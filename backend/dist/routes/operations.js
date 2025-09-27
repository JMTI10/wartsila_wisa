"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/operations.ts
const express_1 = require("express");
const engines_1 = __importDefault(require("./operations/engines"));
const plants_1 = __importDefault(require("./operations/plants"));
const fuel_types_1 = __importDefault(require("./operations/fuel-types"));
const summary_1 = __importDefault(require("./operations/summary"));
const router = (0, express_1.Router)();
// Mount operation-specific routes
router.use('/operations/engines', engines_1.default);
router.use('/operations/plants', plants_1.default);
router.use('/operations/fuel-types', fuel_types_1.default);
router.use('/operations/summary', summary_1.default);
exports.default = router;
//# sourceMappingURL=operations.js.map