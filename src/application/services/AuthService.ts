import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { PasswordHasher } from '../../infrastructure/security/password.hasher';
import { JwtService } from '../../infrastructure/security/jwt.service';
import { RegisterDTO, LoginDTO, AuthResponseDTO } from '../dtos/auth.dto';

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export class AuthService {
  constructor(private userRepo: IUserRepository) {}

  async register(dto: RegisterDTO): Promise<AuthResponseDTO> {
    if (!dto.name || !dto.email || !dto.password) {
      throw new AppError(400, 'Todos los campos son obligatorios: nombre, email y contraseña.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dto.email)) {
      throw new AppError(400, 'El formato de correo electrónico no es válido.');
    }

    if (dto.password.length < 6) {
      throw new AppError(400, 'La contraseña debe contener al menos 6 caracteres.');
    }

    const existingUser = await this.userRepo.findByEmail(dto.email.toLowerCase().trim());
    if (existingUser) {
      throw new AppError(409, 'Ya existe una cuenta registrada con este correo electrónico.');
    }

    const passwordHash = await PasswordHasher.hash(dto.password);
    const newUser = await this.userRepo.create({
      name: dto.name.trim(),
      email: dto.email.toLowerCase().trim(),
      password: passwordHash,
      role: 'USER',
    });

    const token = JwtService.sign({ id: newUser.id, role: newUser.role });

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    };
  }

  async login(dto: LoginDTO): Promise<AuthResponseDTO> {
    if (!dto.email || !dto.password) {
      throw new AppError(400, 'Debes ingresar tu correo y contraseña.');
    }

    const user = await this.userRepo.findByEmail(dto.email.toLowerCase().trim());
    if (!user || !user.password) {
      throw new AppError(401, 'Credenciales inválidas. Verifica tu correo y contraseña.');
    }

    const isValidPassword = await PasswordHasher.compare(dto.password, user.password);
    if (!isValidPassword) {
      throw new AppError(401, 'Credenciales inválidas. Verifica tu correo y contraseña.');
    }

    const token = JwtService.sign({ id: user.id, role: user.role });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async getMe(userId: number) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppError(404, 'Usuario no encontrado.');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
