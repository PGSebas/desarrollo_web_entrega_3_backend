import { Router } from 'express';
import { PerfumeController } from '../controllers/PerfumeController';
import { PerfumeService } from '../../application/services/PerfumeService';
import { PrismaPerfumeRepository } from '../../infrastructure/repositories/PrismaPerfumeRepository';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();
const perfumeRepo = new PrismaPerfumeRepository();
const perfumeService = new PerfumeService(perfumeRepo);
const perfumeController = new PerfumeController(perfumeService);

router.get('/', perfumeController.getAll);
router.get('/:id', perfumeController.getById);

router.post('/', requireAuth, requireAdmin, perfumeController.create);
router.put('/:id', requireAuth, requireAdmin, perfumeController.update);
router.delete('/:id', requireAuth, requireAdmin, perfumeController.delete);

export default router;
