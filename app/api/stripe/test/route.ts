import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Stripe configuration...');
    
    // Verificar que la clave secreta esté configurada
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!secretKey) {
      return NextResponse.json({
        success: false,
        error: 'STRIPE_SECRET_KEY no está configurada',
        details: 'La variable de entorno STRIPE_SECRET_KEY no está definida'
      });
    }

    // Verificar formato de la clave
    if (!secretKey.startsWith('sk_')) {
      return NextResponse.json({
        success: false,
        error: 'Formato de clave inválido',
        details: `La clave debe empezar con 'sk_', pero empieza con: ${secretKey.substring(0, 5)}...`
      });
    }

    // Verificar si es clave de test o producción
    const isTestKey = secretKey.startsWith('sk_test_');
    const isProdKey = secretKey.startsWith('sk_live_');
    
    if (!isTestKey && !isProdKey) {
      return NextResponse.json({
        success: false,
        error: 'Tipo de clave no reconocido',
        details: 'La clave debe ser sk_test_ para desarrollo o sk_live_ para producción'
      });
    }

    // Intentar inicializar Stripe
    const stripe = new Stripe(secretKey, {
      apiVersion: '2025-07-30.basil',
    });

    // Hacer una llamada simple para verificar que la clave funciona
    const balance = await stripe.balance.retrieve();
    
    // Obtener información de la cuenta
    const account = await stripe.accounts.retrieve();

    return NextResponse.json({
      success: true,
      message: 'Stripe configurado correctamente',
      details: {
        keyType: isTestKey ? 'test' : 'production',
        accountId: account.id,
        country: account.country,
        currency: account.default_currency,
        balanceAvailable: balance.available.length > 0 ? balance.available[0].amount : 0,
        balancePending: balance.pending.length > 0 ? balance.pending[0].amount : 0
      }
    });

  } catch (error) {
    console.error('Stripe test error:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({
        success: false,
        error: `Error de Stripe: ${error.message}`,
        code: error.code,
        type: error.type,
        details: 'Verifica que tu clave de Stripe sea válida y esté activa'
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}
