"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Elements } from "@stripe/react-stripe-js"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, ArrowLeft, CreditCard, Shield, Check, Crown, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { ProtectedRoute } from "@/components/protected-route"
import getStripe from "@/lib/stripe"
import CheckoutForm from "@/components/payments/simple-checkout-form"
import DevCheckoutForm from "@/components/payments/dev-checkout-form"
import PayPalPayment from "@/components/payments/paypal-payment"
import { toast } from "sonner"

// Configuración de planes
interface PlanConfig {
  name: string
  description: string
  price: number
  originalPrice?: number
  priceId: string | undefined
  interval: string
  type: "mensual" | "anual"
  monthlyEquivalent?: number
  features: string[]
}

const planConfigs: Record<string, PlanConfig> = {
  "pro-monthly": {
    name: "Pro Mensual",
    description: "Facturación mensual",
    price: 18,
    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID,
    interval: "mes",
    type: "mensual" as const,
    features: [
      "Acceso a todos los 500+ cursos",
      "Análisis detallado del progreso",
      "Certificados de finalización",
      "Soporte prioritario de la comunidad",
      "Aplicación móvil con descargas offline",
      "Sesiones individuales de Q&A con instructores"
    ]
  },
  "pro-annual": {
    name: "Pro Anual",
    description: "Facturación anual - Ahorra 63%",
    price: 80,
    originalPrice: 216,
    priceId: process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID,
    interval: "año",
    type: "anual" as const,
    monthlyEquivalent: 6.67,
    features: [
      "Acceso a todos los 500+ cursos",
      "Análisis detallado del progreso",
      "Certificados de finalización",
      "Soporte premium 24/7",
      "Aplicación móvil con descargas offline",
      "Sesiones individuales de Q&A con instructores",
      "Acceso temprano a nuevos cursos",
      "Webinars y eventos exclusivos"
    ]
  }
}

