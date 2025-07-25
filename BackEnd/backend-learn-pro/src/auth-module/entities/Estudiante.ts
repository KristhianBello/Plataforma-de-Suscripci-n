import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('estudiantes') // Mapea a la tabla 'estudiantes' en la base de datos
export class Estudiante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  apellido: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: 'text', nullable: false })
  contraseña: string; // Almacenará el hash de la contraseña

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  fecha_registro: Date;

  @Column({ type: 'boolean', default: true, nullable: false })
  estado: boolean;
}