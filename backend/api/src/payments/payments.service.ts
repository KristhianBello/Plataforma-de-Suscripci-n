// src/payments/payments.service.ts (Contexto que usa la estrategia)

import { Injectable } from '@nestjs/common';
import { IPaymentStrategy } from './strategies/payment.strategy';
import { Estudiante } from '../auth/entities/estudiante.entity';
import { StripeStrategy } from './strategies/stripe.strategy';

@Injectable()
export class PaymentsService {
  private strategy: IPaymentStrategy;

  constructor(
    private readonly stripeStrategy: StripeStrategy,
    // ... aquí se inyectarían otras estrategias (ej. PayPalStrategy)
  ) {
    // Por defecto, se puede inicializar con una estrategia
    this.setStrategy(this.stripeStrategy);
  }

  /**
   * Permite cambiar la estrategia de pago en tiempo de ejecución.
   * @param strategy La estrategia de pago a utilizar.
   */
  public setStrategy(strategy: IPaymentStrategy) {
    this.strategy = strategy;
  }

  /**
   * Procesa el pago usando la estrategia actualmente configurada.
   * @param amount El monto a pagar.
   * @param user El usuario que realiza el pago.
   */
  public processPayment(amount: number, user: Estudiante) {
    return this.strategy.processPayment(amount, user);
  }
}
