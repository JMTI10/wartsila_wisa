// services/plants/plantEnergyService.ts
import OperationsDatabase from '../../database/connections/operationsDb';

export interface EnergyTotalsCalculated {
  total_gross_generation: number;
  total_net_generation: number;
  total_auxiliary_power: number;
  total_operating_hours: number;
  average_capacity_factor_calculated: number;
  measurement_period: string;
}

export class PlantEnergyService {
  /**
   * Get aggregated energy generation data for all engines in a plant
   * @param operationsDb Database connection
   * @param businessPlantId Business plant ID (not primary key)
   * @returns Calculated energy totals data
   */
  static async getEnergyTotals(
    operationsDb: OperationsDatabase,
    businessPlantId: string
  ): Promise<EnergyTotalsCalculated> {
    try {
      // Get aggregated energy generation data for all engines (all time)
      const energyResult = await operationsDb.query(
        `
        SELECT 
          SUM(eg.gross_generation) as total_gross_generation,
          SUM(eg.net_generation) as total_net_generation,
          SUM(eg.auxiliary_power) as total_auxiliary_power,
          SUM(eg.operating_hours) as total_operating_hours,
          AVG(eg.capacity_factor) as avg_capacity_factor,
          MIN(eg.measurement_date) as earliest_date,
          MAX(eg.measurement_date) as latest_date
        FROM engine_generation eg
        JOIN engines e ON eg.engine_id = e.engine_id
        WHERE e.plant_id = $1
      `,
        [businessPlantId]
      );

      const energyTotalsCalculated: EnergyTotalsCalculated = {
        total_gross_generation: parseFloat(
          energyResult.rows[0]?.total_gross_generation || 0
        ),
        total_net_generation: parseFloat(
          energyResult.rows[0]?.total_net_generation || 0
        ),
        total_auxiliary_power: parseFloat(
          energyResult.rows[0]?.total_auxiliary_power || 0
        ),
        total_operating_hours: parseFloat(
          energyResult.rows[0]?.total_operating_hours || 0
        ),
        average_capacity_factor_calculated: parseFloat(
          energyResult.rows[0]?.avg_capacity_factor || 0
        ),
        measurement_period: `${
          energyResult.rows[0]?.earliest_date?.toISOString().split('T')[0] ||
          'N/A'
        } to ${
          energyResult.rows[0]?.latest_date?.toISOString().split('T')[0] ||
          'N/A'
        }`,
      };

      return energyTotalsCalculated;
    } catch (error) {
      console.error('❌ Error fetching energy totals:', error);
      throw error;
    }
  }
}
