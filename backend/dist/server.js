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
    console.log('   GET /api/operations/engines/:engineId - Get comprehensive engine overview');
    // Plant operations
    console.log('   GET /api/operations/plants - Get all plants');
    console.log('   GET /api/operations/plants/:plantId - Get comprehensive plant overview');
    console.log('   GET /api/operations/plants/:plantId/engines - Get engines for plant');
    console.log('🌱 Ready for sustainability data processing!');
});
exports.default = app;
//# sourceMappingURL=server.js.map