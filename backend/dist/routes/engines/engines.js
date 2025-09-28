"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/operations/engines.ts
const express_1 = require("express");
// Import service functions
const generalInfo_1 = require("./generalInfo");
const efficiencyMetrics_1 = require("./efficiencyMetrics");
const emissionsMetrics_1 = require("./emissionsMetrics");
const yearlyData_1 = require("./yearlyData");
const dailyEmissions_1 = require("./dailyEmissions");
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
// Get comprehensive engine overview with all metrics
router.get('/:engineId', async (req, res) => {
    const { engineId } = req.params;
    console.log(`🏭 Fetching comprehensive overview for engine ${engineId}...`);
    try {
        const operationsDb = req.app.locals.operationsDb;
        // Get basic engine info
        const engineInfoResult = await (0, generalInfo_1.getEngineGeneralInfo)(operationsDb, engineId);
        if (!engineInfoResult.success) {
            return res.status(404).json(engineInfoResult);
        }
        // Get efficiency metrics
        const efficiencyResult = await (0, efficiencyMetrics_1.getEngineEfficiencyMetrics)(operationsDb, engineId);
        if (!efficiencyResult.success) {
            return res.status(500).json(efficiencyResult);
        }
        // Get raw data needed for emissions calculation
        const rawDataResult = await operationsDb.query(`SELECT 
        SUM(eg.net_generation) as total_net_generation,
        SUM(eg.operating_hours) as total_operating_hours
       FROM engine_generation eg
       WHERE eg.engine_id = $1`, [engineId]);
        const rawData = rawDataResult.rows[0];
        const totalNetGeneration = parseFloat(rawData.total_net_generation || 0);
        const totalOperatingHours = parseFloat(rawData.total_operating_hours || 0);
        // Get emissions metrics (using the raw data)
        const emissionsResult = await (0, emissionsMetrics_1.getEngineEmissionsMetrics)(operationsDb, engineId, totalNetGeneration, totalOperatingHours);
        if (!emissionsResult.success) {
            return res.status(500).json(emissionsResult);
        }
        // Get yearly data
        const yearlyResult = await (0, yearlyData_1.getEngineYearlyData)(operationsDb, engineId);
        if (!yearlyResult.success) {
            return res.status(500).json(yearlyResult);
        }
        // Get daily emissions data
        const dailyEmissionsResult = await (0, dailyEmissions_1.getEngineDailyEmissions)(operationsDb, engineId);
        if (!dailyEmissionsResult.success) {
            return res.status(500).json(dailyEmissionsResult);
        }
        // Build response
        const response = {
            success: true,
            data: {
                general_info: engineInfoResult.data,
                efficiency_metrics: efficiencyResult.data,
                emissions_metrics: emissionsResult.data,
                yearly_data: yearlyResult.data,
                emissions_daily_data: dailyEmissionsResult.data,
            },
        };
        console.log(`✅ Engine ${engineId} overview retrieved successfully`);
        res.json(response);
    }
    catch (error) {
        console.error(`❌ Error fetching engine ${engineId} overview:`, error);
        res.status(500).json({
            success: false,
            message: `Failed to fetch engine ${engineId} overview: ${error}`,
        });
    }
});
exports.default = router;
//# sourceMappingURL=engines.js.map