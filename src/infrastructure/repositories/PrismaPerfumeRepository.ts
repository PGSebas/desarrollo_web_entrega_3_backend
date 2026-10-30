import { IPerfumeRepository, PaginationParams, PaginatedResult } from '../../domain/repositories/IPerfumeRepository';
import { Perfume } from '../../domain/entities/Perfume';
import { prisma } from '../database/prisma.client';

export class PrismaPerfumeRepository implements IPerfumeRepository {
  async findAll(params: PaginationParams): Promise<PaginatedResult<Perfume>> {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 8));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.categoria && params.categoria !== 'todos') {
      where.categoria = { equals: params.categoria, mode: 'insensitive' };
    }
    if (params.tipo && params.tipo !== 'todos') {
      where.tipo = { equals: params.tipo, mode: 'insensitive' };
    }
    if (params.search && params.search.trim()) {
      const term = params.search.trim();
      where.OR = [
        { nombre: { contains: term, mode: 'insensitive' } },
        { marca: { contains: term, mode: 'insensitive' } },
        { familiaOlfativa: { contains: term, mode: 'insensitive' } },
        { notas: { contains: term, mode: 'insensitive' } },
      ];
    }

    const minPrice = params.minPrice !== undefined ? Number(params.minPrice) : (params.minPrecio !== undefined ? Number(params.minPrecio) : undefined);
    const maxPrice = params.maxPrice !== undefined ? Number(params.maxPrice) : (params.maxPrecio !== undefined ? Number(params.maxPrecio) : undefined);

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.precio = {};
      if (minPrice !== undefined && !isNaN(minPrice)) {
        where.precio.gte = minPrice;
      }
      if (maxPrice !== undefined && !isNaN(maxPrice)) {
        where.precio.lte = maxPrice;
      }
    }

    const [total, records] = await Promise.all([
      prisma.perfume.count({ where }),
      prisma.perfume.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
    ]);

    return {
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      data: records,
    };
  }

  async findById(id: number): Promise<Perfume | null> {
    return prisma.perfume.findUnique({ where: { id } });
  }

  async create(perfume: Omit<Perfume, 'id' | 'createdAt' | 'updatedAt'>): Promise<Perfume> {
    return prisma.perfume.create({ data: perfume });
  }

  async update(id: number, perfume: Partial<Omit<Perfume, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Perfume> {
    return prisma.perfume.update({
      where: { id },
      data: perfume,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.perfume.delete({ where: { id } });
  }
}