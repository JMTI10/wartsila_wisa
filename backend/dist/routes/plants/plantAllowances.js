"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlantAllowancesService = void 0;
class PlantAllowancesService {
    /**
     * Get allowance data for a plant (current year)
     * @param operationsDb Database connection
     * @param businessPlantId Business plant ID (not primary key)
     * @returns Calculated allowances data or null if no data available
     */
    static async getAllowances(operationsDb, businessPlantId) {
        try {
            // First get CO2 equivalent total for calculations
            const carbonEmissionsResult = await operationsDb.query(`
        SELECT 
          pollutant_type,
          SUM(annual_total) as total_all_time
        FROM engine_stack_emissions ese
        JOIN engines e ON ese.engine_id = e.engine_id
        WHERE e.plant_id = $1 
          AND pollutant_type IN ('co2', 'ch4', 'n2o')
        GROUP BY pollutant_type
      `, [businessPlantId]);
            // Calculate CO2 equivalent
            const gwpFactors = { co2: 1, ch4: 25, n2o: 298 };
            let co2EquivalentTotal = 0;
            carbonEmissionsResult.rows.forEach((row) => {
                const pollutant = row.pollutant_type;
                const totalAllTime = parseFloat(row.total_all_time || 0);
                co2EquivalentTotal +=
                    totalAllTime * gwpFactors[pollutant];
            });
            // Get allowance data (current year)
            const currentYear = new Date().getFullYear();
            const allowanceResult = await operationsDb.query(`
        SELECT 
          allocation_year,
          total_allowances_available
        FROM allowance_tracking
        WHERE plant_id = $1 
          AND allocation_year = $2
      `, [businessPlantId, currentYear]);
            if (allowanceResult.rows.length === 0) {
                return null;
            }
            const allowanceData = allowanceResult.rows[0];
            const allowancesNeededCalculated = Math.ceil(co2EquivalentTotal / 1000); // Convert to tonnes and round up
            const allowancesSurplusCalculated = allowanceData.total_allowances_available - allowancesNeededCalculated;
            const allowancesCalculated = {
                allocation_year: parseInt(allowanceData.allocation_year),
                total_allowances_available: parseInt(allowanceData.total_allowances_available),
                estimated_co2_emissions: Math.round(co2EquivalentTotal * 100) / 100, // Round to 2 decimals
                allowances_needed_calculated: allowancesNeededCalculated,
                allowances_surplus_calculated: allowancesSurplusCalculated,
            };
            return allowancesCalculated;
        }
        catch (error) {
            console.error('❌ Error fetching allowances:', error);
            throw error;
        }
    }
}
exports.PlantAllowancesService = PlantAllowancesService;
//# sourceMappingURL=plantAllowances.js.map