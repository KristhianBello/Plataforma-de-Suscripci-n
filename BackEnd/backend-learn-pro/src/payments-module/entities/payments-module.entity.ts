import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Estudiante } from '../../auth-module/entities/Estudiante';     // Importa la entidad Estudiante
import { Suscripcion } from '../../subscriptions-module/entities/subscriptions-module.entity'; // Importa la entidad Suscripcion (si el pago es por una suscripción)
import { Curso } from '../../courses-module/entities/courses-module.entity';       // Importa la entidad Curso (si el pago es por un curso individual)

export enum EstadoTransaccion {
  PENDIENTE = 'PENDIENTE',
  COMPLETADA = 'COMPLETADA',
  FALLIDA = 'FALLIDA',
  REEMBOLSADA = 'REEMBOLSADA',
  CANCELADA = 'CANCELADA',
}

export enum TipoProductoPagado {
  SUSCRIPCION = 'SUSCRIPCION',
  CURSO_INDIVIDUAL = 'CURSO_INDIVIDUAL',
  // Otros tipos de productos que puedas tener (ej. e-books, consultorías)
}

@Entity('transacciones') // Nombre de la tabla en la base de datos
export class Transaccion {
  @PrimaryGeneratedColumn()
  id: number;

  // Relación Many-to-One con Estudiante (quién realizó el pago)
  @ManyToOne(() => Estudiante, { nullable: false, onDelete: 'RESTRICT' }) // No permite eliminar estudiante si tiene transacciones
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @Column({ name: 'estudiante_id', type: 'int', nullable: false })
  estudiante_id: number;

  // Relación opcional con Suscripción (si el pago es para una suscripción)
  @ManyToOne(() => Suscripcion, { nullable: true, onDelete: 'SET NULL' }) // Si la suscripción se elimina, la transacción persiste pero sin relación
  @JoinColumn({ name: 'suscripcion_id' })
  suscripcion: Suscripcion | null;

  @Column({ name: 'suscripcion_id', type: 'int', nullable: true })
  suscripcion_id: number | null;

  // Relación opcional con Curso (si el pago es por un curso individual)
  @ManyToOne(() => Curso, { nullable: true, onDelete: 'SET NULL' }) // Si el curso se elimina, la transacción persiste pero sin relación
  @JoinColumn({ name: 'curso_id' })
  curso: Curso | null;

  @Column({ name: 'curso_id', type: 'int', nullable: true })
  curso_id: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  monto: number; // Monto de la transacción

  @Column({ type: 'varchar', length: 3, nullable: false })
  moneda: string; // Ej: USD, EUR, COP

  @Column({ type: 'enum', enum: EstadoTransaccion, default: EstadoTransaccion.PENDIENTE, nullable: false })
  estado: EstadoTransaccion; // Estado actual de la transacción

  @Column({ type: 'enum', enum: TipoProductoPagado, nullable: false })
  tipo_producto: TipoProductoPagado; // Qué tipo de producto se pagó

  @Column({ type: 'varchar', length: 255, nullable: true })
  pasarela_pago_id: string | null; // ID de referencia de la transacción en la pasarela de pago (ej. Stripe charge ID)

  @Column({ type: 'varchar', length: 255, nullable: true })
  metodo_pago: string | null; // Ej: 'tarjeta de crédito', 'paypal', 'débito'

  @Column({ type: 'text', nullable: true })
  descripcion: string | null; // Descripción de la transacción (ej. "Pago de suscripción Premium")

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  fecha_ultima_actualizacion: Date;
}