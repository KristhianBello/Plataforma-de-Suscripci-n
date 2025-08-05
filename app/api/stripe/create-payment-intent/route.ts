import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { monto, tipo, suscripcionId, cursoId } = body;

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
    if (!monto || !tipo) {
      return NextResponse.json(
        { error: 'Monto y tipo son requeridos' },
        { status: 400 }
      );
    }

    // Crear PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(monto * 100), // Convertir a centavos
      currency: 'usd',
      metadata: {
        userId: user.user.id,
        tipo,
        suscripcionId: suscripcionId?.toString() || '',
        cursoId: cursoId?.toString() || '',
      },
    });

    // Aquí podrías guardar la transacción en tu base de datos
    // Por ahora simulamos un ID de transacción
    const transaccionId = Date.now();

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      transaccionId,
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
