import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Intentar obtener información de la base de datos
    const { data, error } = await supabase.from('auth.users').select('count').limit(1);
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({
        status: 'error',
        error: error.message,
        details: error,
      }, { status: 400 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection successful',
      data,
    });

  } catch (error) {
    console.error('Connection error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to connect to Supabase',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
