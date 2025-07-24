# ADR 004: Integración de Stripe y PayPal como pasarelas de pago

**Estado:** Aprobada

## Contexto

LearnPro requiere recibir pagos de suscripciones mensuales/anuales de forma segura.

## Decisión

Se decidió integrar **Stripe** y **PayPal** como pasarelas de pago.

## Justificación

- Ambas plataformas son líderes en el sector de pagos online.
- Soportan pagos recurrentes y APIs bien documentadas.
- Stripe facilita testing con entornos sandbox.
- PayPal mejora accesibilidad para usuarios sin tarjetas.

## Consecuencias

- Se manejarán llamadas salientes y recepción de webhooks.
- Se implementará lógica para validar y registrar los pagos en el backend.
