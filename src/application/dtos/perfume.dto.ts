export interface CreatePerfumeDTO {
  nombre: string;
  marca: string;
  precio: number;
  categoria: string;
  tipo: string;
  familiaOlfativa: string;
  concentracion: string;
  notas: string;
  imagenUrl: string;
  descripcion: string;
  stock?: number;
}

export interface UpdatePerfumeDTO extends Partial<CreatePerfumeDTO> {}
