import { IsString, IsEmail, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEstudianteProfileDto {
  @ApiProperty({ description: 'Nuevo nombre del estudiante', example: 'Juan Carlos', required: false })
  @IsOptional() // Hacemos los campos opcionales para que no sea necesario enviar todos
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres.' })
  nombre?: string;

  @ApiProperty({ description: 'Nuevo apellido del estudiante', example: 'Gómez', required: false })
  @IsOptional()
  @IsString({ message: 'El apellido debe ser una cadena de texto.' })
  @MaxLength(100, { message: 'El apellido no puede tener más de 100 caracteres.' })
  apellido?: string;

  @ApiProperty({ description: 'Nuevo correo electrónico del estudiante (debe ser único)', example: 'juan.gomez@example.com', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido.' })
  @MaxLength(255, { message: 'El email no puede tener más de 255 caracteres.' })
  email?: string;

  //@ApiProperty({ description: 'Estado de la cuenta del estudiante (activo/inactivo)', example: true, required: false })
  //@IsOptional()
  // @IsBoolean() // Solo si el estado puede ser cambiado por el propio usuario (generalmente no)
  // estado?: boolean;
  // Si el estado es gestionado solo por administradores, no lo incluyas aquí.
  // Si se incluye, debería ser para un DTO de "AdminUpdateEstudianteDto"
}