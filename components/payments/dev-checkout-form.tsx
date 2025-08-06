"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, Loader2, CreditCard, Play } from 'lucide-react'
import { toast } from 'sonner'

interface DevCheckoutFormProps {
  amount: number
  planName: string
  planType: 'mensual' | 'anual' | 'curso'
  onSuccess?: () => void
  onError?: (error: string) => void
  setLoading: (loading: boolean) => void
  itemId?: string
  itemType?: 'subscription' | 'course'
}

export default function DevCheckoutForm({
  amount,
  planName,
  planType,
  onSuccess,
  onError,
  setLoading,
  itemId,
  itemType = 'subscription'
}: DevCheckoutFormProps) {
  const [processing, setProcessing] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setProcessing(true)
    setLoading(true)
    
    try {
      // Simular delay de procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular éxito
      setSucceeded(true)
      toast.success('¡Pago simulado exitoso!', {
        description: `Tu ${itemType === 'subscription' ? 'suscripción' : 'curso'} ha sido activado correctamente.`,
      })
      
      // Esperar un poco antes de llamar onSuccess
      setTimeout(() => {
        onSuccess?.()
      }, 1000)
      
    } catch (error) {
      console.error('Simulation error:', error)
      onError?.('Error en la simulación de pago')
    } finally {
      setProcessing(false)
      setLoading(false)
    }
  }

  if (succeeded) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            ¡Pago simulado exitoso!
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Play className="h-5 w-5 text-orange-500" />
          <span>Modo Desarrollo - Pago Simulado</span>
        </CardTitle>
        <CardDescription>
          Esta es una simulación para desarrollo. No se realizará ningún cargo real.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resumen del pedido */}
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-3">🚧 Resumen del pedido (DESARROLLO)</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-orange-700">Producto:</span>
                <span className="font-medium text-orange-900">{planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">Tipo:</span>
                <span className="font-medium text-orange-900 capitalize">{planType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">Total (simulado):</span>
                <span className="font-medium text-lg text-orange-900">${amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Información de desarrollo */}
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Modo Desarrollo:</strong> Este formulario simula un pago exitoso sin conectarse a Stripe.
              La configuración real de Stripe será necesaria para producción.
            </AlertDescription>
          </Alert>

          {/* Formulario simulado */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de tarjeta (simulado)
              </label>
              <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                4242 4242 4242 4242 (Tarjeta de prueba)
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vencimiento
                </label>
                <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                  12/28
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVC
                </label>
                <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                  123
                </div>
              </div>
            </div>
          </div>

          {/* Botón de pago */}
          <Button
            type="submit"
            disabled={processing}
            className="w-full bg-orange-600 hover:bg-orange-700"
            size="lg"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Simulando pago...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Simular Pago de ${amount.toFixed(2)}
              </>
            )}
          </Button>

          {/* Nota de términos */}
          <p className="text-xs text-gray-500 text-center">
            🚧 <strong>Modo de desarrollo:</strong> Este es un pago simulado para pruebas.
            {itemType === 'subscription' && (
              <> La suscripción simulada se renovará automáticamente cada {planType === 'mensual' ? 'mes' : 'año'}.</>
            )}
          </p>

          {/* Información de seguridad */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800 font-medium">
                Simulación 100% segura
              </span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Este es un entorno de desarrollo. No se realizarán cargos reales.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
