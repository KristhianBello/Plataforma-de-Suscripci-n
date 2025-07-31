import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';
import { JwtAuthGuard } from '../auth-module/guards/jwt-auth.guard';
import { RolesGuard } from '../auth-module/guards/roles.guard';
import { Roles } from '../auth-module/decorators/roles.decorator';
import { User } from '../auth-module/decorators/user.decorator';
import { JwtPayload } from '../auth-module/interfaces/jwt-payload.interface';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  async createNotificacion(@Body() createNotificacionDto: CreateNotificacionDto) {
    return this.notificationsService.createNotificacion(createNotificacionDto);
  }

  @Get()
  async findAllNotificaciones(
    @User() user: JwtPayload,
    @Query('estudianteId') estudianteId?: string,
  ) {
    // Si es estudiante, solo puede ver sus propias notificaciones
    if (user.rol === 'estudiante') {
      return this.notificationsService.findAllNotificaciones(user.sub);
    }
    
    // Admins pueden filtrar por estudiante o ver todas
    return this.notificationsService.findAllNotificaciones(
      estudianteId ? +estudianteId : undefined,
    );
  }

  @Get('my-notifications')
  async getMyNotifications(@User() user: JwtPayload) {
    return this.notificationsService.findAllNotificaciones(user.sub);
  }

  @Get(':id')
  async findOneNotificacion(@Param('id') id: string) {
    return this.notificationsService.findOneNotificacion(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateNotificacion(
    @Param('id') id: string,
    @Body() updateNotificacionDto: UpdateNotificacionDto,
  ) {
    return this.notificationsService.updateNotificacion(+id, updateNotificacionDto);
  }

  @Patch(':id/mark-read')
  @HttpCode(HttpStatus.OK)
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.marcarComoLeida(+id);
  }

  @Post(':id/send')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async sendNotification(@Param('id') id: string) {
    await this.notificationsService.enviarNotificacion(+id);
    return { message: 'Notificación enviada exitosamente' };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeNotificacion(@Param('id') id: string) {
    await this.notificationsService.removeNotificacion(+id);
  }

  // Endpoints específicos para crear notificaciones comunes
  @Post('welcome/:estudianteId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  async sendWelcomeNotification(
    @Param('estudianteId') estudianteId: string,
    @Body('nombre') nombre: string,
  ) {
    return this.notificationsService.notificarBienvenida(+estudianteId, nombre);
  }

  @Post('payment-success')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  async notifyPaymentSuccess(@Body() body: {
    estudianteId: number;
    monto: number;
    tipo: string;
  }) {
    return this.notificationsService.notificarPagoExitoso(
      body.estudianteId,
      body.monto,
      body.tipo,
    );
  }

  @Post('payment-failed')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  async notifyPaymentFailed(@Body() body: {
    estudianteId: number;
    monto: number;
    error: string;
  }) {
    return this.notificationsService.notificarPagoFallido(
      body.estudianteId,
      body.monto,
      body.error,
    );
  }

  @Post('course-completed')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  async notifyCourseCompleted(@Body() body: {
    estudianteId: number;
    cursoTitulo: string;
  }) {
    return this.notificationsService.notificarCursoCompletado(
      body.estudianteId,
      body.cursoTitulo,
    );
  }
}
