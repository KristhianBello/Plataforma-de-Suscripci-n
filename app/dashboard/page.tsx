"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Clock, Award, TrendingUp, Play, Bell, Settings, Search, Filter, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"
import { ProtectedRoute } from "@/components/protected-route"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

function DashboardContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const { user, signOut } = useAuth()

  // Estado para el plan de suscripción actual
  const [currentPlan, setCurrentPlan] = useState("free") // Plan básico por defecto hasta que el usuario se suscriba

  // Cargar el plan del usuario desde la base de datos
  useEffect(() => {
    // En una implementación real, esto cargaría el plan desde Supabase
    // Por ejemplo: si el usuario tiene subscription_plan en su metadata
    if (user?.user_metadata?.subscription_plan) {
      setCurrentPlan(user.user_metadata.subscription_plan)
    }
    // También podrías hacer una consulta a tu tabla de suscripciones:
    // const { data: subscription } = await supabase
    //   .from('subscriptions')
    //   .select('plan_type')
    //   .eq('user_id', user.id)
    //   .single()
    // if (subscription) setCurrentPlan(subscription.plan_type)
  }, [user])

  // Configuración de planes
  const planConfig = {
    free: {
      name: "Plan Básico",
      displayName: "Básico",
      description: "Acceso limitado a cursos básicos",
      color: "bg-gray-100 text-gray-600",
      features: ["10 cursos gratuitos", "Progreso básico", "Soporte comunitario"]
    },
    monthly: {
      name: "Plan Mensual Pro",
      displayName: "Pro Mensual",
      description: "Acceso completo con facturación mensual",
      color: "bg-blue-100 text-blue-600",
      features: ["Todos los cursos", "Certificados", "Soporte prioritario"]
    },
    premium: {
      name: "Plan Premium",
      displayName: "Premium",
      description: "Acceso completo a todos los cursos",
      color: "bg-purple-100 text-purple-600",
      features: ["Acceso ilimitado", "Certificados premium", "Soporte 24/7", "Contenido exclusivo"]
    },
    annual: {
      name: "Plan Anual Pro",
      displayName: "Pro Anual",
      description: "Mejor valor con facturación anual",
      color: "bg-gold-100 text-gold-600",
      features: ["Todos los cursos", "Descuento anual", "Acceso anticipado", "Webinars exclusivos"]
    }
  }

  const currentPlanInfo = planConfig[currentPlan as keyof typeof planConfig] || planConfig.free

  // Estado para las notificaciones
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Nuevo curso disponible",
      message: "El curso 'Advanced TypeScript' ya está disponible",
      time: "Hace 5 minutos",
      read: false,
      type: "course"
    },
    {
      id: 2,
      title: "Lección completada",
      message: "Has completado 'React Hooks Avanzados'",
      time: "Hace 1 hora",
      read: false,
      type: "achievement"
    },
    {
      id: 3,
      title: "Recordatorio de sesión",
      message: "Tu próxima clase comienza en 30 minutos",
      time: "Hace 2 horas",
      read: true,
      type: "reminder"
    },
    {
      id: 4,
      title: "Certificado generado",
      message: "Tu certificado de 'UI/UX Design' está listo para descargar",
      time: "Hace 1 día",
      read: false,
      type: "certificate"
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const recentCourses = [
    {
      id: 1,
      title: "React Advanced Patterns",
      progress: 75,
      totalLessons: 24,
      completedLessons: 18,
      thumbnail: "/images/react-curso.jpg",
      category: "Development",
    },
    {
      id: 2,
      title: "UI/UX Design Fundamentals",
      progress: 45,
      totalLessons: 32,
      completedLessons: 14,
      thumbnail: "/images/ui-ux-design-curso.jpg",
      category: "Design",
    },
    {
      id: 3,
      title: "Data Science with Python",
      progress: 20,
      totalLessons: 40,
      completedLessons: 8,
      thumbnail: "/images/data_science_using_python-imagen.jpg",
      category: "Data Science",
    },
  ]

  const upcomingLessons = [
    {
      id: 1,
      title: "Advanced React Hooks",
      course: "React Advanced Patterns",
      time: "2:00 PM",
      duration: "45 min",
    },
    {
      id: 2,
      title: "Color Theory in Design",
      course: "UI/UX Design Fundamentals",
      time: "4:30 PM",
      duration: "30 min",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">LearnPro</span>
              </Link>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar cursos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end" forceMount>
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold">Notificaciones</h3>
                    {unreadCount > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={markAllAsRead}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Marcar todas como leídas
                      </Button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No tienes notificaciones
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              !notification.read ? 'bg-blue-600' : 'bg-gray-300'
                            }`} />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-sm text-gray-600">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-2 border-t">
                      <Button variant="ghost" className="w-full text-sm">
                        Ver todas las notificaciones
                      </Button>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/settings">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/images/avatar-imagen.webp" alt="Avatar" />
                      <AvatarFallback>CD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">
                      {user?.user_metadata?.full_name || 'Usuario'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/images/avatar-imagen.webp" alt="Carlos Delgado" />
                    <AvatarFallback>CD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {user?.user_metadata?.full_name || 
                       `${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim() ||
                       user?.email?.split('@')[0] || 
                       'Usuario'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {currentPlan === "free" ? "Miembro Básico" : 
                       currentPlan === "monthly" ? "Miembro Pro" :
                       currentPlan === "annual" ? "Miembro Pro Anual" :
                       "Miembro Premium"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cursos Completados</span>
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Horas Estudiadas</span>
                    <Badge variant="secondary">156h</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Certificados</span>
                    <Badge variant="secondary">8</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Horario de Hoy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingLessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{lesson.title}</p>
                        <p className="text-xs text-gray-600">{lesson.course}</p>
                        <p className="text-xs text-blue-600">
                          {lesson.time} • {lesson.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Mi Suscripción</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mb-2 ${currentPlanInfo.color}`}>
                      {currentPlanInfo.displayName}
                    </div>
                    <p className="text-sm text-gray-600">{currentPlanInfo.description}</p>
                  </div>
                  
                  {/* Características del plan */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Incluye:</h4>
                    <div className="space-y-1">
                      {currentPlanInfo.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Estado del plan */}
                  {currentPlan === "free" && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-700 font-medium">
                        ¡Suscríbete para acceder a todos los cursos!
                      </p>
                    </div>
                  )}

                  <Link href="/subscription">
                    <Button variant="outline" className="w-full">
                      {currentPlan === "free" ? "Suscribirse Ahora" : "Gestionar Suscripción"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cursos Activos</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">+2 desde el mes pasado</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Racha de Aprendizaje</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12 días</div>
                  <p className="text-xs text-muted-foreground">¡Sigue así!</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Certificates</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">+3 este mes</p>
                </CardContent>
              </Card>
            </div>

            {/* Continue Learning */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Mis Cursos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentCourses.map((course) => (
                    <Card key={course.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <div className="aspect-video bg-gray-100 rounded-t-lg relative overflow-hidden">
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button size="sm" className="rounded-full">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <Badge variant="secondary" className="mb-2 text-xs">
                          {course.category}
                        </Badge>
                        <h3 className="font-semibold mb-2">{course.title}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>
                              {course.completedLessons}/{course.totalLessons} lecciones
                            </span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Courses */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recomendado para Ti</CardTitle>
                    <CardDescription>Basado en tu historial de aprendizaje y preferencias</CardDescription>
                  </div>
                  <Link href="/courses">
                    <Button variant="outline" size="sm">
                      Ver más
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
                      <div className="aspect-video bg-gray-100 rounded-t-lg relative">
                        <Image
                          src={
                            i === 1 ? "/images/js-avanzado-imagen.jpeg" : 
                            i === 2 ? "/images/js-avanzado-2-imagen.jpg" : 
                            "/images/js-avanzado-3.jpg"
                          }
                          alt={`Curso de JavaScript Avanzado ${i}`}
                          fill
                          className="object-cover rounded-t-lg"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <CardContent className="p-4">
                        <Badge variant="outline" className="mb-2 text-xs">
                          Nuevo
                        </Badge>
                        <h3 className="font-semibold mb-2">Conceptos Avanzados de JavaScript</h3>
                        <p className="text-sm text-gray-600 mb-3">Domina patrones y técnicas avanzadas de JavaScript</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">24 lecciones</span>
                          <Button size="sm">Inscribirse</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <DashboardContent />
    </ProtectedRoute>
  )
}
