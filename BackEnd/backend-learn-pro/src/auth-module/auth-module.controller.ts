// src/auth-module/auth-module.controller.ts

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthModuleService } from './auth-module.service';

// Importa los DTOs correctos con sus rutas actualizadas
import { RegisterEstudianteDto } from './dto/Estudiante/create-auth-Estudiante.dto';
import { RegisterAdminDto } from './dto/Administrador/create-auth-Administrador.dto';
import { LoginDto } from './dto/login-auth-module.dto';

@Controller('auth') // Cambiamos el path del controlador a 'auth' para URLs más limpias (ej. /auth/register/estudiante)
export class AuthModuleController {
  constructor(private readonly authModuleService: AuthModuleService) {}

  /**
   * Endpoint para registrar un nuevo estudiante.
   * POST /auth/register/estudiante
   */
  @Post('register/estudiante')
  @HttpCode(HttpStatus.CREATED) // Retorna un 201 Created al registrar exitosamente
  async registerEstudiante(@Body() registerEstudianteDto: RegisterEstudianteDto) {
    return this.authModuleService.registerEstudiante(registerEstudianteDto);
  }

  /**
   * Endpoint para registrar un nuevo administrador.
   * NOTA: Este endpoint debería estar protegido con Guards y Roles para que solo un superadmin pueda usarlo.
   * POST /auth/register/admin
   */
  @Post('register/admin')
  @HttpCode(HttpStatus.CREATED) // Retorna un 201 Created al registrar exitosamente
  async registerAdmin(@Body() registerAdminDto: RegisterAdminDto) {
    return this.authModuleService.registerAdmin(registerAdminDto);
  }

  /**
   * Endpoint para el inicio de sesión de estudiantes y administradores.
   * POST /auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK) // Retorna un 200 OK al iniciar sesión exitosamente
  async login(@Body() loginDto: LoginDto) {
    return this.authModuleService.login(loginDto);
  }

  // Los métodos findAll, findOne, update y remove no son típicos de un AuthModule.
  // Esos métodos irían en un UsersModule si deseas una API CRUD para gestionar perfiles de usuarios.
}