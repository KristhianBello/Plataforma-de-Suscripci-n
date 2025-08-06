"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BookOpen, CreditCard, Trash2, ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { toast } from "sonner"

function PaymentMethodsContent() {
  const [showAddCard, setShowAddCard] = useState(false)
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })

  const [paymentMethods] = useState([
    {
      id: 1,
      type: 'visa',
      last4: '4242',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'mastercard',
      last4: '8888',
      expiry: '09/26',
      isDefault: false
    }
  ])

  const [billingHistory] = useState([
    {
      id: 1,
      description: 'Plan Anual Pro',
      date: 'Enero 5, 2025',
      amount: 80.00,
      status: 'Pagado'
    },
    {
      id: 2,
      description: 'Plan Mensual Pro',
      date: 'Diciembre 5, 2024',
      amount: 18.00,
      status: 'Pagado'
    },
    {
      id: 3,
      description: 'Plan Mensual Pro',
      date: 'Noviembre 5, 2024',
      amount: 18.00,
      status: 'Pagado'
    }
  ])

  const handleAddCard = () => {
    // Aquí iría la lógica para agregar la tarjeta
    toast.success("Método de pago agregado correctamente")
    setShowAddCard(false)
    setNewCard({ number: '', expiry: '', cvv: '', name: '' })
  }

  const handleDeleteCard = (id: number) => {
    // Aquí iría la lógica para eliminar la tarjeta
    toast.success("Método de pago eliminado")
  }

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'visa':
        return (
          <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">VISA</span>
          </div>
        )
      case 'mastercard':
        return (
          <div className="w-12 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">MC</span>
          </div>
        )
      default:
        return (
          <div className="w-12 h-8 bg-gray-400 rounded flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-white" />
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/settings" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-600">Volver a Configuración</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">LearnPro</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Métodos de Pago</h1>
            <p className="text-gray-600">Gestiona tus tarjetas y métodos de pago</p>
          </div>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Métodos de Pago</CardTitle>
                  <CardDescription>Tus tarjetas guardadas</CardDescription>
                </div>
                <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Agregar tarjeta</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar nuevo método de pago</DialogTitle>
                      <DialogDescription>
                        Agrega una nueva tarjeta de crédito o débito a tu cuenta
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                        <Input
                          id="cardName"
                          placeholder="Juan Pérez"
                          value={newCard.name}
                          onChange={(e) => setNewCard(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Número de tarjeta</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={newCard.number}
                          onChange={(e) => setNewCard(prev => ({ ...prev, number: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Fecha de expiración</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/AA"
                            value={newCard.expiry}
                            onChange={(e) => setNewCard(prev => ({ ...prev, expiry: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={newCard.cvv}
                            onChange={(e) => setNewCard(prev => ({ ...prev, cvv: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleAddCard} className="flex-1">
                          Agregar tarjeta
                        </Button>
                        <Button variant="outline" onClick={() => setShowAddCard(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getCardIcon(method.type)}
                    <div>
                      <p className="font-medium">•••• •••• •••• {method.last4}</p>
                      <p className="text-sm text-gray-600">Expira {method.expiry}</p>
                    </div>
                    {method.isDefault && (
                      <Badge variant="secondary">Predeterminada</Badge>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      {method.isDefault ? 'Editar' : 'Predeterminada'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteCard(method.id)}
                      disabled={method.isDefault}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Facturación</CardTitle>
              <CardDescription>Tus pagos y facturas recientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {billingHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-gray-600">{item.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.amount.toFixed(2)}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.status}
                        </Badge>
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                          Descargar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Security */}
          <Card>
            <CardHeader>
              <CardTitle>Seguridad de Pagos</CardTitle>
              <CardDescription>Tu información de pago está protegida</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-medium">Encriptación SSL</h4>
                    <p className="text-sm text-gray-600">Todos los datos se transmiten de forma segura</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-medium">PCI DSS Compliant</h4>
                    <p className="text-sm text-gray-600">Cumplimos con los estándares de seguridad</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-medium">Stripe Secure</h4>
                    <p className="text-sm text-gray-600">Procesado por Stripe, líder en pagos</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-medium">Sin almacenamiento</h4>
                    <p className="text-sm text-gray-600">No guardamos tu información completa</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function PaymentMethodsPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <PaymentMethodsContent />
    </ProtectedRoute>
  )
}
