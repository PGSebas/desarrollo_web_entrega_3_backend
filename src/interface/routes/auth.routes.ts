import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../../application/services/AuthService';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();
const userRepo = new PrismaUserRepository();
const authService = new AuthService(userRepo);
const authController = new AuthController(authService);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', requireAuth, authController.me);

export default router;
