import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

// Verificar que la clave secreta de Stripe esté configurada
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY environment variable is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    console.log('Creating subscription - Start')
    
    // Verificar que Stripe esté inicializado correctamente
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not configured')
      return NextResponse.json(
        { error: 'Stripe no está configurado correctamente en el servidor' },
        { status: 500 }
      );
    }

    // Verificar que la clave tenga el formato correcto
    if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
      console.error('Invalid Stripe secret key format')
      return NextResponse.json(
        { error: 'Configuración de Stripe inválida' },
        { status: 500 }
      );
    }
    
    const body = await request.json();
    const { priceId, suscripcionId } = body;
    
    console.log('Request body:', { priceId, suscripcionId })

    // Validar que Stripe esté configurado
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not configured')
      return NextResponse.json(
        { error: 'Stripe no está configurado correctamente' },
        { status: 500 }
      );
    }

    // Validar autenticación
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      console.log('Missing or invalid authorization header')
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    const token = authorization.replace('Bearer ', '');

    // Verificar token con Supabase
    console.log('Verifying token with Supabase')
    const { data: user, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user.user) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    console.log('User authenticated:', user.user.email)

    // Validar datos
    if (!priceId || !suscripcionId) {
      console.log('Missing required fields:', { priceId: !!priceId, suscripcionId: !!suscripcionId })
      return NextResponse.json(
        { error: 'priceId y suscripcionId son requeridos' },
        { status: 400 }
      );
    }

    // Crear customer en Stripe si no existe
    console.log('Finding or creating Stripe customer')
    let customer = null;
    
    const customers = await stripe.customers.list({
      email: user.user.email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      customer = customers.data[0];
      console.log('Found existing customer:', customer.id)
    } else {
      customer = await stripe.customers.create({
        email: user.user.email!,
        metadata: {
          supabase_user_id: user.user.id,
        },
      });
      console.log('Created new customer:', customer.id)
    }

    // Crear la suscripción en Stripe
    console.log('Creating Stripe subscription')
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

    console.log('Subscription created:', subscription.id)

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = (invoice as any).payment_intent as Stripe.PaymentIntent;

    if (!paymentIntent || !paymentIntent.client_secret) {
      console.error('No payment intent or client secret found')
      return NextResponse.json(
        { error: 'Error al crear el payment intent' },
        { status: 500 }
      );
    }

    console.log('Subscription created successfully')

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      subscriptionId: subscription.id,
      transaccionId: Date.now(),
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    
    // Devolver información más específica del error
    if (error instanceof Stripe.errors.StripeError) {
      console.error('Stripe error:', error.message, error.code)
      return NextResponse.json(
        { 
          error: `Error de Stripe: ${error.message}`,
          code: error.code 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
