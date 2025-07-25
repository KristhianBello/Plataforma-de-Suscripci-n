// src/auth-module/dto/register-admin.dto.ts

import { IsString, IsEmail, MinLength, MaxLength, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAdminDto {
  @ApiProperty({ description: 'Nombre de usuario del administrador (único)', example: 'admin_juan' })
  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre de usuario no puede estar vacío.' })
  @MaxLength(50, { message: 'El nombre de usuario no puede tener más de 50 caracteres.' })
  nombre_usuario: string;

  @ApiProperty({ description: 'Correo electrónico del administrador (único)', example: 'admin.juan@example.com' })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido.' })
  @IsNotEmpty({ message: 'El email no puede estar vacío.' })
  @MaxLength(255, { message: 'El email no puede tener más de 255 caracteres.' })
  email: string;

  @ApiProperty({ description: 'Contraseña del administrador (mínimo 6 caracteres)', example: 'AdminSegura123' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  contrasena_hash: string; // En el DTO de entrada, es la contraseña en texto plano que luego se hashea.

  @ApiProperty({
    description: 'Rol del administrador',
    enum: ['super_admin', 'editor_contenido', 'soporte'], // Define los roles permitidos
    example: 'editor_contenido',
  })
  @IsString({ message: 'El rol debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El rol no puede estar vacío.' })
  @IsIn(['super_admin', 'editor_contenido', 'soporte'], { message: 'El rol no es válido.' })
  rol: string;
}