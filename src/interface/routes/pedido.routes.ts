import { Router } from 'express';
import { PedidoController } from '../controllers/PedidoController';
import { PedidoService } from '../../application/services/PedidoService';
import { PrismaPedidoRepository } from '../../infrastructure/repositories/PrismaPedidoRepository';
import { PrismaPerfumeRepository } from '../../infrastructure/repositories/PrismaPerfumeRepository';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();
const pedidoRepo = new PrismaPedidoRepository();
const perfumeRepo = new PrismaPerfumeRepository();
const pedidoService = new PedidoService(pedidoRepo, perfumeRepo);
const pedidoController = new PedidoController(pedidoService);

router.post('/', requireAuth, pedidoController.create);
router.get('/mias', requireAuth, pedidoController.getMias);
router.get('/', requireAuth, requireAdmin, pedidoController.getAll);

export default router;
