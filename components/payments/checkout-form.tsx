"use client"

import React, { useState, useEffect } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { paymentsAPI } from '@/lib/api';
import { toast } from 'sonner';

interface CheckoutFormProps {
  amount: number;
  planName: string;
  planType: 'mensual' | 'anual';
  onSuccess?: () => void;
  onError?: (error: string) => void;
  setLoading: (loading: boolean) => void;
}

export default function CheckoutForm({
  amount,
  planName,
  planType,
  onSuccess,
  onError,
  setLoading,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');

  useEffect(() => {
    // Crear la suscripción y obtener el client secret
    createSubscription();
  }, []);

  const createSubscription = async () => {
    try {
      setLoading(true);
      
      // Primero crear la suscripción en nuestro backend
      const suscripcion = await paymentsAPI.createSuscripcion({
        curso_id: 1, // ID del curso, podrías pasarlo como prop
        tipo: planType,
      });

      // Luego crear la suscripción en Stripe
      const priceId = planType === 'mensual' 
        ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!
        : process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID!;

      const subscriptionData = await paymentsAPI.createSubscription({
        priceId,
        suscripcionId: suscripcion.id,
      });

      setClientSecret(subscriptionData.clientSecret);
    } catch (error) {
      console.error('Error creating subscription:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error creating subscription');
      onError?.(error instanceof Error ? error.message : 'Error creating subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);
    setErrorMessage('');

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/subscription/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'An unexpected error occurred.');
        onError?.(error.message || 'An unexpected error occurred.');
        toast.error('Error en el pago', {
          description: error.message || 'Ocurrió un error inesperado.',
        });
      } else {
        setSucceeded(true);
        toast.success('¡Pago exitoso!', {
          description: 'Tu suscripción ha sido activada correctamente.',
        });
        onSuccess?.();
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage('An unexpected error occurred.');
      onError?.('An unexpected error occurred.');
      toast.error('Error en el pago', {
        description: 'Ocurrió un error inesperado.',
      });
    } finally {
      setProcessing(false);
    }
  };

  if (succeeded) {
    return (
      <div className="text-center py-6">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          ¡Pago exitoso!
        </h3>
        <p className="text-gray-600">
          Tu suscripción {planType} ha sido activada correctamente.
        </p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Preparando formulario de pago...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Resumen del pedido
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span>Plan:</span>
            <span className="font-medium">{planName}</span>
          </div>
          <div className="flex justify-between">
            <span>Tipo:</span>
            <span className="font-medium capitalize">{planType}</span>
          </div>
          <div className="flex justify-between">
            <span>Total:</span>
            <span className="font-medium">${amount}/mes</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Información de pago
        </h3>
        <PaymentElement />
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Dirección de facturación
        </h3>
        <AddressElement options={{ mode: 'billing' }} />
      </div>

      {errorMessage && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full"
        size="lg"
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Procesando...
          </>
        ) : (
          `Pagar $${amount}/mes`
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Al completar este pago, aceptas nuestros términos de servicio y política de privacidad.
        Tu suscripción se renovará automáticamente cada {planType === 'mensual' ? 'mes' : 'año'}.
      </p>
    </form>
  );
}
