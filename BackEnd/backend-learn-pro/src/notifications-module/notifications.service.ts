import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as nodemailer from 'nodemailer';
import { Notificacion, TipoNotificacion, EstadoNotificacion } from './entities/notificacion.entity';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';
import { Estudiante } from '../users-module/entities/estudiante.entity';
import { Suscripcion } from '../subscriptions-module/entities/suscripcion.entity';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepository: Repository<Notificacion>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Suscripcion)
    private readonly suscripcionRepository: Repository<Suscripcion>,
  ) {
    // Configurar el transportador de email
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async createNotificacion(createNotificacionDto: CreateNotificacionDto): Promise<Notificacion> {
    const { estudiante_id } = createNotificacionDto;

    // Verificar que el estudiante existe
    const estudiante = await this.estudianteRepository.findOne({ where: { id: estudiante_id } });
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${estudiante_id} no encontrado.`);
    }

    const notificacion = this.notificacionRepository.create({
      ...createNotificacionDto,
      estudiante,
    });

    const savedNotificacion = await this.notificacionRepository.save(notificacion);

    // Si no hay fecha programada, enviar inmediatamente
    if (!createNotificacionDto.fecha_programada) {
      await this.enviarNotificacion(savedNotificacion.id);
    }

    return savedNotificacion;
  }

  async findAllNotificaciones(estudianteId?: number): Promise<Notificacion[]> {
    const queryBuilder = this.notificacionRepository
      .createQueryBuilder('notificacion')
      .leftJoinAndSelect('notificacion.estudiante', 'estudiante');

    if (estudianteId) {
      queryBuilder.where('notificacion.estudiante_id = :estudianteId', { estudianteId });
    }

    return queryBuilder.orderBy('notificacion.fecha_creacion', 'DESC').getMany();
  }

  async findOneNotificacion(id: number): Promise<Notificacion> {
    const notificacion = await this.notificacionRepository.findOne({
      where: { id },
      relations: ['estudiante'],
    });

    if (!notificacion) {
      throw new NotFoundException(`Notificación con ID ${id} no encontrada.`);
    }

    return notificacion;
  }

  async updateNotificacion(id: number, updateNotificacionDto: UpdateNotificacionDto): Promise<Notificacion> {
    const notificacion = await this.findOneNotificacion(id);
    Object.assign(notificacion, updateNotificacionDto);

    if (updateNotificacionDto.leida && !notificacion.fecha_leida) {
      notificacion.fecha_leida = new Date();
    }

    return this.notificacionRepository.save(notificacion);
  }

  async removeNotificacion(id: number): Promise<void> {
    const notificacion = await this.findOneNotificacion(id);
    await this.notificacionRepository.remove(notificacion);
  }

  async marcarComoLeida(id: number): Promise<Notificacion> {
    return this.updateNotificacion(id, { leida: true });
  }

  async enviarNotificacion(id: number): Promise<void> {
    const notificacion = await this.findOneNotificacion(id);

    if (notificacion.estado === EstadoNotificacion.ENVIADA) {
      return; // Ya fue enviada
    }

    try {
      // Enviar email
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@learnpro.com',
        to: notificacion.estudiante.email,
        subject: notificacion.titulo,
        html: this.generateEmailTemplate(notificacion),
      });

      // Actualizar estado
      await this.updateNotificacion(id, {
        estado: EstadoNotificacion.ENVIADA,
        fecha_enviada: new Date(),
      });

      console.log(`Notificación ${id} enviada exitosamente a ${notificacion.estudiante.email}`);
    } catch (error) {
      console.error(`Error enviando notificación ${id}:`, error);
      await this.updateNotificacion(id, {
        estado: EstadoNotificacion.FALLIDA,
      });
    }
  }

  // Métodos específicos para crear notificaciones comunes
  async notificarPagoExitoso(estudianteId: number, monto: number, tipo: string): Promise<Notificacion> {
    return this.createNotificacion({
      tipo: TipoNotificacion.PAGO_EXITOSO,
      titulo: '✅ Pago procesado exitosamente',
      mensaje: `Tu pago de $${monto} por ${tipo} ha sido procesado correctamente. ¡Gracias por tu confianza!`,
      estudiante_id: estudianteId,
      metadata: { monto, tipo },
    });
  }

  async notificarPagoFallido(estudianteId: number, monto: number, error: string): Promise<Notificacion> {
    return this.createNotificacion({
      tipo: TipoNotificacion.PAGO_FALLIDO,
      titulo: '❌ Error en el procesamiento del pago',
      mensaje: `Hubo un problema procesando tu pago de $${monto}. Por favor, verifica tu método de pago e intenta nuevamente.`,
      estudiante_id: estudianteId,
      metadata: { monto, error },
    });
  }

  async notificarRenovacionSuscripcion(estudianteId: number, fechaVencimiento: Date): Promise<Notificacion> {
    const diasRestantes = Math.ceil((fechaVencimiento.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    return this.createNotificacion({
      tipo: TipoNotificacion.RENOVACION_SUSCRIPCION,
      titulo: '🔔 Tu suscripción está próxima a vencer',
      mensaje: `Tu suscripción vence en ${diasRestantes} días (${fechaVencimiento.toLocaleDateString()}). Renueva ahora para seguir disfrutando de todos los cursos.`,
      estudiante_id: estudianteId,
      metadata: { fechaVencimiento, diasRestantes },
      fecha_programada: new Date(fechaVencimiento.getTime() - (3 * 24 * 60 * 60 * 1000)), // 3 días antes
    });
  }

  async notificarCursoCompletado(estudianteId: number, cursoTitulo: string): Promise<Notificacion> {
    return this.createNotificacion({
      tipo: TipoNotificacion.CURSO_COMPLETADO,
      titulo: '🎉 ¡Felicitaciones! Has completado un curso',
      mensaje: `¡Excelente trabajo! Has completado exitosamente el curso "${cursoTitulo}". Tu certificado estará disponible en tu dashboard.`,
      estudiante_id: estudianteId,
      metadata: { cursoTitulo },
    });
  }

  async notificarBienvenida(estudianteId: number, nombre: string): Promise<Notificacion> {
    return this.createNotificacion({
      tipo: TipoNotificacion.BIENVENIDA,
      titulo: '🎊 ¡Bienvenido a LearnPro!',
      mensaje: `¡Hola ${nombre}! Bienvenido a LearnPro. Estamos emocionados de acompañarte en tu viaje de aprendizaje. Explora nuestros cursos y comienza a aprender hoy mismo.`,
      estudiante_id: estudianteId,
      metadata: { nombre },
    });
  }

  // Cron job para enviar notificaciones programadas
  @Cron(CronExpression.EVERY_HOUR)
  async procesarNotificacionesProgramadas(): Promise<void> {
    console.log('Procesando notificaciones programadas...');
    
    const notificacionesPendientes = await this.notificacionRepository.find({
      where: {
        estado: EstadoNotificacion.PENDIENTE,
        fecha_programada: Repository.LessThanOrEqual(new Date()),
      },
      relations: ['estudiante'],
    });

    for (const notificacion of notificacionesPendientes) {
      await this.enviarNotificacion(notificacion.id);
    }

    console.log(`Procesadas ${notificacionesPendientes.length} notificaciones programadas`);
  }

  // Cron job para recordatorios de renovación de suscripción
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async verificarSuscripcionesPorVencer(): Promise<void> {
    console.log('Verificando suscripciones por vencer...');
    
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + 7); // Próximos 7 días

    const suscripcionesPorVencer = await this.suscripcionRepository.find({
      where: {
        estado: 'activa',
        fecha_fin: Repository.LessThanOrEqual(fechaLimite),
      },
      relations: ['estudiante'],
    });

    for (const suscripcion of suscripcionesPorVencer) {
      // Verificar si ya se envió una notificación reciente
      const notificacionExistente = await this.notificacionRepository.findOne({
        where: {
          estudiante_id: suscripcion.estudiante.id,
          tipo: TipoNotificacion.RENOVACION_SUSCRIPCION,
          fecha_creacion: Repository.MoreThan(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)), // Últimos 7 días
        },
      });

      if (!notificacionExistente) {
        await this.notificarRenovacionSuscripcion(suscripcion.estudiante.id, suscripcion.fecha_fin);
      }
    }

    console.log(`Verificadas ${suscripcionesPorVencer.length} suscripciones por vencer`);
  }

  private generateEmailTemplate(notificacion: Notificacion): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${notificacion.titulo}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>LearnPro</h1>
            </div>
            <div class="content">
              <h2>${notificacion.titulo}</h2>
              <p>Hola ${notificacion.estudiante.nombre},</p>
              <p>${notificacion.mensaje}</p>
              <br>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="button">
                Ir al Dashboard
              </a>
            </div>
            <div class="footer">
              <p>© 2025 LearnPro. Todos los derechos reservados.</p>
              <p>Si no deseas recibir estos emails, puedes darte de baja en tu configuración de cuenta.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
