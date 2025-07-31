import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificacionDto } from './create-notificacion.dto';
import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { EstadoNotificacion } from '../entities/notificacion.entity';

export class UpdateNotificacionDto extends PartialType(CreateNotificacionDto) {
  @IsOptional()
  @IsEnum(EstadoNotificacion)
  estado?: EstadoNotificacion;

  @IsOptional()
  @IsBoolean()
  leida?: boolean;
}
