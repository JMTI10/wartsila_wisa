import { Pool } from 'pg';

class OperationsDatabase {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
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
    } catch (error) {
      return { success: false, message: `Failed: ${error}` };
    }
  }

  async getEngines() {
    try {
      const result = await this.pool.query('SELECT * FROM engines');
      return { success: true, data: result.rows };
    } catch (error) {
      return { success: false, message: `Error: ${error}` };
    }
  }

  // Add this method for custom queries
  async query(sql: string, params?: any[]) {
    try {
      const result = await this.pool.query(sql, params);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async close() {
    await this.pool.end();
  }
}

export default OperationsDatabase;
