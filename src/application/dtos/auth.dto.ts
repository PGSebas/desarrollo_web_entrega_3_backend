import { Role } from '../../domain/entities/User';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  user: {
    id: number;
    name: string;
    email: string;
    role: Role;
  };
  token: string;
}
