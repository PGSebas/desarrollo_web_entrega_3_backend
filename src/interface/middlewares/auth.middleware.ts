import { Request, Response, NextFunction } from 'express';
import { JwtService, JwtPayload } from '../../infrastructure/security/jwt.service';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Token de autenticación no proporcionado. Inicia sesión para continuar.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = JwtService.verify(token);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Token inválido o expirado. Inicia sesión nuevamente.',
    });
  }
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Autenticación requerida.',
    });
    return;
  }

  if (req.user.role !== 'ADMIN') {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Acceso denegado: Se requieren permisos de Administrador.',
    });
    return;
  }

  next();
}
