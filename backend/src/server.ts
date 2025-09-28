// server.ts
import express from 'express';
import cors from 'cors';
import OperationsDatabase from './database/connections/operationsDb';
import operationsRoutes from './routes/operations';
import healthRoutes from './routes/health';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database instance - make it available to routes
const operationsDb = new OperationsDatabase();
app.locals.operationsDb = operationsDb;

// Routes
app.use('/health', healthRoutes);
app.use('/api', operationsRoutes);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down server...');
  await operationsDb.close();
  process.exit(0);
});

// Start server
app.listen(port, () => {
  console.log('🚀 Wärtsilä Sustainability API Server started');
  console.log(`📍 Server running on port ${port}`);
  console.log('🔗 Available endpoints:');
  console.log('   GET /health - Health check');
  console.log(
    '   GET /health/operations-db - Test operations database connection'
  );
  console.log(
    '   GET /health/database-health - Detailed database health check'
  );

  // Basic operations
  console.log('   GET /api/operations/engines - Get all engines');
  console.log('   POST /api/operations/engines - Create new engine');
  console.log('   GET /api/operations/engines/:engineId - Get engine by ID');
  console.log('   PUT /api/operations/engines/:engineId - Update engine');
  console.log(
    '   DELETE /api/operations/engines/:engineId - Decommission engine'
  );

  // Engine analytics
  console.log(
    '   GET /api/operations/engines/overview/:engineId - Comprehensive engine overview'
  );

  // Emissions analytics
  console.log(
    '   GET /api/operations/engines/emissions/:engineId/daily - Daily emissions data'
  );
  console.log(
    '   GET /api/operations/engines/emissions/:engineId/yearly - Yearly emissions trends'
  );
  console.log(
    '   GET /api/operations/engines/emissions/:engineId/summary - Complete emissions summary'
  );

  // Other endpoints
  console.log('   GET /api/operations/plants - Get all plants');
  console.log('   GET /api/operations/fuel-types - Get all fuel types');
  console.log(
    '   GET /api/operations/plants/:plantId/engines - Get engines for plant'
  );
  console.log('   GET /api/operations/summary - Get database summary');

  console.log('🌱 Ready for sustainability data processing!');
});

export default app;
