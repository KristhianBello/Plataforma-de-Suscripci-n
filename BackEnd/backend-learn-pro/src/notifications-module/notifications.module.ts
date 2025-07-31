import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notificacion } from './entities/notificacion.entity';
import { Estudiante } from '../users-module/entities/estudiante.entity';
import { Suscripcion } from '../subscriptions-module/entities/suscripcion.entity';
import { AuthModule } from '../auth-module/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notificacion, Estudiante, Suscripcion]),
    ScheduleModule.forRoot(),
    AuthModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
