import { IsString, IsEmail, MinLength, MaxLength, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Opcional, para documentación Swagger

export class RegisterEstudianteDto {
  @ApiProperty({ description: 'Nombre del estudiante', example: 'Juan' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres.' })
  nombre: string;

  @ApiProperty({ description: 'Apellido del estudiante', example: 'Pérez' })
  @IsString({ message: 'El apellido debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El apellido no puede estar vacío.' })
  @MaxLength(100, { message: 'El apellido no puede tener más de 100 caracteres.' })
  apellido: string;

  @ApiProperty({ description: 'Correo electrónico del estudiante (único)', example: 'juan.perez@example.com' })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido.' })
  @IsNotEmpty({ message: 'El email no puede estar vacío.' })
  @MaxLength(255, { message: 'El email no puede tener más de 255 caracteres.' })
  email: string;

  @ApiProperty({ description: 'Contraseña del estudiante (mínimo 6 caracteres)', example: 'MiClaveSegura123' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  // Puedes añadir más validaciones como @Matches para requisitos de complejidad
  contraseña: string;

  // Los campos `fecha_registro` y `estado` se gestionarán en el backend (servicio/entidad) y no se esperan en el DTO de registro inicial.
}