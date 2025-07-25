import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Curso } from './courses-module.entity'// Importa la entidad Curso

@Entity('lecciones') // Nombre de la tabla en la base de datos
export class Leccion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  contenido_url: string; // URL al contenido de la lección (ej. video, documento)

  @Column({ type: 'int', nullable: false })
  orden: number; // Orden de la lección dentro del curso

  // Relación Many-to-One con Curso
  // Muchas lecciones pertenecen a un curso
  @ManyToOne(() => Curso, curso => curso.lecciones, { onDelete: 'CASCADE' }) // Si se elimina el curso, se eliminan las lecciones
  @JoinColumn({ name: 'curso_id' }) // Columna de la clave foránea en la tabla 'lecciones'
  curso: Curso;

  @Column({ name: 'curso_id', type: 'int', nullable: false })
  curso_id: number; // Columna para la clave foránea
}