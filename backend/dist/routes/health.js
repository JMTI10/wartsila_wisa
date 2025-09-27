"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/health.ts
const express_1 = require("express");
const router = (0, express_1.Router)();
// Basic health check
router.get('/', (req, res) => {
    console.log('🏥 Health check requested');
    res.json({
        status: 'OK',
        message: 'Wärtsilä Sustainability API is running',
        timestamp: new Date().toISOString(),
    });
});
// Test Operations Database connection
router.get('/operations-db', async (req, res) => {
    console.log('🔍 Testing Operations Database connection...');
    try {
        const operationsDb = req.app.locals.operationsDb;
        const result = await operationsDb.testConnection();
        if (result.success) {
            console.log('✅ Operations DB test successful:', result.message);
        }
        else {
            console.log('❌ Operations DB test failed:', result.message);
        }
        res.json(result);
    }
    catch (error) {
        console.error('❌ Operations DB test error:', error);
        res.status(500).json({
            success: false,
            message: `Database test failed: ${error}`,
        });
    }
});
// Database health check with detailed info
router.get('/database-health', async (req, res) => {
    console.log('🔍 Performing detailed database health check...');
    try {
        const operationsDb = req.app.locals.operationsDb;
        // Test basic connection
        const connectionTest = await operationsDb.testConnection();
        if (!connectionTest.success) {
            return res.status(500).json({
                success: false,
                message: 'Database connection failed',
                details: connectionTest,
            });
        }
        // Test table existence and get counts
        const tablesResult = await operationsDb.query(`
      SELECT 
        table_name,
        (
          SELECT COUNT(*) 
          FROM information_schema.columns 
          WHERE table_name = t.table_name
        ) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
        // Get record counts
        const countsResult = await operationsDb.query(`
      SELECT 
        'plants' as table_name, COUNT(*) as record_count FROM plants
      UNION ALL
      SELECT 
        'engines' as table_name, COUNT(*) as record_count FROM engines
      UNION ALL
      SELECT 
        'fuel_types' as table_name, COUNT(*) as record_count FROM fuel_types
    `);
        console.log('✅ Database health check completed successfully');
        res.json({
            success: true,
            connection: connectionTest,
            tables: tablesResult.rows,
            record_counts: countsResult.rows,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error('❌ Database health check failed:', error);
        res.status(500).json({
            success: false,
            message: `Database health check failed: ${error}`,
        });
    }
});
exports.default = router;
//# sourceMappingURL=health.js.map