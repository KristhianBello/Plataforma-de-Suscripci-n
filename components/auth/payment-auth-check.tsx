"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/hooks/use-auth'
import { Lock, User, Mail, AlertCircle, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface PaymentAuthCheckProps {
  isOpen: boolean
  onClose: () => void
  onAuthSuccess: () => void
  planName: string
  amount: number
  planType: 'mensual' | 'anual'
}

export function PaymentAuthCheck({
  isOpen,
  onClose,
  onAuthSuccess,
  planName,
  amount,
  planType
}: PaymentAuthCheckProps) {
  const { user, signIn, signUp } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Si el usuario ya está autenticado, proceder directamente
  if (user && isOpen) {
    onAuthSuccess()
    return null
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    if (isSignUp) {
      if (!formData.firstName) {
        newErrors.firstName = 'El nombre es requerido'
      }
      if (!formData.lastName) {
        newErrors.lastName = 'El apellido es requerido'
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      let success = false

      if (isSignUp) {
        success = await signUp(
          formData.email, 
          formData.password,
          {
            first_name: formData.firstName,
            last_name: formData.lastName
          }
        )
      } else {
        success = await signIn(formData.email, formData.password)
      }

      if (success) {
        onAuthSuccess()
      }
    } catch (error) {
      toast.error('Error en la autenticación')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </DialogTitle>
          <DialogDescription>
            {isSignUp 
              ? 'Crea tu cuenta para proceder con la suscripción'
              : 'Inicia sesión para continuar con tu suscripción'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumen del plan */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Resumen de suscripción</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium">{planName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tipo:</span>
                <span className="font-medium capitalize">{planType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Precio:</span>
                <span className="font-medium">${amount}/{planType === 'mensual' ? 'mes' : 'año'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Formulario de autenticación */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {isSignUp && (
              <div>
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                'Procesando...'
              ) : (
                isSignUp ? 'Crear cuenta y continuar' : 'Iniciar sesión y continuar'
              )}
            </Button>
          </form>

          {/* Toggle entre login y registro */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
              <Button
                variant="link"
                className="p-0 ml-1 h-auto font-normal"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setErrors({})
                  setFormData({
                    email: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                    confirmPassword: ''
                  })
                }}
              >
                {isSignUp ? 'Inicia sesión' : 'Créate una cuenta'}
              </Button>
            </p>
          </div>

          {/* Información de seguridad */}
          <Alert>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm">
              Tu información está protegida con encriptación SSL de 256 bits.
              Nunca almacenamos datos de tarjetas de crédito.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  )
}
