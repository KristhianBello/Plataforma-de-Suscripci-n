"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Clock, Award, TrendingUp, Play, Bell, Settings, Search, Filter, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
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

  const recentCourses = [
    {
      id: 1,
      title: "React Advanced Patterns",
      progress: 75,
      totalLessons: 24,
      completedLessons: 18,
      thumbnail: "/placeholder.svg?height=100&width=150",
      category: "Development",
    },
    {
      id: 2,
      title: "UI/UX Design Fundamentals",
      progress: 45,
      totalLessons: 32,
      completedLessons: 14,
      thumbnail: "/placeholder.svg?height=100&width=150",
      category: "Design",
    },
    {
      id: 3,
      title: "Data Science with Python",
      progress: 20,
      totalLessons: 40,
      completedLessons: 8,
      thumbnail: "/placeholder.svg?height=100&width=150",
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
              <Link href="/" className="flex items-center space-x-2">
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
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                      <AvatarFallback>
                        {user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                        {user?.user_metadata?.last_name?.[0] || ''}
                      </AvatarFallback>
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
                    <AvatarImage src="/placeholder.svg?height=48&width=48" />
                    <AvatarFallback>
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
                    <p className="text-sm text-gray-600">Premium Member</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Courses Completed</span>
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Hours Learned</span>
                    <Badge variant="secondary">156h</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Certificates</span>
                    <Badge variant="secondary">8</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Today's Schedule</CardTitle>
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
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12 days</div>
                  <p className="text-xs text-muted-foreground">Keep it up!</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Certificates</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">+3 this month</p>
                </CardContent>
              </Card>
            </div>

            {/* Continue Learning */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Continue Learning</CardTitle>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentCourses.map((course) => (
                    <Card key={course.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <div className="aspect-video bg-gray-100 rounded-t-lg relative overflow-hidden">
                        <img
                          src={course.thumbnail || "/placeholder.svg"}
                          alt={course.title}
                          className="w-full h-full object-cover"
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
                              {course.completedLessons}/{course.totalLessons} lessons
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
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>Based on your learning history and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
                      <div className="aspect-video bg-gray-100 rounded-t-lg">
                        <img
                          src={`/placeholder.svg?height=120&width=200&query=recommended course ${i}`}
                          alt={`Recommended Course ${i}`}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      </div>
                      <CardContent className="p-4">
                        <Badge variant="outline" className="mb-2 text-xs">
                          New
                        </Badge>
                        <h3 className="font-semibold mb-2">Advanced JavaScript Concepts</h3>
                        <p className="text-sm text-gray-600 mb-3">Master advanced JavaScript patterns and techniques</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">24 lessons</span>
                          <Button size="sm">Enroll</Button>
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
