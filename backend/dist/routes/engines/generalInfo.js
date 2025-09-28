"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEngineGeneralInfo = getEngineGeneralInfo;
async function getEngineGeneralInfo(operationsDb, engineId) {
    try {
        const engineResult = await operationsDb.query('SELECT * FROM engines WHERE engine_id = $1', [engineId]);
        if (engineResult.rows.length === 0) {
            return {
                success: false,
                message: `Engine with ID ${engineId} not found`,
            };
        }
        const engine = engineResult.rows[0];
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
            },
        };
    }
    catch (error) {
        return {
            success: false,
            message: `Failed to fetch engine general info: ${error}`,
        };
    }
}
//# sourceMappingURL=generalInfo.js.map