import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaccion, EstadoTransaccion, TipoProductoPagado } from './entities/transaccion.entity';
import { Estudiante } from '../users-module/entities/estudiante.entity';
import { Suscripcion } from '../subscriptions-module/entities/suscripcion.entity';
import { NotificationsService } from '../notifications-module/notifications.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Transaccion)
    private readonly transaccionRepository: Repository<Transaccion>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Suscripcion)
    private readonly suscripcionRepository: Repository<Suscripcion>,
    private readonly notificationsService: NotificationsService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-11-20.acacia',
    });
  }

  async createPaymentIntent(
    estudianteId: number,
    monto: number,
    tipo: TipoProductoPagado,
    suscripcionId?: number,
    cursoId?: number,
  ): Promise<{ clientSecret: string; transaccionId: number }> {
    const estudiante = await this.estudianteRepository.findOne({ where: { id: estudianteId } });
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${estudianteId} no encontrado.`);
    }

    // Crear la transacción en la base de datos
    const transaccion = this.transaccionRepository.create({
      estudiante: estudiante,
      monto: monto,
      tipo_producto: tipo,
      estado: EstadoTransaccion.PENDIENTE,
      metodo_pago: 'stripe',
      suscripcion_id: suscripcionId,
      curso_id: cursoId,
    });

    const savedTransaccion = await this.transaccionRepository.save(transaccion);

    // Crear Payment Intent en Stripe
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(monto * 100), // Stripe usa centavos
      currency: 'usd',
      customer: await this.getOrCreateStripeCustomer(estudiante),
      metadata: {
        transaccionId: savedTransaccion.id.toString(),
        estudianteId: estudianteId.toString(),
        tipo: tipo,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Actualizar transacción con el ID de Stripe
    savedTransaccion.pasarela_pago_id = paymentIntent.id;
    await this.transaccionRepository.save(savedTransaccion);

    return {
      clientSecret: paymentIntent.client_secret,
      transaccionId: savedTransaccion.id,
    };
  }

  async createSubscription(
    estudianteId: number,
    priceId: string,
    suscripcionId: number,
  ): Promise<{ clientSecret: string; subscriptionId: string; transaccionId: number }> {
    const estudiante = await this.estudianteRepository.findOne({ where: { id: estudianteId } });
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${estudianteId} no encontrado.`);
    }

    const suscripcion = await this.suscripcionRepository.findOne({ where: { id: suscripcionId } });
    if (!suscripcion) {
      throw new NotFoundException(`Suscripción con ID ${suscripcionId} no encontrada.`);
    }

    const customer = await this.getOrCreateStripeCustomer(estudiante);

    // Crear suscripción en Stripe
    const stripeSubscription = await this.stripe.subscriptions.create({
      customer: customer,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        estudianteId: estudianteId.toString(),
        suscripcionId: suscripcionId.toString(),
      },
    });

    // Crear transacción inicial
    const transaccion = this.transaccionRepository.create({
      estudiante: estudiante,
      suscripcion: suscripcion,
      monto: (stripeSubscription.items.data[0].price.unit_amount || 0) / 100,
      tipo_producto: TipoProductoPagado.SUSCRIPCION,
      estado: EstadoTransaccion.PENDIENTE,
      metodo_pago: 'stripe',
      pasarela_pago_id: stripeSubscription.id,
    });

    const savedTransaccion = await this.transaccionRepository.save(transaccion);

    const invoice = stripeSubscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    return {
      clientSecret: paymentIntent.client_secret,
      subscriptionId: stripeSubscription.id,
      transaccionId: savedTransaccion.id,
    };
  }

  async handleWebhook(signature: string, payload: Buffer): Promise<void> {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      throw new BadRequestException('Webhook signature verification failed');
    }

    console.log('Processing Stripe webhook:', event.type);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const transaccionId = paymentIntent.metadata.transaccionId;
    if (!transaccionId) return;

    const transaccion = await this.transaccionRepository.findOne({
      where: { id: parseInt(transaccionId) },
      relations: ['estudiante', 'suscripcion'],
    });

    if (!transaccion) return;

    // Actualizar transacción
    transaccion.estado = EstadoTransaccion.COMPLETADA;
    transaccion.fecha_transaccion = new Date();
    await this.transaccionRepository.save(transaccion);

    // Activar suscripción si aplica
    if (transaccion.suscripcion) {
      transaccion.suscripcion.estado = 'activa';
      await this.suscripcionRepository.save(transaccion.suscripcion);
    }

    // Enviar notificación
    await this.notificationsService.notificarPagoExitoso(
      transaccion.estudiante.id,
      transaccion.monto,
      transaccion.tipo_producto,
    );

    console.log(`Payment successful for transaction ${transaccionId}`);
  }

  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const transaccionId = paymentIntent.metadata.transaccionId;
    if (!transaccionId) return;

    const transaccion = await this.transaccionRepository.findOne({
      where: { id: parseInt(transaccionId) },
      relations: ['estudiante'],
    });

    if (!transaccion) return;

    // Actualizar transacción
    transaccion.estado = EstadoTransaccion.FALLIDA;
    await this.transaccionRepository.save(transaccion);

    // Enviar notificación
    await this.notificationsService.notificarPagoFallido(
      transaccion.estudiante.id,
      transaccion.monto,
      paymentIntent.last_payment_error?.message || 'Error desconocido',
    );

    console.log(`Payment failed for transaction ${transaccionId}`);
  }

  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    const subscription = invoice.subscription;
    if (!subscription || !invoice.customer) return;

    // Buscar suscripción por subscription ID
    const transaccion = await this.transaccionRepository.findOne({
      where: { pasarela_pago_id: subscription.toString() },
      relations: ['estudiante', 'suscripcion'],
    });

    if (!transaccion) return;

    // Crear nueva transacción para el pago recurrente
    const nuevaTransaccion = this.transaccionRepository.create({
      estudiante: transaccion.estudiante,
      suscripcion: transaccion.suscripcion,
      monto: (invoice.amount_paid || 0) / 100,
      tipo_producto: TipoProductoPagado.SUSCRIPCION,
      estado: EstadoTransaccion.COMPLETADA,
      metodo_pago: 'stripe',
      pasarela_pago_id: invoice.id,
      fecha_transaccion: new Date(),
    });

    await this.transaccionRepository.save(nuevaTransaccion);

    // Extender fecha de vencimiento de la suscripción
    if (transaccion.suscripcion) {
      const fechaActual = new Date();
      const nuevaFechaFin = new Date(fechaActual);
      
      // Determinar si es mensual o anual basado en el período
      const subscriptionDetails = await this.stripe.subscriptions.retrieve(subscription.toString());
      const interval = subscriptionDetails.items.data[0]?.price?.recurring?.interval;
      
      if (interval === 'month') {
        nuevaFechaFin.setMonth(nuevaFechaFin.getMonth() + 1);
      } else if (interval === 'year') {
        nuevaFechaFin.setFullYear(nuevaFechaFin.getFullYear() + 1);
      }

      transaccion.suscripcion.fecha_fin = nuevaFechaFin;
      transaccion.suscripcion.estado = 'activa';
      await this.suscripcionRepository.save(transaccion.suscripcion);
    }

    // Enviar notificación
    await this.notificationsService.notificarPagoExitoso(
      transaccion.estudiante.id,
      (invoice.amount_paid || 0) / 100,
      'renovación de suscripción',
    );

    console.log(`Recurring payment successful for subscription ${subscription}`);
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    const subscription = invoice.subscription;
    if (!subscription) return;

    const transaccion = await this.transaccionRepository.findOne({
      where: { pasarela_pago_id: subscription.toString() },
      relations: ['estudiante', 'suscripcion'],
    });

    if (!transaccion) return;

    // Crear transacción fallida
    const transaccionFallida = this.transaccionRepository.create({
      estudiante: transaccion.estudiante,
      suscripcion: transaccion.suscripcion,
      monto: (invoice.amount_due || 0) / 100,
      tipo_producto: TipoProductoPagado.SUSCRIPCION,
      estado: EstadoTransaccion.FALLIDA,
      metodo_pago: 'stripe',
      pasarela_pago_id: invoice.id,
    });

    await this.transaccionRepository.save(transaccionFallida);

    // Enviar notificación
    await this.notificationsService.notificarPagoFallido(
      transaccion.estudiante.id,
      (invoice.amount_due || 0) / 100,
      'Error en el pago recurrente',
    );

    console.log(`Recurring payment failed for subscription ${subscription}`);
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    const suscripcionId = subscription.metadata.suscripcionId;
    if (!suscripcionId) return;

    const suscripcion = await this.suscripcionRepository.findOne({
      where: { id: parseInt(suscripcionId) },
    });

    if (!suscripcion) return;

    // Actualizar estado basado en el estado de Stripe
    let nuevoEstado: string;
    switch (subscription.status) {
      case 'active':
        nuevoEstado = 'activa';
        break;
      case 'canceled':
        nuevoEstado = 'cancelada';
        break;
      case 'past_due':
        nuevoEstado = 'pausada';
        break;
      default:
        nuevoEstado = suscripcion.estado;
    }

    suscripcion.estado = nuevoEstado;
    await this.suscripcionRepository.save(suscripcion);

    console.log(`Subscription ${subscription.id} updated to status: ${subscription.status}`);
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    const suscripcionId = subscription.metadata.suscripcionId;
    if (!suscripcionId) return;

    const suscripcion = await this.suscripcionRepository.findOne({
      where: { id: parseInt(suscripcionId) },
      relations: ['estudiante'],
    });

    if (!suscripcion) return;

    suscripcion.estado = 'cancelada';
    suscripcion.fecha_fin = new Date();
    await this.suscripcionRepository.save(suscripcion);

    // Enviar notificación
    await this.notificationsService.createNotificacion({
      tipo: TipoNotificacion.CANCELACION_SUSCRIPCION,
      titulo: 'Suscripción cancelada',
      mensaje: 'Tu suscripción ha sido cancelada. Puedes reactivarla en cualquier momento desde tu dashboard.',
      estudiante_id: suscripcion.estudiante.id,
    });

    console.log(`Subscription ${subscription.id} canceled`);
  }

  private async getOrCreateStripeCustomer(estudiante: Estudiante): Promise<string> {
    // Verificar si ya tiene un customer ID de Stripe
    if (estudiante.stripe_customer_id) {
      try {
        await this.stripe.customers.retrieve(estudiante.stripe_customer_id);
        return estudiante.stripe_customer_id;
      } catch (error) {
        console.log('Stripe customer not found, creating new one');
      }
    }

    // Crear nuevo customer en Stripe
    const customer = await this.stripe.customers.create({
      email: estudiante.email,
      name: estudiante.nombre,
      metadata: {
        estudianteId: estudiante.id.toString(),
      },
    });

    // Guardar el ID del customer en la base de datos
    estudiante.stripe_customer_id = customer.id;
    await this.estudianteRepository.save(estudiante);

    return customer.id;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await this.stripe.subscriptions.cancel(subscriptionId);
  }

  async getSubscriptionDetails(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.retrieve(subscriptionId);
  }

  async updateSubscription(
    subscriptionId: string,
    priceId: string,
  ): Promise<Stripe.Subscription> {
    const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
    
    return this.stripe.subscriptions.update(subscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: priceId,
      }],
      proration_behavior: 'create_prorations',
    });
  }
}
