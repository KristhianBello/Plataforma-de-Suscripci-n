import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Importa las entidades (rutas corregidas para consistencia)
import { ProgresoLeccion } from './entities/progress-module.entity'; // Corregido: usa progreso-leccion.entity
import { Estudiante } from '../auth-module/entities/Estudiante';     // Corregido: usa estudiante.entity (minúscula)
import { Leccion } from '../courses-module/entities/leccion-module.entity';     // Corregido: usa leccion.entity
import { Curso } from '../courses-module/entities/courses-module.entity';       // Corregido: usa curso.entity

// Importa los DTOs (rutas corregidas para consistencia)
import { CreateProgresoLeccionDto } from './dto/create-progress-module.dto'; // Corregido: usa create-progreso-leccion.dto
import { UpdateProgresoLeccionDto } from './dto/update-progress-module.dto'; // Corregido: usa update-progreso-leccion.dto

@Injectable()
export class ProgressModuleService {
  constructor(
    @InjectRepository(ProgresoLeccion)
    private readonly progresoLeccionRepository: Repository<ProgresoLeccion>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Leccion)
    private readonly leccionRepository: Repository<Leccion>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
  ) {}

  /**
   * Crea o actualiza el progreso de una lección para un estudiante.
   * Si ya existe un progreso para la combinación estudiante-lección, lo actualiza.
   * Si no existe, crea uno nuevo.
   * @param createProgresoLeccionDto Datos para crear/actualizar el progreso.
   * @returns El registro de progreso creado o actualizado.
   * @throws NotFoundException Si el estudiante, la lección o el curso no existen.
   * @throws BadRequestException Si la lección no pertenece al curso especificado.
   */
  async createOrUpdateProgresoLeccion(createProgresoLeccionDto: CreateProgresoLeccionDto): Promise<ProgresoLeccion> {
    const { estudiante_id, leccion_id, curso_id, completada, porcentaje_progreso } = createProgresoLeccionDto;

    // 1. Verificar que el estudiante existe
    const estudiante = await this.estudianteRepository.findOne({ where: { id: estudiante_id } });
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${estudiante_id} no encontrado.`);
    }

    // 2. Verificar que la lección existe
    const leccion = await this.leccionRepository.findOne({ where: { id: leccion_id } });
    if (!leccion) {
      throw new NotFoundException(`Lección con ID ${leccion_id} no encontrada.`);
    }

    // 3. Verificar que el curso existe
    const curso = await this.cursoRepository.findOne({ where: { id: curso_id } });
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${curso_id} no encontrado.`);
    }

    // 4. Verificar que la lección realmente pertenece al curso especificado
    if (leccion.curso_id !== curso_id) {
      throw new BadRequestException(`La lección con ID ${leccion_id} no pertenece al curso con ID ${curso_id}.`);
    }

    // Intentar encontrar un progreso existente para esta combinación estudiante-lección
    let progreso = await this.progresoLeccionRepository.findOne({
      where: { estudiante_id, leccion_id },
    });

    if (progreso) {
      // Si existe, actualizar sus propiedades
      progreso.completada = completada !== undefined ? completada : progreso.completada;
      progreso.porcentaje_progreso = porcentaje_progreso !== undefined ? porcentaje_progreso : progreso.porcentaje_progreso;
      if (progreso.completada && !progreso.fecha_completado) {
        progreso.fecha_completado = new Date();
      } else if (!progreso.completada) { // Si se desmarca como completada, limpiar fecha
        progreso.fecha_completado = null;
      }
    } else {
      // Si no existe, crear un nuevo registro de progreso
      progreso = this.progresoLeccionRepository.create({
        estudiante,
        leccion,
        curso, // Asigna el objeto curso completo
        completada: completada || false,
        porcentaje_progreso: porcentaje_progreso || 0,
        fecha_completado: completada ? new Date() : null,
      });
    }

    return this.progresoLeccionRepository.save(progreso);
  }

  /**
   * Obtiene el progreso de una lección específica para un estudiante.
   * Este método busca por estudianteId y leccionId (clave compuesta).
   * @param estudianteId ID del estudiante.
   * @param leccionId ID de la lección.
   * @returns El registro de progreso.
   * @throws NotFoundException Si el progreso no existe.
   */
  async findOneProgresoLeccion(estudianteId: number, leccionId: number): Promise<ProgresoLeccion> {
    const progreso = await this.progresoLeccionRepository.findOne({
      where: { estudiante_id: estudianteId, leccion_id: leccionId },
      relations: ['estudiante', 'leccion', 'curso'],
    });
    if (!progreso) {
      throw new NotFoundException(`Progreso para estudiante ${estudianteId} en lección ${leccionId} no encontrado.`);
    }
    return progreso;
  }

  // MÉTODO AÑADIDO: Busca un registro de progreso por su ID primario
  /**
   * Obtiene un registro de progreso por su ID primario.
   * @param id ID del registro de progreso.
   * @returns El registro de progreso.
   * @throws NotFoundException Si el registro de progreso no existe.
   */
  async findOneProgresoLeccionById(id: number): Promise<ProgresoLeccion> {
    const progreso = await this.progresoLeccionRepository.findOne({
      where: { id },
      relations: ['estudiante', 'leccion', 'curso'], // Carga las relaciones para que el controlador pueda acceder a ellas
    });
    if (!progreso) {
      throw new NotFoundException(`Registro de progreso con ID ${id} no encontrado.`);
    }
    return progreso;
  }

  /**
   * Actualiza el progreso de una lección existente.
   * @param id ID del registro de progreso.
   * @param updateProgresoLeccionDto Datos para actualizar el progreso.
   * @returns El registro de progreso actualizado.
   * @throws NotFoundException Si el registro de progreso no existe.
   */
  async updateProgresoLeccion(id: number, updateProgresoLeccionDto: UpdateProgresoLeccionDto): Promise<ProgresoLeccion> {
    const progreso = await this.progresoLeccionRepository.findOne({ where: { id } });
    if (!progreso) {
      throw new NotFoundException(`Registro de progreso con ID ${id} no encontrado.`);
    }

    // Aplicar actualizaciones
    Object.assign(progreso, updateProgresoLeccionDto);

    // Lógica para fecha_completado basada en 'completada'
    if (progreso.completada && !progreso.fecha_completado) {
      progreso.fecha_completado = new Date();
    } else if (!progreso.completada && progreso.fecha_completado) { // Si se desmarca como completada, limpiar fecha
      progreso.fecha_completado = null;
    }

    return this.progresoLeccionRepository.save(progreso);
  }

  /**
   * Elimina un registro de progreso por su ID.
   * @param id ID del registro de progreso a eliminar.
   * @throws NotFoundException Si el registro de progreso no existe.
   */
  async removeProgresoLeccion(id: number): Promise<void> {
    const result = await this.progresoLeccionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Registro de progreso con ID ${id} no encontrado para eliminar.`);
    }
  }

  /**
   * Obtiene todo el progreso de un estudiante en todos los cursos/lecciones.
   * @param estudianteId ID del estudiante.
   * @returns Lista de registros de ProgresoLeccion.
   * @throws NotFoundException Si el estudiante no existe.
   */
  async getProgresoTotalByEstudiante(estudianteId: number): Promise<ProgresoLeccion[]> {
    const estudiante = await this.estudianteRepository.findOne({ where: { id: estudianteId } });
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${estudianteId} no encontrado.`);
    }
    return this.progresoLeccionRepository.find({
      where: { estudiante_id: estudianteId },
      relations: ['leccion', 'curso'], // Carga las lecciones y cursos asociados
      order: { curso_id: 'ASC', leccion: { orden: 'ASC' } }, // Ordena por curso y luego por orden de lección
    });
  }

  /**
   * Calcula el progreso general de un estudiante en un curso específico.
   * @param estudianteId ID del estudiante.
   * @param cursoId ID del curso.
   * @returns Un objeto con el progreso total del curso (ej. lecciones completadas / total de lecciones).
   * @throws NotFoundException Si el estudiante o el curso no existen.
   */
  async getProgresoCursoByEstudiante(estudianteId: number, cursoId: number): Promise<{
    totalLecciones: number;
    leccionesCompletadas: number;
    porcentajeCurso: number;
  }> {
    const estudiante = await this.estudianteRepository.findOne({ where: { id: estudianteId } });
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${estudianteId} no encontrado.`);
    }
    const curso = await this.cursoRepository.findOne({ where: { id: cursoId }, relations: ['lecciones'] });
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${cursoId} no encontrado.`);
    }

    const totalLecciones = curso.lecciones.length;
    if (totalLecciones === 0) {
      return { totalLecciones: 0, leccionesCompletadas: 0, porcentajeCurso: 0 };
    }

    const progresoLecciones = await this.progresoLeccionRepository.find({
      where: { estudiante_id: estudianteId, curso_id: cursoId, completada: true },
    });

    const leccionesCompletadas = progresoLecciones.length;
    const porcentajeCurso = (leccionesCompletadas / totalLecciones) * 100;

    return {
      totalLecciones,
      leccionesCompletadas,
      porcentajeCurso: parseFloat(porcentajeCurso.toFixed(2)), // Redondear a 2 decimales
    };
  }

  /**
   * Marca una lección como completada para un estudiante.
   * @param estudianteId ID del estudiante.
   * @param leccionId ID de la lección.
   * @returns El registro de progreso actualizado.
   * @throws NotFoundException Si el estudiante o la lección no existen.
   */
  async markLeccionAsCompleted(estudianteId: number, leccionId: number): Promise<ProgresoLeccion> {
    const estudiante = await this.estudianteRepository.findOne({ where: { id: estudianteId } });
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${estudianteId} no encontrado.`);
    }
    const leccion = await this.leccionRepository.findOne({ where: { id: leccionId } });
    if (!leccion) {
      throw new NotFoundException(`Lección con ID ${leccionId} no encontrada.`);
    }

    let progreso = await this.progresoLeccionRepository.findOne({
      where: { estudiante_id: estudianteId, leccion_id: leccionId },
    });

    if (!progreso) {
      // Si no existe, crear un nuevo registro
      progreso = this.progresoLeccionRepository.create({
        estudiante,
        leccion,
        curso: leccion.curso, // Asigna el curso desde la lección
        completada: true,
        porcentaje_progreso: 100,
        fecha_completado: new Date(),
      });
    } else {
      // Si existe, actualizarlo
      progreso.completada = true;
      progreso.porcentaje_progreso = 100;
      if (!progreso.fecha_completado) {
        progreso.fecha_completado = new Date();
      }
    }
    return this.progresoLeccionRepository.save(progreso);
  }
}