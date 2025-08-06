"use client"

import React, { useState, useEffect } from 'react'
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, Loader2, CreditCard } from 'lucide-react'
import { paymentsAPI } from '@/lib/api'
import { toast } from 'sonner'

interface CheckoutFormProps {
  amount: number
  planName: string
  planType: 'mensual' | 'anual' | 'curso'
  onSuccess?: () => void
  onError?: (error: string) => void
  setLoading: (loading: boolean) => void
  itemId?: string
  itemType?: 'subscription' | 'course'
}

export default function CheckoutForm({
  amount,
  planName,
  planType,
  onSuccess,
  onError,
  setLoading,
  itemId,
  itemType = 'subscription'
}: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [processing, setProcessing] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const [clientSecret, setClientSecret] = useState<string>('')
  const [paymentReady, setPaymentReady] = useState(false)

  useEffect(() => {
    if (itemType === 'subscription') {
      createSubscription()
    } else {
      createPaymentIntent()
    }
  }, [])

  const createSubscription = async () => {
    try {
      setLoading(true)
      
      // Primero crear la suscripción en nuestro backend
      const suscripcion = await paymentsAPI.createSuscripcion({
        curso_id: parseInt(itemId || '1'),
        tipo: planType as 'mensual' | 'anual',
      })

      // Luego crear la suscripción en Stripe
      const priceId = planType === 'mensual' 
        ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!
        : process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID!

      const subscriptionData = await paymentsAPI.createSubscription({
        priceId,
        suscripcionId: suscripcion.id,
      })

      setClientSecret(subscriptionData.clientSecret)
      setPaymentReady(true)
    } catch (error) {
      console.error('Error creating subscription:', error)
      const errorMsg = error instanceof Error ? error.message : 'Error creating subscription'
      setErrorMessage(errorMsg)
      onError?.(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const createPaymentIntent = async () => {
    try {
      setLoading(true)
      
      const paymentData = await paymentsAPI.createPaymentIntent({
        monto: amount,
        tipo: 'curso',
        cursoId: parseInt(itemId || '1'),
      })

      setClientSecret(paymentData.clientSecret)
      setPaymentReady(true)
    } catch (error) {
      console.error('Error creating payment intent:', error)
      const errorMsg = error instanceof Error ? error.message : 'Error creating payment intent'
      setErrorMessage(errorMsg)
      onError?.(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setProcessing(true)
    setErrorMessage('')

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      })

      if (error) {
        setErrorMessage(error.message || 'An unexpected error occurred.')
        onError?.(error.message || 'An unexpected error occurred.')
        toast.error('Error en el pago', {
          description: error.message || 'Ocurrió un error inesperado.',
        })
      } else {
        setSucceeded(true)
        toast.success('¡Pago exitoso!', {
          description: `Tu ${itemType === 'subscription' ? 'suscripción' : 'curso'} ha sido activado correctamente.`,
        })
        onSuccess?.()
      }
    } catch (error) {
      console.error('Payment error:', error)
      setErrorMessage('An unexpected error occurred.')
      onError?.('An unexpected error occurred.')
      toast.error('Error en el pago', {
        description: 'Ocurrió un error inesperado.',
      })
    } finally {
      setProcessing(false)
    }
  }

  if (succeeded) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            ¡Pago exitoso!
          </h3>
          <p className="text-gray-600 mb-4">
            Tu {itemType === 'subscription' ? 'suscripción' : 'curso'} ha sido activado correctamente.
          </p>
          <p className="text-sm text-gray-500">
            Serás redirigido automáticamente en unos segundos...
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!paymentReady || !clientSecret) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-3" />
          <span className="text-gray-600">Preparando formulario de pago...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Finalizar Pago</span>
        </CardTitle>
        <CardDescription>
          Completa tu información de pago de forma segura
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resumen del pedido */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Resumen del pedido</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Producto:</span>
                <span className="font-medium">{planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span className="font-medium capitalize">{planType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium text-lg">${amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Elemento de pago de Stripe */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Información de pago
            </h4>
            <PaymentElement 
              options={{
                layout: 'tabs',
                fields: {
                  billingDetails: {
                    name: 'auto',
                    email: 'auto',
                  }
                }
              }}
            />
          </div>

          {/* Dirección de facturación */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Dirección de facturación
            </h4>
            <AddressElement 
              options={{ 
                mode: 'billing',
                fields: {
                  phone: 'always',
                },
                validation: {
                  phone: {
                    required: 'never',
                  },
                },
              }} 
            />
          </div>

          {/* Mensaje de error */}
          {errorMessage && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Botón de pago */}
          <Button
            type="submit"
            disabled={!stripe || processing}
            className="w-full"
            size="lg"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando pago...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pagar ${amount.toFixed(2)}
              </>
            )}
          </Button>

          {/* Nota de términos */}
          <p className="text-xs text-gray-500 text-center">
            Al completar este pago, aceptas nuestros{' '}
            <a href="/terms" className="text-blue-600 hover:underline">
              términos de servicio
            </a>{' '}
            y{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">
              política de privacidad
            </a>
            .{itemType === 'subscription' && (
              <> Tu suscripción se renovará automáticamente cada {planType === 'mensual' ? 'mes' : 'año'}.</>
            )}
          </p>

          {/* Información de seguridad */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800 font-medium">
                Pago 100% seguro
              </span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Tu información está protegida con encriptación SSL de 256 bits.
              No almacenamos datos de tarjetas de crédito.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
