// services/plants/plantEnginesService.ts
import OperationsDatabase from '../../database/connections/operationsDb';

export interface EnginesSummaryCalculated {
  total_count: number;
  active_count_calculated: number;
  maintenance_count_calculated: number;
  inactive_count_calculated: number;
  decommissioned_count_calculated: number;
  total_nameplate_capacity_calculated: number;
  engines_list: any[];
}

export class PlantEnginesService {
  /**
   * Get engines summary for a specific plant
   * @param operationsDb Database connection
   * @param businessPlantId Business plant ID (not primary key)
   * @returns Calculated engines summary data
   */
  static async getEnginesSummary(
    operationsDb: OperationsDatabase,
    businessPlantId: string
  ): Promise<EnginesSummaryCalculated> {
    try {
      // Get all engines for this plant using the business plant_id
      const enginesResult = await operationsDb.query(
        `
        SELECT 
          engine_id,
          model,
          nameplate_capacity,
          status
        FROM engines 
        WHERE plant_id = $1
        ORDER BY engine_id ASC
      `,
        [businessPlantId]
      );

      const engines = enginesResult.rows;

      // Calculate engine summary
      const enginesSummaryCalculated: EnginesSummaryCalculated = {
        total_count: engines.length,
        active_count_calculated: engines.filter((e) => e.status === 'active')
          .length,
        maintenance_count_calculated: engines.filter(
          (e) => e.status === 'maintenance'
        ).length,
        inactive_count_calculated: engines.filter(
          (e) => e.status === 'inactive'
        ).length,
        decommissioned_count_calculated: engines.filter(
          (e) => e.status === 'decommissioned'
        ).length,
        total_nameplate_capacity_calculated: engines.reduce(
          (sum, e) => sum + parseFloat(e.nameplate_capacity || 0),
          0
        ),
        engines_list: engines,
      };

      return enginesSummaryCalculated;
    } catch (error) {
      console.error('❌ Error fetching engines summary:', error);
      throw error;
    }
  }
}
