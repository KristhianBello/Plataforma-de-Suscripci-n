// src/payments-module/payments-module.service.ts

import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Importa las entidades
import { Transaccion, EstadoTransaccion, TipoProductoPagado } from './entities/payments-module.entity';
import { Estudiante } from '../auth-module/entities/Estudiante';     // Desde AuthModule
import { Suscripcion } from '../subscriptions-module/entities/subscriptions-module.entity'; // Desde SubscriptionsModule
import { Curso } from '../courses-module/entities/courses-module.entity';       // Desde CoursesModule

// Importa los DTOs
import { CreateTransaccionDto } from './dto/create-payments-module.dto';
import { UpdateTransaccionDto } from './dto/update-payments-module.dto';

@Injectable()
export class PaymentsModuleService {
  constructor(
    @InjectRepository(Transaccion)
    private readonly transaccionRepository: Repository<Transaccion>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Suscripcion)
    private readonly suscripcionRepository: Repository<Suscripcion>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
  ) {}

  /**
   * Crea una nueva transacción en el sistema.
   * Esto generalmente se llama ANTES de interactuar con la pasarela de pago externa.
   * @param createTransaccionDto Datos para crear la transacción.
   * @returns La transacción creada.
   * @throws NotFoundException Si el estudiante, suscripción o curso asociado no existen.
   * @throws BadRequestException Si se intenta asociar tanto suscripcion_id como curso_id.
   */
  async createTransaccion(createTransaccionDto: CreateTransaccionDto): Promise<Transaccion> {
    const { estudiante_id, suscripcion_id, curso_id, tipo_producto } = createTransaccionDto;

    // 1. Verificar que el estudiante existe
    const estudiante = await this.estudianteRepository.findOne({ where: { id: estudiante_id } });
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${estudiante_id} no encontrado.`);
    }

    // 2. Validar que solo se asocie un tipo de producto (suscripción O curso, no ambos)
    if (suscripcion_id && curso_id) {
      throw new BadRequestException('Una transacción no puede estar asociada a una suscripción y un curso individual al mismo tiempo.');
    }

    let suscripcion: Suscripcion | null = null;
    let curso: Curso | null = null;

    // 3. Verificar y asociar la suscripción si aplica
    if (suscripcion_id) {
      suscripcion = await this.suscripcionRepository.findOne({ where: { id: suscripcion_id } });
      if (!suscripcion) {
        throw new NotFoundException(`Suscripción con ID ${suscripcion_id} no encontrada.`);
      }
      if (tipo_producto !== TipoProductoPagado.SUSCRIPCION) {
        throw new BadRequestException('El tipo de producto debe ser SUSCRIPCION si se proporciona un suscripcion_id.');
      }
    }

    // 4. Verificar y asociar el curso si aplica
    if (curso_id) {
      curso = await this.cursoRepository.findOne({ where: { id: curso_id } });
      if (!curso) {
        throw new NotFoundException(`Curso con ID ${curso_id} no encontrado.`);
      }
      if (tipo_producto !== TipoProductoPagado.CURSO_INDIVIDUAL) {
        throw new BadRequestException('El tipo de producto debe ser CURSO_INDIVIDUAL si se proporciona un curso_id.');
      }
    }

    // Si no se proporcionó ni suscripcion_id ni curso_id, pero el tipo de producto indica uno, es un error
    if (!suscripcion_id && !curso_id && (tipo_producto === TipoProductoPagado.SUSCRIPCION || tipo_producto === TipoProductoPagado.CURSO_INDIVIDUAL)) {
        throw new BadRequestException('Debe proporcionar un suscripcion_id o curso_id para el tipo de producto especificado.');
    }


    const nuevaTransaccion = this.transaccionRepository.create({
      ...createTransaccionDto,
      estudiante: estudiante,
      suscripcion: suscripcion,
      curso: curso,
      estado: createTransaccionDto.estado || EstadoTransaccion.PENDIENTE, // Asegura el estado inicial
    });

    return this.transaccionRepository.save(nuevaTransaccion);
  }

  /**
   * Obtiene todas las transacciones.
   * @param estudianteId (Opcional) Filtra por ID de estudiante.
   * @param estado (Opcional) Filtra por estado de transacción.
   * @returns Lista de transacciones.
   */
  async findAllTransacciones(estudianteId?: number, estado?: EstadoTransaccion): Promise<Transaccion[]> {
    const queryBuilder = this.transaccionRepository.createQueryBuilder('transaccion')
      .leftJoinAndSelect('transaccion.estudiante', 'estudiante')
      .leftJoinAndSelect('transaccion.suscripcion', 'suscripcion')
      .leftJoinAndSelect('transaccion.curso', 'curso');

    if (estudianteId) {
      queryBuilder.andWhere('transaccion.estudiante_id = :estudianteId', { estudianteId });
    }
    if (estado) {
      queryBuilder.andWhere('transaccion.estado = :estado', { estado });
    }

    return queryBuilder.getMany();
  }

  /**
   * Obtiene una transacción por su ID.
   * @param id ID de la transacción.
   * @returns La transacción encontrada.
   * @throws NotFoundException Si la transacción no existe.
   */
  async findOneTransaccion(id: number): Promise<Transaccion> {
    const transaccion = await this.transaccionRepository.findOne({
      where: { id },
      relations: ['estudiante', 'suscripcion', 'curso'],
    });
    if (!transaccion) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada.`);
    }
    return transaccion;
  }

  /**
   * Actualiza una transacción existente.
   * Esto es comúnmente usado por webhooks de pasarelas de pago para actualizar el estado.
   * @param id ID de la transacción a actualizar.
   * @param updateTransaccionDto Datos para actualizar la transacción.
   * @returns La transacción actualizada.
   * @throws NotFoundException Si la transacción no existe.
   */
  async updateTransaccion(id: number, updateTransaccionDto: UpdateTransaccionDto): Promise<Transaccion> {
    const transaccion = await this.transaccionRepository.preload({ id: id, ...updateTransaccionDto });
    if (!transaccion) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada.`);
    }
    return this.transaccionRepository.save(transaccion);
  }

  /**
   * Elimina una transacción por su ID.
   * @param id ID de la transacción a eliminar.
   * @throws NotFoundException Si la transacción no existe.
   */
  async removeTransaccion(id: number): Promise<void> {
    const result = await this.transaccionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada para eliminar.`);
    }
  }

  /**
   * Maneja la lógica posterior a un pago exitoso.
   * Actualiza el estado de la transacción a COMPLETADA y puede activar la suscripción/acceso al curso.
   * @param transaccionId ID de la transacción a marcar como exitosa.
   * @param pasarelaPagoId ID de referencia de la pasarela de pago.
   * @param metodoPago Método de pago utilizado.
   * @returns La transacción actualizada.
   * @throws NotFoundException Si la transacción no existe.
   * @throws BadRequestException Si la transacción ya está completada o en un estado final.
   */
  async handlePaymentSuccess(transaccionId: number, pasarelaPagoId: string, metodoPago: string): Promise<Transaccion> {
    const transaccion = await this.findOneTransaccion(transaccionId);

    if (transaccion.estado === EstadoTransaccion.COMPLETADA || transaccion.estado === EstadoTransaccion.REEMBOLSADA) {
      throw new BadRequestException(`La transacción ${transaccionId} ya está en estado ${transaccion.estado}.`);
    }

    transaccion.estado = EstadoTransaccion.COMPLETADA;
    transaccion.pasarela_pago_id = pasarelaPagoId;
    transaccion.metodo_pago = metodoPago;

    const updatedTransaccion = await this.transaccionRepository.save(transaccion);

    // Lógica adicional: Activar suscripción o dar acceso al curso
    if (updatedTransaccion.suscripcion) {
      // Aquí deberías llamar a un método en SubscriptionsModuleService
      // para cambiar el estado de la suscripción a 'activa' si aún no lo está.
      // Ejemplo: await this.subscriptionsModuleService.activateSuscripcion(updatedTransaccion.suscripcion.id);
      console.log(`Suscripción ${updatedTransaccion.suscripcion.id} activada (lógica pendiente).`);
    } else if (updatedTransaccion.curso) {
      // Aquí podrías registrar el acceso del estudiante al curso individual.
      // Esto podría implicar crear una entrada en una tabla de "acceso_curso"
      // o similar si no es por suscripción.
      console.log(`Acceso al curso ${updatedTransaccion.curso.id} otorgado al estudiante ${updatedTransaccion.estudiante.id} (lógica pendiente).`);
    }

    return updatedTransaccion;
  }

  /**
   * Maneja la lógica posterior a un pago fallido.
   * Actualiza el estado de la transacción a FALLIDA.
   * @param transaccionId ID de la transacción a marcar como fallida.
   * @param pasarelaPagoId (Opcional) ID de referencia de la pasarela de pago.
   * @returns La transacción actualizada.
   * @throws NotFoundException Si la transacción no existe.
   * @throws BadRequestException Si la transacción ya está en un estado final.
   */
  async handlePaymentFailure(transaccionId: number, pasarelaPagoId?: string): Promise<Transaccion> {
    const transaccion = await this.findOneTransaccion(transaccionId);

    if (transaccion.estado === EstadoTransaccion.COMPLETADA || transaccion.estado === EstadoTransaccion.REEMBOLSADA) {
      throw new BadRequestException(`La transacción ${transaccionId} ya está en estado ${transaccion.estado}. No se puede marcar como fallida.`);
    }

    transaccion.estado = EstadoTransaccion.FALLIDA;
    if (pasarelaPagoId) {
      transaccion.pasarela_pago_id = pasarelaPagoId;
    }
    return this.transaccionRepository.save(transaccion);
  }

  /**
   * Maneja la lógica de un reembolso.
   * Actualiza el estado de la transacción a REEMBOLSADA.
   * @param transaccionId ID de la transacción a reembolsar.
   * @returns La transacción actualizada.
   * @throws NotFoundException Si la transacción no existe.
   * @throws BadRequestException Si la transacción no está en un estado que permita reembolso (ej. no completada).
   */
  async handleRefund(transaccionId: number): Promise<Transaccion> {
    const transaccion = await this.findOneTransaccion(transaccionId);

    if (transaccion.estado !== EstadoTransaccion.COMPLETADA) {
      throw new BadRequestException(`La transacción ${transaccionId} no está en estado COMPLETADA y no puede ser reembolsada.`);
    }

    transaccion.estado = EstadoTransaccion.REEMBOLSADA;
    const updatedTransaccion = await this.transaccionRepository.save(transaccion);

    // Lógica adicional: Desactivar suscripción o revocar acceso al curso si aplica
    if (updatedTransaccion.suscripcion) {
      // Aquí deberías llamar a un método en SubscriptionsModuleService
      // para cambiar el estado de la suscripción a 'cancelada' o 'inactiva'.
      // Ejemplo: await this.subscriptionsModuleService.cancelSuscripcion(updatedTransaccion.suscripcion.id);
      console.log(`Suscripción ${updatedTransaccion.suscripcion.id} cancelada por reembolso (lógica pendiente).`);
    } else if (updatedTransaccion.curso) {
      // Aquí podrías revocar el acceso del estudiante al curso individual si aplica.
      console.log(`Acceso al curso ${updatedTransaccion.curso.id} revocado al estudiante ${updatedTransaccion.estudiante.id} por reembolso (lógica pendiente).`);
    }

    return updatedTransaccion;
  }
}
