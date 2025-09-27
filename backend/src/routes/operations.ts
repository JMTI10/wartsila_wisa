// routes/operations.ts
import { Router } from 'express';
import enginesRoutes from './operations/engines';
import plantsRoutes from './operations/plants';
import fuelTypesRoutes from './operations/fuel-types';
import summaryRoutes from './operations/summary';

const router = Router();

// Mount operation-specific routes
router.use('/operations/engines', enginesRoutes);
router.use('/operations/plants', plantsRoutes);
router.use('/operations/fuel-types', fuelTypesRoutes);
router.use('/operations/summary', summaryRoutes);

export default router;
