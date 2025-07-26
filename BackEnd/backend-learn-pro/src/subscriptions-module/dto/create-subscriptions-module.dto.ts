import { IsNumber, IsNotEmpty, IsDateString, IsOptional, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Puedes definir un enum si los estados de suscripción son fijos
enum SuscripcionEstado {
  ACTIVA = 'activa',
  INACTIVA = 'inactiva',
  CANCELADA = 'cancelada',
  FINALIZADA = 'finalizada',
}

export class CreateSuscripcionDto {
  @ApiProperty({ description: 'ID del estudiante que se suscribe', example: 1 })
  @IsNumber({}, { message: 'El ID del estudiante debe ser un número.' })
  @IsNotEmpty({ message: 'El ID del estudiante no puede estar vacío.' })
  @Type(() => Number)
  estudiante_id: number;

  @ApiProperty({ description: 'ID del curso al que se suscribe el estudiante', example: 101 })
  @IsNumber({}, { message: 'El ID del curso debe ser un número.' })
  @IsNotEmpty({ message: 'El ID del curso no puede estar vacío.' })
  @Type(() => Number)
  curso_id: number;

  @ApiProperty({ description: 'Estado inicial de la suscripción', example: SuscripcionEstado.ACTIVA, enum: SuscripcionEstado, required: false })
  @IsOptional()
  @IsString({ message: 'El estado debe ser una cadena de texto.' })
  @IsEnum(SuscripcionEstado, { message: 'El estado proporcionado no es válido.' })
  estado?: SuscripcionEstado; // Por defecto 'activa' en la entidad

  @ApiProperty({ description: 'Fecha de inicio de la suscripción (formato ISO 8601)', example: '2024-07-27T10:00:00Z', required: false })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de inicio debe ser una cadena de fecha válida (ISO 8601).' })
  fecha_inicio?: string; // Se convierte a Date en el servicio/entidad

  @ApiProperty({ description: 'Fecha de fin de la suscripción (formato ISO 8601)', example: '2025-07-27T10:00:00Z', required: false })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de fin debe ser una cadena de fecha válida (ISO 8601).' })
  fecha_fin?: string; // Se convierte a Date en el servicio/entidad
}