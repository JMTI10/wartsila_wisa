"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEngineYearlyData = getEngineYearlyData;
async function getEngineYearlyData(operationsDb, engineId) {
    try {
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
        const yearlyData = yearlyResult.rows.map((row) => ({
            year: parseInt(row.year),
            co2_annual_calculated: parseFloat(row.co2_annual || 0),
            co2_annual_unit: 'tonnes',
            nox_annual_calculated: parseFloat(row.nox_annual || 0),
            nox_annual_unit: 'tonnes',
            sox_annual_calculated: parseFloat(row.sox_annual || 0),
            sox_annual_unit: 'tonnes',
            net_generation_annual_calculated: parseFloat(row.net_generation_annual || 0),
            net_generation_annual_unit: 'MWh',
            operating_hours_annual_calculated: parseFloat(row.operating_hours_annual || 0),
            capacity_factor_annual_calculated: parseFloat(row.capacity_factor_annual || 0),
        }));
        return {
            success: true,
            data: yearlyData,
        };
    }
    catch (error) {
        return {
            success: false,
            message: `Failed to fetch yearly data: ${error}`,
        };
    }
}
//# sourceMappingURL=yearlyData.js.map