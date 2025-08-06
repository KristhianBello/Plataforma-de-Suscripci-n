"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, Gift, Calendar, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { Confetti } from '@/components/ui/confetti'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showConfetti, setShowConfetti] = useState(true)

  const subscriptionId = searchParams.get('subscription_id')
  const planType = searchParams.get('plan_type') || 'mensual'
  const planName = searchParams.get('plan_name') || 'Pro'

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <Confetti />
        </div>
      )}
      
      <div className="w-full max-w-2xl space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            ¡Pago Exitoso! 🎉
          </h1>
          <p className="text-xl text-gray-600">
            Tu suscripción ha sido activada correctamente
          </p>
        </div>

        {/* Subscription Details */}
        <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Gift className="h-6 w-6 text-green-600" />
              Detalles de tu Suscripción
            </CardTitle>
            <CardDescription>
              Tu nueva suscripción está activa y lista para usar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm text-gray-600">Plan seleccionado</p>
                    <p className="font-semibold text-gray-900">{planName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Tipo de facturación</p>
                    <p className="font-semibold text-gray-900 capitalize">{planType}</p>
                  </div>
                </div>

                {subscriptionId && (
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">ID de suscripción</p>
                      <p className="font-mono text-sm text-gray-900">{subscriptionId}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">¿Qué incluye tu plan?</h3>
                <ul className="space-y-1 text-sm text-green-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3" />
                    Acceso a todos los 500+ cursos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3" />
                    Certificados de finalización
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3" />
                    Soporte prioritario 24/7
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3" />
                    Descargas offline en móvil
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3" />
                    Acceso temprano a contenido nuevo
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button asChild className="flex-1 group">
                <Link href="/courses">
                  Explorar Cursos
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="flex-1">
                <Link href="/dashboard">
                  Ir al Dashboard
                </Link>
              </Button>
            </div>

            {/* Additional Info */}
            <div className="text-center text-sm text-gray-600 pt-4 border-t">
              <p>
                Un email de confirmación ha sido enviado a tu correo electrónico.
              </p>
              <p className="mt-1">
                Puedes gestionar tu suscripción desde{' '}
                <Link href="/settings" className="text-green-600 hover:text-green-700 underline">
                  configuración de cuenta
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-gray-900">¿Necesitas ayuda?</h3>
              <p className="text-sm text-gray-600">
                Si tienes alguna pregunta sobre tu suscripción, no dudes en contactarnos.
              </p>
              <div className="flex justify-center gap-4 pt-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/help">
                    Centro de Ayuda
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="mailto:support@learnpro.com">
                    Contactar Soporte
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