// Componente interno con useSearchParams
function PaymentPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"stripe" | "paypal">("stripe")
  const [stripePromise] = useState(() => getStripe())

  // Obtener el plan de los parámetros de búsqueda
  const planParam = searchParams.get("plan") || "pro-monthly"
  const planConfig = planConfigs[planParam as keyof typeof planConfigs]

  // Verificar si Stripe está configurado correctamente
  const isStripeConfigured = Boolean(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && 
    process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID &&
    process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID
  )

  console.log('Stripe configuration:', {
    publishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    monthlyPriceId: !!process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID,
    annualPriceId: !!process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID,
    isStripeConfigured
  })

  useEffect(() => {
    // Verificar que el usuario esté autenticado
    if (!user) {
      toast.error("Debes iniciar sesión para continuar")
      router.push("/login")
      return
    }

    // Verificar que el plan sea válido
    if (!planConfig) {
      toast.error("Plan de suscripción no válido")
      router.push("/subscription")
      return
    }
  }, [user, planConfig, router])

  const handlePaymentSuccess = () => {
    toast.success("¡Pago exitoso!", {
      description: "Tu suscripción ha sido activada correctamente."
    })
    
    // Redirigir al dashboard después de un breve delay
    setTimeout(() => {
      router.push("/dashboard?welcome=true")
    }, 2000)
  }

  const handlePaymentError = (error: string) => {
    toast.error("Error en el pago", {
      description: error
    })
  }

  const handlePayPalSuccess = async (details: any) => {
    try {
      setLoading(true)
      
      // Aquí puedes agregar lógica para validar el pago con tu backend
      console.log("PayPal payment successful:", details)
      
      handlePaymentSuccess()
    } catch (error) {
      console.error("Error processing PayPal payment:", error)
      handlePaymentError("Error al procesar el pago de PayPal")
    } finally {
      setLoading(false)
    }
  }

  if (!planConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Plan no encontrado</h2>
          <p className="text-gray-600 mb-6">El plan de suscripción especificado no es válido.</p>
          <Button asChild>
            <Link href="/subscription">Volver a Planes</Link>
          </Button>
        </div>
      </div>
    )
  }

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

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Finalizar Suscripción</h1>
            <p className="text-lg text-gray-600">
              Completa tu pago para activar tu plan {planConfig.name}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Plan Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      {planConfig.type === "anual" && (
                        <Crown className="h-5 w-5 text-yellow-500 mr-2" />
                      )}
                      {planConfig.name}
                    </CardTitle>
                    {planConfig.type === "anual" && (
                      <Badge className="bg-green-100 text-green-800">
                        Ahorra 63%
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{planConfig.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Precio */}
                    <div className="border-b pb-4">
                      <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-bold text-gray-900">
                          ${planConfig.price}
                        </span>
                        <span className="text-lg text-gray-600">/{planConfig.interval}</span>
                      </div>
                      {planConfig.originalPrice && (
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-lg text-gray-500 line-through">
                            ${planConfig.originalPrice}
                          </span>
                          <Badge variant="secondary" className="text-green-700">
                            Ahorras ${planConfig.originalPrice - planConfig.price}
                          </Badge>
                        </div>
                      )}
                      {planConfig.monthlyEquivalent && (
                        <p className="text-sm text-green-600 font-medium mt-2">
                          Equivale a ${planConfig.monthlyEquivalent}/mes
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Incluye:</h3>
                      <ul className="space-y-2">
                        {planConfig.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Pago 100% seguro:</strong> Utilizamos encriptación SSL de 256 bits para proteger tu información.
                  Garantía de devolución de 30 días.
                </AlertDescription>
              </Alert>

              {/* Terms Notice */}
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  • Tu suscripción se renovará automáticamente cada {planConfig.interval}
                </p>
                <p>
                  • Puedes cancelar en cualquier momento desde tu panel de control
                </p>
                <p>
                  • Al completar este pago, aceptas nuestros{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    términos de servicio
                  </Link>{" "}
                  y{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    política de privacidad
                  </Link>
                </p>
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Método de Pago
                  </CardTitle>
                  <CardDescription>
                    Elige tu método de pago preferido
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedPaymentMethod} onValueChange={(value) => setSelectedPaymentMethod(value as "stripe" | "paypal")}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="stripe">Tarjeta</TabsTrigger>
                      <TabsTrigger value="paypal">PayPal</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="stripe" className="mt-6">
                      {stripePromise ? (
                        <Elements
                          stripe={stripePromise}
                          options={{
                            mode: 'subscription',
                            amount: Math.round(planConfig.price * 100), // Stripe expects cents
                            currency: 'usd',
                            appearance: {
                              theme: 'stripe',
                              variables: {
                                colorPrimary: '#3b82f6',
                              },
                            },
                          }}
                        >
                          <CheckoutForm
                            amount={planConfig.price}
                            planName={planConfig.name}
                            planType={planConfig.type}
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                            setLoading={setLoading}
                            itemType="subscription"
                            itemId="1"
                          />
                        </Elements>
                      ) : (
                        // Solo usar formulario de desarrollo si Stripe Promise falla
                        <DevCheckoutForm
                          amount={planConfig.price}
                          planName={planConfig.name}
                          planType={planConfig.type}
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                          setLoading={setLoading}
                          itemType="subscription"
                          itemId="1"
                        />
                      )}
                    </TabsContent>
                    
                    <TabsContent value="paypal" className="mt-6">
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium text-gray-900 mb-2">
                            Resumen del pedido
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Plan:</span>
                              <span className="font-medium">{planConfig.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total:</span>
                              <span className="font-medium">${planConfig.price}/{planConfig.interval}</span>
                            </div>
                          </div>
                        </div>
                        
                        <PayPalScriptProvider
                          options={{
                            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                            currency: "USD",
                            intent: "subscription"
                          }}
                        >
                          <PayPalPayment
                            amount={planConfig.price}
                            onSuccess={handlePayPalSuccess}
                            onError={handlePaymentError}
                          />
                        </PayPalScriptProvider>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex items-center space-x-4">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-900">Procesando pago...</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente principal con Suspense
export default function PaymentPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-900">Cargando página de pago...</span>
          </div>
        </div>
      }>
        <PaymentPageContent />
      </Suspense>
    </ProtectedRoute>
  )
}
