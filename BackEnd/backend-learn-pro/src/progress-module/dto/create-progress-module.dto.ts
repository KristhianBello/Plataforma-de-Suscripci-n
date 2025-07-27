import { IsNumber, IsNotEmpty, IsBoolean, IsOptional, Min, Max, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProgresoLeccionDto {
  @ApiProperty({ description: 'ID del estudiante al que pertenece este progreso', example: 1 })
  @IsNumber({}, { message: 'El ID del estudiante debe ser un número.' })
  @IsNotEmpty({ message: 'El ID del estudiante no puede estar vacío.' })
  @Type(() => Number)
  estudiante_id: number;

  @ApiProperty({ description: 'ID de la lección a la que corresponde este progreso', example: 101 })
  @IsNumber({}, { message: 'El ID de la lección debe ser un número.' })
  @IsNotEmpty({ message: 'El ID de la lección no puede estar vacío.' })
  @Type(() => Number)
  leccion_id: number;

  @ApiProperty({ description: 'ID del curso al que pertenece la lección (para referencia rápida)', example: 50 })
  @IsNumber({}, { message: 'El ID del curso debe ser un número.' })
  @IsNotEmpty({ message: 'El ID del curso no puede estar vacío.' })
  @Type(() => Number)
  curso_id: number;

  @ApiProperty({ description: 'Indica si la lección ha sido completada', example: false, required: false })
  @IsOptional()
  @IsBoolean({ message: 'El campo completada debe ser un valor booleano.' })
  completada?: boolean; // Por defecto 'false' en la entidad

  @ApiProperty({ description: 'Porcentaje de progreso dentro de la lección (0-100)', example: 0, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'El porcentaje de progreso debe ser un número.' })
  @Min(0, { message: 'El porcentaje de progreso no puede ser menor a 0.' })
  @Max(100, { message: 'El porcentaje de progreso no puede ser mayor a 100.' })
  @Type(() => Number)
  porcentaje_progreso?: number; // Por defecto '0' en la entidad

  @ApiProperty({ description: 'Fecha y hora en que la lección fue marcada como completada (ISO 8601)', example: '2024-07-28T15:30:00Z', required: false })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de completado debe ser una cadena de fecha válida (ISO 8601).' })
  fecha_completado?: string;
}