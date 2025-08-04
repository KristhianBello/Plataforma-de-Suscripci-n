// src/auth-module/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';

import { UserFactory } from './factories/users.factory'; // <-- Importamos el factory
import { UserEntity } from './factories/user.factory'; // <-- Importamos el tipo de la entidad


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private userFactory: UserFactory, // <-- Inyectamos el factory
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, rol = 'estudiante', ...userData } = registerDto;
    
    // Verificar si el usuario ya existe
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Patrón de Diseño: Factory Method
    // Usamos el factory para crear la entidad de usuario correcta
    // Se asume que registerDto tiene una propiedad 'rol'. Si no, por defecto será 'estudiante'.
    const newUserEntity = this.userFactory.createUser(rol as 'estudiante' | 'administrador');
    
    // Asignar los datos del DTO a la entidad creada
    Object.assign(newUserEntity, {
      ...userData,
      email,
      password: hashedPassword,
    });

    // Guardar la entidad de usuario en la base de datos
    const user = await this.usersService.create(newUserEntity);

    // Generar token
    const token = this.generateToken(user);
    
    return {
      user: this.excludePassword(user),
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    // Buscar usuario por email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generar token
    const token = this.generateToken(user);
    
    return {
      user: this.excludePassword(user),
      token,
    };
  }

  async validateUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.excludePassword(user);
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  private excludePassword(user: any) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}