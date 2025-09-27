"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/operations/summary.ts
const express_1 = require("express");
const router = (0, express_1.Router)();
// Get basic summary statistics
router.get('/', async (req, res) => {
    console.log('📊 Fetching database summary...');
    try {
        const operationsDb = req.app.locals.operationsDb;
        const result = await operationsDb.query(`
      SELECT 
        'Plants' as category, COUNT(*) as count FROM plants
      UNION ALL
      SELECT 
        'Engines' as category, COUNT(*) as count FROM engines
      UNION ALL
      SELECT 
        'Fuel Types' as category, COUNT(*) as count FROM fuel_types
    `);
        console.log('✅ Summary retrieved successfully');
        res.json({
            success: true,
            data: result.rows,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error('❌ Error fetching summary:', error);
        res.status(500).json({
            success: false,
            message: `Failed to fetch summary: ${error}`,
        });
    }
});
// Get detailed summary with breakdowns
router.get('/detailed', async (req, res) => {
    console.log('📊 Fetching detailed database summary...');
    try {
        const operationsDb = req.app.locals.operationsDb;
        // Get total counts
        const totalCountsResult = await operationsDb.query(`
      SELECT 
        'Plants' as category, COUNT(*) as count FROM plants
      UNION ALL
      SELECT 
        'Engines' as category, COUNT(*) as count FROM engines
      UNION ALL
      SELECT 
        'Fuel Types' as category, COUNT(*) as count FROM fuel_types
    `);
        // Get fuel type breakdown
        const fuelBreakdownResult = await operationsDb.query(`
      SELECT 
        f.fuel_code,
        f.fuel_name,
        COUNT(e.id) as engine_count
      FROM fuel_types f
      LEFT JOIN engines e ON f.fuel_code = e.fuel_code
      GROUP BY f.fuel_code, f.fuel_name
      ORDER BY engine_count DESC, f.fuel_name
    `);
        // Get plant breakdown
        const plantBreakdownResult = await operationsDb.query(`
      SELECT 
        p.plant_id,
        p.plant_name,
        COUNT(e.id) as engine_count
      FROM plants p
      LEFT JOIN engines e ON p.id = e.plant_id
      GROUP BY p.plant_id, p.plant_name
      ORDER BY engine_count DESC, p.plant_name
    `);
        const summary = {
            total_counts: totalCountsResult.rows,
            fuel_type_breakdown: fuelBreakdownResult.rows,
            plant_breakdown: plantBreakdownResult.rows,
        };
        console.log('✅ Detailed summary retrieved successfully');
        res.json({
            success: true,
            data: summary,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error('❌ Error fetching detailed summary:', error);
        res.status(500).json({
            success: false,
            message: `Failed to fetch detailed summary: ${error}`,
        });
    }
});
exports.default = router;
//# sourceMappingURL=summary.js.map