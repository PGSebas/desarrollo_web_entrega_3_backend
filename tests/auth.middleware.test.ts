import { Response, NextFunction } from 'express';
import { requireAuth, requireAdmin, AuthenticatedRequest } from '../src/interface/middlewares/auth.middleware';
import { JwtService } from '../src/infrastructure/security/jwt.service';

describe('Middlewares de Autenticación y Autorización (Bonificación)', () => {
  let mockReq: Partial<AuthenticatedRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
    mockNext = jest.fn();
  });

  describe('1. Middleware requireAuth', () => {
    it('debe responder 401 si no se envía la cabecera Authorization', () => {
      mockReq = {
        headers: {},
      };

      requireAuth(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Unauthorized',
          message: expect.stringContaining('Token de autenticación no proporcionado'),
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('debe responder 401 si la cabecera no tiene el formato Bearer <token>', () => {
      mockReq = {
        headers: {
          authorization: 'Basic token123',
        },
      };

      requireAuth(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('debe responder 401 si el token JWT es inválido o está corrupto', () => {
      mockReq = {
        headers: {
          authorization: 'Bearer token_invalido_xyz',
        },
      };

      requireAuth(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Unauthorized',
          message: expect.stringContaining('Token inválido o expirado'),
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('debe permitir el paso (next) e inyectar el usuario en req.user con un token válido', () => {
      const payloadValido = { id: 10, role: 'USER' as const };
      const token = JwtService.sign(payloadValido);

      mockReq = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      requireAuth(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

      expect(mockReq.user).toBeDefined();
      expect(mockReq.user?.id).toBe(10);
      expect(mockReq.user?.role).toBe('USER');
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  describe('2. Middleware requireAdmin', () => {
    it('debe responder 401 si req.user no existe (no pasó por requireAuth)', () => {
      mockReq = {};

      requireAdmin(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Unauthorized',
          message: 'Autenticación requerida.',
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('debe responder 403 Forbidden si el usuario autenticado tiene rol USER', () => {
      mockReq = {
        user: { id: 2, role: 'USER' },
      };

      requireAdmin(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Forbidden',
          message: expect.stringContaining('Se requieren permisos de Administrador'),
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('debe permitir el paso (next) si el usuario autenticado tiene rol ADMIN', () => {
      mockReq = {
        user: { id: 1, role: 'ADMIN' },
      };

      requireAdmin(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(statusMock).not.toHaveBeenCalled();
    });
  });
});