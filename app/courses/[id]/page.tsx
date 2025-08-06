"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Play, Clock, Users, Star, Download, Share2, Heart, CheckCircle, Lock, FileText, Video, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [currentProgress, setCurrentProgress] = useState(0)

  const handleEnrollClick = () => {
    if (!user) {
      toast.error("Debes iniciar sesión para comprar este curso")
      return
    }
    
    // Redirigir a la página de checkout con el ID del curso
    router.push(`/checkout?course=${params.id}`)
  }

  // Mock course data - in real app, fetch based on params.id
  const course = {
    id: 1,
    title: "Complete React Developer Course",
    instructor: {
      name: "John Smith",
      avatar: "/placeholder.svg?height=64&width=64",
      bio: "Senior Frontend Developer with 8+ years of experience",
      rating: 4.9,
      students: 25000,
    },
    description:
      "Master React from basics to advanced concepts with hands-on projects. This comprehensive course covers everything you need to know to become a proficient React developer.",
    thumbnail: "/courses/curso111.jpg",
    category: "Development",
    level: "Intermediate",
    rating: 4.8,
    reviews: 1234,
    students: 12543,
    duration: "42 hours",
    lessons: 156,
    lastUpdated: "January 2024",
    language: "English",
    price: 49.99, // Precio individual del curso
    originalPrice: 79.99, // Precio original para mostrar descuento
    tags: ["React", "JavaScript", "Frontend", "Hooks", "Redux"],
    whatYouWillLearn: [
      "Build modern React applications from scratch",
      "Master React Hooks and Context API",
      "Implement state management with Redux",
      "Create responsive and interactive UIs",
      "Deploy React applications to production",
      "Write clean and maintainable code",
    ],
    requirements: [
      "Basic knowledge of HTML, CSS, and JavaScript",
      "Familiarity with ES6+ features",
      "A computer with internet connection",
      "Code editor (VS Code recommended)",
    ],
  }

  const curriculum = [
    {
      id: 1,
      title: "Getting Started with React",
      lessons: 12,
      duration: "2h 30m",
      isCompleted: true,
      lessons_detail: [
        { id: 1, title: "Introduction to React", duration: "15m", type: "video", isCompleted: true, isLocked: false },
        {
          id: 2,
          title: "Setting up Development Environment",
          duration: "20m",
          type: "video",
          isCompleted: true,
          isLocked: false,
        },
        {
          id: 3,
          title: "Your First React Component",
          duration: "18m",
          type: "video",
          isCompleted: true,
          isLocked: false,
        },
        { id: 4, title: "JSX Fundamentals", duration: "25m", type: "video", isCompleted: false, isLocked: false },
      ],
    },
    {
      id: 2,
      title: "React Components Deep Dive",
      lessons: 18,
      duration: "4h 15m",
      isCompleted: false,
      lessons_detail: [
        {
          id: 5,
          title: "Functional vs Class Components",
          duration: "22m",
          type: "video",
          isCompleted: false,
          isLocked: false,
        },
        {
          id: 6,
          title: "Props and State Management",
          duration: "30m",
          type: "video",
          isCompleted: false,
          isLocked: false,
        },
        { id: 7, title: "Event Handling", duration: "18m", type: "video", isCompleted: false, isLocked: true },
        { id: 8, title: "Component Lifecycle", duration: "35m", type: "video", isCompleted: false, isLocked: true },
      ],
    },
    {
      id: 3,
      title: "React Hooks Mastery",
      lessons: 15,
      duration: "3h 45m",
      isCompleted: false,
      lessons_detail: [
        { id: 9, title: "useState Hook", duration: "25m", type: "video", isCompleted: false, isLocked: true },
        { id: 10, title: "useEffect Hook", duration: "30m", type: "video", isCompleted: false, isLocked: true },
        { id: 11, title: "Custom Hooks", duration: "28m", type: "video", isCompleted: false, isLocked: true },
      ],
    },
  ]

  const reviews = [
    {
      id: 1,
      user: "Alice Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2 weeks ago",
      comment: "Excellent course! John explains everything clearly and the projects are very practical.",
    },
    {
      id: 2,
      user: "Bob Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      date: "1 month ago",
      comment: "Great content and well-structured. Helped me land my first React job!",
    },
    {
      id: 3,
      user: "Carol Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2 months ago",
      comment: "The best React course I've taken. Comprehensive and up-to-date with latest practices.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/courses" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">LearnPro</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/courses" className="text-gray-600 hover:text-gray-900">
                Courses
              </Link>
              <Link href="/progress" className="text-gray-600 hover:text-gray-900">
                Progress
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Hero */}
            <Card className="mb-8">
              <div className="relative">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button size="lg" className="rounded-full">
                    <Play className="h-6 w-6 mr-2" />
                    Preview Course
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
                <p className="text-gray-600 mb-6">{course.description}</p>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      {course.rating} ({course.reviews} reviews)
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students.toLocaleString()} students
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {isEnrolled && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Course Progress</span>
                      <span className="text-sm text-gray-600">{currentProgress}% Complete</span>
                    </div>
                    <Progress value={currentProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Content Tabs */}
            <Tabs defaultValue="curriculum" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="curriculum" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Curriculum</CardTitle>
                    <CardDescription>
                      {course.lessons} lessons • {course.duration} total length
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {curriculum.map((section) => (
                        <div key={section.id} className="border rounded-lg">
                          <div className="p-4 bg-gray-50 border-b">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">{section.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>{section.lessons} lessons</span>
                                <span>{section.duration}</span>
                                {section.isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="space-y-2">
                              {section.lessons_detail.map((lesson) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                                >
                                  <div className="flex items-center space-x-3">
                                    {lesson.isLocked ? (
                                      <Lock className="h-4 w-4 text-gray-400" />
                                    ) : lesson.type === "video" ? (
                                      <Video className="h-4 w-4 text-blue-600" />
                                    ) : (
                                      <FileText className="h-4 w-4 text-gray-600" />
                                    )}
                                    <span className={`text-sm ${lesson.isLocked ? "text-gray-400" : ""}`}>
                                      {lesson.title}
                                    </span>
                                    {lesson.isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
                                  </div>
                                  <span className="text-sm text-gray-600">{lesson.duration}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What you'll learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {course.whatYouWillLearn.map((item, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {course.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Course Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Level:</span> {course.level}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {course.duration}
                      </div>
                      <div>
                        <span className="font-medium">Language:</span> {course.language}
                      </div>
                      <div>
                        <span className="font-medium">Last Updated:</span> {course.lastUpdated}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Meet Your Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={course.instructor.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {course.instructor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{course.instructor.name}</h3>
                        <p className="text-gray-600 mb-3">{course.instructor.bio}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            {course.instructor.rating} instructor rating
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {course.instructor.students.toLocaleString()} students
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Reviews</CardTitle>
                    <CardDescription>
                      {course.rating} average rating • {course.reviews} reviews
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-b-0">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage src={review.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {review.user
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{review.user}</h4>
                                <span className="text-sm text-gray-600">{review.date}</span>
                              </div>
                              <div className="flex items-center mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    ${course.price}
                  </div>
                  {course.originalPrice && (
                    <div className="text-lg text-gray-500 line-through mb-2">
                      ${course.originalPrice}
                    </div>
                  )}
                  <p className="text-sm text-gray-600">Acceso de por vida</p>
                  {course.originalPrice && (
                    <Badge variant="destructive" className="mt-2">
                      {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>

                {!isEnrolled ? (
                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={handleEnrollClick}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Comprar Curso
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      size="lg"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Vista Previa Gratis
                    </Button>
                    <div className="text-center">
                      <Link 
                        href="/subscription" 
                        className="text-sm text-blue-600 hover:underline"
                      >
                        O suscríbete para acceso a todos los cursos
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Button className="w-full mb-4" size="lg">
                    Continuar Aprendiendo
                  </Button>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Lessons</span>
                    <span className="font-medium">{course.lessons}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Level</span>
                    <span className="font-medium">{course.level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Language</span>
                    <span className="font-medium">{course.language}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3">This course includes:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Video className="h-4 w-4 text-gray-600" />
                      <span>{course.duration} on-demand video</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Download className="h-4 w-4 text-gray-600" />
                      <span>Downloadable resources</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
