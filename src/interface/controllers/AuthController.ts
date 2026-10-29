import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../application/services/AuthService';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  me = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.getMe(req.user!.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
