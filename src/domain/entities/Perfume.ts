export interface Perfume {
  id: number;
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
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}
