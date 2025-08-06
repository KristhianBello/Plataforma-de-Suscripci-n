"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Bell, Mail, Smartphone, MessageSquare, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { toast } from "sonner"

function NotificationsContent() {
  const [notifications, setNotifications] = useState({
    emailCourses: true,
    emailPromotions: false,
    emailReminders: true,
    emailNewsletter: true,
    pushCourses: true,
    pushPromotions: false,
    pushReminders: true,
    pushAchievements: true,
    smsReminders: false,
    smsImportant: true,
    digestFrequency: 'weekly',
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00'
  })

  const handleSave = () => {
    // Aquí iría la lógica para guardar las preferencias
    toast.success("Configuración de notificaciones actualizada")
  }

  const handleToggle = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ajustes de Notificaciones</h1>
            <p className="text-gray-600">Configura cómo y cuándo quieres recibir notificaciones</p>
          </div>

          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <div>
                  <CardTitle>Notificaciones por Email</CardTitle>
                  <CardDescription>Gestiona las notificaciones que recibes en tu correo</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Nuevos cursos y lecciones</p>
                  <p className="text-sm text-gray-600">Recibe emails sobre nuevo contenido disponible</p>
                </div>
                <Switch
                  checked={notifications.emailCourses}
                  onCheckedChange={(checked) => handleToggle('emailCourses', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Promociones y ofertas</p>
                  <p className="text-sm text-gray-600">Ofertas especiales y descuentos en cursos</p>
                </div>
                <Switch
                  checked={notifications.emailPromotions}
                  onCheckedChange={(checked) => handleToggle('emailPromotions', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Recordatorios de estudio</p>
                  <p className="text-sm text-gray-600">Te recordamos continuar con tus cursos</p>
                </div>
                <Switch
                  checked={notifications.emailReminders}
                  onCheckedChange={(checked) => handleToggle('emailReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Newsletter semanal</p>
                  <p className="text-sm text-gray-600">Resumen semanal de tu progreso y novedades</p>
                </div>
                <Switch
                  checked={notifications.emailNewsletter}
                  onCheckedChange={(checked) => handleToggle('emailNewsletter', checked)}
                />
              </div>

              <div className="border-t pt-4">
                <Label htmlFor="digestFrequency">Frecuencia del resumen</Label>
                <Select 
                  value={notifications.digestFrequency} 
                  onValueChange={(value) => setNotifications(prev => ({ ...prev, digestFrequency: value }))}
                >
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diario</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensual</SelectItem>
                    <SelectItem value="never">Nunca</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Push Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <div>
                  <CardTitle>Notificaciones Push</CardTitle>
                  <CardDescription>Notificaciones en tu navegador y dispositivos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Nuevos cursos y lecciones</p>
                  <p className="text-sm text-gray-600">Notificaciones inmediatas sobre contenido nuevo</p>
                </div>
                <Switch
                  checked={notifications.pushCourses}
                  onCheckedChange={(checked) => handleToggle('pushCourses', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Promociones y ofertas</p>
                  <p className="text-sm text-gray-600">Ofertas especiales por tiempo limitado</p>
                </div>
                <Switch
                  checked={notifications.pushPromotions}
                  onCheckedChange={(checked) => handleToggle('pushPromotions', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Recordatorios de estudio</p>
                  <p className="text-sm text-gray-600">Recordatorios para mantener tu racha de aprendizaje</p>
                </div>
                <Switch
                  checked={notifications.pushReminders}
                  onCheckedChange={(checked) => handleToggle('pushReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Logros y certificados</p>
                  <p className="text-sm text-gray-600">Cuando completes cursos o obtengas certificados</p>
                </div>
                <Switch
                  checked={notifications.pushAchievements}
                  onCheckedChange={(checked) => handleToggle('pushAchievements', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* SMS Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <div>
                  <CardTitle>Notificaciones SMS</CardTitle>
                  <CardDescription>Mensajes de texto a tu número de teléfono</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Recordatorios importantes</p>
                  <p className="text-sm text-gray-600">Solo notificaciones críticas por SMS</p>
                </div>
                <Switch
                  checked={notifications.smsReminders}
                  onCheckedChange={(checked) => handleToggle('smsReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alertas de seguridad</p>
                  <p className="text-sm text-gray-600">Cambios importantes en tu cuenta</p>
                </div>
                <Switch
                  checked={notifications.smsImportant}
                  onCheckedChange={(checked) => handleToggle('smsImportant', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Horas de Silencio</CardTitle>
              <CardDescription>Define un horario donde no recibirás notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Activar horas de silencio</p>
                  <p className="text-sm text-gray-600">No recibirás notificaciones durante estas horas</p>
                </div>
                <Switch
                  checked={notifications.quietHoursEnabled}
                  onCheckedChange={(checked) => handleToggle('quietHoursEnabled', checked)}
                />
              </div>

              {notifications.quietHoursEnabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quietStart">Hora de inicio</Label>
                    <Input
                      id="quietStart"
                      type="time"
                      value={notifications.quietHoursStart}
                      onChange={(e) => setNotifications(prev => ({ ...prev, quietHoursStart: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quietEnd">Hora de fin</Label>
                    <Input
                      id="quietEnd"
                      type="time"
                      value={notifications.quietHoursEnd}
                      onChange={(e) => setNotifications(prev => ({ ...prev, quietHoursEnd: e.target.value }))}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Device Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <div>
                  <CardTitle>Configuración por Dispositivo</CardTitle>
                  <CardDescription>Personaliza las notificaciones para cada dispositivo</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Chrome en Windows</p>
                    <p className="text-sm text-gray-600">Dispositivo actual • Todas las notificaciones habilitadas</p>
                  </div>
                  <Button variant="outline" size="sm">Configurar</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Safari en iPhone</p>
                    <p className="text-sm text-gray-600">Últimos 2 días • Solo notificaciones importantes</p>
                  </div>
                  <Button variant="outline" size="sm">Configurar</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button onClick={handleSave} className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Guardar configuración</span>
            </Button>
            <Link href="/settings">
              <Button variant="outline">Cancelar</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <NotificationsContent />
    </ProtectedRoute>
  )
}
