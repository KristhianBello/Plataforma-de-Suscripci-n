"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  BookOpen, 
  Search, 
  MessageSquare, 
  Mail, 
  Phone, 
  ExternalLink,
  ArrowLeft,
  Send,
  HelpCircle,
  FileText,
  Video,
  Users,
  Clock
} from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { toast } from "sonner"

function HelpSupportContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [supportForm, setSupportForm] = useState({
    category: '',
    subject: '',
    message: '',
    priority: 'medium'
  })

  const faqData = [
    {
      id: 1,
      question: "¿Cómo puedo cambiar mi plan de suscripción?",
      answer: "Puedes cambiar tu plan desde la sección 'Gestionar Suscripción' en tu configuración. Los cambios se aplicarán en tu próximo ciclo de facturación."
    },
    {
      id: 2,
      question: "¿Puedo descargar cursos para ver sin conexión?",
      answer: "Sí, los usuarios con plan Pro pueden descargar lecciones para verlas sin conexión usando nuestra aplicación móvil."
    },
    {
      id: 3,
      question: "¿Cómo obtengo un certificado de finalización?",
      answer: "Los certificados se generan automáticamente cuando completas el 100% de un curso. Puedes descargarlos desde la sección 'Mis Certificados'."
    },
    {
      id: 4,
      question: "¿Qué métodos de pago aceptan?",
      answer: "Aceptamos todas las tarjetas de crédito y débito principales (Visa, Mastercard, American Express) a través de Stripe."
    },
    {
      id: 5,
      question: "¿Puedo cancelar mi suscripción en cualquier momento?",
      answer: "Sí, puedes cancelar tu suscripción en cualquier momento. Tendrás acceso hasta el final de tu período de facturación actual."
    },
    {
      id: 6,
      question: "¿Ofrecen reembolsos?",
      answer: "Ofrecemos una garantía de devolución de dinero de 30 días para nuevos usuarios. Contacta a soporte para procesar tu reembolso."
    }
  ]

  const helpResources = [
    {
      title: "Guía de inicio rápido",
      description: "Aprende lo básico para empezar con LearnPro",
      icon: FileText,
      link: "/help/getting-started"
    },
    {
      title: "Tutoriales en video",
      description: "Videos paso a paso para usar todas las funciones",
      icon: Video,
      link: "/help/video-tutorials"
    },
    {
      title: "Foro de la comunidad",
      description: "Conecta con otros estudiantes y obtén ayuda",
      icon: Users,
      link: "/community"
    },
    {
      title: "Estado del sistema",
      description: "Verifica el estado actual de nuestros servicios",
      icon: Clock,
      link: "/status"
    }
  ]

  const filteredFAQ = faqData.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSupportSubmit = () => {
    if (!supportForm.category || !supportForm.subject || !supportForm.message) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }
    
    // Aquí iría la lógica para enviar el ticket de soporte
    toast.success("Ticket de soporte enviado. Te responderemos en las próximas 24 horas.")
    setSupportForm({ category: '', subject: '', message: '', priority: 'medium' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-600">Volver al Dashboard</span>
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Centro de Ayuda</h1>
            <p className="text-gray-600">Encuentra respuestas, recursos y obtén soporte técnico</p>
          </div>

          {/* Search */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Buscar en preguntas frecuentes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-lg h-12"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* FAQ and Resources */}
            <div className="lg:col-span-2 space-y-6">
              {/* Help Resources */}
              <Card>
                <CardHeader>
                  <CardTitle>Recursos de Ayuda</CardTitle>
                  <CardDescription>Explora nuestros recursos para resolver dudas comunes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {helpResources.map((resource, index) => (
                      <Link key={index} href={resource.link} className="block">
                        <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <resource.icon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{resource.title}</h3>
                              <p className="text-sm text-gray-600">{resource.description}</p>
                            </div>
                            <ExternalLink className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle>Preguntas Frecuentes</CardTitle>
                  <CardDescription>
                    {searchQuery ? `Resultados para "${searchQuery}"` : "Las preguntas más comunes de nuestros usuarios"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredFAQ.length === 0 ? (
                    <div className="text-center py-8">
                      <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No se encontraron resultados para tu búsqueda</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setSearchQuery("")}
                      >
                        Ver todas las preguntas
                      </Button>
                    </div>
                  ) : (
                    <Accordion type="single" collapsible className="space-y-2">
                      {filteredFAQ.map((item) => (
                        <AccordionItem key={item.id} value={item.id.toString()}>
                          <AccordionTrigger className="text-left">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Support */}
            <div className="space-y-6">
              {/* Quick Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Contacto Rápido</CardTitle>
                  <CardDescription>Otras formas de obtener ayuda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium">Chat en vivo</p>
                      <p className="text-sm text-gray-600">Lun-Vie 9:00-18:00</p>
                    </div>
                    <Badge variant="secondary">En línea</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Mail className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-600">support@learnpro.com</p>
                    </div>
                    <Badge variant="outline">24h</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Phone className="h-5 w-5 text-purple-600" />
                    <div className="flex-1">
                      <p className="font-medium">Teléfono</p>
                      <p className="text-sm text-gray-600">+34 900 123 456</p>
                    </div>
                    <Badge variant="outline">Lun-Vie</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Support Ticket Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Enviar Ticket de Soporte</CardTitle>
                  <CardDescription>Describe tu problema y te ayudaremos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select 
                      value={supportForm.category}
                      onValueChange={(value) => setSupportForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Problema técnico</SelectItem>
                        <SelectItem value="billing">Facturación y pagos</SelectItem>
                        <SelectItem value="courses">Cursos y contenido</SelectItem>
                        <SelectItem value="account">Cuenta y perfil</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridad</Label>
                    <Select 
                      value={supportForm.priority}
                      onValueChange={(value) => setSupportForm(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Asunto</Label>
                    <Input
                      id="subject"
                      placeholder="Describe brevemente el problema"
                      value={supportForm.subject}
                      onChange={(e) => setSupportForm(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe el problema en detalle..."
                      rows={4}
                      value={supportForm.message}
                      onChange={(e) => setSupportForm(prev => ({ ...prev, message: e.target.value }))}
                    />
                  </div>

                  <Button onClick={handleSupportSubmit} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar ticket
                  </Button>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Estado del Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Plataforma web</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Operativo
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Operativo
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Videos</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Operativo
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pagos</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Operativo
                      </Badge>
                    </div>
                  </div>
                  <Link href="/status">
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      Ver historial completo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HelpSupportPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <HelpSupportContent />
    </ProtectedRoute>
  )
}
