"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlantOtherEmissionsService = void 0;
class PlantOtherEmissionsService {
    /**
     * Get aggregated other pollutant emissions for a plant (NOx, SOx, PM, etc.) with intensity calculations
     * @param operationsDb Database connection
     * @param businessPlantId Business plant ID (not primary key)
     * @param totalNetGeneration Optional total net generation to calculate intensity (if not provided, intensity will be 0)
     * @returns Calculated other emissions data including intensity metrics
     */
    static async getOtherEmissions(operationsDb, businessPlantId, totalNetGeneration) {
        try {
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
      `, [businessPlantId]);
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
      `, [businessPlantId]);
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
      `, [businessPlantId]);
            // Process other emissions
            const otherEmissionsCalculated = {
                measurement_period: 'No data available',
            };
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
                    otherEmissionsResult.rows[0].latest_date
                        ?.toISOString()
                        .split('T')[0] || 'N/A';
            }
            otherEmissionsCalculated.measurement_period = `${otherEmissionsStartDate} to ${otherEmissionsEndDate}`;
            // Add stack emissions (NOx, SOx) with intensity calculations
            otherStackEmissionsResult.rows.forEach((row) => {
                const totalAllTime = parseFloat(row.total_all_time || 0);
                const pollutantType = row.pollutant_type;
                otherEmissionsCalculated[`total_${pollutantType}_all_time`] =
                    totalAllTime;
                // Calculate intensity using provided total net generation (convert tonnes to kg for standard reporting)
                if (totalNetGeneration && totalNetGeneration > 0) {
                    otherEmissionsCalculated[`${pollutantType}_intensity_calculated`] =
                        Math.round(((totalAllTime * 1000) / totalNetGeneration) * 100) /
                            100; // kg per MWh
                }
            });
            // Add particulate emissions with intensity calculations
            const pmData = particulateEmissionsResult.rows[0];
            if (pmData) {
                const totalPm10AllTime = parseFloat(pmData.total_pm10_all_time || 0);
                const totalPm25AllTime = parseFloat(pmData.total_pm25_all_time || 0);
                otherEmissionsCalculated.total_pm10_all_time_calculated =
                    totalPm10AllTime;
                otherEmissionsCalculated.total_pm25_all_time_calculated =
                    totalPm25AllTime;
                // Calculate PM intensity using provided total net generation (already in kg from hourly rates)
                if (totalNetGeneration && totalNetGeneration > 0) {
                    otherEmissionsCalculated.pm10_intensity_calculated =
                        Math.round((totalPm10AllTime / totalNetGeneration) * 100) / 100; // kg per MWh
                    otherEmissionsCalculated.pm25_intensity_calculated =
                        Math.round((totalPm25AllTime / totalNetGeneration) * 100) / 100; // kg per MWh
                }
            }
            // Add other pollutant emissions (mercury, VOCs, heavy metals) with intensity calculations
            otherEmissionsResult.rows.forEach((row) => {
                const totalAllTime = parseFloat(row.total_all_time || 0);
                const pollutantType = row.pollutant_type;
                otherEmissionsCalculated[`total_${pollutantType}_all_time`] =
                    totalAllTime;
                // Calculate intensity using provided total net generation (convert kg to g for smaller pollutants like mercury)
                if (totalNetGeneration && totalNetGeneration > 0) {
                    const intensityMultiplier = pollutantType === 'mercury' ? 1000 : 1; // g/MWh for mercury, kg/MWh for others
                    otherEmissionsCalculated[`${pollutantType}_intensity_calculated`] =
                        Math.round(((totalAllTime * intensityMultiplier) / totalNetGeneration) * 100) / 100;
                }
            });
            return otherEmissionsCalculated;
        }
        catch (error) {
            console.error('❌ Error fetching other emissions:', error);
            throw error;
        }
    }
}
exports.PlantOtherEmissionsService = PlantOtherEmissionsService;
//# sourceMappingURL=plantOtherEmissions.js.map