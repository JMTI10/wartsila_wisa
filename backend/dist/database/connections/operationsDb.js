"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
class OperationsDatabase {
    constructor() {
        this.pool = new pg_1.Pool({
            host: process.env.DB_OPERATIONS_HOST || 'database-operations',
            port: parseInt(process.env.DB_OPERATIONS_PORT || '5432'),
            user: process.env.POSTGRES_OPERATIONS_USER || 'sustainability_user',
            password: process.env.POSTGRES_OPERATIONS_PASSWORD,
            database: process.env.POSTGRES_OPERATIONS_DB || 'sustainability_platform',
        });
    }
    async testConnection() {
        try {
            const result = await this.pool.query('SELECT NOW()');
            return { success: true, message: 'Connected', data: result.rows };
        }
        catch (error) {
            return { success: false, message: `Failed: ${error}` };
        }
    }
    async getEngines() {
        try {
            const result = await this.pool.query('SELECT * FROM engines');
            return { success: true, data: result.rows };
        }
        catch (error) {
            return { success: false, message: `Error: ${error}` };
        }
    }
    // Add this method for custom queries
    async query(sql, params) {
        try {
            const result = await this.pool.query(sql, params);
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async close() {
        await this.pool.end();
    }
}
exports.default = OperationsDatabase;
//# sourceMappingURL=operationsDb.js.map