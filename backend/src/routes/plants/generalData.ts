// services/plants/plantGeneralDataService.ts
import OperationsDatabase from '../../database/connections/operationsDb';

export class PlantGeneralDataService {
  /**
   * Get general plant data by plant ID
   * @param operationsDb Database connection
   * @param plantId Primary key ID of the plant
   * @returns Plant data or null if not found
   */
  static async getPlantGeneralData(
    operationsDb: OperationsDatabase,
    plantId: string
  ): Promise<any | null> {
    try {
      const plantResult = await operationsDb.query(
        'SELECT * FROM plants WHERE id = $1',
        [plantId]
      );

      if (plantResult.rows.length === 0) {
        return null;
      }

      return plantResult.rows[0];
    } catch (error) {
      console.error('❌ Error fetching plant general data:', error);
      throw error;
    }
  }
}
