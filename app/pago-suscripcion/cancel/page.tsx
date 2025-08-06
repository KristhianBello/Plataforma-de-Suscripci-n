"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, BookOpen, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

export default function PaymentCancelPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Verificar que el usuario esté autenticado
    if (!user) {
      router.push("/login")
      return
    }

    // Mostrar mensaje informativo
    toast.info("Pago cancelado", {
      description: "No se ha realizado ningún cargo. Puedes intentar nuevamente cuando gustes."
    })
  }, [user, router])

  const reasons = [
    {
      title: "¿Tienes dudas sobre el plan?",
      description: "Revisa todos los detalles y beneficios de nuestros planes",
      action: "Ver Planes",
      href: "/subscription"
    },
    {
      title: "¿Problemas con el pago?",
      description: "Verifica que tu información de pago sea correcta",
      action: "Intentar de Nuevo",
      href: "/pago-suscripcion"
    },
    {
      title: "¿Necesitas más información?",
      description: "Consulta nuestras preguntas frecuentes o contacta soporte",
      action: "Centro de Ayuda",
      href: "/help"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">LearnPro</span>
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/subscription" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Planes
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Cancel Message */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
              <XCircle className="h-8 w-8 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Pago Cancelado
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              No se ha realizado ningún cargo a tu cuenta
            </p>
            <p className="text-gray-500">
              Puedes intentar nuevamente cuando estés listo
            </p>
          </div>

          {/* Reasons and Solutions */}
          <div className="space-y-6 mb-12">
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-8">
              ¿Cómo podemos ayudarte?
            </h2>
            
            {reasons.map((reason, index) => (
              <Card key={index} className="transition-all hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {reason.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={reason.href}>
                      {reason.action}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button asChild size="lg" className="flex items-center justify-center">
                <Link href="/pago-suscripcion">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Reintentar Pago
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex items-center justify-center">
                <Link href="/dashboard">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Volver al Dashboard
                </Link>
              </Button>
            </div>
            
            <Button asChild variant="ghost" size="sm" className="w-full flex items-center justify-center">
              <Link href="/help">
                <HelpCircle className="h-4 w-4 mr-2" />
                ¿Tienes preguntas? Contacta soporte
              </Link>
            </Button>
          </div>

          {/* Alternative Options */}
          <Card className="mt-12 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 text-center">
                Mientras tanto, sigue aprendiendo
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-blue-700 mb-4">
                Explora nuestros cursos gratuitos disponibles mientras decides sobre tu suscripción
              </p>
              <Button asChild variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                <Link href="/courses?filter=free">Ver Cursos Gratuitos</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="text-center mt-8 text-sm text-gray-600">
            <p>
              🔒 Tu información está segura. No almacenamos datos de tarjetas de crédito en nuestros servidores.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
