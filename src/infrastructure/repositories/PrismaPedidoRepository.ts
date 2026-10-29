import { IPedidoRepository } from '../../domain/repositories/IPedidoRepository';
import { Pedido } from '../../domain/entities/Pedido';
import { prisma } from '../database/prisma.client';

export class PrismaPedidoRepository implements IPedidoRepository {
  async create(pedido: Omit<Pedido, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'perfume'>): Promise<Pedido> {
    const record = await prisma.pedido.create({
      data: {
        userId: pedido.userId,
        perfumeId: pedido.perfumeId,
        cantidad: pedido.cantidad,
        direccionEnvio: pedido.direccionEnvio,
        telefono: pedido.telefono,
        mensaje: pedido.mensaje,
        estado: pedido.estado || 'PENDIENTE',
      },
      include: {
        perfume: true,
      },
    });
    return record as any;
  }

  async findByUserId(userId: number): Promise<Pedido[]> {
    const records = await prisma.pedido.findMany({
      where: { userId },
      include: {
        perfume: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return records as any;
  }

  async findAll(): Promise<Pedido[]> {
    const records = await prisma.pedido.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        perfume: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return records as any;
  }

  async findById(id: number): Promise<Pedido | null> {
    const record = await prisma.pedido.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        perfume: true,
      },
    });
    return record as any;
  }
}
