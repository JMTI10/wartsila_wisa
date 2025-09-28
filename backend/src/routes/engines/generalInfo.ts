// services/engines/generalInfo.ts
import OperationsDatabase from '../../database/connections/operationsDb';
import { Engine } from '../../types/Engine';

export async function getEngineGeneralInfo(
  operationsDb: OperationsDatabase,
  engineId: string
): Promise<{ success: boolean; data?: Engine; message?: string }> {
  try {
    const engineResult = await operationsDb.query(
      'SELECT * FROM engines WHERE engine_id = $1',
      [engineId]
    );

    if (engineResult.rows.length === 0) {
      return {
        success: false,
        message: `Engine with ID ${engineId} not found`,
      };
    }

    const engine = engineResult.rows[0] as Engine;

    return {
      success: true,
      data: {
        engine_id: engine.engine_id,
        plant_id: engine.plant_id,
        model: engine.model,
        nameplate_capacity: engine.nameplate_capacity,
        status: engine.status,
        created_at: engine.created_at,
        updated_at: engine.updated_at,
      } as Engine,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to fetch engine general info: ${error}`,
    };
  }
}
