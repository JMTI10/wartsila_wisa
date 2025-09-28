"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/operations/engines/index.ts
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
// Get engine by ID (basic info only)
router.get('/:engineId', async (req, res) => {
    const { engineId } = req.params;
    console.log(`🏭 Fetching engine ${engineId}...`);
    try {
        const operationsDb = req.app.locals.operationsDb;
        const result = await operationsDb.query('SELECT * FROM engines WHERE engine_id = $1', [parseInt(engineId)]);
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
// Create new engine
router.post('/', async (req, res) => {
    console.log('🏭 Creating new engine...');
    try {
        const { plant_id, model, nameplate_capacity, status = 'active' } = req.body;
        if (!plant_id) {
            return res.status(400).json({
                success: false,
                message: 'plant_id is required',
            });
        }
        const operationsDb = req.app.locals.operationsDb;
        const result = await operationsDb.query(`INSERT INTO engines (plant_id, model, nameplate_capacity, status) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`, [plant_id, model, nameplate_capacity, status]);
        console.log('✅ Engine created successfully:', result.rows[0].engine_id);
        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Engine created successfully',
        });
    }
    catch (error) {
        console.error('❌ Error creating engine:', error);
        res.status(500).json({
            success: false,
            message: `Failed to create engine: ${error}`,
        });
    }
});
// Update engine
router.put('/:engineId', async (req, res) => {
    const { engineId } = req.params;
    console.log(`🏭 Updating engine ${engineId}...`);
    try {
        const { plant_id, model, nameplate_capacity, status } = req.body;
        const operationsDb = req.app.locals.operationsDb;
        const result = await operationsDb.query(`UPDATE engines 
       SET plant_id = COALESCE($1, plant_id),
           model = COALESCE($2, model),
           nameplate_capacity = COALESCE($3, nameplate_capacity),
           status = COALESCE($4, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE engine_id = $5
       RETURNING *`, [plant_id, model, nameplate_capacity, status, parseInt(engineId)]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Engine with ID ${engineId} not found`,
            });
        }
        console.log(`✅ Engine ${engineId} updated successfully`);
        res.json({
            success: true,
            data: result.rows[0],
            message: 'Engine updated successfully',
        });
    }
    catch (error) {
        console.error(`❌ Error updating engine ${engineId}:`, error);
        res.status(500).json({
            success: false,
            message: `Failed to update engine ${engineId}: ${error}`,
        });
    }
});
// Delete engine (soft delete - set status to decommissioned)
router.delete('/:engineId', async (req, res) => {
    const { engineId } = req.params;
    console.log(`🏭 Decommissioning engine ${engineId}...`);
    try {
        const operationsDb = req.app.locals.operationsDb;
        const result = await operationsDb.query(`UPDATE engines 
       SET status = 'decommissioned', updated_at = CURRENT_TIMESTAMP
       WHERE engine_id = $1
       RETURNING *`, [parseInt(engineId)]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Engine with ID ${engineId} not found`,
            });
        }
        console.log(`✅ Engine ${engineId} decommissioned successfully`);
        res.json({
            success: true,
            data: result.rows[0],
            message: 'Engine decommissioned successfully',
        });
    }
    catch (error) {
        console.error(`❌ Error decommissioning engine ${engineId}:`, error);
        res.status(500).json({
            success: false,
            message: `Failed to decommission engine ${engineId}: ${error}`,
        });
    }
});
exports.default = router;
//# sourceMappingURL=emissions.js.map