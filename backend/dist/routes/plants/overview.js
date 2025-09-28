"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/operations/plants.ts
const express_1 = require("express");
const router = (0, express_1.Router)();
// Get all plants
router.get('/', async (req, res) => {
    try {
        const operationsDb = req.app.locals.operationsDb;
        const result = await operationsDb.query(`
      SELECT 
        id,
        plant_id,
        plant_name,
        plant_location,
        created_at
      FROM plants 
      ORDER BY plant_name ASC
    `);
        res.json({
            success: true,
            data: result.rows,
            count: result.rows.length,
        });
    }
    catch (error) {
        console.error('Error fetching plants:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch plants',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
// Get plant by database ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const operationsDb = req.app.locals.operationsDb;
        const result = await operationsDb.query(`
      SELECT 
        id,
        plant_id,
        plant_name,
        plant_location,
        created_at
      FROM plants 
      WHERE id = $1
    `, [parseInt(id)]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Plant with ID '${id}' not found`,
            });
        }
        res.json({
            success: true,
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error('Error fetching plant:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch plant',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
// Enhanced Get plant general information (from JSON file + calculated data)
router.get('/:id/info', async (req, res) => {
    try {
        const { id } = req.params;
        const operationsDb = req.app.locals.operationsDb;
        // First verify plant exists in database and get plant_id
        const plantResult = await operationsDb.query(`
      SELECT id, plant_id, plant_name, plant_location 
      FROM plants 
      WHERE id = $1
    `, [parseInt(id)]);
        if (plantResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Plant with ID '${id}' not found`,
            });
        }
        const plantId = plantResult.rows[0].plant_id;
        // All data will be calculated from database - no JSON file needed
        // Get all engines for this plant
        const enginesResult = await operationsDb.query(`
      SELECT 
        engine_id,
        model,
        nameplate_capacity,
        status
      FROM engines 
      WHERE plant_id = $1
      ORDER BY engine_id ASC
    `, [plantId]);
        // Calculate engine summary
        const engines = enginesResult.rows;
        const enginesSummary = {
            total_count: engines.length,
            active_count: engines.filter((e) => e.status === 'active').length,
            maintenance_count: engines.filter((e) => e.status === 'maintenance')
                .length,
            inactive_count: engines.filter((e) => e.status === 'inactive').length,
            decommissioned_count: engines.filter((e) => e.status === 'decommissioned')
                .length,
            total_nameplate_capacity: engines.reduce((sum, e) => sum + parseFloat(e.nameplate_capacity || 0), 0),
            engines_list: engines,
        };
        // Get aggregated energy generation data for all engines (all time)
        const energyResult = await operationsDb.query(`
      SELECT 
        SUM(eg.gross_generation) as total_gross_generation,
        SUM(eg.net_generation) as total_net_generation,
        SUM(eg.auxiliary_power) as total_auxiliary_power,
        SUM(eg.operating_hours) as total_operating_hours,
        AVG(eg.capacity_factor) as avg_capacity_factor,
        MIN(eg.measurement_date) as earliest_date,
        MAX(eg.measurement_date) as latest_date
      FROM engine_generation eg
      JOIN engines e ON eg.engine_id = e.engine_id
      WHERE e.plant_id = $1
    `, [plantId]);
        const energyTotals = {
            total_gross_generation: parseFloat(energyResult.rows[0]?.total_gross_generation || 0),
            total_net_generation: parseFloat(energyResult.rows[0]?.total_net_generation || 0),
            total_auxiliary_power: parseFloat(energyResult.rows[0]?.total_auxiliary_power || 0),
            total_operating_hours: parseFloat(energyResult.rows[0]?.total_operating_hours || 0),
            average_capacity_factor: parseFloat(energyResult.rows[0]?.avg_capacity_factor || 0),
            measurement_period: `${energyResult.rows[0]?.earliest_date?.toISOString().split('T')[0] ||
                'N/A'} to ${energyResult.rows[0]?.latest_date?.toISOString().split('T')[0] || 'N/A'}`,
        };
        // Get aggregated carbon emissions (CO2, CH4, N2O) - all time
        const carbonEmissionsResult = await operationsDb.query(`
      SELECT 
        pollutant_type,
        SUM(annual_total) as total_all_time,
        MIN(measurement_date) as earliest_date,
        MAX(measurement_date) as latest_date
      FROM engine_stack_emissions ese
      JOIN engines e ON ese.engine_id = e.engine_id
      WHERE e.plant_id = $1 
        AND pollutant_type IN ('co2', 'ch4', 'n2o')
      GROUP BY pollutant_type
    `, [plantId]);
        // Process carbon emissions and calculate CO2 equivalent
        const carbonEmissions = {};
        // Set measurement period from carbon emissions data
        if (carbonEmissionsResult.rows.length > 0) {
            const earliestDate = carbonEmissionsResult.rows[0].earliest_date
                ?.toISOString()
                .split('T')[0];
            const latestDate = carbonEmissionsResult.rows[0].latest_date
                ?.toISOString()
                .split('T')[0];
            carbonEmissions.measurement_period = `${earliestDate || 'N/A'} to ${latestDate || 'N/A'}`;
        }
        else {
            carbonEmissions.measurement_period = 'No data available';
        }
        // GWP factors for CO2 equivalent calculation
        const gwpFactors = { co2: 1, ch4: 25, n2o: 298 };
        let co2EquivalentTotal = 0;
        carbonEmissionsResult.rows.forEach((row) => {
            const pollutant = row.pollutant_type;
            const totalAllTime = parseFloat(row.total_all_time || 0);
            carbonEmissions[`total_${pollutant}_all_time`] = totalAllTime;
            co2EquivalentTotal +=
                totalAllTime * gwpFactors[pollutant];
        });
        carbonEmissions.co2_equivalent_total = co2EquivalentTotal;
        // Get other pollutant emissions (NOx, SOx) - all time
        const otherStackEmissionsResult = await operationsDb.query(`
      SELECT 
        pollutant_type,
        SUM(annual_total) as total_all_time,
        MIN(measurement_date) as earliest_date,
        MAX(measurement_date) as latest_date
      FROM engine_stack_emissions ese
      JOIN engines e ON ese.engine_id = e.engine_id
      WHERE e.plant_id = $1 
        AND pollutant_type IN ('nox', 'sox')
      GROUP BY pollutant_type
    `, [plantId]);
        // Get particulate matter emissions - all time
        const particulateEmissionsResult = await operationsDb.query(`
      SELECT 
        SUM(epe.pm10_rate * 8760) as total_pm10_all_time,  -- Convert hourly to annual, then sum
        SUM(epe.pm25_rate * 8760) as total_pm25_all_time,
        SUM(epe.total_pm_annual) as total_pm_all_time,
        MIN(epe.measurement_date) as earliest_date,
        MAX(epe.measurement_date) as latest_date
      FROM engine_particulate_emissions epe
      JOIN engines e ON epe.engine_id = e.engine_id
      WHERE e.plant_id = $1
    `, [plantId]);
        // Get other emissions (mercury, VOCs, heavy metals) - all time
        const otherEmissionsResult = await operationsDb.query(`
      SELECT 
        pollutant_type,
        SUM(annual_total) as total_all_time,
        MIN(measurement_date) as earliest_date,
        MAX(measurement_date) as latest_date
      FROM engine_other_emissions eoe
      JOIN engines e ON eoe.engine_id = e.engine_id
      WHERE e.plant_id = $1
      GROUP BY pollutant_type
    `, [plantId]);
        // Process other emissions
        const otherEmissions = {};
        // Set measurement period from available data
        let otherEmissionsStartDate = 'N/A';
        let otherEmissionsEndDate = 'N/A';
        if (otherStackEmissionsResult.rows.length > 0) {
            otherEmissionsStartDate =
                otherStackEmissionsResult.rows[0].earliest_date
                    ?.toISOString()
                    .split('T')[0] || 'N/A';
            otherEmissionsEndDate =
                otherStackEmissionsResult.rows[0].latest_date
                    ?.toISOString()
                    .split('T')[0] || 'N/A';
        }
        else if (particulateEmissionsResult.rows.length > 0 &&
            particulateEmissionsResult.rows[0].earliest_date) {
            otherEmissionsStartDate =
                particulateEmissionsResult.rows[0].earliest_date
                    ?.toISOString()
                    .split('T')[0] || 'N/A';
            otherEmissionsEndDate =
                particulateEmissionsResult.rows[0].latest_date
                    ?.toISOString()
                    .split('T')[0] || 'N/A';
        }
        else if (otherEmissionsResult.rows.length > 0) {
            otherEmissionsStartDate =
                otherEmissionsResult.rows[0].earliest_date
                    ?.toISOString()
                    .split('T')[0] || 'N/A';
            otherEmissionsEndDate =
                otherEmissionsResult.rows[0].latest_date?.toISOString().split('T')[0] ||
                    'N/A';
        }
        otherEmissions.measurement_period = `${otherEmissionsStartDate} to ${otherEmissionsEndDate}`;
        // Add stack emissions (NOx, SOx)
        otherStackEmissionsResult.rows.forEach((row) => {
            otherEmissions[`total_${row.pollutant_type}_all_time`] = parseFloat(row.total_all_time || 0);
        });
        // Add particulate emissions
        const pmData = particulateEmissionsResult.rows[0];
        if (pmData) {
            otherEmissions.total_pm10_all_time = parseFloat(pmData.total_pm10_all_time || 0);
            otherEmissions.total_pm25_all_time = parseFloat(pmData.total_pm25_all_time || 0);
        }
        // Add other pollutant emissions (mercury, VOCs, heavy metals)
        otherEmissionsResult.rows.forEach((row) => {
            otherEmissions[`total_${row.pollutant_type}_all_time`] = parseFloat(row.total_all_time || 0);
        });
        // Get fuel consumption and costs - all time
        const fuelCostsResult = await operationsDb.query(`
      SELECT 
        SUM(efc.fuel_cost_per_day * 365) as total_all_time_fuel_cost,
        SUM(efc.consumption_rate * 8760) as total_all_time_consumption,
        efc.consumption_rate_unit,
        COUNT(DISTINCT efc.fuel_id) as fuel_types_count,
        MIN(efc.measurement_date) as earliest_date,
        MAX(efc.measurement_date) as latest_date
      FROM engine_fuel_consumption efc
      JOIN engines e ON efc.engine_id = e.engine_id
      WHERE e.plant_id = $1
      GROUP BY efc.consumption_rate_unit
    `, [plantId]);
        // Calculate operating costs
        const totalAllTimeFuelCost = fuelCostsResult.rows.reduce((sum, row) => sum + parseFloat(row.total_all_time_fuel_cost || 0), 0);
        const costPerMwhProduced = energyTotals.total_net_generation > 0
            ? totalAllTimeFuelCost / energyTotals.total_net_generation
            : 0;
        // Set fuel costs measurement period
        let fuelCostsPeriod = 'No data available';
        if (fuelCostsResult.rows.length > 0 &&
            fuelCostsResult.rows[0].earliest_date) {
            const earliestDate = fuelCostsResult.rows[0].earliest_date
                ?.toISOString()
                .split('T')[0];
            const latestDate = fuelCostsResult.rows[0].latest_date
                ?.toISOString()
                .split('T')[0];
            fuelCostsPeriod = `${earliestDate || 'N/A'} to ${latestDate || 'N/A'}`;
        }
        const operatingSummary = {
            total_all_time_fuel_cost: totalAllTimeFuelCost,
            cost_per_mwh_produced: Math.round(costPerMwhProduced * 100) / 100, // Round to 2 decimals
            total_net_generation: energyTotals.total_net_generation,
            measurement_period: fuelCostsPeriod,
        };
        // Get allowance data (current year)
        const currentYear = new Date().getFullYear();
        const allowanceResult = await operationsDb.query(`
      SELECT 
        allocation_year,
        total_allowances_available
      FROM allowance_tracking
      WHERE plant_id = $1 
        AND allocation_year = $2
    `, [plantId, currentYear]);
        let allowances = null;
        if (allowanceResult.rows.length > 0) {
            const allowanceData = allowanceResult.rows[0];
            const allowancesNeeded = Math.ceil(co2EquivalentTotal / 1000); // Convert to tonnes and round up
            const allowancesSurplus = allowanceData.total_allowances_available - allowancesNeeded;
            allowances = {
                allocation_year: parseInt(allowanceData.allocation_year),
                total_allowances_available: parseInt(allowanceData.total_allowances_available),
                estimated_co2_emissions: Math.round(co2EquivalentTotal * 100) / 100, // Round to 2 decimals
                allowances_needed: allowancesNeeded,
                allowances_surplus: allowancesSurplus,
            };
        }
        // Combine all calculated data
        const combinedInfo = {
            ...plantResult.rows[0],
            engines: enginesSummary,
            energy_totals: energyTotals,
            carbon_emissions: carbonEmissions,
            other_emissions: otherEmissions,
            operating_summary: operatingSummary,
            allowances: allowances,
            last_updated: new Date().toISOString(),
            data_completeness: {
                engines_data: engines.length > 0,
                emissions_data: carbonEmissionsResult.rows.length > 0,
                fuel_consumption_data: fuelCostsResult.rows.length > 0,
                generation_data: energyResult.rows[0]?.total_net_generation > 0,
                allowances_data: allowances !== null,
            },
        };
        res.json({
            success: true,
            data: combinedInfo,
        });
    }
    catch (error) {
        console.error('Error fetching enhanced plant info:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch plant information',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=overview.js.map