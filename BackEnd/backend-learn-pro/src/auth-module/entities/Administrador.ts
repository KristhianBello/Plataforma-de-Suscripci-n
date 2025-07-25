import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer'; // <-- Importa Exclude


@Entity('administradores') // Mapea a la tabla 'administradores' en la base de datos
export class Administrador {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  nombre_usuario: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: 'text', nullable: false })
  @Exclude() // Excluye este campo de la serialización
  contrasena_hash: string;

  @Column({ type: 'varchar', length: 50, default: 'admin', nullable: false })
  rol: string; // Ej: 'super_admin', 'editor_contenido', 'soporte'
}