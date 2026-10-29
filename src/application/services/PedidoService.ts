import { IPedidoRepository } from '../../domain/repositories/IPedidoRepository';
import { IPerfumeRepository } from '../../domain/repositories/IPerfumeRepository';
import { CreatePedidoDTO } from '../dtos/pedido.dto';
import { AppError } from './AuthService';

export class PedidoService {
  constructor(
    private pedidoRepo: IPedidoRepository,
    private perfumeRepo: IPerfumeRepository
  ) {}

  async create(userId: number, dto: CreatePedidoDTO) {
    if (!dto.perfumeId || !dto.direccionEnvio) {
      throw new AppError(400, 'Debes especificar el perfume y la dirección de envío.');
    }

    const perfume = await this.perfumeRepo.findById(Number(dto.perfumeId));
    if (!perfume) {
      throw new AppError(404, 'El perfume solicitado no existe en nuestro catálogo.');
    }

    return this.pedidoRepo.create({
      userId,
      perfumeId: Number(dto.perfumeId),
      cantidad: Math.max(1, Number(dto.cantidad) || 1),
      direccionEnvio: dto.direccionEnvio.trim(),
      telefono: dto.telefono ? dto.telefono.trim() : null,
      mensaje: dto.mensaje ? dto.mensaje.trim() : null,
      estado: 'PENDIENTE',
    });
  }

  async getMias(userId: number) {
    return this.pedidoRepo.findByUserId(userId);
  }

  async getAll() {
    return this.pedidoRepo.findAll();
  }
}
