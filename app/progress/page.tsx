"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Clock, Trophy, Target, Play, CheckCircle, Circle, Star } from "lucide-react"
import Link from "next/link"

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState("in-progress")

  // Datos de ejemplo para cursos en progreso
  const coursesInProgress = [
    {
      id: 1,
      title: "Complete React Developer Course",
      instructor: "John Smith",
      thumbnail: "/courses/curso1.jpg",
      progress: 65,
      totalLessons: 156,
      completedLessons: 101,
      timeSpent: "28 horas",
      lastAccessed: "Hace 2 días",
      nextLesson: "React Hooks Avanzados",
      category: "Development"
    },
    {
      id: 2,
      title: "UI/UX Design Fundamentals",
      instructor: "Sarah Johnson",
      thumbnail: "/courses/curso3.jpg",
      progress: 40,
      totalLessons: 89,
      completedLessons: 36,
      timeSpent: "15 horas",
      lastAccessed: "Hace 1 semana",
      nextLesson: "Principios de Color",
      category: "Design"
    },
    {
      id: 3,
      title: "Data Science with Python",
      instructor: "Dr. Michael Chen",
      thumbnail: "/courses/curso4.jpg",
      progress: 85,
      totalLessons: 234,
      completedLessons: 199,
      timeSpent: "52 horas",
      lastAccessed: "Ayer",
      nextLesson: "Machine Learning Avanzado",
      category: "Data Science"
    }
  ]

  // Cursos completados
  const completedCourses = [
    {
      id: 4,
      title: "Digital Marketing Mastery",
      instructor: "Emma Wilson",
      thumbnail: "/courses/curso5.jpg",
      completedDate: "15 Dic 2024",
      totalTime: "35 horas",
      rating: 5,
      certificate: true,
      category: "Marketing"
    },
    {
      id: 5,
      title: "Business Strategy & Leadership",
      instructor: "Robert Davis",
      thumbnail: "/courses/curso6.jpg",
      completedDate: "28 Nov 2024",
      totalTime: "48 horas",
      rating: 4,
      certificate: true,
      category: "Business"
    }
  ]

  // Estadísticas generales
  const stats = {
    totalCoursesEnrolled: 8,
    coursesCompleted: 2,
    coursesInProgress: 3,
    totalHoursLearned: 178,
    certificatesEarned: 2,
    currentStreak: 12
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
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/courses" className="text-gray-600 hover:text-gray-900">
                Cursos
              </Link>
              <Link href="/progress" className="text-blue-600 font-medium">
                Progreso
              </Link>
              <Link href="/certificates" className="text-gray-600 hover:text-gray-900">
                Certificados
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Progreso</h1>
          <p className="text-gray-600">
            Sigue tu progreso de aprendizaje y mantén el impulso
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalCoursesEnrolled}</div>
              <div className="text-sm text-gray-600">Cursos Inscritos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.coursesCompleted}</div>
              <div className="text-sm text-gray-600">Completados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Play className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.coursesInProgress}</div>
              <div className="text-sm text-gray-600">En Progreso</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalHoursLearned}</div>
              <div className="text-sm text-gray-600">Horas Aprendidas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.certificatesEarned}</div>
              <div className="text-sm text-gray-600">Certificados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.currentStreak}</div>
              <div className="text-sm text-gray-600">Días Seguidos</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="in-progress">En Progreso</TabsTrigger>
            <TabsTrigger value="completed">Completados</TabsTrigger>
          </TabsList>

          {/* Cursos en Progreso */}
          <TabsContent value="in-progress" className="space-y-6">
            <div className="grid gap-6">
              {coursesInProgress.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full md:w-48 h-32 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary">{course.category}</Badge>
                            <span className="text-sm text-gray-500">{course.lastAccessed}</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{course.title}</h3>
                          <p className="text-gray-600">por {course.instructor}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progreso</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{course.completedLessons} de {course.totalLessons} lecciones</span>
                            <span>{course.timeSpent} completadas</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Siguiente lección:</p>
                            <p className="font-medium text-gray-900">{course.nextLesson}</p>
                          </div>
                          <Link href={`/courses/${course.id}`}>
                            <Button>
                              <Play className="h-4 w-4 mr-2" />
                              Continuar
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Cursos Completados */}
          <TabsContent value="completed" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {completedCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completado
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Badge variant="secondary" className="mb-2">{course.category}</Badge>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{course.title}</h3>
                        <p className="text-gray-600">por {course.instructor}</p>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.totalTime}
                        </div>
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < course.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Completado el {course.completedDate}
                        </span>
                        {course.certificate && (
                          <Link href="/certificates">
                            <Button variant="outline" size="sm">
                              <Trophy className="h-4 w-4 mr-2" />
                              Ver Certificado
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
