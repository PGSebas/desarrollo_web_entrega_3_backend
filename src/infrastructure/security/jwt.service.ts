import jwt from 'jsonwebtoken';
import { Role } from '../../domain/entities/User';

export interface JwtPayload {
  id: number;
  role: Role;
}

export class JwtService {
  private static readonly secret = process.env.JWT_SECRET || 'clave_secreta_jwt_noire_perfumes_2026_super_segura';
  private static readonly expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as any;

  static sign(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  static verify(token: string): JwtPayload {
    return jwt.verify(token, this.secret) as JwtPayload;
  }
}
