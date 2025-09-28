"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const operationsDb_1 = __importDefault(require("./database/connections/operationsDb"));
const operations_1 = __importDefault(require("./routes/operations"));
const health_1 = __importDefault(require("./routes/health"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Database instance - make it available to routes
const operationsDb = new operationsDb_1.default();
app.locals.operationsDb = operationsDb;
// Routes
app.use('/health', health_1.default);
app.use('/api', operations_1.default);
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
    // Health endpoints
    console.log('   GET /health - Health check');
    console.log('   GET /health/operations-db - Test operations database connection');
    console.log('   GET /health/database-health - Detailed database health check');
    // Engine operations
    console.log('   GET /api/operations/engines - Get all engines (basic info)');
    console.log('   GET /api/operations/engines/detailed - Get engines with detailed information');
    console.log('   POST /api/operations/engines - Create new engine');
    console.log('   GET /api/operations/engines/:engineId - Get engine by ID');
    console.log('   PUT /api/operations/engines/:engineId - Update engine');
    console.log('   DELETE /api/operations/engines/:engineId - Decommission engine');
    // Engine analytics & overview
    console.log('   GET /api/operations/engines/overview/:engineId - Comprehensive engine overview');
    // Plant operations
    console.log('   GET /api/operations/plants - Get all plants');
    console.log('   POST /api/operations/plants - Create new plant');
    console.log('   GET /api/operations/plants/:plantId - Get plant by ID');
    console.log('   PUT /api/operations/plants/:plantId - Update plant');
    console.log('   GET /api/operations/plants/:plantId/engines - Get engines for plant');
    console.log('   GET /api/operations/plants/:plantId/info - Get plant general information');
    // Fuel type operations
    console.log('   GET /api/operations/fuel-types - Get all fuel types');
    console.log('   GET /api/operations/fuel-types/:fuelCode - Get fuel type by code');
    console.log('   GET /api/operations/fuel-types/:fuelCode/engines - Get engines using fuel type');
    // Summary & analytics
    console.log('   GET /api/operations/summary - Get basic database summary');
    console.log('   GET /api/operations/summary/detailed - Get detailed database summary');
    console.log('🌱 Ready for sustainability data processing!');
});
exports.default = app;
//# sourceMappingURL=server.js.map