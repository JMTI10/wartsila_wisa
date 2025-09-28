"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEngineEmissionsMetrics = getEngineEmissionsMetrics;
async function getEngineEmissionsMetrics(operationsDb, engineId, totalNetGeneration, totalOperatingHours) {
    try {
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
        const co2Intensity = emissionRates.co2_rate && totalNetGeneration && totalOperatingHours
            ? (emissionRates.co2_rate * totalOperatingHours) / totalNetGeneration
            : null;
        // Get total net generation from ALL connected engines
        const totalNetGenerationAllEnginesResult = await operationsDb.query(`SELECT SUM(eg.net_generation) as total_net_generation_all_engines
       FROM engine_generation eg`);
        const totalNetGenerationAllEngines = parseFloat(totalNetGenerationAllEnginesResult.rows[0]
            ?.total_net_generation_all_engines || 0);
        // Get total revenue from ALL connected engines
        const totalRevenueAllEnginesResult = await operationsDb.query(`SELECT SUM(eg.revenue) as total_revenue_all_engines
       FROM engine_generation eg
       WHERE eg.revenue IS NOT NULL`);
        const totalRevenueAllEngines = parseFloat(totalRevenueAllEnginesResult.rows[0]?.total_revenue_all_engines || 0);
        // Get total annual fuel consumption from ALL connected engines
        const totalFuelConsumptionResult = await operationsDb.query(`SELECT SUM(efc.annual_consumption) as total_fuel_consumption_all_engines
       FROM engine_fuel_consumption efc
       WHERE efc.annual_consumption IS NOT NULL`);
        const totalFuelConsumptionAllEngines = parseFloat(totalFuelConsumptionResult.rows[0]?.total_fuel_consumption_all_engines ||
            0);
        // Get annual emissions totals for all engines for emissions per unit production calculation
        const annualEmissionsResult = await operationsDb.query(`SELECT 
        pollutant_type,
        SUM(annual_total) as total_annual_emissions
       FROM engine_stack_emissions 
       WHERE pollutant_type IN ('co2', 'nox', 'sox')
         AND annual_total IS NOT NULL
       GROUP BY pollutant_type`);
        const annualEmissions = annualEmissionsResult.rows.reduce((acc, row) => {
            acc[`${row.pollutant_type}_annual`] = parseFloat(row.total_annual_emissions);
            return acc;
        }, {});
        // Calculate emissions per unit of production (tonnes/MWh)
        const co2PerUnit = annualEmissions.co2_annual && totalNetGenerationAllEngines
            ? annualEmissions.co2_annual / totalNetGenerationAllEngines
            : null;
        const noxPerUnit = annualEmissions.nox_annual && totalNetGenerationAllEngines
            ? annualEmissions.nox_annual / totalNetGenerationAllEngines
            : null;
        const soxPerUnit = annualEmissions.sox_annual && totalNetGenerationAllEngines
            ? annualEmissions.sox_annual / totalNetGenerationAllEngines
            : null;
        // Calculate emissions per unit of revenue (tonnes/currency unit)
        const co2PerRevenue = annualEmissions.co2_annual && totalRevenueAllEngines
            ? annualEmissions.co2_annual / totalRevenueAllEngines
            : null;
        const noxPerRevenue = annualEmissions.nox_annual && totalRevenueAllEngines
            ? annualEmissions.nox_annual / totalRevenueAllEngines
            : null;
        const soxPerRevenue = annualEmissions.sox_annual && totalRevenueAllEngines
            ? annualEmissions.sox_annual / totalRevenueAllEngines
            : null;
        // Calculate CO2 emissions per unit of fuel consumed (tonnes CO2/fuel unit)
        const co2PerFuelConsumed = annualEmissions.co2_annual && totalFuelConsumptionAllEngines
            ? annualEmissions.co2_annual / totalFuelConsumptionAllEngines
            : null;
        const metrics = {
            co2_intensity_calculated: co2Intensity
                ? parseFloat(co2Intensity.toFixed(1))
                : null,
            co2_intensity_calculated_unit: 'kg/MWh',
            emissions_per_unit_production_calculated: {
                co2_per_unit: co2PerUnit ? parseFloat(co2PerUnit.toFixed(4)) : null,
                co2_per_unit_unit: 'tonnes/MWh',
                nox_per_unit: noxPerUnit ? parseFloat(noxPerUnit.toFixed(4)) : null,
                nox_per_unit_unit: 'tonnes/MWh',
                sox_per_unit: soxPerUnit ? parseFloat(soxPerUnit.toFixed(4)) : null,
                sox_per_unit_unit: 'tonnes/MWh',
            },
            emissions_per_unit_revenue_calculated: {
                co2_per_revenue: co2PerRevenue
                    ? parseFloat(co2PerRevenue.toFixed(6))
                    : null,
                co2_per_revenue_unit: 'tonnes/currency_unit',
                nox_per_revenue: noxPerRevenue
                    ? parseFloat(noxPerRevenue.toFixed(6))
                    : null,
                nox_per_revenue_unit: 'tonnes/currency_unit',
                sox_per_revenue: soxPerRevenue
                    ? parseFloat(soxPerRevenue.toFixed(6))
                    : null,
                sox_per_revenue_unit: 'tonnes/currency_unit',
            },
            co2_per_unit_fuel_consumed_calculated: {
                co2_per_fuel: co2PerFuelConsumed
                    ? parseFloat(co2PerFuelConsumed.toFixed(8))
                    : null,
                co2_per_fuel_unit: 'tonnes_co2/fuel_unit',
            },
            emission_rates: {
                co2_rate: emissionRates.co2_rate || null,
                co2_rate_unit: 'kg/hour',
                nox_rate: emissionRates.nox_rate || null,
                nox_rate_unit: 'kg/hour',
                sox_rate: emissionRates.sox_rate || null,
                sox_rate_unit: 'kg/hour',
            },
        };
        return {
            success: true,
            data: metrics,
        };
    }
    catch (error) {
        return {
            success: false,
            message: `Failed to fetch emissions metrics: ${error}`,
        };
    }
}
//# sourceMappingURL=emissionsMetrics.js.map