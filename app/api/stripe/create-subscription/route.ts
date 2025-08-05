import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId, suscripcionId } = body;

    // Validar autenticación
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    const token = authorization.replace('Bearer ', '');

    // Verificar token con Supabase
    const { data: user, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user.user) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    // Validar datos
    if (!priceId || !suscripcionId) {
      return NextResponse.json(
        { error: 'priceId y suscripcionId son requeridos' },
        { status: 400 }
      );
    }

    // Crear customer en Stripe si no existe
    let customer = null;
    
    const customers = await stripe.customers.list({
      email: user.user.email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: user.user.email!,
        metadata: {
          supabase_user_id: user.user.id,
        },
      });
    }

    // Crear la suscripción en Stripe
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        suscripcion_id: suscripcionId.toString(),
        user_id: user.user.id,
      },
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = (invoice as any).payment_intent as Stripe.PaymentIntent;

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      subscriptionId: subscription.id,
      transaccionId: Date.now(),
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
