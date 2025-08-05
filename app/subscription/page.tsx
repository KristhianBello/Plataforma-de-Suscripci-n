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
      name: "Free",
      description: "Perfect for getting started",
      price: { monthly: 0, annual: 0 },
      features: ["Access to 10 free courses", "Basic progress tracking", "Community forum access", "Mobile app access"],
      limitations: ["Limited course selection", "No certificates", "No offline downloads"],
      popular: false,
      buttonText: "Current Plan",
      buttonVariant: "outline" as const,
    },
    {
      id: "monthly",
      name: "Monthly Pro",
      description: "Full access with monthly billing",
      price: { monthly: 18, annual: 18 },
      features: [
        "Access to all 500+ courses",
        "Detailed progress analytics",
        "Certificates of completion",
        "Priority community support",
        "Mobile app with offline downloads",
        "1-on-1 instructor Q&A sessions",
      ],
      limitations: [],
      popular: false,
      buttonText: "Upgrade to Monthly",
      buttonVariant: "default" as const,
    },
    {
      id: "annual",
      name: "Annual Pro",
      description: "Best value with annual billing",
      price: { monthly: 6.67, annual: 80 },
      originalPrice: { annual: 216 },
      features: [
        "Access to all 500+ courses",
        "Detailed progress analytics",
        "Certificates of completion",
        "Premium 24/7 support",
        "Mobile app with offline downloads",
        "1-on-1 instructor Q&A sessions",
        "Early access to new courses",
        "Exclusive webinars and events",
      ],
      limitations: [],
      popular: true,
      buttonText: "Upgrade to Annual",
      buttonVariant: "default" as const,
    },
  ]

  const paymentMethods = [
    {
      id: "stripe",
      name: "Credit/Debit Card",
      description: "Visa, Mastercard, American Express",
      icon: CreditCard,
      available: true,
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Pay with your PayPal account",
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
                  Dashboard
                </Link>
                <Link href="/courses" className="text-gray-600 hover:text-gray-900">
                  Courses
                </Link>
                <Link href="/subscription" className="text-blue-600 font-medium">
                  Subscription
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Learning Plan</h1>
            <p className="text-xl text-gray-600 mb-8">
              Unlock your potential with unlimited access to our course library
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-sm ${!isAnnual ? "font-medium" : "text-gray-600"}`}>Monthly</span>
              <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
              <span className={`text-sm ${isAnnual ? "font-medium" : "text-gray-600"}`}>Annual</span>
              <Badge variant="secondary" className="ml-2">
                Save 63%
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
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>

                  <div className="mt-4">
                    {plan.price.monthly === 0 ? (
                      <div className="text-4xl font-bold text-gray-900">Free</div>
                    ) : (
                      <div>
                        <div className="text-4xl font-bold text-gray-900">
                          ${isAnnual ? plan.price.annual : plan.price.monthly}
                          {!isAnnual && <span className="text-lg text-gray-600">/month</span>}
                          {isAnnual && <span className="text-lg text-gray-600">/year</span>}
                        </div>
                        {plan.originalPrice && isAnnual && (
                          <div className="text-sm text-gray-500 line-through">${plan.originalPrice.annual}/year</div>
                        )}
                        {isAnnual && plan.price.monthly < 18 && (
                          <div className="text-sm text-green-600 font-medium">
                            ${plan.price.monthly}/month when billed annually
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
                    {currentPlan === plan.id ? "Current Plan" : plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Comparison */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Compare Plans</CardTitle>
              <CardDescription>See what's included in each plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Features</th>
                      <th className="text-center py-3 px-4">Free</th>
                      <th className="text-center py-3 px-4">Monthly Pro</th>
                      <th className="text-center py-3 px-4">Annual Pro</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="py-3 px-4 flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-gray-600" />
                        Course Access
                      </td>
                      <td className="text-center py-3 px-4">10 courses</td>
                      <td className="text-center py-3 px-4">500+ courses</td>
                      <td className="text-center py-3 px-4">500+ courses</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 flex items-center">
                        <Award className="h-4 w-4 mr-2 text-gray-600" />
                        Certificates
                      </td>
                      <td className="text-center py-3 px-4">❌</td>
                      <td className="text-center py-3 px-4">✅</td>
                      <td className="text-center py-3 px-4">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 flex items-center">
                        <Download className="h-4 w-4 mr-2 text-gray-600" />
                        Offline Downloads
                      </td>
                      <td className="text-center py-3 px-4">❌</td>
                      <td className="text-center py-3 px-4">✅</td>
                      <td className="text-center py-3 px-4">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 flex items-center">
                        <Smartphone className="h-4 w-4 mr-2 text-gray-600" />
                        Mobile App
                      </td>
                      <td className="text-center py-3 px-4">Basic</td>
                      <td className="text-center py-3 px-4">Full Access</td>
                      <td className="text-center py-3 px-4">Full Access</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 flex items-center">
                        <Headphones className="h-4 w-4 mr-2 text-gray-600" />
                        Support
                      </td>
                      <td className="text-center py-3 px-4">Community</td>
                      <td className="text-center py-3 px-4">Priority</td>
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
              <CardTitle>Secure Payment Methods</CardTitle>
              <CardDescription>We accept all major payment methods</CardDescription>
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
                <p>🔒 All payments are secured with 256-bit SSL encryption</p>
                <p className="mt-2">30-day money-back guarantee • Cancel anytime</p>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Can I cancel my subscription anytime?</h3>
                  <p className="text-sm text-gray-600">
                    Yes, you can cancel your subscription at any time. You'll continue to have access until the end of
                    your billing period.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Do you offer refunds?</h3>
                  <p className="text-sm text-gray-600">
                    We offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Can I switch between plans?</h3>
                  <p className="text-sm text-gray-600">
                    Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next
                    billing cycle.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Are there any hidden fees?</h3>
                  <p className="text-sm text-gray-600">
                    No, the price you see is the price you pay. There are no setup fees, hidden charges, or additional
                    costs.
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
              <DialogTitle>Complete Your Subscription</DialogTitle>
              <DialogDescription>
                {selectedPlan && `You're subscribing to the ${selectedPlan.name} plan.`}
              </DialogDescription>
            </DialogHeader>
            {selectedPlan && (
              <StripePayment
                amount={isAnnual ? selectedPlan.price.annual : selectedPlan.price.monthly}
                planName={selectedPlan.name}
                planType={isAnnual ? 'anual' : 'mensual'}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
