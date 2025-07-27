// src/progress-module/progress-module.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Query, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProgressModuleService } from './progress-module.service';

// Importa los DTOs correctos (rutas corregidas para consistencia)
import { CreateProgresoLeccionDto } from './dto/create-progress-module.dto';
import { UpdateProgresoLeccionDto } from './dto/update-progress-module.dto';

// Importa los Guards y Decoradores de tu AuthModule
import { JwtAuthGuard } from '../auth-module/guards/jwt-auth.guard';
import { RolesGuard } from '../auth-module/guards/roles.guard';
import { Roles } from '../auth-module/decorators/roles.decorator';
import { User } from '../auth-module/decorators/user.decorator'; // Para obtener el usuario autenticado

// Define una interfaz para el payload del JWT que se adjunta al Request
interface JwtPayload {
  sub: number; // ID del usuario (estudiante_id, admin_id, etc.)
  email: string;
  rol: string; // 'estudiante', 'admin', 'super_admin', etc.
}

@Controller('progress') // Prefijo de ruta: /api/progress
@UseGuards(JwtAuthGuard) // Todas las rutas en este controlador requieren autenticación JWT por defecto
export class ProgressModuleController {
  constructor(private readonly progressModuleService: ProgressModuleService) {}

  /**
   * Crea o actualiza el progreso de una lección para un estudiante.
   * POST /progress
   * Un estudiante puede crear/actualizar su propio progreso. Un admin puede crear/actualizar el de cualquier estudiante.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrUpdateProgresoLeccion(
    @User() user: JwtPayload,
    @Body() createProgresoLeccionDto: CreateProgresoLeccionDto,
  ) {
    // Si el usuario es un estudiante, asegúrate de que solo pueda registrar progreso para sí mismo.
    if (user.rol === 'estudiante' && user.sub !== createProgresoLeccionDto.estudiante_id) {
      throw new ForbiddenException('Un estudiante solo puede registrar progreso para sí mismo.');
    }
    return this.progressModuleService.createOrUpdateProgresoLeccion(createProgresoLeccionDto);
  }

  /**
   * Obtiene un registro de progreso de lección por su ID.
   * GET /progress/:id
   * Accesible por 'admin', 'super_admin', o el 'estudiante' propietario del registro.
   */
  @Get(':id')
  async findOneProgresoLeccionById(@User() user: JwtPayload, @Param('id') id: string) {
    // USAR EL MÉTODO findOneProgresoLeccionById DEL SERVICIO
    const progreso = await this.progressModuleService.findOneProgresoLeccionById(+id);

    // Si el usuario no es admin/super_admin, debe ser el propietario del progreso
    if (user.rol === 'estudiante' && progreso.estudiante_id !== user.sub) {
      throw new ForbiddenException('No tienes permiso para ver este registro de progreso.');
    }
    return progreso;
  }


  /**
   * Actualiza un registro de progreso existente por su ID.
   * PATCH /progress/:id
   * Solo accesible por usuarios con rol 'admin' o 'super_admin', o el estudiante propietario.
   */
  @Patch(':id')
  async updateProgresoLeccion(
    @User() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateProgresoLeccionDto: UpdateProgresoLeccionDto,
  ) {
    // USAR EL MÉTODO findOneProgresoLeccionById DEL SERVICIO
    const progresoExistente = await this.progressModuleService.findOneProgresoLeccionById(+id); // Busca primero para verificar propiedad

    // Si el usuario no es admin/super_admin, debe ser el propietario del progreso
    if (user.rol === 'estudiante' && progresoExistente.estudiante_id !== user.sub) {
      throw new ForbiddenException('No tienes permiso para actualizar este registro de progreso.');
    }
    return this.progressModuleService.updateProgresoLeccion(+id, updateProgresoLeccionDto);
  }

  /**
   * Elimina un registro de progreso por su ID.
   * DELETE /progress/:id
   * Solo accesible por usuarios con rol 'admin' o 'super_admin'.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content para eliminación exitosa
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  async removeProgresoLeccion(@Param('id') id: string) {
    await this.progressModuleService.removeProgresoLeccion(+id);
  }

  // --- Endpoints para la visualización del progreso del estudiante ---

  /**
   * Obtiene el progreso total de un estudiante en todas sus lecciones.
   * GET /progress/student/:estudianteId/total
   * Protegido para que solo un admin/super_admin pueda ver las de otros,
   * o el propio estudiante pueda ver las suyas.
   */
  @Get('student/:estudianteId/total')
  async getProgresoTotalByEstudiante(@User() user: JwtPayload, @Param('estudianteId') estudianteId: string) {
    // Si el usuario no es admin/super_admin, debe ser el propio estudiante
    if (user.rol === 'estudiante' && user.sub !== +estudianteId) {
      throw new ForbiddenException('No tienes permiso para ver el progreso de otro estudiante.');
    }
    return this.progressModuleService.getProgresoTotalByEstudiante(+estudianteId);
  }

  /**
   * Obtiene el progreso de un estudiante en un curso específico.
   * GET /progress/student/:estudianteId/course/:cursoId
   * Protegido para que solo un admin/super_admin pueda ver las de otros,
   * o el propio estudiante pueda ver las suyas.
   */
  @Get('student/:estudianteId/course/:cursoId')
  async getProgresoCursoByEstudiante(
    @User() user: JwtPayload,
    @Param('estudianteId') estudianteId: string,
    @Param('cursoId') cursoId: string,
  ) {
    // Si el usuario no es admin/super_admin, debe ser el propio estudiante
    if (user.rol === 'estudiante' && user.sub !== +estudianteId) {
      throw new ForbiddenException('No tienes permiso para ver el progreso de otro estudiante.');
    }
    return this.progressModuleService.getProgresoCursoByEstudiante(+estudianteId, +cursoId);
  }

  /**
   * Marca una lección como completada para un estudiante.
   * PATCH /progress/student/:estudianteId/lesson/:leccionId/complete
   * Un estudiante solo puede marcar sus propias lecciones como completadas.
   * Un admin/super_admin puede marcar lecciones como completadas para cualquier estudiante.
   */
  @Patch('student/:estudianteId/lesson/:leccionId/complete')
  @HttpCode(HttpStatus.OK)
  async markLeccionAsCompleted(
    @User() user: JwtPayload,
    @Param('estudianteId') estudianteId: string,
    @Param('leccionId') leccionId: string,
  ) {
    // Si el usuario es un estudiante, asegúrate de que solo pueda marcar su propio progreso.
    if (user.rol === 'estudiante' && user.sub !== +estudianteId) {
      throw new ForbiddenException('Un estudiante solo puede marcar su propio progreso.');
    }
    return this.progressModuleService.markLeccionAsCompleted(+estudianteId, +leccionId);
  }
}