import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Reutilizamos los enums definidos en la entidad Transaccion
import { EstadoTransaccion } from '../entities/payments-module.entity';

// Creamos una clase base con las propiedades que se pueden actualizar
class UpdatableTransaccionProperties {
  @ApiProperty({ description: 'Nuevo estado de la transacción', example: EstadoTransaccion.COMPLETADA, enum: EstadoTransaccion, required: false })
  @IsOptional()
  @IsEnum(EstadoTransaccion, { message: 'El estado de la transacción no es válido.' })
  estado?: EstadoTransaccion;

  @ApiProperty({ description: 'ID de referencia de la transacción en la pasarela de pago (opcional)', example: 'ch_123XYZABC', required: false })
  @IsOptional()
  @IsString({ message: 'El ID de la pasarela de pago debe ser una cadena de texto.' })
  @MaxLength(255, { message: 'El ID de la pasarela de pago no puede exceder los 255 caracteres.' })
  pasarela_pago_id?: string;

  @ApiProperty({ description: 'Método de pago utilizado (ej. tarjeta de crédito, paypal)', example: 'tarjeta de crédito', required: false })
  @IsOptional()
  @IsString({ message: 'El método de pago debe ser una cadena de texto.' })
  @MaxLength(255, { message: 'El método de pago no puede exceder los 255 caracteres.' })
  metodo_pago?: string;

  @ApiProperty({ description: 'Descripción actualizada de la transacción (opcional)', example: 'Pago completado por suscripción', required: false })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @MaxLength(500, { message: 'La descripción no puede exceder los 500 caracteres.' })
  descripcion?: string;
}

// Extendemos de la clase base para hacer todas sus propiedades opcionales
export class UpdateTransaccionDto extends PartialType(UpdatableTransaccionProperties) {
  // Aquí no se incluyen estudiante_id, suscripcion_id, curso_id, monto, moneda, tipo_producto
  // ya que estos campos NO deberían cambiar una vez que la transacción ha sido iniciada.
}