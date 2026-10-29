import { Pedido } from '../entities/Pedido';

export interface IPedidoRepository {
  create(pedido: Omit<Pedido, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'perfume'>): Promise<Pedido>;
  findByUserId(userId: number): Promise<Pedido[]>;
  findAll(): Promise<Pedido[]>;
  findById(id: number): Promise<Pedido | null>;
}
