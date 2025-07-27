import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { Estudiante } from '../../auth-module/entities/Estudiante';     // Importa la entidad Estudiante
import { Leccion } from '../../courses-module/entities/leccion-module.entity';     // Importa la entidad Leccion
import { Curso } from '../../courses-module/entities/courses-module.entity';       // Importa la entidad Curso (para referencia rápida)

@Entity('progreso_lecciones') // Nombre de la tabla en la base de datos
@Unique(['estudiante_id', 'leccion_id']) // Un estudiante solo puede tener un registro de progreso por lección
export class ProgresoLeccion {
  @PrimaryGeneratedColumn()
  id: number;

  // Relación Many-to-One con Estudiante
  @ManyToOne(() => Estudiante)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @Column({ name: 'estudiante_id', type: 'int', nullable: false })
  estudiante_id: number;

  // Relación Many-to-One con Leccion
  @ManyToOne(() => Leccion)
  @JoinColumn({ name: 'leccion_id' })
  leccion: Leccion;

  @Column({ name: 'leccion_id', type: 'int', nullable: false })
  leccion_id: number;

  // Relación Many-to-One con Curso (opcional, para referencia rápida sin join adicional)
  // Aunque la lección ya tiene una relación con el curso, tenerla aquí puede simplificar ciertas consultas.
  @ManyToOne(() => Curso)
  @JoinColumn({ name: 'curso_id' })
  curso: Curso;

  @Column({ name: 'curso_id', type: 'int', nullable: false })
  curso_id: number; // Columna para la clave foránea del curso

  @Column({ type: 'boolean', default: false, nullable: false })
  completada: boolean; // Indica si la lección ha sido completada

  @Column({ type: 'int', default: 0, nullable: false })
  porcentaje_progreso: number; // Porcentaje de progreso dentro de la lección (0-100)

  @Column({ type: 'timestamptz', nullable: true })
  fecha_completado: Date; // Fecha y hora en que se marcó la lección como completada

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  fecha_inicio_progreso: Date | null ; // Fecha en que se inició el progreso en esta lección

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  fecha_ultima_actualizacion: Date | null ; // Fecha de la última actualización del progreso
}