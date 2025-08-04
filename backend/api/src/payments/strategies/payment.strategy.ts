// src/payments/strategies/payment.strategy.ts (Interfaz de la estrategia)

import { Estudiante } from '../../auth/entities/estudiante.entity';

/**
 * Define la interfaz que todas las estrategias de pago deben seguir.
 * Esto asegura que cualquier método de pago tenga un método 'processPayment'.
 */
export interface IPaymentStrategy {
  processPayment(amount: number, user: Estudiante): Promise<any>;
}
