"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlantOperatingSummaryService = void 0;
class PlantOperatingSummaryService {
    /**
     * Get operating summary including fuel costs and cost per MWh for a plant
     * @param operationsDb Database connection
     * @param businessPlantId Business plant ID (not primary key)
     * @returns Calculated operating summary data
     */
    static async getOperatingSummary(operationsDb, businessPlantId) {
        try {
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
      `, [businessPlantId]);
            // Get total net generation for cost calculations
            const energyResult = await operationsDb.query(`
        SELECT 
          SUM(eg.net_generation) as total_net_generation
        FROM engine_generation eg
        JOIN engines e ON eg.engine_id = e.engine_id
        WHERE e.plant_id = $1
      `, [businessPlantId]);
            // Calculate operating costs
            const totalAllTimeFuelCost = fuelCostsResult.rows.reduce((sum, row) => sum + parseFloat(row.total_all_time_fuel_cost || 0), 0);
            const totalNetGeneration = parseFloat(energyResult.rows[0]?.total_net_generation || 0);
            const costPerMwhProducedCalculated = totalNetGeneration > 0 ? totalAllTimeFuelCost / totalNetGeneration : 0;
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
            const operatingSummaryCalculated = {
                total_all_time_fuel_cost: totalAllTimeFuelCost,
                cost_per_mwh_produced_calculated: Math.round(costPerMwhProducedCalculated * 100) / 100, // Round to 2 decimals
                total_net_generation: totalNetGeneration,
                measurement_period: fuelCostsPeriod,
            };
            return operatingSummaryCalculated;
        }
        catch (error) {
            console.error('❌ Error fetching operating summary:', error);
            throw error;
        }
    }
}
exports.PlantOperatingSummaryService = PlantOperatingSummaryService;
//# sourceMappingURL=operatingSummary.js.map