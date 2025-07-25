// src/courses-module/courses-module.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, BadRequestException} from '@nestjs/common';
import { CoursesModuleService } from './courses-module.service';

// Importa los DTOs correctos con sus rutas actualizadas
import { CreateCursoDto } from './dto/cursos/create-courses-module.dto';
import { UpdateCursoDto } from './dto/cursos/update-courses-module.dto';
import { CreateLeccionDto } from './dto/leccion/create-leccion-module.dto';
import { UpdateLeccionDto } from './dto/leccion/update-leccion-module.dto';

// Importa los Guards y Decoradores de tu AuthModule
import { JwtAuthGuard } from '../auth-module/guards/jwt-auth.guard';
import { RolesGuard } from '../auth-module/guards/roles.guard';
import { Roles } from '../auth-module/decorators/roles.decorator';

@Controller('courses') // Cambiamos el prefijo de la ruta a 'courses'
export class CoursesModuleController {
  constructor(private readonly coursesModuleService: CoursesModuleService) {}

  // --- Endpoints para Cursos ---

  /**
   * Crea un nuevo curso.
   * POST /courses
   * Requiere autenticación y rol de 'admin' o 'super_admin'.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async createCurso(@Body() createCursoDto: CreateCursoDto) {
    return this.coursesModuleService.createCurso(createCursoDto);
  }

  /**
   * Obtiene todos los cursos.
   * GET /courses
   * Accesible por cualquier usuario autenticado (estudiante o admin).
   */
  @Get()
  @UseGuards(JwtAuthGuard) // Solo requiere autenticación
  async findAllCursos() {
    return this.coursesModuleService.findAllCursos();
  }

  /**
   * Obtiene un curso por su ID.
   * GET /courses/:id
   * Accesible por cualquier usuario autenticado.
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOneCurso(@Param('id') id: string) {
    return this.coursesModuleService.findOneCurso(+id);
  }

  /**
   * Actualiza un curso existente.
   * PATCH /courses/:id
   * Requiere autenticación y rol de 'admin' o 'super_admin'.
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async updateCurso(@Param('id') id: string, @Body() updateCursoDto: UpdateCursoDto) {
    return this.coursesModuleService.updateCurso(+id, updateCursoDto);
  }

  /**
   * Elimina un curso por su ID.
   * DELETE /courses/:id
   * Requiere autenticación y rol de 'admin' o 'super_admin'.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content para eliminación exitosa
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async removeCurso(@Param('id') id: string) {
    await this.coursesModuleService.removeCurso(+id);
  }

  // --- Endpoints para Lecciones ---

  /**
   * Crea una nueva lección para un curso.
   * POST /courses/:cursoId/lecciones
   * Requiere autenticación y rol de 'admin' o 'super_admin'.
   */
  @Post(':cursoId/lecciones')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async createLeccion(@Param('cursoId') cursoId: string, @Body() createLeccionDto: CreateLeccionDto) {
    // Asegurarse de que el curso_id del DTO coincida con el parámetro de la ruta
    if (createLeccionDto.curso_id && createLeccionDto.curso_id !== +cursoId) {
        throw new BadRequestException('El ID del curso en el cuerpo no coincide con el ID de la ruta.');
    }
    createLeccionDto.curso_id = +cursoId; // Asegura que el ID del curso se toma de la URL
    return this.coursesModuleService.createLeccion(createLeccionDto);
  }

  /**
   * Obtiene todas las lecciones de un curso específico, o todas las lecciones si no se especifica cursoId.
   * GET /courses/:cursoId/lecciones (lecciones de un curso)
   * GET /lecciones (todas las lecciones - puede ser una ruta separada si es muy diferente)
   * Accesible por cualquier usuario autenticado.
   */
  @Get(':cursoId/lecciones')
  @UseGuards(JwtAuthGuard)
  async findAllLeccionesByCurso(@Param('cursoId') cursoId: string) {
    return this.coursesModuleService.findAllLecciones(+cursoId);
  }

  // Opcional: Si quieres un endpoint para todas las lecciones sin filtrar por curso
  @Get('lecciones') // Nota: Esta ruta debe ir ANTES de :id para evitar conflictos
  @UseGuards(JwtAuthGuard)
  async findAllLecciones() {
    return this.coursesModuleService.findAllLecciones();
  }


  /**
   * Obtiene una lección específica por su ID.
   * GET /lecciones/:id
   * Accesible por cualquier usuario autenticado.
   */
  @Get('lecciones/:id') // Ruta para obtener una lección por su propio ID
  @UseGuards(JwtAuthGuard)
  async findOneLeccion(@Param('id') id: string) {
    return this.coursesModuleService.findOneLeccion(+id);
  }

  /**
   * Actualiza una lección existente.
   * PATCH /lecciones/:id
   * Requiere autenticación y rol de 'admin' o 'super_admin'.
   */
  @Patch('lecciones/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async updateLeccion(@Param('id') id: string, @Body() updateLeccionDto: UpdateLeccionDto) {
    return this.coursesModuleService.updateLeccion(+id, updateLeccionDto);
  }

  /**
   * Elimina una lección por su ID.
   * DELETE /lecciones/:id
   * Requiere autenticación y rol de 'admin' o 'super_admin'.
   */
  @Delete('lecciones/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async removeLeccion(@Param('id') id: string) {
    await this.coursesModuleService.removeLeccion(+id);
  }
}