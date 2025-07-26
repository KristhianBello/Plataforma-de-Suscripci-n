import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Estudiante } from '../../auth-module/entities/Estudiante'; // Importa la entidad Estudiante
import { Curso } from '../../courses-module/entities/courses-module.entity';     // Importa la entidad Curso

@Entity('suscripciones') // Nombre de la tabla en la base de datos
export class Suscripcion {
  @PrimaryGeneratedColumn()
  id: number;

  // Relación Many-to-One con Estudiante
  // Muchas suscripciones pertenecen a un estudiante
  @ManyToOne(() => Estudiante)
  @JoinColumn({ name: 'estudiante_id' }) // Columna de la clave foránea en la tabla 'suscripciones'
  estudiante: Estudiante;

  @Column({ name: 'estudiante_id', type: 'int', nullable: false })
  estudiante_id: number; // Columna para la clave foránea

  // Relación Many-to-One con Curso
  // Muchas suscripciones pertenecen a un curso
  @ManyToOne(() => Curso)
  @JoinColumn({ name: 'curso_id' }) // Columna de la clave foránea en la tabla 'suscripciones'
  curso: Curso;

  @Column({ name: 'curso_id', type: 'int', nullable: false })
  curso_id: number; // Columna para la clave foránea

  @Column({ type: 'varchar', length: 50, default: 'activa', nullable: false })
  // Puedes usar un enum o un check constraint: 'activa', 'inactiva', 'cancelada', 'finalizada'
  estado: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  fecha_inicio: Date; // Fecha en que se inició la suscripción

  @Column({ type: 'timestamptz', nullable: true })
  fecha_fin: Date; // Fecha en que termina o terminó la suscripción (si aplica)

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  fecha_actualizacion: Date;
}