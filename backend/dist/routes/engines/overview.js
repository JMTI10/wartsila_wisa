"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/operations/engines/overview.ts
const express_1 = require("express");
const router = (0, express_1.Router)();
// Get comprehensive engine overview with all metrics
router.get('/:engineId', async (req, res) => {
    const { engineId } = req.params;
    console.log(`🏭 Fetching comprehensive overview for engine ${engineId}...`);
    try {
        const operationsDb = req.app.locals.operationsDb;
        // Get basic engine info
        const engineResult = await operationsDb.query('SELECT * FROM engines WHERE engine_id = $1', [engineId]);
        if (engineResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Engine with ID ${engineId} not found`,
            });
        }
        const engine = engineResult.rows[0];
        // Get efficiency metrics (aggregated from all historical data)
        const efficiencyResult = await operationsDb.query(`SELECT 
        SUM(efc.fuel_energy_input * eg.operating_hours) as total_fuel_energy_mwh,
        SUM(eg.net_generation) as total_net_generation_mwh,
        SUM(eg.operating_hours) as total_operating_hours,
        AVG(eg.capacity_factor) as avg_capacity_factor,
        COUNT(eg.generation_id) as total_records
       FROM engine_generation eg
       LEFT JOIN engine_fuel_consumption efc ON eg.engine_id = efc.engine_id 
         AND eg.measurement_date = efc.measurement_date
       WHERE eg.engine_id = $1`, [engineId]);
        const efficiencyData = efficiencyResult.rows[0];
        // Calculate metrics
        const heatRate = efficiencyData.total_fuel_energy_mwh &&
            efficiencyData.total_net_generation_mwh
            ? parseFloat(efficiencyData.total_fuel_energy_mwh) /
                parseFloat(efficiencyData.total_net_generation_mwh)
            : null;
        const thermalEfficiency = heatRate ? (1 / heatRate) * 100 : null;
        // Get emission rates (average from ALL available data, not just recent)
        const emissionRatesResult = await operationsDb.query(`SELECT 
        pollutant_type,
        AVG(mass_rate) as avg_mass_rate
       FROM engine_stack_emissions 
       WHERE engine_id = $1 
         AND pollutant_type IN ('co2', 'nox', 'sox')
         AND mass_rate IS NOT NULL
       GROUP BY pollutant_type`, [engineId]);
        const emissionRates = emissionRatesResult.rows.reduce((acc, row) => {
            acc[`${row.pollutant_type}_rate`] = parseFloat(row.avg_mass_rate);
            return acc;
        }, {});
        // Calculate CO2 intensity
        const co2Intensity = emissionRates.co2_rate &&
            efficiencyData.total_net_generation_mwh &&
            efficiencyData.total_operating_hours
            ? (emissionRates.co2_rate *
                parseFloat(efficiencyData.total_operating_hours)) /
                parseFloat(efficiencyData.total_net_generation_mwh)
            : null;
        // Get yearly data
        const yearlyResult = await operationsDb.query(`SELECT 
        EXTRACT(YEAR FROM eg.measurement_date) as year,
        SUM(ese.annual_total) FILTER (WHERE ese.pollutant_type = 'co2') as co2_annual,
        SUM(ese.annual_total) FILTER (WHERE ese.pollutant_type = 'nox') as nox_annual,
        SUM(ese.annual_total) FILTER (WHERE ese.pollutant_type = 'sox') as sox_annual,
        SUM(eg.net_generation) as net_generation_annual,
        SUM(eg.operating_hours) as operating_hours_annual,
        AVG(eg.capacity_factor) as capacity_factor_annual
       FROM engine_generation eg
       LEFT JOIN engine_stack_emissions ese ON eg.engine_id = ese.engine_id 
         AND EXTRACT(YEAR FROM eg.measurement_date) = EXTRACT(YEAR FROM ese.measurement_date)
       WHERE eg.engine_id = $1
       GROUP BY EXTRACT(YEAR FROM eg.measurement_date)
       ORDER BY year DESC`, [engineId]);
        // Get daily emissions data for graphs (ALL available data, not just last 90 days)
        const dailyEmissionsResult = await operationsDb.query(`SELECT 
        eg.measurement_date as date,
        (ese.mass_rate * eg.operating_hours / 365) as co2_emissions_kg,
        eg.net_generation / 365 as daily_net_generation_mwh,
        ese.mass_rate as hourly_co2_rate,
        eg.operating_hours as daily_operating_hours
       FROM engine_generation eg
       JOIN engine_stack_emissions ese ON eg.engine_id = ese.engine_id 
         AND eg.measurement_date = ese.measurement_date
       WHERE eg.engine_id = $1 
         AND ese.pollutant_type = 'co2'
         AND ese.mass_rate IS NOT NULL
       ORDER BY eg.measurement_date DESC`, [engineId]);
        const dailyEmissions = dailyEmissionsResult.rows.map((row) => ({
            date: row.date,
            co2_emissions: parseFloat(row.co2_emissions_kg || 0),
            co2_emissions_unit: 'kg',
            net_generation: parseFloat(row.daily_net_generation_mwh || 0),
            net_generation_unit: 'MWh',
            co2_intensity: row.daily_net_generation_mwh > 0
                ? parseFloat(row.co2_emissions_kg) /
                    parseFloat(row.daily_net_generation_mwh)
                : 0,
            hourly_co2_rate: parseFloat(row.hourly_co2_rate || 0),
            daily_operating_hours: parseFloat(row.daily_operating_hours || 0),
        }));
        // Build response
        const response = {
            success: true,
            data: {
                general_info: {
                    engine_id: engine.engine_id,
                    plant_id: engine.plant_id,
                    model: engine.model,
                    nameplate_capacity: engine.nameplate_capacity,
                    status: engine.status,
                    created_at: engine.created_at,
                    updated_at: engine.updated_at,
                },
                efficiency_metrics: {
                    heat_rate: heatRate ? parseFloat(heatRate.toFixed(2)) : null,
                    heat_rate_unit: 'MWh_fuel/MWh_electric',
                    thermal_efficiency: thermalEfficiency
                        ? parseFloat(thermalEfficiency.toFixed(1))
                        : null,
                    thermal_efficiency_unit: '%',
                    total_operating_hours: parseFloat(efficiencyData.total_operating_hours || 0),
                    average_capacity_factor: parseFloat(efficiencyData.avg_capacity_factor || 0),
                    total_net_generation: parseFloat(efficiencyData.total_net_generation_mwh || 0),
                    total_net_generation_unit: 'MWh',
                },
                emissions_metrics: {
                    co2_intensity: co2Intensity
                        ? parseFloat(co2Intensity.toFixed(1))
                        : null,
                    co2_intensity_unit: 'kg/MWh',
                    emission_rates: {
                        co2_rate: emissionRates.co2_rate || null,
                        co2_rate_unit: 'kg/hour',
                        nox_rate: emissionRates.nox_rate || null,
                        nox_rate_unit: 'kg/hour',
                        sox_rate: emissionRates.sox_rate || null,
                        sox_rate_unit: 'kg/hour',
                    },
                },
                yearly_data: yearlyResult.rows.map((row) => ({
                    year: parseInt(row.year),
                    co2_annual: parseFloat(row.co2_annual || 0),
                    co2_annual_unit: 'tonnes',
                    nox_annual: parseFloat(row.nox_annual || 0),
                    nox_annual_unit: 'tonnes',
                    sox_annual: parseFloat(row.sox_annual || 0),
                    sox_annual_unit: 'tonnes',
                    net_generation_annual: parseFloat(row.net_generation_annual || 0),
                    net_generation_annual_unit: 'MWh',
                    operating_hours_annual: parseFloat(row.operating_hours_annual || 0),
                    capacity_factor_annual: parseFloat(row.capacity_factor_annual || 0),
                })),
                emissions_daily_data: dailyEmissions,
            },
        };
        console.log(`✅ Engine ${engineId} overview retrieved successfully`);
        res.json(response);
    }
    catch (error) {
        console.error(`❌ Error fetching engine ${engineId} overview:`, error);
        res.status(500).json({
            success: false,
            message: `Failed to fetch engine ${engineId} overview: ${error}`,
        });
    }
});
exports.default = router;
//# sourceMappingURL=overview.js.map