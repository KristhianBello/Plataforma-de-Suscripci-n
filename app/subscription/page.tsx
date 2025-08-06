"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { BookOpen, Check, Crown, CreditCard, Award, Download, Smartphone, Headphones } from "lucide-react"
import Link from "next/link"
import StripePayment from "@/components/payments/stripe-payment"
import PayPalPayment from "@/components/payments/paypal-payment"
import { useAuth } from "@/hooks/use-auth"
import { ProtectedRoute } from "@/components/protected-route"
import { toast } from "sonner"

// Configure page for client-side rendering
export const dynamic = 'force-dynamic'

export default function SubscriptionPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [currentPlan, setCurrentPlan] = useState("free") // free, monthly, annual
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const { user } = useAuth()

  const plans = [
    {
      id: "free",
      name: "Gratis",
      description: "Perfecto para comenzar",
      price: { monthly: 0, annual: 0 },
      features: ["Acceso a 10 cursos gratuitos", "Seguimiento básico del progreso", "Acceso al foro de la comunidad", "Acceso a la aplicación móvil"],
      limitations: ["Selección limitada de cursos", "Sin certificados", "Sin descargas offline"],
      popular: false,
      buttonText: "Plan Actual",
      buttonVariant: "outline" as const,
    },
    {
      id: "monthly",
      name: "Pro Mensual",
      description: "Acceso completo con facturación mensual",
      price: { monthly: 18, annual: 18 },
      features: [
        "Acceso a todos los 500+ cursos",
        "Análisis detallado del progreso",
        "Certificados de finalización",
        "Soporte prioritario de la comunidad",
        "Aplicación móvil con descargas offline",
        "Sesiones individuales de Q&A con instructores",
      ],
      limitations: [],
      popular: false,
      buttonText: "Actualizar a Mensual",
      buttonVariant: "default" as const,
    },
    {
      id: "annual",
      name: "Pro Anual",
      description: "Mejor valor con facturación anual",
      price: { monthly: 6.67, annual: 80 },
      originalPrice: { annual: 216 },
      features: [
        "Acceso a todos los 500+ cursos",
        "Análisis detallado del progreso",
        "Certificados de finalización",
        "Soporte premium 24/7",
        "Aplicación móvil con descargas offline",
        "Sesiones individuales de Q&A con instructores",
        "Acceso temprano a nuevos cursos",
        "Webinars y eventos exclusivos",
      ],
      limitations: [],
      popular: true,
      buttonText: "Actualizar a Anual",
      buttonVariant: "default" as const,
    },
  ]

  const paymentMethods = [
    {
      id: "stripe",
      name: "Tarjeta de Crédito/Débito",
      description: "Visa, Mastercard, American Express",
      icon: CreditCard,
      available: true,
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Paga con tu cuenta de PayPal",
      icon: CreditCard,
      available: true,
    },
  ]

  const handlePlanSelect = (planId: string) => {
    if (planId === "free" || planId === currentPlan) return;
    
    if (!user) {
      toast.error("Debes iniciar sesión para suscribirte");
      return;
    }

    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setCurrentPlan(selectedPlan?.id || "free");
    toast.success("¡Suscripción activada exitosamente!");
  };

  const handlePaymentError = (error: string) => {
    toast.error("Error en el pago", {
      description: error,
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">LearnPro</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Panel
                </Link>
                <Link href="/courses" className="text-gray-600 hover:text-gray-900">
                  Cursos
                </Link>
                <Link href="/subscription" className="text-blue-600 font-medium">
                  Suscripción
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Elige Tu Plan de Aprendizaje</h1>
            <p className="text-xl text-gray-600 mb-8">
              Desbloquea tu potencial con acceso ilimitado a nuestra biblioteca de cursos
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-sm ${!isAnnual ? "font-medium" : "text-gray-600"}`}>Mensual</span>
              <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
              <span className={`text-sm ${isAnnual ? "font-medium" : "text-gray-600"}`}>Anual</span>
              <Badge variant="secondary" className="ml-2">
                Ahorra 63%
              </Badge>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${plan.popular ? "border-blue-600 border-2" : ""} ${
                  currentPlan === plan.id ? "ring-2 ring-blue-600" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                    <Crown className="h-3 w-3 mr-1" />
                    Más Popular
                  </Badge>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>

                  <div className="mt-4">
                    {plan.price.monthly === 0 ? (
                      <div className="text-4xl font-bold text-gray-900">Gratis</div>
                    ) : (
                      <div>
                        <div className="text-4xl font-bold text-gray-900">
                          ${isAnnual ? plan.price.annual : plan.price.monthly}
                          {!isAnnual && <span className="text-lg text-gray-600">/mes</span>}
                          {isAnnual && <span className="text-lg text-gray-600">/año</span>}
                        </div>
                        {plan.originalPrice && isAnnual && (
                          <div className="text-sm text-gray-500 line-through">${plan.originalPrice.annual}/año</div>
                        )}
                        {isAnnual && plan.price.monthly < 18 && (
                          <div className="text-sm text-green-600 font-medium">
                            ${plan.price.monthly}/mes cuando se factura anualmente
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}

                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-start space-x-3 opacity-60">
                        <div className="w-5 h-5 mt-0.5 flex-shrink-0 flex items-center justify-center">
                          <div className="w-3 h-0.5 bg-gray-400" />
                        </div>
                        <span className="text-sm text-gray-600">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full"
                    variant={currentPlan === plan.id ? "outline" : plan.buttonVariant}
                    disabled={currentPlan === plan.id}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    {currentPlan === plan.id ? "Plan Actual" : plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Comparison */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Comparar Planes</CardTitle>
              <CardDescription>Ve qué está incluido en cada plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Características</th>
                      <th className="text-center py-3 px-4">Gratis</th>
                      <th className="text-center py-3 px-4">Pro Mensual</th>
                      <th className="text-center py-3 px-4">Pro Anual</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="py-3 px-4 flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-gray-600" />
                        Acceso a Cursos
                      </td>
                      <td className="text-center py-3 px-4">10 cursos</td>
                      <td className="text-center py-3 px-4">500+ cursos</td>
                      <td className="text-center py-3 px-4">500+ cursos</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 flex items-center">
                        <Award className="h-4 w-4 mr-2 text-gray-600" />
                        Certificados
                      </td>
                      <td className="text-center py-3 px-4">❌</td>
                      <td className="text-center py-3 px-4">✅</td>
                      <td className="text-center py-3 px-4">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 flex items-center">
                        <Download className="h-4 w-4 mr-2 text-gray-600" />
                        Descargas Offline
                      </td>
                      <td className="text-center py-3 px-4">❌</td>
                      <td className="text-center py-3 px-4">✅</td>
                      <td className="text-center py-3 px-4">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 flex items-center">
                        <Smartphone className="h-4 w-4 mr-2 text-gray-600" />
                        Aplicación Móvil
                      </td>
                      <td className="text-center py-3 px-4">Básica</td>
                      <td className="text-center py-3 px-4">Acceso Completo</td>
                      <td className="text-center py-3 px-4">Acceso Completo</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 flex items-center">
                        <Headphones className="h-4 w-4 mr-2 text-gray-600" />
                        Soporte
                      </td>
                      <td className="text-center py-3 px-4">Comunidad</td>
                      <td className="text-center py-3 px-4">Prioritario</td>
                      <td className="text-center py-3 px-4">Premium</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Métodos de Pago Seguros</CardTitle>
              <CardDescription>Aceptamos todos los métodos de pago principales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <method.icon className="h-8 w-8 text-gray-600" />
                    <div>
                      <h3 className="font-medium">{method.name}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center text-sm text-gray-600">
                <p>🔒 Todos los pagos están asegurados con encriptación SSL de 256 bits</p>
                <p className="mt-2">Garantía de devolución de 30 días • Cancela en cualquier momento</p>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>Preguntas Frecuentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">¿Puedo cancelar mi suscripción en cualquier momento?</h3>
                  <p className="text-sm text-gray-600">
                    Sí, puedes cancelar tu suscripción en cualquier momento. Continuarás teniendo acceso hasta el final de tu período de facturación.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">¿Ofrecen reembolsos?</h3>
                  <p className="text-sm text-gray-600">
                    Ofrecemos una garantía de devolución de dinero de 30 días. Si no estás satisfecho, contáctanos para un reembolso completo.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">¿Puedo cambiar entre planes?</h3>
                  <p className="text-sm text-gray-600">
                    Sí, puedes actualizar o cambiar tu plan en cualquier momento. Los cambios se reflejarán en tu próximo ciclo de facturación.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">¿Hay tarifas ocultas?</h3>
                  <p className="text-sm text-gray-600">
                    No, el precio que ves es el precio que pagas. No hay tarifas de configuración, cargos ocultos o costos adicionales.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Dialog */}
        <Dialog open={showPayment} onOpenChange={setShowPayment}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Completa Tu Suscripción</DialogTitle>
              <DialogDescription>
                {selectedPlan && `Te estás suscribiendo al plan ${selectedPlan.name}.`}
              </DialogDescription>
            </DialogHeader>
            {selectedPlan && (
              <div>
                <h4 className="mb-2 text-center">Selecciona tu método de pago:</h4>
                <div className="flex flex-col gap-4">
                  {/* Stripe */}
                  <div className="border rounded-lg p-4">
                    <p className="font-medium mb-2">Tarjeta de Crédito/Débito</p>
                    <StripePayment
                      amount={isAnnual ? selectedPlan.price.annual : selectedPlan.price.monthly}
                      planName={selectedPlan.name}
                      planType={isAnnual ? 'anual' : 'mensual'}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </div>
                  {/* PayPal */}
                  <div className="border rounded-lg p-4">
                    <p className="font-medium mb-2">PayPal</p>
                    {/*@ts-ignore*/}
                    <PayPalPayment
                      amount={isAnnual ? selectedPlan.price.annual : selectedPlan.price.monthly}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
