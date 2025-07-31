"use client"

import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './checkout-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripePaymentProps {
  amount: number;
  planName: string;
  planType: 'mensual' | 'anual';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function StripePayment({ 
  amount, 
  planName, 
  planType, 
  onSuccess, 
  onError 
}: StripePaymentProps) {
  const [loading, setLoading] = useState(false);

  const options = {
    mode: 'subscription' as const,
    amount: Math.round(amount * 100), // Stripe usa centavos
    currency: 'usd',
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#0ea5e9',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '6px',
        borderRadius: '8px',
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Completar Pago</CardTitle>
          <CardDescription>
            Suscripción {planType} - {planName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Procesando pago...</span>
            </div>
          ) : (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm
                amount={amount}
                planName={planName}
                planType={planType}
                onSuccess={onSuccess}
                onError={onError}
                setLoading={setLoading}
              />
            </Elements>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
