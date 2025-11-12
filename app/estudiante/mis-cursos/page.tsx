"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Clock,
  Award,
  Search,
  Filter,
  Grid3x3,
  List,
  Star,
  Play,
  Download,
  Bell,
  User,
  LogOut,
  Home,
  TrendingUp,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function MisCursos() {
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const allCourses = [
    {
      id: "1",
      title: "Desarrollo Web Full Stack",
      instructor: "Dr. Carlos Ruiz",
      category: "Tecnología",
      progress: 75,
      image: "💻",
      status: "active",
      totalLessons: 48,
      completedLessons: 36,
      duration: "12 semanas",
      nextLesson: "React Hooks Avanzados",
      rating: 4.8,
      enrolled: "3,245 estudiantes",
    },
    {
      id: "2",
      title: "Machine Learning con Python",
      instructor: "Dra. Ana Martínez",
      category: "Data Science",
      progress: 45,
      image: "🤖",
      status: "active",
      totalLessons: 60,
      completedLessons: 27,
      duration: "16 semanas",
      nextLesson: "Redes Neuronales Básicas",
      rating: 4.9,
      enrolled: "2,890 estudiantes",
    },
    {
      id: "3",
      title: "Diseño UX/UI Profesional",
      instructor: "Prof. Luis Gómez",
      category: "Diseño",
      progress: 20,
      image: "🎨",
      status: "active",
      totalLessons: 36,
      completedLessons: 7,
      duration: "10 semanas",
      nextLesson: "Principios de Diseño Visual",
      rating: 4.7,
      enrolled: "4,120 estudiantes",
    },
    {
      id: "4",
      title: "Marketing Digital Avanzado",
      instructor: "Mtra. Sofia Torres",
      category: "Marketing",
      progress: 100,
      image: "📱",
      status: "completed",
      totalLessons: 40,
      completedLessons: 40,
      duration: "8 semanas",
      nextLesson: "Curso Completado",
      rating: 5.0,
      enrolled: "5,670 estudiantes",
    },
    {
      id: "5",
      title: "Excel para Análisis de Datos",
      instructor: "Ing. Roberto Silva",
      category: "Negocios",
      progress: 100,
      image: "📊",
      status: "completed",
      totalLessons: 32,
      completedLessons: 32,
      duration: "6 semanas",
      nextLesson: "Curso Completado",
      rating: 4.6,
      enrolled: "6,890 estudiantes",
    },
  ]

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = 
      filterStatus === "all" ||
      (filterStatus === "active" && course.status === "active") ||
      (filterStatus === "completed" && course.status === "completed")

    return matchesSearch && matchesFilter
  })

  const stats = {
    active: allCourses.filter(c => c.status === "active").length,
    completed: allCourses.filter(c => c.status === "completed").length,
    totalHours: 124,
    avgProgress: Math.round(allCourses.reduce((acc, c) => acc + c.progress, 0) / allCourses.length),
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar del Estudiante */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-black">
              UNIVERSIA
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/estudiante/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition">
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link href="/estudiante/mis-cursos" className="flex items-center gap-2 text-purple-600 font-bold">
                <BookOpen className="w-4 h-4" />
                Mis Cursos
              </Link>
              <Link href="/estudiante/progreso" className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition">
                <TrendingUp className="w-4 h-4" />
                Progreso
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="font-bold text-sm">{user.name}</p>
                  <p className="text-xs text-slate-500">Estudiante</p>
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="icon"
                  className="border-slate-200"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black mb-2">Mis Cursos 📚</h1>
          <p className="text-slate-600">Gestiona y continúa tu aprendizaje</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 border-2 border-slate-200 hover:border-purple-600 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.active}</p>
                  <p className="text-sm text-slate-600">Cursos Activos</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 border-2 border-slate-200 hover:border-purple-600 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.completed}</p>
                  <p className="text-sm text-slate-600">Completados</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 border-2 border-slate-200 hover:border-purple-600 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.totalHours}h</p>
                  <p className="text-sm text-slate-600">Horas Totales</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 border-2 border-slate-200 hover:border-purple-600 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.avgProgress}%</p>
                  <p className="text-sm text-slate-600">Progreso Promedio</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card className="p-6 border-2 border-slate-200">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Buscar cursos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-2 border-slate-200 focus:border-purple-600"
                />
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  className={filterStatus === "all" ? "bg-purple-600 hover:bg-purple-700" : "border-2 border-slate-200"}
                >
                  Todos
                </Button>
                <Button
                  variant={filterStatus === "active" ? "default" : "outline"}
                  onClick={() => setFilterStatus("active")}
                  className={filterStatus === "active" ? "bg-purple-600 hover:bg-purple-700" : "border-2 border-slate-200"}
                >
                  Activos
                </Button>
                <Button
                  variant={filterStatus === "completed" ? "default" : "outline"}
                  onClick={() => setFilterStatus("completed")}
                  className={filterStatus === "completed" ? "bg-purple-600 hover:bg-purple-700" : "border-2 border-slate-200"}
                >
                  Completados
                </Button>
              </div>

              <div className="flex gap-2 border-2 border-slate-200 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Courses Grid/List */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              {viewMode === "grid" ? (
                <Card className="overflow-hidden border-2 border-slate-200 hover:border-purple-600 hover:shadow-xl transition-all group">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-5xl">{course.image}</div>
                      <Badge className={course.status === "completed" ? "bg-green-100 text-green-700 border-green-300" : "bg-purple-100 text-purple-700 border-purple-300"}>
                        {course.status === "completed" ? "Completado" : "En Progreso"}
                      </Badge>
                    </div>

                    <Badge variant="outline" className="mb-3 border-slate-300">
                      {course.category}
                    </Badge>

                    <h3 className="font-black text-lg mb-2 line-clamp-2 group-hover:text-purple-600 transition">
                      {course.title}
                    </h3>

                    <p className="text-sm text-slate-600 mb-4">👨‍🏫 {course.instructor}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Progreso</span>
                        <span className="font-bold text-purple-600">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                      <p className="text-xs text-slate-500">
                        {course.completedLessons} de {course.totalLessons} lecciones
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{course.rating}</span>
                      <span>•</span>
                      <span>{course.enrolled}</span>
                    </div>

                    {course.status === "active" && (
                      <div className="bg-purple-50 p-3 rounded-lg mb-4">
                        <p className="text-xs text-purple-600 font-bold mb-1">Siguiente lección:</p>
                        <p className="text-sm font-bold">{course.nextLesson}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link href={`/estudiante/curso/${course.id}`} className="flex-1">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 font-bold">
                          <Play className="w-4 h-4 mr-2" />
                          {course.status === "completed" ? "Revisar" : "Continuar"}
                        </Button>
                      </Link>
                      {course.status === "completed" && (
                        <Button variant="outline" size="icon" className="border-2 border-slate-200">
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="border-2 border-slate-200 hover:border-purple-600 hover:shadow-lg transition-all">
                  <div className="p-6 flex flex-col md:flex-row gap-6 items-start">
                    <div className="text-6xl">{course.image}</div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="border-slate-300">
                              {course.category}
                            </Badge>
                            <Badge className={course.status === "completed" ? "bg-green-100 text-green-700 border-green-300" : "bg-purple-100 text-purple-700 border-purple-300"}>
                              {course.status === "completed" ? "Completado" : "En Progreso"}
                            </Badge>
                          </div>
                          <h3 className="font-black text-xl mb-1 hover:text-purple-600 transition">
                            {course.title}
                          </h3>
                          <p className="text-sm text-slate-600">👨‍🏫 {course.instructor}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.totalLessons} lecciones</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold">{course.rating}</span>
                        </div>
                        <span>{course.enrolled}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Progreso del curso</span>
                          <span className="font-bold text-purple-600">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>

                      {course.status === "active" && (
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-xs text-purple-600 font-bold mb-1">Siguiente lección:</p>
                          <p className="text-sm font-bold">{course.nextLesson}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link href={`/estudiante/curso/${course.id}`}>
                        <Button className="bg-purple-600 hover:bg-purple-700 font-bold w-full md:w-auto">
                          <Play className="w-4 h-4 mr-2" />
                          {course.status === "completed" ? "Revisar" : "Continuar"}
                        </Button>
                      </Link>
                      {course.status === "completed" && (
                        <Button variant="outline" className="border-2 border-slate-200">
                          <Download className="w-4 h-4 mr-2" />
                          Certificado
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-black mb-2">No se encontraron cursos</h3>
            <p className="text-slate-600">Intenta con otros términos de búsqueda</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
