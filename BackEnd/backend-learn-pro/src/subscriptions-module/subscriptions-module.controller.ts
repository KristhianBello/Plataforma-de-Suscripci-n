// src/subscriptions-module/subscriptions-module.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Query, ForbiddenException } from '@nestjs/common';
import { SubscriptionsModuleService } from './subscriptions-module.service';
// Importa los DTOs correctos
import { CreateSuscripcionDto } from './dto/create-subscriptions-module.dto';
import { UpdateSuscripcionDto } from './dto/update-subscriptions-module.dto';

// Importa los Guards y Decoradores de tu AuthModule
import { JwtAuthGuard } from '../auth-module/guards/jwt-auth.guard';
import { RolesGuard } from '../auth-module/guards/roles.guard';
import { Roles } from '../auth-module/decorators/roles.decorator';
import { User } from '../auth-module/decorators/user.decorator'; // Para obtener el usuario autenticado

// Define una interfaz para el payload del JWT que se adjunta al Request
interface JwtPayload {
  sub: number; // ID del usuario
  email: string;
  rol: string; // 'estudiante', 'admin', 'super_admin', etc.
}

@Controller('subscriptions') // Cambiamos el prefijo de la ruta a 'subscriptions'
@UseGuards(JwtAuthGuard) // Todas las rutas en este controlador requieren autenticación JWT por defecto
export class SubscriptionsModuleController {
  constructor(private readonly subscriptionsModuleService: SubscriptionsModuleService) {}

  /**
   * Crea una nueva suscripción.
   * POST /subscriptions
   * Puede ser iniciada por un estudiante (para sí mismo) o por un admin (para cualquier estudiante).
   * Si es un estudiante, se asegura que la suscripción es para su propio ID.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSuscripcion(@User() user: JwtPayload, @Body() createSuscripcionDto: CreateSuscripcionDto) {
    // Si el usuario es un estudiante, asegúrate de que solo pueda suscribirse a sí mismo.
    if (user.rol === 'estudiante' && user.sub !== createSuscripcionDto.estudiante_id) {
      throw new ForbiddenException('Un estudiante solo puede crear suscripciones para sí mismo.'); // Corregido
    }
    return this.subscriptionsModuleService.createSuscripcion(createSuscripcionDto);
  }

  /**
   * Obtiene todas las suscripciones.
   * GET /subscriptions
   * Solo accesible por usuarios con rol 'admin' o 'super_admin'.
   * Opcionalmente, un estudiante puede ver sus propias suscripciones (filtrado por query param).
   */
  @Get()
  @UseGuards(RolesGuard) // Usa RolesGuard para verificar el rol
  @Roles('admin', 'super_admin') // Solo administradores pueden ver todas las suscripciones
  async findAllSuscripciones(
    @Query('estudianteId') estudianteId?: string,
    @Query('cursoId') cursoId?: string,
  ) {
    return this.subscriptionsModuleService.findAllSuscripciones(
      estudianteId ? +estudianteId : undefined,
      cursoId ? +cursoId : undefined,
    );
  }

  /**
   * Obtiene una suscripción específica por su ID.
   * GET /subscriptions/:id
   * Accesible por 'admin', 'super_admin', o el 'estudiante' propietario de la suscripción.
   */
  @Get(':id')
  async findOneSuscripcion(@User() user: JwtPayload, @Param('id') id: string) {
    const suscripcion = await this.subscriptionsModuleService.findOneSuscripcion(+id);

    // Si el usuario no es admin/super_admin, debe ser el propietario de la suscripción
    if (user.rol === 'estudiante' && suscripcion.estudiante_id !== user.sub) {
      throw new ForbiddenException('No tienes permiso para ver esta suscripción.'); // Corregido
    }
    return suscripcion;
  }

  /**
   * Actualiza una suscripción existente.
   * PATCH /subscriptions/:id
   * Solo accesible por usuarios con rol 'admin' o 'super_admin'.
   */
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  async updateSuscripcion(@Param('id') id: string, @Body() updateSuscripcionDto: UpdateSuscripcionDto) {
    return this.subscriptionsModuleService.updateSuscripcion(+id, updateSuscripcionDto);
  }

  /**
   * Elimina una suscripción por su ID.
   * DELETE /subscriptions/:id
   * Solo accesible por usuarios con rol 'admin' o 'super_admin'.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content para eliminación exitosa
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  async removeSuscripcion(@Param('id') id: string) {
    await this.subscriptionsModuleService.removeSuscripcion(+id);
  }

  // --- Endpoints de Gestión de Estado de Suscripción ---

  /**
   * Finaliza una suscripción.
   * PATCH /subscriptions/:id/finalize
   * Solo accesible por usuarios con rol 'admin' o 'super_admin'.
   */
  @Patch(':id/finalize')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  async finalizeSuscripcion(@Param('id') id: string) {
    return this.subscriptionsModuleService.finalizeSuscripcion(+id);
  }

  /**
   * Cancela una suscripción.
   * PATCH /subscriptions/:id/cancel
   * Solo accesible por usuarios con rol 'admin' o 'super_admin', o el estudiante propietario.
   */
  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelSuscripcion(@User() user: JwtPayload, @Param('id') id: string) {
    const suscripcion = await this.subscriptionsModuleService.findOneSuscripcion(+id);

    // Permitir cancelar si es admin/super_admin o el estudiante propietario
    if (user.rol === 'estudiante' && suscripcion.estudiante_id !== user.sub) {
      throw new ForbiddenException('No tienes permiso para cancelar esta suscripción.'); // Corregido
    }
    // Si es admin/super_admin, o si es el estudiante propietario, permite la cancelación
    return this.subscriptionsModuleService.cancelSuscripcion(+id);
  }

  // --- Endpoints para Estudiantes (ver sus propias suscripciones) ---

  /**
   * Obtiene todas las suscripciones de un estudiante específico.
   * GET /subscriptions/by-estudiante/:estudianteId
   * Protegido para que solo un admin/super_admin pueda ver las de otros,
   * o el propio estudiante pueda ver las suyas.
   */
  @Get('by-estudiante/:estudianteId')
  async findSuscripcionesByEstudiante(@User() user: JwtPayload, @Param('estudianteId') estudianteId: string) {
    // Si el usuario no es admin/super_admin, debe ser el propio estudiante
    if (user.rol === 'estudiante' && user.sub !== +estudianteId) {
      throw new ForbiddenException('No tienes permiso para ver las suscripciones de otro estudiante.'); // Corregido
    }
    return this.subscriptionsModuleService.findSuscripcionesByEstudiante(+estudianteId);
  }

  /**
   * Obtiene todas las suscripciones a un curso específico.
   * GET /subscriptions/by-curso/:cursoId
   * Solo accesible por usuarios con rol 'admin' o 'super_admin'.
   */
  @Get('by-curso/:cursoId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  async findSuscripcionesByCurso(@Param('cursoId') cursoId: string) {
    return this.subscriptionsModuleService.findSuscripcionesByCurso(+cursoId);
  }
}