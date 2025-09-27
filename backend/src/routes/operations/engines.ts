// routes/operations/engines.ts
import { Router, Request, Response } from 'express';
import OperationsDatabase from '../../database/connections/operationsDb';
import { Engine, EngineWithDetails } from '../../types/Engine';

const router = Router();

// Get all engines (basic info)
router.get('/', async (req: Request, res: Response) => {
  console.log('🏭 Fetching engines from Operations Database...');

  try {
    const operationsDb: OperationsDatabase = req.app.locals.operationsDb;
    const result = await operationsDb.getEngines();

    if (result.success) {
      console.log(
        '✅ Engines retrieved successfully:',
        result.data?.length,
        'engines found'
      );
      res.json({
        success: true,
        data: result.data as Engine[],
        count: result.data?.length || 0,
      });
    } else {
      console.log('❌ Failed to retrieve engines:', result.message);
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('❌ Error fetching engines:', error);
    res.status(500).json({
      success: false,
      message: `Failed to fetch engines: ${error}`,
    });
  }
});

// Get engines with detailed information (JOIN query)
router.get('/detailed', async (req: Request, res: Response) => {
  console.log('🏭 Fetching detailed engines from Operations Database...');

  try {
    const operationsDb: OperationsDatabase = req.app.locals.operationsDb;
    const result = await operationsDb.query(`
      SELECT 
        e.id,
        e.engine_id,
        e.engine_name,
        e.plant_id,
        p.plant_name,
        e.fuel_code,
        f.fuel_name,
        e.created_at
      FROM engines e
      JOIN plants p ON e.plant_id = p.id
      JOIN fuel_types f ON e.fuel_code = f.fuel_code
      ORDER BY p.plant_name, e.engine_id
    `);

    console.log(
      '✅ Detailed engines retrieved successfully:',
      result.rows.length,
      'engines found'
    );
    res.json({
      success: true,
      data: result.rows as EngineWithDetails[],
      count: result.rows.length,
    });
  } catch (error) {
    console.error('❌ Error fetching detailed engines:', error);
    res.status(500).json({
      success: false,
      message: `Failed to fetch detailed engines: ${error}`,
    });
  }
});

// Get engine by ID
router.get('/:engineId', async (req: Request, res: Response) => {
  const { engineId } = req.params;
  console.log(`🏭 Fetching engine ${engineId}...`);

  try {
    const operationsDb: OperationsDatabase = req.app.locals.operationsDb;
    const result = await operationsDb.query(
      `
      SELECT 
        e.id,
        e.engine_id,
        e.engine_name,
        e.plant_id,
        p.plant_name,
        e.fuel_code,
        f.fuel_name,
        e.created_at
      FROM engines e
      JOIN plants p ON e.plant_id = p.id
      JOIN fuel_types f ON e.fuel_code = f.fuel_code
      WHERE e.engine_id = $1
    `,
      [engineId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Engine with ID ${engineId} not found`,
      });
    }

    console.log(`✅ Engine ${engineId} retrieved successfully`);
    res.json({
      success: true,
      data: result.rows[0] as EngineWithDetails,
    });
  } catch (error) {
    console.error(`❌ Error fetching engine ${engineId}:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to fetch engine ${engineId}: ${error}`,
    });
  }
});

export default router;
