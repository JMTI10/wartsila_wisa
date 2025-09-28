// routes/operations.ts
import { Router } from 'express';
import enginesRoutes from './engines/engines';
import plantsRoutes from './operations/plants';

const router = Router();

// Mount operation-specific routes
router.use('/operations/engines', enginesRoutes);
router.use('/operations/plants', plantsRoutes);

export default router;
