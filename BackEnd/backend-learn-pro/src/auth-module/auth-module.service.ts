// src/auth-module/auth-module.service.ts

import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer'; // <-- Importa instanceToPlain
import * as bcrypt from 'bcryptjs'; // Usaremos bcryptjs para el hashing de contraseñas

import { Estudiante } from './entities/Estudiante';
import { Administrador } from './entities/Administrador';

// Importa los DTOs correctos
import { RegisterEstudianteDto } from './dto/Estudiante/create-auth-Estudiante.dto'; // Ruta ajustada
import { RegisterAdminDto } from './dto/Administrador/create-auth-Administrador.dto'; // Ruta ajustada
import { LoginDto } from './dto/login-auth-module.dto'; // Ruta ajustada

@Injectable()
export class AuthModuleService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Administrador)
    private readonly administradorRepository: Repository<Administrador>,
    private readonly jwtService: JwtService, // Para generar y firmar JWTs
  ) {}

  /**
   * Registra un nuevo estudiante en la plataforma.
   * @param registerEstudianteDto Datos para el registro del estudiante.
   * @returns El estudiante registrado con un token de acceso.
   */
  async registerEstudiante(registerEstudianteDto: RegisterEstudianteDto) {
    const { email, contraseña, ...rest } = registerEstudianteDto;

    // 1. Verificar si el email ya existe
    const existingEstudiante = await this.estudianteRepository.findOne({ where: { email } });
    if (existingEstudiante) {
      throw new BadRequestException('El correo electrónico ya está registrado.');
    }

    // 2. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10); // El '10' es el saltRounds, un buen valor predeterminado.

    // 3. Crear y guardar el nuevo estudiante
    const newEstudiante = this.estudianteRepository.create({
      email,
      contraseña: hashedPassword, // Guardamos el hash
      ...rest,
    });
    const savedEstudiante = await this.estudianteRepository.save(newEstudiante);

    // 4. Generar un token JWT para el estudiante
    const payload = { sub: savedEstudiante.id, email: savedEstudiante.email, rol: 'estudiante' };
    const token = await this.jwtService.sign(payload);

    // No devolver la contraseña hasheada en la respuesta
    const { contraseña: _, ...result } = savedEstudiante;
    return {
      
      message: 'Estudiante registrado exitosamente.',
      estudiante: instanceToPlain(savedEstudiante), // <-- Usa instanceToPlain aquí
      access_token: token,
    };
  }

  /**
   * Registra un nuevo administrador en la plataforma.
   * NOTA: Este método debería estar protegido y solo ser accesible por un SuperAdmin.
   * @param registerAdminDto Datos para el registro del administrador.
   * @returns El administrador registrado con un token de acceso.
   */
  async registerAdmin(registerAdminDto: RegisterAdminDto) {
    const { email, contrasena_hash, ...rest } = registerAdminDto;

    // 1. Verificar si el email o nombre_usuario ya existen
    const existingAdmin = await this.administradorRepository.findOne({
      where: [{ email }, { nombre_usuario: rest.nombre_usuario }],
    });
    if (existingAdmin) {
      throw new BadRequestException('El correo electrónico o nombre de usuario ya está registrado.');
    }

    // 2. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contrasena_hash, 10);

    // 3. Crear y guardar el nuevo administrador
    const newAdmin = this.administradorRepository.create({
      email,
      contrasena_hash: hashedPassword, // Guardamos el hash
      ...rest,
    });
    const savedAdmin = await this.administradorRepository.save(newAdmin);

    // 4. Generar un token JWT para el administrador
    const payload = { sub: savedAdmin.id, email: savedAdmin.email, rol: savedAdmin.rol };
    const token = await this.jwtService.sign(payload);

    const { contrasena_hash: _, ...result } = savedAdmin;
    return {
      message: 'Administrador registrado exitosamente.',
      admin: instanceToPlain(savedAdmin), // <-- Usa instanceToPlain aquí
      access_token: token,
    };
  }

  /**
   * Inicia sesión para un usuario (estudiante o administrador).
   * @param loginDto Credenciales de inicio de sesión.
   * @returns El usuario autenticado y un token de acceso.
   */
  async login(loginDto: LoginDto) {
    const { email, contraseña } = loginDto;

    // 1. Intentar encontrar al usuario como estudiante
    // AÑADIR | null al tipo de 'user'
    let user: Estudiante | Administrador | null = await this.estudianteRepository.findOne({ where: { email } });
    let userRole = 'estudiante';

    // 2. Si no es estudiante, intentar encontrarlo como administrador
    if (!user) {
      user = await this.administradorRepository.findOne({ where: { email } });
      userRole = 'administrador';
    }

    // A partir de aquí, TypeScript ya sabe que si 'user' no es null, entonces es Estudiante | Administrador
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas: email no encontrado.');
    }

    // 3. Comparar la contraseña proporcionada con el hash almacenado
    // Aquí, TypeScript ya sabe que 'user' NO es null
    const isPasswordValid = await bcrypt.compare(
      contraseña,
      userRole === 'estudiante' ? (user as Estudiante).contraseña : (user as Administrador).contrasena_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas: contraseña inválida.');
    }

    // 4. Generar un token JWT
    const payload = {
      sub: user.id,
      email: user.email,
      rol: userRole === 'estudiante' ? 'estudiante' : (user as Administrador).rol,
    };
    const token = await this.jwtService.sign(payload);

    // No devolver la contraseña hasheada en la respuesta
    const userResponse = instanceToPlain(user); // <-- ¡Cambia aquí!

    return {
      message: 'Inicio de sesión exitoso.',
      user: userResponse, // <-- Usa instanceToPlain aquí
      access_token: token,
    };
  }

  // Puedes añadir métodos para validar el token o buscar un usuario por ID desde el token
  async validateUserById(userId: number, role: string): Promise<Estudiante | Administrador | null> {
    if (role === 'estudiante') {
      return this.estudianteRepository.findOne({ where: { id: userId } });
    } else if (role === 'administrador' || role === 'super_admin' || role === 'editor_contenido' || role === 'soporte') {
      return this.administradorRepository.findOne({ where: { id: userId } });
    }
    return null;
  }
}