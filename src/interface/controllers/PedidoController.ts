import { Response, NextFunction } from 'express';
import { PedidoService } from '../../application/services/PedidoService';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class PedidoController {
  constructor(private pedidoService: PedidoService) {}

  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await this.pedidoService.create(userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getMias = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await this.pedidoService.getMias(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.pedidoService.getAll();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
