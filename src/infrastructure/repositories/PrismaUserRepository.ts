import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User, Role } from '../../domain/entities/User';
import { prisma } from '../database/prisma.client';

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const record = await prisma.user.findUnique({ where: { email } });
    if (!record) return null;
    return {
      id: record.id,
      name: record.name,
      email: record.email,
      password: record.password,
      role: record.role as Role,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  async findById(id: number): Promise<User | null> {
    const record = await prisma.user.findUnique({ where: { id } });
    if (!record) return null;
    return {
      id: record.id,
      name: record.name,
      email: record.email,
      password: record.password,
      role: record.role as Role,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const record = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password!,
        role: userData.role as any,
      },
    });
    return {
      id: record.id,
      name: record.name,
      email: record.email,
      password: record.password,
      role: record.role as Role,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
