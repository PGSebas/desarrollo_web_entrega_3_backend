import { Request, Response, NextFunction } from 'express';
import { PerfumeService } from '../../application/services/PerfumeService';

export class PerfumeController {
  constructor(private perfumeService: PerfumeService) {}

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, categoria, tipo, search, minPrice, maxPrice, minPrecio, maxPrecio } = req.query;
      const result = await this.perfumeService.getAll({
        page: Number(page) || 1,
        limit: Number(limit) || 8,
        categoria: categoria as string,
        tipo: tipo as string,
        search: search as string,
        minPrice: minPrice !== undefined ? Number(minPrice) : (minPrecio !== undefined ? Number(minPrecio) : undefined),
        maxPrice: maxPrice !== undefined ? Number(maxPrice) : (maxPrecio !== undefined ? Number(maxPrecio) : undefined),
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'BadRequest', message: 'El ID de perfume debe ser numérico.' });
        return;
      }
      const result = await this.perfumeService.getById(id);
      if (!result) {
        res.status(404).json({ error: 'NotFound', message: `No se encontró ninguna fragancia con ID ${id}.` });
        return;
      }
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.perfumeService.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'BadRequest', message: 'El ID debe ser numérico.' });
        return;
      }
      const result = await this.perfumeService.update(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'BadRequest', message: 'El ID debe ser numérico.' });
        return;
      }
      await this.perfumeService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}