"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  BookOpen, 
  Shield, 
  Eye, 
  EyeOff, 
  Save, 
  ArrowLeft, 
  Download,
  Trash2,
  Lock,
  Smartphone,
  AlertTriangle,
  Monitor,
  Tablet
} from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { toast } from "sonner"
import { supabase } from '@/lib/supabase'

function PrivacySecurityContent() {
  const [showPassword, setShowPassword] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: '30',
    profileVisibility: 'public',
    courseProgress: 'enabled',
    dataCollection: true,
    analytics: true,
    marketing: false
  })

  const [activeSessions, setActiveSessions] = useState([
    {
      id: 1,
      device: 'Chrome en Windows',
      deviceType: 'desktop',
      browser: 'Chrome',
      os: 'Windows 11',
      location: 'Madrid, España',
      ip: '192.168.1.1',
      lastActive: 'Activo ahora',
      current: true
    },
    {
      id: 2,
      device: 'Safari en iPhone',
      deviceType: 'mobile',
      browser: 'Safari',
      os: 'iOS 17.1',
      location: 'Madrid, España',
      ip: '192.168.1.5',
      lastActive: 'Hace 2 días',
      current: false
    },
    {
      id: 3,
      device: 'Firefox en Ubuntu',
      deviceType: 'desktop',
      browser: 'Firefox',
      os: 'Ubuntu 22.04',
      location: 'Barcelona, España',
      ip: '10.0.0.1',
      lastActive: 'Hace 1 semana',
      current: false
    }
  ])

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="h-5 w-5 text-gray-600" />
      case 'tablet':
        return <Tablet className="h-5 w-5 text-gray-600" />
      case 'desktop':
      default:
        return <Monitor className="h-5 w-5 text-gray-600" />
    }
  }

  const handlePasswordChange = async () => {
    // Validaciones básicas
    if (!securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword) {
      toast.error("Por favor completa todos los campos")
      return
    }

    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    // Validar longitud mínima de la nueva contraseña
    if (securityData.newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsUpdatingPassword(true)

    try {
      // Actualizar contraseña en Supabase
      const { error } = await supabase.auth.updateUser({
        password: securityData.newPassword
      })

      if (error) {
        // Manejar diferentes tipos de errores
        if (error.message.includes('password')) {
          toast.error("Error al actualizar la contraseña. Verifica tu contraseña actual.")
        } else {
          toast.error("Error al actualizar la contraseña: " + error.message)
        }
        return
      }

      // Éxito
      toast.success("Contraseña actualizada correctamente")
      setSecurityData(prev => ({ 
        ...prev, 
        currentPassword: '', 
        newPassword: '', 
        confirmPassword: '' 
      }))

    } catch (error) {
      console.error('Error updating password:', error)
      toast.error("Error inesperado al actualizar la contraseña")
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleSessionRevoke = (sessionId: number) => {
    // Remover la sesión de la lista
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId))
    // Aquí iría la lógica para cerrar la sesión en el servidor
    toast.success("Sesión cerrada correctamente")
  }

  const handleDataExport = () => {
    // Aquí iría la lógica para exportar datos
    toast.success("Solicitud de exportación enviada. Recibirás un email cuando esté lista.")
  }

  const handleAccountDeletion = () => {
    // Aquí iría la lógica para eliminar la cuenta
    toast.success("Solicitud de eliminación enviada. Tu cuenta será eliminada en 30 días.")
    setShowDeleteDialog(false)
  }

  const handleSave = () => {
    // Aquí iría la lógica para guardar las configuraciones
    toast.success("Configuración de privacidad y seguridad actualizada")
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacidad y Seguridad</h1>
            <p className="text-gray-600">Protege tu cuenta y controla tu información personal</p>
          </div>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <div>
                  <CardTitle>Seguridad de la Cuenta</CardTitle>
                  <CardDescription>Configura las medidas de seguridad para tu cuenta</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password Change */}
              <div className="space-y-4">
                <h3 className="font-semibold">Cambiar contraseña</h3>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Contraseña actual</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nueva contraseña</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                    {securityData.newPassword && securityData.newPassword.length < 6 && (
                      <p className="text-xs text-red-600">La contraseña debe tener al menos 6 caracteres</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                    {securityData.confirmPassword && securityData.newPassword !== securityData.confirmPassword && (
                      <p className="text-xs text-red-600">Las contraseñas no coinciden</p>
                    )}
                    {securityData.confirmPassword && securityData.newPassword === securityData.confirmPassword && securityData.newPassword.length >= 6 && (
                      <p className="text-xs text-green-600">Las contraseñas coinciden</p>
                    )}
                  </div>
                  <Button 
                    onClick={handlePasswordChange}
                    disabled={isUpdatingPassword}
                  >
                    {isUpdatingPassword ? "Actualizando..." : "Actualizar contraseña"}
                  </Button>
                </div>
              </div>

              {/* Two Factor Authentication */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Autenticación de dos factores (2FA)</h3>
                    <p className="text-sm text-gray-600">Agrega una capa extra de seguridad a tu cuenta</p>
                  </div>
                  <Switch
                    checked={securityData.twoFactor}
                    onCheckedChange={(checked) => 
                      setSecurityData(prev => ({ ...prev, twoFactor: checked }))
                    }
                  />
                </div>
                {securityData.twoFactor && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-800 font-medium">2FA está habilitado</p>
                        <p className="text-sm text-blue-700">
                          Usa tu aplicación de autenticación para generar códigos de acceso.
                        </p>
                        <div className="flex space-x-2 mt-2">
                          <Button variant="outline" size="sm">Ver códigos de respaldo</Button>
                          <Button variant="outline" size="sm">Reconfigurar</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Login Alerts */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Alertas de inicio de sesión</h3>
                    <p className="text-sm text-gray-600">Recibe notificaciones cuando alguien acceda a tu cuenta</p>
                  </div>
                  <Switch
                    checked={securityData.loginAlerts}
                    onCheckedChange={(checked) => 
                      setSecurityData(prev => ({ ...prev, loginAlerts: checked }))
                    }
                  />
                </div>
              </div>

              {/* Session Timeout */}
              <div className="border-t pt-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Tiempo de inactividad antes de cerrar sesión</Label>
                  <Select 
                    value={securityData.sessionTimeout}
                    onValueChange={(value) => setSecurityData(prev => ({ ...prev, sessionTimeout: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="240">4 horas</SelectItem>
                      <SelectItem value="never">Nunca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Sesiones Activas</CardTitle>
              <CardDescription>Dispositivos que han accedido a tu cuenta recientemente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getDeviceIcon(session.deviceType)}
                      </div>
                      <div>
                        <p className="font-medium">{session.browser} en {session.os}</p>
                        <p className="text-sm text-gray-600">
                          {session.location} • IP: {session.ip}
                        </p>
                        <p className="text-sm text-gray-500">{session.lastActive}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {session.current && (
                        <Badge variant="secondary">Dispositivo actual</Badge>
                      )}
                      {!session.current && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSessionRevoke(session.id)}
                        >
                          Cerrar sesión
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Privacidad</CardTitle>
              <CardDescription>Controla cómo compartimos tu información</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Visibility */}
              <div className="space-y-2">
                <Label htmlFor="profileVisibility">Visibilidad del perfil</Label>
                <Select 
                  value={securityData.profileVisibility}
                  onValueChange={(value) => setSecurityData(prev => ({ ...prev, profileVisibility: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Público - Visible para todos</SelectItem>
                    <SelectItem value="students">Solo estudiantes de LearnPro</SelectItem>
                    <SelectItem value="private">Privado - Solo tú</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Course Progress */}
              <div className="space-y-2">
                <Label htmlFor="courseProgress">Mostrar progreso de cursos</Label>
                <Select 
                  value={securityData.courseProgress}
                  onValueChange={(value) => setSecurityData(prev => ({ ...prev, courseProgress: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">Habilitado</SelectItem>
                    <SelectItem value="disabled">Deshabilitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Data Collection */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Recopilación de datos</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Cookies esenciales</p>
                      <p className="text-sm text-gray-600">Necesarias para el funcionamiento del sitio</p>
                    </div>
                    <Switch checked={true} disabled />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Análisis y mejoras</p>
                      <p className="text-sm text-gray-600">Nos ayudan a mejorar la experiencia de usuario</p>
                    </div>
                    <Switch
                      checked={securityData.analytics}
                      onCheckedChange={(checked) => 
                        setSecurityData(prev => ({ ...prev, analytics: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing personalizado</p>
                      <p className="text-sm text-gray-600">Para personalizar anuncios y contenido</p>
                    </div>
                    <Switch
                      checked={securityData.marketing}
                      onCheckedChange={(checked) => 
                        setSecurityData(prev => ({ ...prev, marketing: checked }))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Datos</CardTitle>
              <CardDescription>Controla y administra tu información personal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Export Data */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Download className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Exportar mis datos</p>
                    <p className="text-sm text-gray-600">Descarga una copia de toda tu información</p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleDataExport}>
                  Solicitar exportación
                </Button>
              </div>

              {/* Delete Account */}
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Trash2 className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">Eliminar mi cuenta</p>
                    <p className="text-sm text-red-600">Eliminar permanentemente tu cuenta y todos los datos</p>
                  </div>
                </div>
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Eliminar cuenta</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span>Confirmar eliminación de cuenta</span>
                      </DialogTitle>
                      <DialogDescription>
                        Esta acción es irreversible. Se eliminarán permanentemente:
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Tu perfil y toda tu información personal</li>
                        <li>• Progreso de todos los cursos</li>
                        <li>• Certificados obtenidos</li>
                        <li>• Historial de pagos y suscripciones</li>
                        <li>• Todas las configuraciones y preferencias</li>
                      </ul>
                      <div className="p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Importante:</strong> Tu cuenta será desactivada inmediatamente y eliminada 
                          permanentemente en 30 días. Durante este período, puedes reactivarla contactando soporte.
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="destructive" onClick={handleAccountDeletion} className="flex-1">
                          Sí, eliminar mi cuenta
                        </Button>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
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

export default function PrivacySecurityPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <PrivacySecurityContent />
    </ProtectedRoute>
  )
}
