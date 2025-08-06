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
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

interface SimpleCheckoutFormProps {
  amount: number
  planName: string
  planType: 'mensual' | 'anual' | 'curso'
  onSuccess?: () => void
  onError?: (error: string) => void
  setLoading: (loading: boolean) => void
  itemId?: string
  itemType?: 'subscription' | 'course'
}

export default function SimpleCheckoutForm({
  amount,
  planName,
  planType,
  onSuccess,
  onError,
  setLoading,
  itemId,
  itemType = 'subscription'
}: SimpleCheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [processing, setProcessing] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const [creatingPayment, setCreatingPayment] = useState(false)

  // No crear la suscripción automáticamente, solo preparar el componente

  const createSubscriptionAndGetSecret = async (): Promise<string> => {
    try {
      setLoading(true)
      
      // Obtener el token de autorización del usuario actual
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No hay sesión activa')
      }
      
      // Determinar el priceId basado en el tipo de plan
      const priceId = planType === 'mensual' 
        ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID
        : process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID
      
      if (!priceId) {
        throw new Error('Price ID no configurado para este plan')
      }
      
      // Crear suscripción usando la API
      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          priceId,
          suscripcionId: parseInt(itemId || '1')
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear la suscripción')
      }

      const data = await response.json()
      
      if (!data.clientSecret) {
        throw new Error('No se recibió client secret del servidor')
      }
      
      return data.clientSecret
    } catch (error) {
      console.error('Error creating subscription:', error)
      const errorMsg = error instanceof Error ? error.message : 'Error al crear la suscripción'
      setErrorMessage(errorMsg)
      onError?.(errorMsg)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const createPaymentIntentAndGetSecret = async (): Promise<string> => {
    try {
      setLoading(true)
      
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No hay sesión activa')
      }
      
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          monto: amount,
          tipo: 'curso',
          cursoId: parseInt(itemId || '1')
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear el payment intent')
      }

      const data = await response.json()
      
      if (!data.clientSecret) {
        throw new Error('No se recibió client secret del servidor')
      }
      
      return data.clientSecret
    } catch (error) {
      console.error('Error creating payment intent:', error)
      const errorMsg = error instanceof Error ? error.message : 'Error al crear el payment intent'
      setErrorMessage(errorMsg)
      onError?.(errorMsg)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Funciones legacy para compatibilidad (no se usan más)
  const createSubscription = async () => {
    await createSubscriptionAndGetSecret()
  }

  const createPaymentIntent = async () => {
    await createPaymentIntentAndGetSecret()
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)
    setErrorMessage('')

    try {
      // Crear el payment intent/subscription cuando el usuario envía el formulario
      setCreatingPayment(true)
      
      let currentClientSecret: string
      
      if (itemType === 'subscription') {
        currentClientSecret = await createSubscriptionAndGetSecret()
      } else {
        currentClientSecret = await createPaymentIntentAndGetSecret()
      }
      
      if (!currentClientSecret) {
        throw new Error('No se pudo crear el payment intent')
      }
      
      setCreatingPayment(false)

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: currentClientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/pago-suscripcion/success?plan=${planType}`,
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
      setCreatingPayment(false)
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

  // Mostrar el formulario directamente, sin esperar el clientSecret

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
            disabled={!stripe || processing || creatingPayment}
            className="w-full"
            size="lg"
          >
            {creatingPayment ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparando pago...
              </>
            ) : processing ? (
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
