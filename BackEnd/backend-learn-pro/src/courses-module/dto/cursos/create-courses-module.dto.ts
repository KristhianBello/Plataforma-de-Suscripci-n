import { IsString, IsNotEmpty, IsNumber, IsUrl, IsOptional, Min, MaxLength, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Puedes definir un enum si los estados son fijos
enum CursoEstado {
  BORRADOR = 'borrador',
  PUBLICADO = 'publicado',
  ARCHIVADO = 'archivado',
}

// Puedes definir un enum si los niveles son fijos
enum CursoNivel {
  PRINCIPIANTE = 'Principiante',
  INTERMEDIO = 'Intermedio',
  AVANZADO = 'Avanzado',
  TODOS = 'Todos los niveles',
}

export class CreateCursoDto {
  @ApiProperty({ description: 'Título del curso', example: 'Desarrollo Web con NestJS' })
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El título no puede estar vacío.' })
  @MaxLength(255, { message: 'El título no puede exceder los 255 caracteres.' })
  titulo: string;

  @ApiProperty({ description: 'Descripción detallada del curso', example: 'Aprende a construir APIs robustas con NestJS.', required: false })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @MaxLength(1000, { message: 'La descripción no puede exceder los 1000 caracteres.' })
  descripcion?: string;

  @ApiProperty({ description: 'Precio del curso', example: 49.99 })
  @IsNumber({}, { message: 'El precio debe ser un número.' })
  @Min(0, { message: 'El precio no puede ser negativo.' })
  @Type(() => Number) // Asegura que el valor se transforme a número
  precio: number;

  @ApiProperty({ description: 'Idioma del curso', example: 'Español', required: false })
  @IsOptional()
  @IsString({ message: 'El idioma debe ser una cadena de texto.' })
  @MaxLength(50, { message: 'El idioma no puede exceder los 50 caracteres.' })
  idioma?: string;

  @ApiProperty({ description: 'Nivel del curso', example: CursoNivel.INTERMEDIO, enum: CursoNivel, required: false })
  @IsOptional()
  @IsString({ message: 'El nivel debe ser una cadena de texto.' })
  @IsEnum(CursoNivel, { message: 'El nivel proporcionado no es válido.' })
  nivel?: CursoNivel;

  @ApiProperty({ description: 'URL de la imagen de portada del curso', example: 'https://example.com/imagen.jpg', required: false })
  @IsOptional()
  @IsUrl({}, { message: 'La URL de la imagen de portada debe ser una URL válida.' })
  @MaxLength(255, { message: 'La URL de la imagen no puede exceder los 255 caracteres.' })
  url_imagen_portada?: string;

  @ApiProperty({ description: 'Duración estimada del curso en minutos', example: 120 })
  @IsNumber({}, { message: 'La duración debe ser un número.' })
  @Min(0, { message: 'La duración no puede ser negativa.' })
  @Type(() => Number)
  duracion_minutos: number;

  @ApiProperty({ description: 'Estado inicial del curso', example: CursoEstado.BORRADOR, enum: CursoEstado, required: false })
  @IsOptional()
  @IsString({ message: 'El estado debe ser una cadena de texto.' })
  @IsEnum(CursoEstado, { message: 'El estado proporcionado no es válido.' })
  estado?: CursoEstado; // Por defecto 'borrador' en la entidad, pero se puede especificar
}