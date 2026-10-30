import { Perfume } from '../entities/Perfume';

export interface PaginationParams {
  page: number;
  limit: number;
  categoria?: string;
  tipo?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minPrecio?: number;
  maxPrecio?: number;
}

export interface PaginatedResult<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: T[];
}

export interface IPerfumeRepository {
  findAll(params: PaginationParams): Promise<PaginatedResult<Perfume>>;
  findById(id: number): Promise<Perfume | null>;
  create(perfume: Omit<Perfume, 'id' | 'createdAt' | 'updatedAt'>): Promise<Perfume>;
  update(id: number, perfume: Partial<Omit<Perfume, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Perfume>;
  delete(id: number): Promise<void>;
}