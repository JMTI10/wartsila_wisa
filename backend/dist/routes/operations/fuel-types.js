"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/operations/fuel-types.ts
const express_1 = require("express");
const router = (0, express_1.Router)();
// Get all fuel types
router.get('/', async (req, res) => {
    console.log('⛽ Fetching fuel types from Operations Database...');
    try {
        const operationsDb = req.app.locals.operationsDb;
        const result = await operationsDb.query('SELECT * FROM fuel_types ORDER BY fuel_name');
        console.log('✅ Fuel types retrieved successfully:', result.rows.length, 'fuel types found');
        res.json({
            success: true,
            data: result.rows,
            count: result.rows.length,
        });
    }
    catch (error) {
        console.error('❌ Error fetching fuel types:', error);
        res.status(500).json({
            success: false,
            message: `Failed to fetch fuel types: ${error}`,
        });
    }
});
// Get fuel type by code
router.get('/:fuelCode', async (req, res) => {
    const { fuelCode } = req.params;
    console.log(`⛽ Fetching fuel type ${fuelCode}...`);
    try {
        const operationsDb = req.app.locals.operationsDb;
        const result = await operationsDb.query('SELECT * FROM fuel_types WHERE fuel_code = $1', [fuelCode.toUpperCase()]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Fuel type with code ${fuelCode} not found`,
            });
        }
        console.log(`✅ Fuel type ${fuelCode} retrieved successfully`);
        res.json({
            success: true,
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error(`❌ Error fetching fuel type ${fuelCode}:`, error);
        res.status(500).json({
            success: false,
            message: `Failed to fetch fuel type ${fuelCode}: ${error}`,
        });
    }
});
// Get engines using specific fuel type
router.get('/:fuelCode/engines', async (req, res) => {
    const { fuelCode } = req.params;
    console.log(`⛽ Fetching engines using fuel type ${fuelCode}...`);
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
      WHERE f.fuel_code = $1
      ORDER BY p.plant_name, e.engine_id
    `, [fuelCode.toUpperCase()]);
        console.log(`✅ Engines using fuel type ${fuelCode} retrieved:`, result.rows.length, 'engines found');
        res.json({
            success: true,
            data: result.rows,
            count: result.rows.length,
            fuel_code: fuelCode.toUpperCase(),
        });
    }
    catch (error) {
        console.error(`❌ Error fetching engines for fuel type ${fuelCode}:`, error);
        res.status(500).json({
            success: false,
            message: `Failed to fetch engines for fuel type ${fuelCode}: ${error}`,
        });
    }
});
exports.default = router;
//# sourceMappingURL=fuel-types.js.map