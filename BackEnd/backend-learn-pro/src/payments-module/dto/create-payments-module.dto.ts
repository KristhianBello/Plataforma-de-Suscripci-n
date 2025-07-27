import { IsNumber, IsNotEmpty, IsString, IsOptional, IsEnum, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Reutilizamos los enums definidos en la entidad Transaccion
import { EstadoTransaccion, TipoProductoPagado } from '../entities/payments-module.entity';

export class CreateTransaccionDto {
  @ApiProperty({ description: 'ID del estudiante que realiza el pago', example: 1 })
  @IsNumber({}, { message: 'El ID del estudiante debe ser un número.' })
  @IsNotEmpty({ message: 'El ID del estudiante no puede estar vacío.' })
  @Type(() => Number)
  estudiante_id: number;

  @ApiProperty({ description: 'ID de la suscripción asociada al pago (opcional)', example: 101, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'El ID de la suscripción debe ser un número.' })
  @Type(() => Number)
  suscripcion_id?: number;

  @ApiProperty({ description: 'ID del curso asociado al pago (opcional)', example: 201, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'El ID del curso debe ser un número.' })
  @Type(() => Number)
  curso_id?: number;

  @ApiProperty({ description: 'Monto de la transacción', example: 49.99 })
  @IsNumber({}, { message: 'El monto debe ser un número.' })
  @Min(0.01, { message: 'El monto debe ser mayor que cero.' })
  @Type(() => Number)
  monto: number;

  @ApiProperty({ description: 'Código de moneda (ej. USD, EUR, COP)', example: 'USD' })
  @IsString({ message: 'La moneda debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La moneda no puede estar vacía.' })
  @MaxLength(3, { message: 'La moneda debe tener 3 caracteres (código ISO).' })
  moneda: string;

  @ApiProperty({ description: 'Tipo de producto que se está pagando', example: TipoProductoPagado.SUSCRIPCION, enum: TipoProductoPagado })
  @IsEnum(TipoProductoPagado, { message: 'El tipo de producto no es válido.' })
  tipo_producto: TipoProductoPagado;

  @ApiProperty({ description: 'Estado inicial de la transacción', example: EstadoTransaccion.PENDIENTE, enum: EstadoTransaccion, required: false })
  @IsOptional()
  @IsEnum(EstadoTransaccion, { message: 'El estado de la transacción no es válido.' })
  estado?: EstadoTransaccion; // Por defecto 'PENDIENTE' en la entidad

  @ApiProperty({ description: 'Descripción de la transacción (opcional)', example: 'Pago por suscripción mensual', required: false })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @MaxLength(500, { message: 'La descripción no puede exceder los 500 caracteres.' })
  descripcion?: string;

  // Nota: pasarela_pago_id y metodo_pago no se incluyen aquí,
  // ya que se llenarán DESPUÉS de la interacción con la pasarela de pago.
}