import { PartialType } from '@nestjs/swagger'; // Para heredar y hacer opcionales los campos
import { CreateSuscripcionDto } from './create-subscriptions-module.dto'; // Importa el DTO de creación

// PartialType toma todas las propiedades de CreateSuscripcionDto y las hace opcionales
export class UpdateSuscripcionDto extends PartialType(CreateSuscripcionDto) {
  // Nota: estudiante_id y curso_id raramente se actualizan en una suscripción existente,
  // pero se incluyen aquí si en algún caso se necesitara.
}