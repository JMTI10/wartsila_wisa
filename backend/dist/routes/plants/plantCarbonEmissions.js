"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlantCarbonEmissionsService = void 0;
class PlantCarbonEmissionsService {
    /**
     * Get aggregated carbon emissions (CO2, CH4, N2O) for a plant
     * @param operationsDb Database connection
     * @param businessPlantId Business plant ID (not primary key)
     * @returns Calculated carbon emissions data
     */
    static async getCarbonEmissions(operationsDb, businessPlantId) {
        try {
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
      `, [businessPlantId]);
            // Get total energy generation for the same period and plant
            const energyGenerationResult = await operationsDb.query(`
        SELECT 
          SUM(eg.net_generation) as total_net_generation_mwh,
          SUM(eg.gross_generation) as total_gross_generation_mwh,
          MIN(eg.measurement_date) as earliest_gen_date,
          MAX(eg.measurement_date) as latest_gen_date
        FROM engine_generation eg
        JOIN engines e ON eg.engine_id = e.engine_id
        WHERE e.plant_id = $1
          AND eg.net_generation IS NOT NULL
      `, [businessPlantId]);
            // Process carbon emissions and calculate CO2 equivalent
            const carbonEmissionsCalculated = {
                co2_equivalent_total_calculated: 0,
                co2_intensity_calculated: 0,
                co2_equivalent_intensity_calculated: 0,
                measurement_period: 'No data available',
            };
            // Set measurement period from carbon emissions data
            if (carbonEmissionsResult.rows.length > 0) {
                const earliestDate = carbonEmissionsResult.rows[0].earliest_date
                    ?.toISOString()
                    .split('T')[0];
                const latestDate = carbonEmissionsResult.rows[0].latest_date
                    ?.toISOString()
                    .split('T')[0];
                carbonEmissionsCalculated.measurement_period = `${earliestDate || 'N/A'} to ${latestDate || 'N/A'}`;
            }
            // GWP factors for CO2 equivalent calculation
            const gwpFactors = { co2: 1, ch4: 25, n2o: 298 };
            let co2EquivalentTotalCalculated = 0;
            let totalCO2AllTime = 0;
            // Process emissions data
            carbonEmissionsResult.rows.forEach((row) => {
                const pollutant = row.pollutant_type;
                const totalAllTime = parseFloat(row.total_all_time || 0);
                // Dynamically set properties on the object
                carbonEmissionsCalculated[`total_${pollutant}_all_time`] =
                    totalAllTime;
                // Track CO2 separately for intensity calculation
                if (pollutant === 'co2') {
                    totalCO2AllTime = totalAllTime;
                }
                co2EquivalentTotalCalculated +=
                    totalAllTime * gwpFactors[pollutant];
            });
            carbonEmissionsCalculated.co2_equivalent_total_calculated =
                co2EquivalentTotalCalculated;
            // Calculate intensity if we have energy generation data
            const totalNetGeneration = parseFloat(energyGenerationResult.rows[0]?.total_net_generation_mwh || 0);
            const totalGrossGeneration = parseFloat(energyGenerationResult.rows[0]?.total_gross_generation_mwh || 0);
            if (totalNetGeneration > 0) {
                carbonEmissionsCalculated.total_net_generation_mwh = totalNetGeneration;
                carbonEmissionsCalculated.total_gross_generation_mwh =
                    totalGrossGeneration;
                // Use net generation for intensity calculations (standard practice)
                carbonEmissionsCalculated.co2_intensity_calculated =
                    totalCO2AllTime / totalNetGeneration;
                carbonEmissionsCalculated.co2_equivalent_intensity_calculated =
                    co2EquivalentTotalCalculated / totalNetGeneration;
            }
            else {
                console.warn(`⚠️ No net generation data found for plant ${businessPlantId}, intensity calculations set to 0`);
            }
            return carbonEmissionsCalculated;
        }
        catch (error) {
            console.error('❌ Error fetching carbon emissions:', error);
            throw error;
        }
    }
}
exports.PlantCarbonEmissionsService = PlantCarbonEmissionsService;
//# sourceMappingURL=plantCarbonEmissions.js.map