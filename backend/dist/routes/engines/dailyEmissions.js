"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEngineDailyEmissions = getEngineDailyEmissions;
async function getEngineDailyEmissions(operationsDb, engineId) {
    try {
        // Get daily emissions data for all pollutants (ALL available data, not just last 90 days)
        const dailyEmissionsResult = await operationsDb.query(`SELECT 
        eg.measurement_date as date,
        -- CO2 emissions calculations
        (co2.mass_rate * eg.operating_hours / 365) as co2_emissions_kg,
        co2.mass_rate as hourly_co2_rate,
        -- CH4 emissions calculations
        (ch4.mass_rate * eg.operating_hours / 365) as ch4_emissions_kg,
        -- N2O emissions calculations
        (n2o.mass_rate * eg.operating_hours / 365) as n2o_emissions_kg,
        -- NOx emissions calculations
        (nox.mass_rate * eg.operating_hours / 365) as nox_emissions_kg,
        -- SOx emissions calculations
        (sox.mass_rate * eg.operating_hours / 365) as sox_emissions_kg,
        -- Generation calculations
        eg.net_generation / 365 as daily_net_generation_mwh,
        eg.operating_hours as daily_operating_hours
       FROM engine_generation eg
       LEFT JOIN engine_stack_emissions co2 ON eg.engine_id = co2.engine_id 
         AND eg.measurement_date = co2.measurement_date AND co2.pollutant_type = 'co2'
       LEFT JOIN engine_stack_emissions ch4 ON eg.engine_id = ch4.engine_id 
         AND eg.measurement_date = ch4.measurement_date AND ch4.pollutant_type = 'ch4'
       LEFT JOIN engine_stack_emissions n2o ON eg.engine_id = n2o.engine_id 
         AND eg.measurement_date = n2o.measurement_date AND n2o.pollutant_type = 'n2o'
       LEFT JOIN engine_stack_emissions nox ON eg.engine_id = nox.engine_id 
         AND eg.measurement_date = nox.measurement_date AND nox.pollutant_type = 'nox'
       LEFT JOIN engine_stack_emissions sox ON eg.engine_id = sox.engine_id 
         AND eg.measurement_date = sox.measurement_date AND sox.pollutant_type = 'sox'
       WHERE eg.engine_id = $1
       ORDER BY eg.measurement_date DESC`, [engineId]);
        const dailyEmissions = dailyEmissionsResult.rows.map((row) => {
            const co2Emissions = parseFloat(row.co2_emissions_kg || 0);
            const dailyGeneration = parseFloat(row.daily_net_generation_mwh || 0);
            return {
                date: row.date,
                co2_emissions_calculated: co2Emissions,
                co2_emissions_unit: 'kg',
                ch4_emissions_calculated: parseFloat(row.ch4_emissions_kg || 0),
                ch4_emissions_unit: 'kg',
                n2o_emissions_calculated: parseFloat(row.n2o_emissions_kg || 0),
                n2o_emissions_unit: 'kg',
                nox_emissions_calculated: parseFloat(row.nox_emissions_kg || 0),
                nox_emissions_unit: 'kg',
                sox_emissions_calculated: parseFloat(row.sox_emissions_kg || 0),
                sox_emissions_unit: 'kg',
                net_generation_calculated: dailyGeneration,
                net_generation_unit: 'MWh',
                co2_intensity_calculated: dailyGeneration > 0 ? co2Emissions / dailyGeneration : 0,
                co2_intensity_unit: 'kg/MWh',
                hourly_co2_rate: parseFloat(row.hourly_co2_rate || 0),
                hourly_co2_rate_unit: 'kg/hour',
                daily_operating_hours_calculated: parseFloat(row.daily_operating_hours || 0),
                daily_operating_hours_unit: 'hours',
            };
        });
        return {
            success: true,
            data: dailyEmissions,
        };
    }
    catch (error) {
        return {
            success: false,
            message: `Failed to fetch daily emissions data: ${error}`,
        };
    }
}
//# sourceMappingURL=dailyEmissions.js.map