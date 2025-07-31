import { IsEnum, IsString, IsOptional, IsNumber, IsBoolean, IsObject, IsDate } from 'class-validator';
import { TipoNotificacion } from '../entities/notificacion.entity';

export class CreateNotificacionDto {
  @IsEnum(TipoNotificacion)
  tipo: TipoNotificacion;

  @IsString()
  titulo: string;

  @IsString()
  mensaje: string;

  @IsNumber()
  estudiante_id: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsDate()
  fecha_programada?: Date;
}
