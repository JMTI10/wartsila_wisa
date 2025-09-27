"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/operations/engines.ts
const express_1 = require("express");
const router = (0, express_1.Router)();
// Get all engines (basic info)
router.get('/', async (req, res) => {
    console.log('🏭 Fetching engines from Operations Database...');
    try {
        const operationsDb = req.app.locals.operationsDb;
        const result = await operationsDb.getEngines();
        if (result.success) {
            console.log('✅ Engines retrieved successfully:', result.data?.length, 'engines found');
            res.json({
                success: true,
                data: result.data,
                count: result.data?.length || 0,
            });
        }
        else {
            console.log('❌ Failed to retrieve engines:', result.message);
            res.status(500).json(result);
        }
    }
    catch (error) {
        console.error('❌ Error fetching engines:', error);
        res.status(500).json({
            success: false,
            message: `Failed to fetch engines: ${error}`,
        });
    }
});
// Get engines with detailed information (JOIN query)
router.get('/detailed', async (req, res) => {
    console.log('🏭 Fetching detailed engines from Operations Database...');
    try {
        const operationsDb = req.app.locals.operationsDb;
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
        console.log('✅ Detailed engines retrieved successfully:', result.rows.length, 'engines found');
        res.json({
            success: true,
            data: result.rows,
            count: result.rows.length,
        });
    }
    catch (error) {
        console.error('❌ Error fetching detailed engines:', error);
        res.status(500).json({
            success: false,
            message: `Failed to fetch detailed engines: ${error}`,
        });
    }
});
// Get engine by ID
router.get('/:engineId', async (req, res) => {
    const { engineId } = req.params;
    console.log(`🏭 Fetching engine ${engineId}...`);
    try {
        const operationsDb = req.app.locals.operationsDb;
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
      WHERE e.engine_id = $1
    `, [engineId]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Engine with ID ${engineId} not found`,
            });
        }
        console.log(`✅ Engine ${engineId} retrieved successfully`);
        res.json({
            success: true,
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error(`❌ Error fetching engine ${engineId}:`, error);
        res.status(500).json({
            success: false,
            message: `Failed to fetch engine ${engineId}: ${error}`,
        });
    }
});
exports.default = router;
//# sourceMappingURL=engines.js.map