import { IPerfumeRepository, PaginationParams } from '../../domain/repositories/IPerfumeRepository';
import { CreatePerfumeDTO, UpdatePerfumeDTO } from '../dtos/perfume.dto';
import { AppError } from './AuthService';

export class PerfumeService {
  constructor(private perfumeRepo: IPerfumeRepository) {}

  async getAll(params: PaginationParams) {
    return this.perfumeRepo.findAll(params);
  }

  async getById(id: number) {
    const perfume = await this.perfumeRepo.findById(id);
    if (!perfume) {
      throw new AppError(404, 'El perfume solicitado no existe.');
    }
    return perfume;
  }

  async create(dto: CreatePerfumeDTO) {
    if (!dto.nombre || !dto.marca || dto.precio === undefined || !dto.categoria) {
      throw new AppError(400, 'Los campos nombre, marca, precio y categoría son obligatorios.');
    }
    if (Number(dto.precio) <= 0) {
      throw new AppError(400, 'El precio debe ser un valor positivo mayor a 0.');
    }

    return this.perfumeRepo.create({
      nombre: dto.nombre.trim(),
      marca: dto.marca.trim(),
      precio: Number(dto.precio),
      categoria: dto.categoria.toLowerCase(),
      tipo: dto.tipo ? dto.tipo.toLowerCase() : 'disenador',
      familiaOlfativa: dto.familiaOlfativa || 'Sin clasificar',
      concentracion: dto.concentracion || 'Eau de Parfum',
      notas: dto.notas || '',
      imagenUrl: dto.imagenUrl || '',
      descripcion: dto.descripcion || '',
      stock: dto.stock !== undefined ? Number(dto.stock) : 10,
    });
  }

  async update(id: number, dto: UpdatePerfumeDTO) {
    const existing = await this.perfumeRepo.findById(id);
    if (!existing) {
      throw new AppError(404, 'El perfume a editar no existe.');
    }

    if (dto.precio !== undefined && Number(dto.precio) <= 0) {
      throw new AppError(400, 'El precio debe ser mayor a 0.');
    }

    return this.perfumeRepo.update(id, {
      ...dto,
      precio: dto.precio !== undefined ? Number(dto.precio) : undefined,
      stock: dto.stock !== undefined ? Number(dto.stock) : undefined,
    });
  }

  async delete(id: number) {
    const existing = await this.perfumeRepo.findById(id);
    if (!existing) {
      throw new AppError(404, 'El perfume a eliminar no existe.');
    }
    await this.perfumeRepo.delete(id);
  }
}
