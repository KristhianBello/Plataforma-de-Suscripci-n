import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Award, TrendingUp, Check, Star, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">LearnPro</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4" variant="secondary">
            🚀 New: AI-Powered Learning Paths
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Master New Skills with
            <span className="text-blue-600 block">LearnPro</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Access thousands of courses, track your progress, and learn at your own pace with our personalized learning
            platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Learning Today
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
          <div className="mt-12">
            <Image
              src="/placeholder.svg?height=400&width=800"
              alt="LearnPro Dashboard"
              width={800}
              height={400}
              className="rounded-lg shadow-2xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Completion Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">4.9</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Learn</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools and features you need for effective online learning.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Extensive Course Library</CardTitle>
                <CardDescription>
                  Access thousands of courses across multiple disciplines and skill levels.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  Monitor your learning journey with detailed analytics and progress reports.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Award className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Certificates</CardTitle>
                <CardDescription>
                  Earn verified certificates upon course completion to showcase your skills.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Users className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Community Learning</CardTitle>
                <CardDescription>
                  Connect with fellow learners and instructors in our vibrant community.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Star className="h-12 w-12 text-yellow-600 mb-4" />
                <CardTitle>Personalized Experience</CardTitle>
                <CardDescription>AI-powered recommendations tailored to your learning style and goals.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Play className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Interactive Content</CardTitle>
                <CardDescription>Engage with interactive videos, quizzes, and hands-on projects.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Learning Plan</h2>
            <p className="text-xl text-gray-600">Flexible pricing options to fit your learning needs and budget.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Monthly Plan</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-4">
                  $29<span className="text-lg text-gray-600">/month</span>
                </div>
                <CardDescription>Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    Access to all courses
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    Progress tracking
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    Community access
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    Mobile app access
                  </li>
                </ul>
                <Button className="w-full mt-6">Get Started</Button>
              </CardContent>
            </Card>
            <Card className="border-2 border-blue-600 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">Most Popular</Badge>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Annual Plan</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-4">
                  $290<span className="text-lg text-gray-600">/year</span>
                </div>
                <CardDescription>Save 17% with annual billing</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    Everything in Monthly
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    Offline downloads
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    Advanced analytics
                  </li>
                </ul>
                <Button className="w-full mt-6">Get Started</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6" />
                <span className="text-xl font-bold">LearnPro</span>
              </div>
              <p className="text-gray-400">
                Empowering learners worldwide with quality education and personalized learning experiences.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Features
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LearnPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
