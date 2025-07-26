// src/subscriptions-module/subscriptions-module.service.ts

import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Importa las entidades
import { Suscripcion } from '../subscriptions-module/entities/subscriptions-module.entity';
import { Estudiante } from '../auth-module/entities/Estudiante'; // Desde AuthModule
import { Curso } from '../courses-module/entities/courses-module.entity';       // Desde CoursesModule

// Importa los DTOs
import { CreateSuscripcionDto } from './dto/create-subscriptions-module.dto';
import { UpdateSuscripcionDto } from './dto/update-subscriptions-module.dto';

@Injectable()
export class SubscriptionsModuleService {
  constructor(
    @InjectRepository(Suscripcion)
    private readonly suscripcionRepository: Repository<Suscripcion>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
  ) {}

  /**
   * Crea una nueva suscripción para un estudiante a un curso.
   * @param createSuscripcionDto Datos para crear la suscripción.
   * @returns La suscripción creada.
   * @throws NotFoundException Si el estudiante o el curso no existen.
   * @throws ConflictException Si el estudiante ya está suscrito a ese curso.
   */
  async createSuscripcion(createSuscripcionDto: CreateSuscripcionDto): Promise<Suscripcion> {
    const { estudiante_id, curso_id } = createSuscripcionDto;

    // 1. Verificar que el estudiante existe
    const estudiante = await this.estudianteRepository.findOne({ where: { id: estudiante_id } });
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${estudiante_id} no encontrado.`);
    }

    // 2. Verificar que el curso existe
    const curso = await this.cursoRepository.findOne({ where: { id: curso_id } });
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${curso_id} no encontrado.`);
    }

    // 3. Verificar si el estudiante ya está suscrito a este curso
    const existingSuscripcion = await this.suscripcionRepository.findOne({
      where: { estudiante_id: estudiante.id, curso_id: curso.id, estado: 'activa' }, // Asumimos que no puede haber 2 activas
    });
    if (existingSuscripcion) {
      throw new ConflictException(`El estudiante con ID ${estudiante_id} ya está suscrito activamente al curso con ID ${curso_id}.`);
    }

    // Crear la nueva suscripción
    const nuevaSuscripcion = this.suscripcionRepository.create({
      ...createSuscripcionDto,
      estudiante: estudiante, // Asigna el objeto estudiante completo
      curso: curso,         // Asigna el objeto curso completo
    });

    return this.suscripcionRepository.save(nuevaSuscripcion);
  }

  /**
   * Obtiene todas las suscripciones.
   * Opcionalmente filtra por ID de estudiante o ID de curso.
   * @param estudianteId (Opcional) ID del estudiante para filtrar.
   * @param cursoId (Opcional) ID del curso para filtrar.
   * @returns Una lista de suscripciones.
   */
  async findAllSuscripciones(estudianteId?: number, cursoId?: number): Promise<Suscripcion[]> {
    const queryBuilder = this.suscripcionRepository.createQueryBuilder('suscripcion')
      .leftJoinAndSelect('suscripcion.estudiante', 'estudiante') // Carga la relación con Estudiante
      .leftJoinAndSelect('suscripcion.curso', 'curso');         // Carga la relación con Curso

    if (estudianteId) {
      queryBuilder.andWhere('suscripcion.estudiante_id = :estudianteId', { estudianteId });
    }
    if (cursoId) {
      queryBuilder.andWhere('suscripcion.curso_id = :cursoId', { cursoId });
    }

    return queryBuilder.getMany();
  }

  /**
   * Obtiene una suscripción por su ID.
   * @param id ID de la suscripción.
   * @returns La suscripción encontrada.
   * @throws NotFoundException Si la suscripción no existe.
   */
  async findOneSuscripcion(id: number): Promise<Suscripcion> {
    const suscripcion = await this.suscripcionRepository.findOne({
      where: { id },
      relations: ['estudiante', 'curso'], // Carga las relaciones
    });
    if (!suscripcion) {
      throw new NotFoundException(`Suscripción con ID ${id} no encontrada.`);
    }
    return suscripcion;
  }

  /**
   * Actualiza una suscripción existente.
   * @param id ID de la suscripción a actualizar.
   * @param updateSuscripcionDto Datos para actualizar la suscripción.
   * @returns La suscripción actualizada.
   * @throws NotFoundException Si la suscripción no existe.
   * @throws BadRequestException Si se intenta cambiar estudiante_id o curso_id a uno inexistente o ya suscrito.
   */
  async updateSuscripcion(id: number, updateSuscripcionDto: UpdateSuscripcionDto): Promise<Suscripcion> {
    const { estudiante_id, curso_id } = updateSuscripcionDto;

    // Verificar si el estudiante_id o curso_id se están intentando cambiar
    // Esto es delicado, ya que cambiar la relación principal podría requerir una nueva suscripción
    // Generalmente, solo se actualiza el estado o la fecha_fin.
    // Si se permite cambiar, habría que validar:
    if (estudiante_id || curso_id) {
        // Cargar la suscripción original para comparar
        const originalSuscripcion = await this.suscripcionRepository.findOne({ where: { id } });
        if (!originalSuscripcion) {
            throw new NotFoundException(`Suscripción con ID ${id} no encontrada.`);
        }

        const newEstudianteId = estudiante_id || originalSuscripcion.estudiante_id;
        const newCursoId = curso_id || originalSuscripcion.curso_id;

        // Si se intenta cambiar el estudiante o el curso a valores diferentes
        if (newEstudianteId !== originalSuscripcion.estudiante_id || newCursoId !== originalSuscripcion.curso_id) {
            // Verificar si la nueva combinación ya existe
            const existingCombination = await this.suscripcionRepository.findOne({
                where: { estudiante_id: newEstudianteId, curso_id: newCursoId, estado: 'activa' },
            });
            if (existingCombination && existingCombination.id !== id) {
                throw new ConflictException(`Ya existe una suscripción activa para el estudiante ${newEstudianteId} al curso ${newCursoId}.`);
            }

            // Validar que el nuevo estudiante y/o curso existan si se proveen
            if (estudiante_id && !(await this.estudianteRepository.findOne({ where: { id: estudiante_id } }))) {
                throw new NotFoundException(`Nuevo Estudiante con ID ${estudiante_id} no encontrado.`);
            }
            if (curso_id && !(await this.cursoRepository.findOne({ where: { id: curso_id } }))) {
                throw new NotFoundException(`Nuevo Curso con ID ${curso_id} no encontrado.`);
            }

            // Si se cambian, se deben asignar los objetos de entidad para TypeORM
            if (estudiante_id) (updateSuscripcionDto as any).estudiante = await this.estudianteRepository.findOne({ where: { id: estudiante_id } });
            if (curso_id) (updateSuscripcionDto as any).curso = await this.cursoRepository.findOne({ where: { id: curso_id } });
        }
    }


    const suscripcion = await this.suscripcionRepository.preload({ id: id, ...updateSuscripcionDto });
    if (!suscripcion) {
      throw new NotFoundException(`Suscripción con ID ${id} no encontrada.`);
    }
    return this.suscripcionRepository.save(suscripcion);
  }

  /**
   * Elimina una suscripción por su ID.
   * @param id ID de la suscripción a eliminar.
   * @throws NotFoundException Si la suscripción no existe.
   */
  async removeSuscripcion(id: number): Promise<void> {
    const result = await this.suscripcionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Suscripción con ID ${id} no encontrada para eliminar.`);
    }
  }

  /**
   * Obtiene las suscripciones de un estudiante específico.
   * @param estudianteId ID del estudiante.
   * @returns Lista de suscripciones del estudiante.
   * @throws NotFoundException Si el estudiante no existe.
   */
  async findSuscripcionesByEstudiante(estudianteId: number): Promise<Suscripcion[]> {
    const estudiante = await this.estudianteRepository.findOne({ where: { id: estudianteId } });
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${estudianteId} no encontrado.`);
    }
    return this.suscripcionRepository.find({
      where: { estudiante_id: estudianteId },
      relations: ['curso'], // Carga el curso asociado
    });
  }

  /**
   * Obtiene las suscripciones de un curso específico.
   * @param cursoId ID del curso.
   * @returns Lista de suscripciones al curso.
   * @throws NotFoundException Si el curso no existe.
   */
  async findSuscripcionesByCurso(cursoId: number): Promise<Suscripcion[]> {
    const curso = await this.cursoRepository.findOne({ where: { id: cursoId } });
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${cursoId} no encontrado.`);
    }
    return this.suscripcionRepository.find({
      where: { curso_id: cursoId },
      relations: ['estudiante'], // Carga el estudiante asociado
    });
  }

  /**
   * Finaliza una suscripción (cambia su estado a 'finalizada' y establece fecha_fin si no existe).
   * @param id ID de la suscripción a finalizar.
   * @returns La suscripción actualizada.
   * @throws NotFoundException Si la suscripción no existe.
   * @throws BadRequestException Si la suscripción ya está finalizada o cancelada.
   */
  async finalizeSuscripcion(id: number): Promise<Suscripcion> {
    const suscripcion = await this.suscripcionRepository.findOne({ where: { id } });
    if (!suscripcion) {
      throw new NotFoundException(`Suscripción con ID ${id} no encontrada.`);
    }
    if (suscripcion.estado === 'finalizada' || suscripcion.estado === 'cancelada') {
      throw new BadRequestException(`La suscripción con ID ${id} ya está ${suscripcion.estado}.`);
    }

    suscripcion.estado = 'finalizada';
    if (!suscripcion.fecha_fin) {
      suscripcion.fecha_fin = new Date(); // Establece la fecha de fin a la fecha actual
    }
    return this.suscripcionRepository.save(suscripcion);
  }

  /**
   * Cancela una suscripción (cambia su estado a 'cancelada' y establece fecha_fin si no existe).
   * @param id ID de la suscripción a cancelar.
   * @returns La suscripción actualizada.
   * @throws NotFoundException Si la suscripción no existe.
   * @throws BadRequestException Si la suscripción ya está cancelada o finalizada.
   */
  async cancelSuscripcion(id: number): Promise<Suscripcion> {
    const suscripcion = await this.suscripcionRepository.findOne({ where: { id } });
    if (!suscripcion) {
      throw new NotFoundException(`Suscripción con ID ${id} no encontrada.`);
    }
    if (suscripcion.estado === 'cancelada' || suscripcion.estado === 'finalizada') {
      throw new BadRequestException(`La suscripción con ID ${id} ya está ${suscripcion.estado}.`);
    }

    suscripcion.estado = 'cancelada';
    if (!suscripcion.fecha_fin) {
      suscripcion.fecha_fin = new Date(); // Establece la fecha de fin a la fecha actual
    }
    return this.suscripcionRepository.save(suscripcion);
  }
}