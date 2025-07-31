import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Estudiante } from '../../users-module/entities/estudiante.entity';

export enum TipoNotificacion {
  RENOVACION_SUSCRIPCION = 'renovacion_suscripcion',
  PAGO_EXITOSO = 'pago_exitoso',
  PAGO_FALLIDO = 'pago_fallido',
  CURSO_COMPLETADO = 'curso_completado',
  NUEVA_LECCION = 'nueva_leccion',
  RECORDATORIO_PROGRESO = 'recordatorio_progreso',
  BIENVENIDA = 'bienvenida',
  CANCELACION_SUSCRIPCION = 'cancelacion_suscripcion'
}

export enum EstadoNotificacion {
  PENDIENTE = 'pendiente',
  ENVIADA = 'enviada',
  LEIDA = 'leida',
  FALLIDA = 'fallida'
}

@Entity('notificaciones')
export class Notificacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TipoNotificacion })
  tipo: TipoNotificacion;

  @Column()
  titulo: string;

  @Column({ type: 'text' })
  mensaje: string;

  @Column({ type: 'enum', enum: EstadoNotificacion, default: EstadoNotificacion.PENDIENTE })
  estado: EstadoNotificacion;

  @Column({ type: 'boolean', default: false })
  leida: boolean;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  fecha_programada: Date;

  @Column({ nullable: true })
  fecha_enviada: Date;

  @Column({ nullable: true })
  fecha_leida: Date;

  // Relación con Estudiante
  @Column()
  estudiante_id: number;

  @ManyToOne(() => Estudiante, { eager: true })
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;
}
