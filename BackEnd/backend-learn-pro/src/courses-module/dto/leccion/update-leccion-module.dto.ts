import { PartialType } from '@nestjs/swagger';
import { CreateLeccionDto } from '../leccion/create-leccion-module.dto';

// PartialType toma todas las propiedades de CreateLeccionDto y las hace opcionales
export class UpdateLeccionDto extends PartialType(CreateLeccionDto) {
  // Nota: curso_id generalmente no se actualiza una vez que la lección está asignada
  // Si se permite mover lecciones entre cursos, se manejaría con lógica de negocio específica.
}