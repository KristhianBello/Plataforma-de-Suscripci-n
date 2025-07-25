import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Contraseña actual del usuario', example: 'MiClaveActual123' })
  @IsString({ message: 'La contraseña actual debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La contraseña actual no puede estar vacía.' })
  @MinLength(6, { message: 'La contraseña actual debe tener al menos 6 caracteres.' })
  currentPassword: string;

  @ApiProperty({ description: 'Nueva contraseña del usuario', example: 'MiNuevaClaveSegura!' })
  @IsString({ message: 'La nueva contraseña debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La nueva contraseña no puede estar vacía.' })
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres.' })
  // Puedes añadir validaciones de complejidad como @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: 'La contraseña debe ser más compleja.' })
  newPassword: string;

  @ApiProperty({ description: 'Confirmación de la nueva contraseña', example: 'MiNuevaClaveSegura!' })
  @IsString({ message: 'La confirmación de la contraseña debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La confirmación de la contraseña no puede estar vacía.' })
  @MinLength(6, { message: 'La confirmación de la contraseña debe tener al menos 6 caracteres.' })
  confirmNewPassword: string;
}