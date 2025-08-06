"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, BookOpen, Award, Download, Smartphone, ArrowRight, Home, Settings } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { Confetti } from "@/components/ui/confetti"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [showConfetti, setShowConfetti] = useState(true)
  
  // Obtener información del pago de los parámetros de búsqueda
  const paymentIntent = searchParams.get("payment_intent")
  const planType = searchParams.get("plan") || "pro-monthly"
  
  useEffect(() => {
    // Verificar que el usuario esté autenticado
    if (!user) {
      router.push("/login")
      return
    }

    // Mostrar mensaje de bienvenida
    toast.success("¡Bienvenido a LearnPro Pro!", {
      description: "Tu suscripción ha sido activada exitosamente."
    })

    // Ocultar confetti después de 5 segundos
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [user, router])

  const planInfo = {
    "pro-monthly": {
      name: "Pro Mensual",
      price: "$18/mes",
      interval: "mensual"
    },
    "pro-annual": {
      name: "Pro Anual",
      price: "$80/año",
      interval: "anual"
    }
  }

  const currentPlan = planInfo[planType as keyof typeof planInfo] || planInfo["pro-monthly"]

  const features = [
    {
      icon: BookOpen,
      title: "500+ Cursos",
      description: "Acceso completo a toda nuestra biblioteca de cursos"
    },
    {
      icon: Award,
      title: "Certificados",
      description: "Obtén certificados verificados al completar los cursos"
    },
    {
      icon: Download,
      title: "Descargas Offline",
      description: "Descarga contenido para estudiar sin conexión"
    },
    {
      icon: Smartphone,
      title: "App Móvil",
      description: "Acceso completo desde tu dispositivo móvil"
    }
  ]

  const nextSteps = [
    {
      title: "Explora los Cursos",
      description: "Descubre más de 500 cursos en diferentes categorías",
      action: "Ver Cursos",
      href: "/courses",
      primary: true
    },
    {
      title: "Personaliza tu Perfil",
      description: "Configura tus preferencias y objetivos de aprendizaje",
      action: "Ir a Perfil",
      href: "/profile"
    },
    {
      title: "Gestiona tu Suscripción",
      description: "Revisa los detalles de tu plan y métodos de pago",
      action: "Ver Suscripción",
      href: "/subscription"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {showConfetti && <Confetti />}
      
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">LearnPro</span>
            </Link>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Suscripción Activa
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ¡Pago Exitoso!
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Tu suscripción {currentPlan.name} ha sido activada
            </p>
            <p className="text-lg text-gray-500">
              {paymentIntent && (
                <>ID de transacción: <span className="font-mono text-sm">{paymentIntent}</span></>
              )}
            </p>
          </div>

          {/* Plan Details */}
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-800">
                {currentPlan.name}
              </CardTitle>
              <div className="text-3xl font-bold text-green-900">
                {currentPlan.price}
              </div>
              <p className="text-green-700">
                Renovación automática {currentPlan.interval}
              </p>
            </CardHeader>
          </Card>

          {/* Features Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Ahora tienes acceso a todo esto:
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <feature.icon className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              ¿Qué sigue?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {nextSteps.map((step, index) => (
                <Card key={index} className={`transition-all hover:shadow-lg ${step.primary ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardHeader>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <Button 
                      asChild 
                      className="w-full" 
                      variant={step.primary ? "default" : "outline"}
                    >
                      <Link href={step.href} className="flex items-center justify-center">
                        {step.action}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="flex items-center">
              <Link href="/dashboard">
                <Home className="h-5 w-5 mr-2" />
                Ir al Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex items-center">
              <Link href="/settings">
                <Settings className="h-5 w-5 mr-2" />
                Configurar Cuenta
              </Link>
            </Button>
          </div>

          {/* Support Section */}
          <Card className="mt-12 bg-blue-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                ¿Necesitas ayuda?
              </h3>
              <p className="text-blue-700 mb-4">
                Nuestro equipo de soporte está aquí para ayudarte a aprovechar al máximo tu suscripción.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                  <Link href="/help">Centro de Ayuda</Link>
                </Button>
                <Button asChild variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                  <Link href="/contact">Contactar Soporte</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Email Confirmation Notice */}
          <div className="text-center mt-8 text-sm text-gray-600">
            <p>
              📧 Hemos enviado un email de confirmación a <span className="font-medium">{user?.email}</span>
            </p>
            <p className="mt-1">
              También recibirás un recibo de tu pago en los próximos minutos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
