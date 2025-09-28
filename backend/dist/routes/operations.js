"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/operations.ts
const express_1 = require("express");
const engines_1 = __importDefault(require("./engines/engines"));
const plants_1 = __importDefault(require("./plants/plants"));
const router = (0, express_1.Router)();
// Mount operation-specific routes
router.use('/operations/engines', engines_1.default);
router.use('/operations/plants', plants_1.default);
exports.default = router;
//# sourceMappingURL=operations.js.map