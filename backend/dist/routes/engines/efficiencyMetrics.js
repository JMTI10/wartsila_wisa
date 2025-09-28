"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEngineEfficiencyMetrics = getEngineEfficiencyMetrics;
exports.getTotalNetGeneration = getTotalNetGeneration;
async function getEngineEfficiencyMetrics(operationsDb, engineId) {
    try {
        // Get efficiency metrics (aggregated from all historical data)
        const efficiencyResult = await operationsDb.query(`SELECT 
        SUM(efc.fuel_energy_input * eg.operating_hours) as total_fuel_energy_mwh,
        SUM(eg.net_generation) as total_net_generation_mwh,
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
        const metrics = {
            heat_rate_calculated: heatRate ? parseFloat(heatRate.toFixed(2)) : null,
            heat_rate_unit: 'MWh_fuel/MWh_electric',
            thermal_efficiency_calculated: thermalEfficiency
                ? parseFloat(thermalEfficiency.toFixed(1))
                : null,
            thermal_efficiency_unit: '%',
        };
        return {
            success: true,
            data: metrics,
        };
    }
    catch (error) {
        return {
            success: false,
            message: `Failed to fetch efficiency metrics: ${error}`,
        };
    }
}
// Additional function to calculate total net generation for all engines
async function getTotalNetGeneration(operationsDb, engineIds) {
    try {
        let query = `
      SELECT SUM(eg.net_generation) as total_net_generation_mwh
      FROM engine_generation eg
    `;
        let params = [];
        if (engineIds && engineIds.length > 0) {
            query += ` WHERE eg.engine_id = ANY($1)`;
            params.push(engineIds);
        }
        const result = await operationsDb.query(query, params);
        const totalNetGeneration = parseFloat(result.rows[0].total_net_generation_mwh || 0);
        return {
            success: true,
            data: {
                total_net_generation_calculated: totalNetGeneration,
                total_net_generation_unit: 'MWh',
            },
        };
    }
    catch (error) {
        return {
            success: false,
            message: `Failed to fetch total net generation: ${error}`,
        };
    }
}
//# sourceMappingURL=efficiencyMetrics.js.map