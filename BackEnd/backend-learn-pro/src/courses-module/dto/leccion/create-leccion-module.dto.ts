import { IsString, IsNotEmpty, IsNumber, IsUrl, IsOptional, Min, MaxLength} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeccionDto {
  @ApiProperty({ description: 'Título de la lección', example: 'Introducción a NestJS' })
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El título no puede estar vacío.' })
  @MaxLength(255, { message: 'El título no puede exceder los 255 caracteres.' })
  titulo: string;

  @ApiProperty({ description: 'URL del contenido de la lección (ej. video, documento)', example: 'https://example.com/leccion1.mp4', required: false })
  @IsOptional()
  @IsUrl({}, { message: 'La URL del contenido debe ser una URL válida.' })
  contenido_url?: string;

  @ApiProperty({ description: 'Orden de la lección dentro del curso', example: 1 })
  @IsNumber({}, { message: 'El orden debe ser un número.' })
  @IsNotEmpty({ message: 'El orden no puede estar vacío.' })
  @Min(1, { message: 'El orden debe ser al menos 1.' })
  @Type(() => Number)
  orden: number;

  @ApiProperty({ description: 'ID del curso al que pertenece la lección', example: 1 })
  @IsNumber({}, { message: 'El ID del curso debe ser un número.' })
  @IsNotEmpty({ message: 'El ID del curso no puede estar vacío.' })
  @Type(() => Number)
  curso_id: number; // Campo requerido para asociar la lección a un curso
}