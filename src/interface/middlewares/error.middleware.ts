import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../application/services/AuthService';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
    });
    return;
  }

  if (err?.code === 'P2002') {
    res.status(409).json({
      status: 'error',
      statusCode: 409,
      message: 'Ya existe un registro con estos datos únicos.',
    });
    return;
  }

  if (err?.code === 'P2025') {
    res.status(404).json({
      status: 'error',
      statusCode: 404,
      message: 'El recurso solicitado no fue encontrado en la base de datos.',
    });
    return;
  }

  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'El cuerpo de la solicitud no tiene un formato JSON válido.',
    });
    return;
  }

  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Ha ocurrido un error interno en el servidor. Inténtalo más tarde.',
  });
}
