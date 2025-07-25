// src/courses-module/courses-module.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Importa las entidades
import { Curso } from './entities/courses-module.entity';
import { Leccion } from './entities/leccion-module.entity';

// Importa los DTOs
import { CreateCursoDto } from './dto/cursos/create-courses-module.dto';
import { UpdateCursoDto } from './dto/cursos/update-courses-module.dto';
import { CreateLeccionDto } from './dto/leccion/create-leccion-module.dto';
import { UpdateLeccionDto } from './dto/leccion/update-leccion-module.dto';

@Injectable()
export class CoursesModuleService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    @InjectRepository(Leccion)
    private readonly leccionRepository: Repository<Leccion>,
  ) {}

  // --- Métodos para Cursos ---

  /**
   * Crea un nuevo curso.
   * @param createCursoDto Datos para crear el curso.
   * @returns El curso creado.
   */
  async createCurso(createCursoDto: CreateCursoDto): Promise<Curso> {
    const nuevoCurso = this.cursoRepository.create(createCursoDto);
    return this.cursoRepository.save(nuevoCurso);
  }

  /**
   * Obtiene todos los cursos.
   * @returns Una lista de cursos.
   */
  async findAllCursos(): Promise<Curso[]> {
    return this.cursoRepository.find({ relations: ['lecciones'] }); // Carga también las lecciones asociadas
  }

  /**
   * Obtiene un curso por su ID.
   * @param id ID del curso.
   * @returns El curso encontrado.
   * @throws NotFoundException Si el curso no existe.
   */
  async findOneCurso(id: number): Promise<Curso> {
    const curso = await this.cursoRepository.findOne({ where: { id }, relations: ['lecciones'] });
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado.`);
    }
    return curso;
  }

  /**
   * Actualiza un curso existente.
   * @param id ID del curso a actualizar.
   * @param updateCursoDto Datos para actualizar el curso.
   * @returns El curso actualizado.
   * @throws NotFoundException Si el curso no existe.
   */
  async updateCurso(id: number, updateCursoDto: UpdateCursoDto): Promise<Curso> {
    const curso = await this.cursoRepository.preload({ id: id, ...updateCursoDto });
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado.`);
    }
    return this.cursoRepository.save(curso);
  }

  /**
   * Elimina un curso por su ID.
   * @param id ID del curso a eliminar.
   * @throws NotFoundException Si el curso no existe.
   */
  async removeCurso(id: number): Promise<void> {
    const result = await this.cursoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado para eliminar.`);
    }
  }

  // --- Métodos para Lecciones ---

  /**
   * Crea una nueva lección para un curso específico.
   * @param createLeccionDto Datos para crear la lección.
   * @returns La lección creada.
   * @throws NotFoundException Si el curso asociado no existe.
   */
  async createLeccion(createLeccionDto: CreateLeccionDto): Promise<Leccion> {
    const curso = await this.cursoRepository.findOne({ where: { id: createLeccionDto.curso_id } });
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${createLeccionDto.curso_id} no encontrado.`);
    }

    const nuevaLeccion = this.leccionRepository.create({
      ...createLeccionDto,
      curso: curso, // Asigna el objeto curso completo
    });
    return this.leccionRepository.save(nuevaLeccion);
  }

  /**
   * Obtiene todas las lecciones (opcionalmente filtradas por curso).
   * @param cursoId (Opcional) ID del curso para filtrar lecciones.
   * @returns Una lista de lecciones.
   */
  async findAllLecciones(cursoId?: number): Promise<Leccion[]> {
    const queryBuilder = this.leccionRepository.createQueryBuilder('leccion')
      .leftJoinAndSelect('leccion.curso', 'curso'); // Carga también la relación con el curso

    if (cursoId) {
      queryBuilder.where('leccion.curso_id = :cursoId', { cursoId });
    }

    return queryBuilder.orderBy('leccion.orden', 'ASC').getMany(); // Ordena por orden de la lección
  }

  /**
   * Obtiene una lección específica por su ID.
   * @param id ID de la lección.
   * @returns La lección encontrada.
   * @throws NotFoundException Si la lección no existe.
   */
  async findOneLeccion(id: number): Promise<Leccion> {
    const leccion = await this.leccionRepository.findOne({ where: { id }, relations: ['curso'] });
    if (!leccion) {
      throw new NotFoundException(`Lección con ID ${id} no encontrada.`);
    }
    return leccion;
  }

  /**
   * Actualiza una lección existente.
   * @param id ID de la lección a actualizar.
   * @param updateLeccionDto Datos para actualizar la lección.
   * @returns La lección actualizada.
   * @throws NotFoundException Si la lección no existe.
   * @throws BadRequestException Si se intenta cambiar el curso_id a un curso inexistente.
   */
  async updateLeccion(id: number, updateLeccionDto: UpdateLeccionDto): Promise<Leccion> {
    // Si se intenta cambiar el curso_id, validar que el nuevo curso exista
    if (updateLeccionDto.curso_id) {
      const nuevoCurso = await this.cursoRepository.findOne({ where: { id: updateLeccionDto.curso_id } });
      if (!nuevoCurso) {
        throw new BadRequestException(`El Curso con ID ${updateLeccionDto.curso_id} no existe.`);
      }
      // Actualiza la referencia al objeto curso en el DTO para el preload
      (updateLeccionDto as any).curso = nuevoCurso;
    }

    // preload se encarga de cargar la entidad existente y aplicar los cambios del DTO
    const leccion = await this.leccionRepository.preload({ id: id, ...updateLeccionDto });

    if (!leccion) {
      throw new NotFoundException(`Lección con ID ${id} no encontrada.`);
    }
    return this.leccionRepository.save(leccion);
  }

  /**
   * Elimina una lección por su ID.
   * @param id ID de la lección a eliminar.
   * @throws NotFoundException Si la lección no existe.
   */
  async removeLeccion(id: number): Promise<void> {
    const result = await this.leccionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Lección con ID ${id} no encontrada para eliminar.`);
    }
  }
}