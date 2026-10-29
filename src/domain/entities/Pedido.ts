import { User } from './User';
import { Perfume } from './Perfume';

export interface Pedido {
  id: number;
  userId: number;
  user?: User;
  perfumeId: number;
  perfume?: Perfume;
  cantidad: number;
  direccionEnvio: string;
  telefono?: string | null;
  mensaje?: string | null;
  estado: string;
  createdAt?: Date;
  updatedAt?: Date;
}
