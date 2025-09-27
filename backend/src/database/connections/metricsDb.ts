import { Pool } from 'pg';

class MetricsDatabase {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_METRICS_HOST || 'database-metrics',
      port: parseInt(process.env.DB_METRICS_PORT || '5432'),
      user: process.env.POSTGRES_METRICS_USER || 'sustainability_metrics_user',
      password: process.env.POSTGRES_METRICS_PASSWORD,
      database: process.env.POSTGRES_METRICS_DB || 'sustainability_metrics',
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

  async getPlantMetrics() {
    try {
      const result = await this.pool.query('SELECT * FROM plant_metrics');
      return { success: true, data: result.rows };
    } catch (error) {
      return { success: false, message: `Error: ${error}` };
    }
  }

  async close() {
    await this.pool.end();
  }
}

export default MetricsDatabase;
