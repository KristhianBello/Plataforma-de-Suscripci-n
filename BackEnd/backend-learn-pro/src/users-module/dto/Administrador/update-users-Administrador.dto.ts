import { IsString, IsEmail, IsOptional, MaxLength, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdminProfileDto {
  @ApiProperty({ description: 'Nuevo nombre de usuario del administrador (único)', example: 'admin_julieta', required: false })
  @IsOptional()
  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto.' })
  @MaxLength(50, { message: 'El nombre de usuario no puede tener más de 50 caracteres.' })
  nombre_usuario?: string;

  @ApiProperty({ description: 'Nuevo correo electrónico del administrador (debe ser único)', example: 'admin.julieta@example.com', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido.' })
  @MaxLength(255, { message: 'El email no puede tener más de 255 caracteres.' })
  email?: string;

  // El rol NO se debería actualizar desde este DTO si es para que un admin se actualice a sí mismo.
  // Si es para un super-admin que actualiza a otro, entonces el rol sí podría ser opcional aquí.
  // @ApiProperty({
  //   description: 'Nuevo rol del administrador',
  //   enum: ['super_admin', 'editor_contenido', 'soporte'],
  //   required: false
  // })
  // @IsOptional()
  // @IsString()
  // @IsIn(['super_admin', 'editor_contenido', 'soporte'], { message: 'El rol no es válido.' })
  // rol?: string;
}