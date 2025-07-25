import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Leccion } from './leccion-module.entity'

@Entity('cursos') // Nombre de la tabla en la base de datos
export class Curso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00, nullable: false })
  precio: number; // Precio del curso

  @Column({ type: 'varchar', length: 50, nullable: true })
  idioma: string; // Ej: 'Español', 'Inglés'

  @Column({ type: 'varchar', length: 50, nullable: true })
  nivel: string; // Ej: 'Principiante', 'Intermedio', 'Avanzado'

  @Column({ type: 'varchar', length: 255, nullable: true })
  url_imagen_portada: string; // URL de la imagen de portada del curso

  @Column({ type: 'int', default: 0, nullable: false })
  duracion_minutos: number; // Duración total estimada del curso en minutos

  @Column({ type: 'varchar', length: 20, default: 'borrador', nullable: false })
  // Puedes usar un enum o un check constraint en la DB: 'borrador', 'publicado', 'archivado'
  estado: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  fecha_actualizacion: Date;

  // Relación One-to-Many con Lecciones
  // Un curso tiene muchas lecciones
  @OneToMany(() => Leccion, leccion => leccion.curso, { cascade: true })
  lecciones: Leccion[];
}