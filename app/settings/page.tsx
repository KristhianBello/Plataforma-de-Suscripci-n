"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  BookOpen, 
  User, 
  Shield, 
  CreditCard, 
  Bell, 
  Palette, 
  Globe, 
  HelpCircle,
  ChevronRight,
  ArrowLeft,
  Settings,
  Smartphone,
  Download,
  Trash2
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { ProtectedRoute } from "@/components/protected-route"
import { toast } from "sonner"

function SettingsContent() {
  const { user } = useAuth()
  
  const [quickSettings, setQuickSettings] = useState({
    notifications: true,
    darkMode: false,
    autoPlay: true,
    emailUpdates: true
  })

  const settingsCategories = [
    {
      title: "Perfil",
      description: "Gestiona tu información personal y foto de perfil",
      icon: User,
      href: "/profile",
      color: "blue"
    },
    {
      title: "Privacidad y Seguridad",
      description: "Controla tu privacidad y configuraciones de seguridad",
      icon: Shield,
      href: "/privacy",
      color: "green"
    },
    {
      title: "Métodos de Pago",
      description: "Administra tus tarjetas y facturación",
      icon: CreditCard,
      href: "/payment-methods",
      color: "purple"
    },
    {
      title: "Notificaciones",
      description: "Personaliza qué notificaciones quieres recibir",
      icon: Bell,
      href: "/notifications",
      color: "orange"
    },
    {
      title: "Suscripción",
      description: "Gestiona tu plan y suscripción actual",
      icon: Smartphone,
      href: "/subscription",
      color: "indigo"
    },
    {
      title: "Ayuda y Soporte",
      description: "Obtén ayuda y contacta con soporte técnico",
      icon: HelpCircle,
      href: "/help",
      color: "red"
    }
  ]

  const handleQuickSettingChange = (setting: string, value: boolean) => {
    setQuickSettings(prev => ({ ...prev, [setting]: value }))
    toast.success("Configuración actualizada")
  }

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
      indigo: "bg-indigo-100 text-indigo-600",
      red: "bg-red-100 text-red-600"
    }
    return colorMap[color as keyof typeof colorMap] || "bg-gray-100 text-gray-600"
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración</h1>
            <p className="text-gray-600">Gestiona tu cuenta, preferencias y configuraciones de privacidad</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Tu Perfil</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/placeholder.svg?height=64&width=64" />
                      <AvatarFallback className="text-lg">
                        {user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                        {user?.user_metadata?.last_name?.[0] || ''}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {user?.user_metadata?.full_name || 
                         `${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim() ||
                         user?.email?.split('@')[0] || 
                         'Usuario'}
                      </h3>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                      <Badge variant="secondary" className="mt-1">Miembro Premium</Badge>
                    </div>
                  </div>
                  <Link href="/profile">
                    <Button variant="outline" className="w-full">
                      Editar Perfil
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Quick Settings */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Configuración Rápida</CardTitle>
                  <CardDescription>Ajustes frecuentes de un vistazo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">Notificaciones</span>
                    </div>
                    <Switch
                      checked={quickSettings.notifications}
                      onCheckedChange={(checked) => handleQuickSettingChange('notifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Palette className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">Modo oscuro</span>
                    </div>
                    <Switch
                      checked={quickSettings.darkMode}
                      onCheckedChange={(checked) => handleQuickSettingChange('darkMode', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Download className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">Reproducción automática</span>
                    </div>
                    <Switch
                      checked={quickSettings.autoPlay}
                      onCheckedChange={(checked) => handleQuickSettingChange('autoPlay', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">Emails de actualización</span>
                    </div>
                    <Switch
                      checked={quickSettings.emailUpdates}
                      onCheckedChange={(checked) => handleQuickSettingChange('emailUpdates', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings Categories */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Configuraciones</CardTitle>
                  <CardDescription>Accede a todas las opciones de configuración disponibles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {settingsCategories.map((category, index) => (
                      <Link key={index} href={category.href} className="block">
                        <div className="p-4 border rounded-lg hover:shadow-md transition-all hover:border-blue-200 group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(category.color)}`}>
                                <category.icon className="h-6 w-6" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {category.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {category.description}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Acciones de Cuenta</CardTitle>
                  <CardDescription>Opciones avanzadas para tu cuenta</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <div className="flex items-center space-x-3">
                        <Download className="h-5 w-5 text-blue-600" />
                        <div className="text-left">
                          <p className="font-medium">Exportar Datos</p>
                          <p className="text-xs text-gray-600">Descarga tu información</p>
                        </div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <div className="flex items-center space-x-3">
                        <Settings className="h-5 w-5 text-gray-600" />
                        <div className="text-left">
                          <p className="font-medium">Configuración Avanzada</p>
                          <p className="text-xs text-gray-600">Opciones técnicas</p>
                        </div>
                      </div>
                    </Button>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" className="justify-start h-auto p-4 w-full border-red-200 hover:bg-red-50">
                      <div className="flex items-center space-x-3">
                        <Trash2 className="h-5 w-5 text-red-600" />
                        <div className="text-left">
                          <p className="font-medium text-red-600">Eliminar Cuenta</p>
                          <p className="text-xs text-gray-600">Elimina permanentemente tu cuenta</p>
                        </div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <SettingsContent />
    </ProtectedRoute>
  )
}
