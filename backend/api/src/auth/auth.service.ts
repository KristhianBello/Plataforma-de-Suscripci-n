import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, ...userData } = registerDto;
    
    // Verificar si el usuario ya existe
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear el usuario
    const user = await this.usersService.create({
      ...userData,
      email,
      password: hashedPassword,
    });

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
