"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Download, Share2, Search, Trophy, Calendar, User, Award, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function CertificatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { value: "all", label: "Todas las Categorías" },
    { value: "development", label: "Desarrollo" },
    { value: "design", label: "Diseño" },
    { value: "business", label: "Negocios" },
    { value: "data-science", label: "Ciencia de Datos" },
    { value: "marketing", label: "Marketing" },
  ]

  // Certificados obtenidos
  const certificates = [
    {
      id: 1,
      courseTitle: "Digital Marketing Mastery",
      instructor: "Emma Wilson",
      category: "Marketing",
      completedDate: "15 Dic 2024",
      issueDate: "16 Dic 2024",
      certificateId: "LPR-2024-DM-001",
      duration: "35 horas",
      skills: ["SEO", "Social Media Marketing", "Google Analytics", "Email Marketing"],
      grade: "A+",
      thumbnail: "/courses/curso5.jpg",
      verified: true
    },
    {
      id: 2,
      courseTitle: "Business Strategy & Leadership",
      instructor: "Robert Davis",
      category: "Business",
      completedDate: "28 Nov 2024",
      issueDate: "29 Nov 2024",
      certificateId: "LPR-2024-BS-002",
      duration: "48 horas",
      skills: ["Strategic Planning", "Team Leadership", "Decision Making", "Project Management"],
      grade: "A",
      thumbnail: "/courses/curso6.jpg",
      verified: true
    },
    {
      id: 3,
      courseTitle: "Advanced JavaScript Concepts",
      instructor: "Alex Thompson",
      category: "Development",
      completedDate: "10 Oct 2024",
      issueDate: "11 Oct 2024",
      certificateId: "LPR-2024-JS-003",
      duration: "38 horas",
      skills: ["ES6+", "Async Programming", "Performance Optimization", "Design Patterns"],
      grade: "A+",
      thumbnail: "/courses/curso7.webp",
      verified: true
    }
  ]

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory =
      selectedCategory === "all" || cert.category.toLowerCase().replace(/\s+/g, "-") === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleDownload = (certificateId: string) => {
    // Simular descarga de certificado
    console.log(`Descargando certificado: ${certificateId}`)
  }

  const handleShare = (certificateId: string) => {
    // Simular compartir certificado
    const shareUrl = `https://learnpro.com/certificates/${certificateId}`
    navigator.clipboard.writeText(shareUrl)
    alert("Enlace del certificado copiado al portapapeles")
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
              <Link href="/progress" className="text-gray-600 hover:text-gray-900">
                Progreso
              </Link>
              <Link href="/certificates" className="text-blue-600 font-medium">
                Certificados
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Certificados</h1>
          <p className="text-gray-600">
            Tus logros y certificaciones obtenidas en LearnPro
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{certificates.length}</div>
              <div className="text-sm text-gray-600">Certificados Obtenidos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{certificates.filter(c => c.verified).length}</div>
              <div className="text-sm text-gray-600">Verificados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">2024</div>
              <div className="text-sm text-gray-600">Año Más Activo</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <User className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">A+</div>
              <div className="text-sm text-gray-600">Calificación Promedio</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar certificados por curso, instructor o habilidad..."
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
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {filteredCertificates.length} de {certificates.length} certificados
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((certificate) => (
            <Card key={certificate.id} className="group hover:shadow-lg transition-all duration-200">
              <div className="relative overflow-hidden">
                <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Trophy className="h-8 w-8" />
                    {certificate.verified && (
                      <Badge className="bg-green-500">
                        Verificado
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{certificate.courseTitle}</h3>
                  <p className="text-blue-100 text-sm">por {certificate.instructor}</p>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary">{certificate.category}</Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Completado</p>
                      <p className="font-medium">{certificate.completedDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Duración</p>
                      <p className="font-medium">{certificate.duration}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Calificación</p>
                      <p className="font-medium text-green-600">{certificate.grade}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">ID Certificado</p>
                      <p className="font-medium text-xs">{certificate.certificateId}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm mb-2">Habilidades Adquiridas</p>
                    <div className="flex flex-wrap gap-1">
                      {certificate.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDownload(certificate.certificateId)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleShare(certificate.certificateId)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredCertificates.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron certificados</h3>
              <p className="text-gray-600 mb-4">
                Intenta ajustar tus filtros de búsqueda o completa más cursos para obtener certificados.
              </p>
              <Link href="/courses">
                <Button>
                  Explorar Cursos
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Certificate Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Sobre los Certificados de LearnPro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Verificación</h4>
                <p className="text-gray-600 text-sm">
                  Todos nuestros certificados son verificables y pueden ser compartidos con empleadores 
                  o en redes profesionales como LinkedIn.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Validez</h4>
                <p className="text-gray-600 text-sm">
                  Los certificados de LearnPro no tienen fecha de vencimiento y son reconocidos 
                  por empresas líderes en la industria.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
