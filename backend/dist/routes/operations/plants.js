"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/operations/plants.ts
const express_1 = require("express");
const router = (0, express_1.Router)();
// Get all plants
router.get('/', async (req, res) => {
    console.log('🏭 Fetching plants from Operations Database...');
    try {
        const operationsDb = req.app.locals.operationsDb;
        const result = await operationsDb.query('SELECT * FROM plants ORDER BY plant_name');
        console.log('✅ Plants retrieved successfully:', result.rows.length, 'plants found');
        res.json({
            success: true,
            data: result.rows,
            count: result.rows.length,
        });
    }
    catch (error) {
        console.error('❌ Error fetching plants:', error);
        res.status(500).json({
            success: false,
            message: `Failed to fetch plants: ${error}`,
        });
    }
});
// Get plant by ID
router.get('/:plantId', async (req, res) => {
    const { plantId } = req.params;
    console.log(`🏭 Fetching plant ${plantId}...`);
    try {
        const operationsDb = req.app.locals.operationsDb;
        const result = await operationsDb.query('SELECT * FROM plants WHERE plant_id = $1', [plantId]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Plant with ID ${plantId} not found`,
            });
        }
        console.log(`✅ Plant ${plantId} retrieved successfully`);
        res.json({
            success: true,
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error(`❌ Error fetching plant ${plantId}:`, error);
        res.status(500).json({
            success: false,
            message: `Failed to fetch plant ${plantId}: ${error}`,
        });
    }
});
// Get engines for a specific plant
router.get('/:plantId/engines', async (req, res) => {
    const { plantId } = req.params;
    console.log(`🏭 Fetching engines for plant ${plantId}...`);
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
      WHERE p.plant_id = $1
      ORDER BY e.engine_id
    `, [plantId]);
        console.log(`✅ Engines for plant ${plantId} retrieved:`, result.rows.length, 'engines found');
        res.json({
            success: true,
            data: result.rows,
            count: result.rows.length,
            plant_id: plantId,
        });
    }
    catch (error) {
        console.error(`❌ Error fetching engines for plant ${plantId}:`, error);
        res.status(500).json({
            success: false,
            message: `Failed to fetch engines for plant ${plantId}: ${error}`,
        });
    }
});
exports.default = router;
//# sourceMappingURL=plants.js.map