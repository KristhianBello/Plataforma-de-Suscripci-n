// src/payments-module/payments-module.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PaymentsModuleService } from './payments-module.service';

// Importa los DTOs correctos
import { CreateTransaccionDto } from './dto/create-payments-module.dto';
import { UpdateTransaccionDto } from './dto/update-payments-module.dto';

// Importa los Guards y Decoradores de tu AuthModule
import { JwtAuthGuard } from '../auth-module/guards/jwt-auth.guard';
import { RolesGuard } from '../auth-module/guards/roles.guard';
import { Roles } from '../auth-module/decorators/roles.decorator';
import { User } from '../auth-module/decorators/user.decorator'; // Para obtener el usuario autenticado

// Define una interfaz para el payload del JWT que se adjunta al Request
interface JwtPayload {
  sub: number; // ID del usuario (estudiante_id, admin_id, etc.)
  email: string;
  rol: string; // 'estudiante', 'admin', 'super_admin', etc.
}

@Controller('payments') // Prefijo de ruta: /api/payments
export class PaymentsModuleController {
  constructor(private readonly paymentsModuleService: PaymentsModuleService) {}

  /**
   * Inicia una nueva transacción de pago.
   * POST /payments/checkout
   * Un estudiante puede iniciar un pago para sí mismo. Un admin puede iniciar para cualquier estudiante.
   */
  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard) // Requiere autenticación
  async createTransaccion(@User() user: JwtPayload, @Body() createTransaccionDto: CreateTransaccionDto) {
    // Si el usuario es un estudiante, asegúrate de que solo pueda iniciar pagos para sí mismo.
    if (user.rol === 'estudiante' && user.sub !== createTransaccionDto.estudiante_id) {
      throw new ForbiddenException('Un estudiante solo puede iniciar pagos para sí mismo.');
    }
    return this.paymentsModuleService.createTransaccion(createTransaccionDto);
  }

  /**
   * Obtiene todas las transacciones.
   * GET /payments
   * Solo accesible por usuarios con rol 'admin' o 'super_admin'.
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard) // Requiere autenticación y rol
  @Roles('admin', 'super_admin')
  async findAllTransacciones(
    @Query('estudianteId') estudianteId?: string,
    @Query('estado') estado?: string, // EstadoTransaccion como string
  ) {
    return this.paymentsModuleService.findAllTransacciones(
      estudianteId ? +estudianteId : undefined,
      estado as any, // Cast a any para el enum, la validación se hace en el servicio si es necesario
    );
  }

  /**
   * Obtiene una transacción específica por su ID.
   * GET /payments/:id
   * Accesible por 'admin', 'super_admin', o el 'estudiante' propietario de la transacción.
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard) // Requiere autenticación
  async findOneTransaccion(@User() user: JwtPayload, @Param('id') id: string) {
    const transaccion = await this.paymentsModuleService.findOneTransaccion(+id);

    // Si el usuario no es admin/super_admin, debe ser el propietario de la transacción
    if (user.rol === 'estudiante' && transaccion.estudiante_id !== user.sub) {
      throw new ForbiddenException('No tienes permiso para ver esta transacción.');
    }
    return transaccion;
  }

  /**
   * Actualiza una transacción existente (uso administrativo o manual).
   * PATCH /payments/:id
   * Solo accesible por usuarios con rol 'admin' o 'super_admin'.
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) // Requiere autenticación y rol
  @Roles('admin', 'super_admin')
  async updateTransaccion(@Param('id') id: string, @Body() updateTransaccionDto: UpdateTransaccionDto) {
    return this.paymentsModuleService.updateTransaccion(+id, updateTransaccionDto);
  }

  /**
   * Elimina una transacción por su ID.
   * DELETE /payments/:id
   * Solo accesible por usuarios con rol 'admin' o 'super_admin'.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content para eliminación exitosa
  @UseGuards(JwtAuthGuard, RolesGuard) // Requiere autenticación y rol
  @Roles('admin', 'super_admin')
  async removeTransaccion(@Param('id') id: string) {
    await this.paymentsModuleService.removeTransaccion(+id);
  }

  /**
   * Obtiene todas las transacciones de un estudiante específico.
   * GET /payments/student/:estudianteId
   * Protegido para que solo un admin/super_admin pueda ver las de otros,
   * o el propio estudiante pueda ver las suyas.
   */
  @Get('student/:estudianteId')
  @UseGuards(JwtAuthGuard) // Requiere autenticación
  async findTransaccionesByEstudiante(@User() user: JwtPayload, @Param('estudianteId') estudianteId: string) {
    // Si el usuario no es admin/super_admin, debe ser el propio estudiante
    if (user.rol === 'estudiante' && user.sub !== +estudianteId) {
      throw new ForbiddenException('No tienes permiso para ver las transacciones de otro estudiante.');
    }
    return this.paymentsModuleService.findAllTransacciones(+estudianteId); // Reutiliza findAllTransacciones
  }

  // --- Webhooks para Pasarelas de Pago (NO PROTEGIDOS POR JWT GUARD) ---
  // Estos endpoints recibirán notificaciones de las pasarelas de pago.
  // La seguridad debe implementarse con firmas de webhook o IP whitelisting.

  /**
   * Webhook para notificaciones de pago exitoso.
   * POST /payments/webhook/success
   * @param body Contenido del webhook de la pasarela de pago.
   */
  @Post('webhook/success')
  @HttpCode(HttpStatus.OK)
  async handleWebhookSuccess(@Body() body: any) {
    // En un entorno real, aquí se verificaría la firma del webhook
    // y se extraería el ID de la transacción y otros datos relevantes.
    console.log('Webhook de pago exitoso recibido:', body);
    const transaccionId = body.data?.object?.metadata?.transaccionId || body.transaccionId; // Ejemplo de cómo obtener el ID
    const pasarelaPagoId = body.data?.object?.id || body.paymentId;
    const metodoPago = body.data?.object?.payment_method_details?.type || 'desconocido';

    if (!transaccionId || !pasarelaPagoId) {
      throw new BadRequestException('Datos de webhook insuficientes para procesar el éxito.');
    }

    try {
      const updatedTransaccion = await this.paymentsModuleService.handlePaymentSuccess(+transaccionId, pasarelaPagoId, metodoPago);
      return { success: true, message: 'Transacción marcada como completada.', transaccion: updatedTransaccion.id };
    } catch (error) {
      console.error('Error al procesar webhook de éxito:', error.message);
      throw new BadRequestException(`Error al procesar el pago: ${error.message}`);
    }
  }

  /**
   * Webhook para notificaciones de pago fallido.
   * POST /payments/webhook/failure
   * @param body Contenido del webhook de la pasarela de pago.
   */
  @Post('webhook/failure')
  @HttpCode(HttpStatus.OK)
  async handleWebhookFailure(@Body() body: any) {
    console.log('Webhook de pago fallido recibido:', body);
    const transaccionId = body.data?.object?.metadata?.transaccionId || body.transaccionId;
    const pasarelaPagoId = body.data?.object?.id || body.paymentId;

    if (!transaccionId) {
      throw new BadRequestException('Datos de webhook insuficientes para procesar el fallo.');
    }

    try {
      const updatedTransaccion = await this.paymentsModuleService.handlePaymentFailure(+transaccionId, pasarelaPagoId);
      return { success: true, message: 'Transacción marcada como fallida.', transaccion: updatedTransaccion.id };
    } catch (error) {
      console.error('Error al procesar webhook de fallo:', error.message);
      throw new BadRequestException(`Error al procesar el fallo del pago: ${error.message}`);
    }
  }

  /**
   * Webhook para notificaciones de reembolso.
   * POST /payments/webhook/refund
   * @param body Contenido del webhook de la pasarela de pago.
   */
  @Post('webhook/refund')
  @HttpCode(HttpStatus.OK)
  async handleWebhookRefund(@Body() body: any) {
    console.log('Webhook de reembolso recibido:', body);
    const transaccionId = body.data?.object?.metadata?.transaccionId || body.transaccionId;

    if (!transaccionId) {
      throw new BadRequestException('Datos de webhook insuficientes para procesar el reembolso.');
    }

    try {
      const updatedTransaccion = await this.paymentsModuleService.handleRefund(+transaccionId);
      return { success: true, message: 'Transacción marcada como reembolsada.', transaccion: updatedTransaccion.id };
    } catch (error) {
      console.error('Error al procesar webhook de reembolso:', error.message);
      throw new BadRequestException(`Error al procesar el reembolso: ${error.message}`);
    }
  }
}
