import { PartialType } from '@nestjs/swagger'; // Para heredar y hacer opcionales los campos
import { CreateCursoDto } from '../cursos/create-courses-module.dto'; // Importa el DTO de creación

// PartialType toma todas las propiedades de CreateCursoDto y las hace opcionales
export class UpdateCursoDto extends PartialType(CreateCursoDto) {
  // Aquí puedes añadir propiedades adicionales si UpdateCursoDto tuviera campos que no están en CreateCursoDto
}