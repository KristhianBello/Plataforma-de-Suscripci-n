// src/users-module/users-module.controller.ts

import { Controller, Get, Patch, Body, Param, Delete, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersModuleService } from './users-module.service';

// Importa los DTOs correctos
import { UpdateEstudianteProfileDto } from './dto/Estudiante/update-users-Estudiante.dto';
import { UpdateAdminProfileDto } from './dto/Administrador/update-users-Administrador.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

// Importa los Guards y Decoradores (asumiendo que los crearás)
import { JwtAuthGuard } from '../auth-module/guards/jwt-auth.guard'; // Ruta de ejemplo, ajusta según donde lo crees
import { RolesGuard } from '../auth-module/guards/roles.guard';     // Ruta de ejemplo
import { Roles } from '../auth-module/decorators/roles.decorator';   // Ruta de ejemplo
import { User } from '../auth-module/decorators/user.decorator';     // Ruta de ejemplo, para obtener el usuario del request

// Define una interfaz para el payload del JWT que se adjunta al Request
interface JwtPayload {
  sub: number; // ID del usuario
  email: string;
  rol: string; // 'estudiante', 'admin', 'super_admin', etc.
}

@Controller('users') // Cambiamos el prefijo de la ruta a 'users'
@UseGuards(JwtAuthGuard) // Todas las rutas en este controlador requieren autenticación JWT por defecto
export class UsersModuleController {
  constructor(private readonly usersModuleService: UsersModuleService) {}

  /**
   * Obtener el perfil del usuario autenticado (estudiante o administrador).
   * GET /users/me
   */
  @Get('me')
  async getMyProfile(@User() user: JwtPayload) { // Usamos el decorador @User para obtener el payload
    if (user.rol === 'estudiante') {
      return this.usersModuleService.getEstudianteProfile(user.sub);
    } else {
      // Asumimos que cualquier otro rol es un administrador
      return this.usersModuleService.getAdminProfile(user.sub);
    }
  }

  /**
   * Actualizar el perfil del usuario autenticado (estudiante o administrador).
   * PATCH /users/me
   */
  @Patch('me')
  async updateMyProfile(
    @User() user: JwtPayload,
    @Body() updateDto: UpdateEstudianteProfileDto | UpdateAdminProfileDto, // Puede ser cualquiera de los dos
  ) {
    if (user.rol === 'estudiante') {
      return this.usersModuleService.updateEstudianteProfile(user.sub, updateDto as UpdateEstudianteProfileDto);
    } else {
      return this.usersModuleService.updateAdminProfile(user.sub, updateDto as UpdateAdminProfileDto);
    }
  }

  /**
   * Cambiar la contraseña del usuario autenticado.
   * PATCH /users/me/password
   */
  @Patch('me/password')
  @HttpCode(HttpStatus.OK)
  async changeMyPassword(@User() user: JwtPayload, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersModuleService.changePassword(user.sub, user.rol as 'estudiante' | 'administrador', changePasswordDto);
  }

  // --- Rutas exclusivas para Administradores ---

  /**
   * Obtener todos los estudiantes.
   * GET /users/estudiantes
   * Solo accesible por usuarios con rol 'admin' o 'super_admin'.
   */
  @Get('estudiantes')
  @UseGuards(RolesGuard) // Usa el RolesGuard para verificar el rol
  @Roles('admin', 'super_admin') // Define los roles permitidos
  async findAllEstudiantes() {
    return this.usersModuleService.findAllEstudiantes();
  }

  /**
   * Obtener el perfil de un estudiante por ID (para administradores).
   * GET /users/estudiantes/:id
   * Solo accesible por usuarios con rol 'admin' o 'super_admin'.
   */
  @Get('estudiantes/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  async getEstudianteById(@Param('id') id: string) {
    return this.usersModuleService.getEstudianteProfile(+id);
  }

  /**
   * Actualizar el perfil de un estudiante por ID (para administradores).
   * PATCH /users/estudiantes/:id
   * Solo accesible por usuarios con rol 'admin' o 'super_admin'.
   */
  @Patch('estudiantes/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  async updateEstudianteById(@Param('id') id: string, @Body() updateEstudianteDto: UpdateEstudianteProfileDto) {
    return this.usersModuleService.updateEstudianteProfile(+id, updateEstudianteDto);
  }

  /**
   * Eliminar un estudiante por ID (para administradores).
   * DELETE /users/estudiantes/:id
   * Solo accesible por usuarios con rol 'admin' o 'super_admin'.
   */
  @Delete('estudiantes/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content para eliminación exitosa sin cuerpo de respuesta
  async removeEstudiante(@Param('id') id: string) {
    await this.usersModuleService.removeEstudiante(+id);
  }

  // --- Rutas exclusivas para Super Administradores ---

  /**
   * Obtener todos los administradores.
   * GET /users/administradores
   * Solo accesible por usuarios con rol 'super_admin'.
   */
  @Get('administradores')
  @UseGuards(RolesGuard)
  @Roles('super_admin')
  async findAllAdmins() {
    return this.usersModuleService.findAllAdmins();
  }

  /**
   * Obtener el perfil de un administrador por ID (para super_admin).
   * GET /users/administradores/:id
   * Solo accesible por usuarios con rol 'super_admin'.
   */
  @Get('administradores/:id')
  @UseGuards(RolesGuard)
  @Roles('super_admin')
  async getAdminById(@Param('id') id: string) {
    return this.usersModuleService.getAdminProfile(+id);
  }

  /**
   * Actualizar el perfil de un administrador por ID (para super_admin).
   * PATCH /users/administradores/:id
   * Solo accesible por usuarios con rol 'super_admin'.
   */
  @Patch('administradores/:id')
  @UseGuards(RolesGuard)
  @Roles('super_admin')
  async updateAdminById(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminProfileDto) {
    return this.usersModuleService.updateAdminProfile(+id, updateAdminDto);
  }

  /**
   * Eliminar un administrador por ID (para super_admin).
   * DELETE /users/administradores/:id
   * Solo accesible por usuarios con rol 'super_admin'.
   */
  @Delete('administradores/:id')
  @UseGuards(RolesGuard)
  @Roles('super_admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAdmin(@Param('id') id: string) {
    await this.usersModuleService.removeAdmin(+id);
  }
}