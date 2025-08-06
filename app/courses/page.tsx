"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Search, Star, Clock, Users, Play, Heart } from "lucide-react"
import Link from "next/link"

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")

  const categories = [
    { value: "all", label: "Todas las Categorías" },
    { value: "development", label: "Desarrollo" },
    { value: "design", label: "Diseño" },
    { value: "business", label: "Negocios" },
    { value: "data-science", label: "Ciencia de Datos" },
    { value: "marketing", label: "Marketing" },
  ]

  const levels = [
    { value: "all", label: "Todos los Niveles" },
    { value: "beginner", label: "Principiante" },
    { value: "intermediate", label: "Intermedio" },
    { value: "advanced", label: "Avanzado" },
  ]

  const courses = [
    {
      id: 1,
      title: "Complete React Developer Course",
      instructor: "John Smith",
      description: "Master React from basics to advanced concepts with hands-on projects",
      thumbnail: "/courses/curso1.jpg",
      category: "Development",
      level: "Intermediate",
      rating: 4.8,
      students: 12543,
      duration: "42 hours",
      lessons: 156,
      price: "Free with subscription",
      tags: ["React", "JavaScript", "Frontend"],
    },
    {
      id: 2,
      title: "UI/UX Design Fundamentals",
      instructor: "Sarah Johnson",
      description: "Learn the principles of user interface and user experience design",
      thumbnail: "/courses/curso3.jpg",
      category: "Design",
      level: "Beginner",
      rating: 4.6,
      students: 8932,
      duration: "28 hours",
      lessons: 89,
      price: "Free with subscription",
      tags: ["UI/UX", "Design", "Figma"],
    },
    {
      id: 3,
      title: "Data Science with Python",
      instructor: "Dr. Michael Chen",
      description: "Comprehensive data science course covering Python, pandas, and machine learning",
      thumbnail: "/courses/curso4.jpg",
      category: "Data Science",
      level: "Advanced",
      rating: 4.9,
      students: 15678,
      duration: "65 hours",
      lessons: 234,
      price: "Free with subscription",
      tags: ["Python", "Data Science", "Machine Learning"],
    },
    {
      id: 4,
      title: "Digital Marketing Mastery",
      instructor: "Emma Wilson",
      description: "Complete guide to digital marketing including SEO, social media, and analytics",
      thumbnail: "/courses/curso5.jpg",
      category: "Marketing",
      level: "Intermediate",
      rating: 4.7,
      students: 9876,
      duration: "35 hours",
      lessons: 128,
      price: "Free with subscription",
      tags: ["Marketing", "SEO", "Social Media"],
    },
    {
      id: 5,
      title: "Business Strategy & Leadership",
      instructor: "Robert Davis",
      description: "Develop strategic thinking and leadership skills for business success",
      thumbnail: "/courses/curso6.jpg",
      category: "Business",
      level: "Advanced",
      rating: 4.5,
      students: 6543,
      duration: "48 hours",
      lessons: 167,
      price: "Free with subscription",
      tags: ["Business", "Strategy", "Leadership"],
    },
    {
      id: 6,
      title: "Advanced JavaScript Concepts",
      instructor: "Alex Thompson",
      description: "Deep dive into advanced JavaScript patterns, async programming, and performance",
      thumbnail: "/courses/curso7.webp",
      category: "Development",
      level: "Advanced",
      rating: 4.8,
      students: 11234,
      duration: "38 hours",
      lessons: 142,
      price: "Free with subscription",
      tags: ["JavaScript", "Advanced", "Performance"],
    },
  ]

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || course.category.toLowerCase().replace(/\s+/g, "-") === selectedCategory
    const matchesLevel = selectedLevel === "all" || course.level.toLowerCase() === selectedLevel

    return matchesSearch && matchesCategory && matchesLevel
  })

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
              <Link href="/courses" className="text-blue-600 font-medium">
                Cursos
              </Link>
              <Link href="/progress" className="text-gray-600 hover:text-gray-900">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explorar Cursos</h1>
          <p className="text-gray-600">
            Descubre nuevas habilidades y avanza en tu carrera con nuestra biblioteca completa de cursos
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar cursos, instructores o temas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Nivel" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {filteredCourses.length} de {courses.length} cursos
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="group cursor-pointer hover:shadow-lg transition-all duration-200">
              <div className="relative overflow-hidden">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="sm" className="rounded-full">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-4 right-4">
                  <Button variant="ghost" size="sm" className="rounded-full bg-white/80 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="mb-3">
                  <Badge variant="secondary" className="mb-2">
                    {course.category}
                  </Badge>
                  <Badge variant="outline" className="ml-2">
                    {course.level}
                  </Badge>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                <p className="text-sm text-gray-500 mb-4">por {course.instructor}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      {course.rating}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {course.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-green-600">{course.price}</span>
                  <Link href={`/courses/${course.id}`}>
                    <Button>Comenzar a Aprender</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron cursos</h3>
              <p className="text-gray-600 mb-4">Prueba ajustando tus criterios de búsqueda o navega todos los cursos</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setSelectedLevel("all")
                }}
              >
                Limpiar Filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
