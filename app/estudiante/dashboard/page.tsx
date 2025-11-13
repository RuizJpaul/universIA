"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  BookOpen,
  Clock,
  Award,
  Flame,
  Calendar,
  Bell,
  LogOut,
  Home,
  FileText,
  Video,
  TrendingUp,
  Settings,
  User,
  Newspaper,
  FlaskConical,
} from "lucide-react"

export default function StudentDashboard() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const courses = [
    {
      id: "1",
      title: "Desarrollo Web Full Stack",
      instructor: "Dr. Carlos Ruiz",
      category: "Tecnología",
      progress: 75,
      image: "💻",
      nextLesson: "React Hooks Avanzados",
    },
    {
      id: "2",
      title: "Machine Learning con Python",
      instructor: "Dra. Ana Martínez",
      category: "Data Science",
      progress: 45,
      image: "🤖",
      nextLesson: "Redes Neuronales Básicas",
    },
    {
      id: "3",
      title: "Diseño UX/UI Profesional",
      instructor: "Prof. Luis Gómez",
      category: "Diseño",
      progress: 20,
      image: "🎨",
      nextLesson: "Principios de Diseño Visual",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navbar - Fluid Style */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-light tracking-wide hover:opacity-80 transition">
              UNIVERSIA
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/estudiante/dashboard" className="flex items-center gap-2 text-purple-600 font-medium hover:bg-purple-50 px-4 py-2 rounded-full transition-colors">
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link href="/estudiante/mis-cursos" className="flex items-center gap-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-full transition-colors">
                <BookOpen className="w-4 h-4" />
                Mis Cursos
              </Link>
              <Link href="/estudiante/noticias" className="flex items-center gap-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-full transition-colors">
                <Newspaper className="w-4 h-4" />
                Noticias
              </Link>
              <Link href="/estudiante/progreso" className="flex items-center gap-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-full transition-colors">
                <TrendingUp className="w-4 h-4" />
                Progreso
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-purple-50">
                <Bell className="w-5 h-5" />
              </Button>
              
              {/* Perfil de usuario mejorado */}
              <Link href="/estudiante/perfil">
                <div className="flex items-center gap-3 hover:bg-slate-50 px-4 py-2 rounded-full transition-all cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-slate-400">Ver perfil</p>
                  </div>
                </div>
              </Link>

              <Button
                onClick={logout}
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Imagen de Biblioteca */}
      <div className="relative h-[60vh] min-h-[500px] max-h-[700px] flex items-end overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <img 
            src="/images/fondoEstudiante.jpg" 
            alt="UniversIA" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Overlay con gradiente suave solo en la parte inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        
        {/* Contenido sobre la imagen */}
        <div className="relative max-w-7xl mx-auto px-8 pb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight text-slate-900">
              Hola, <span className="font-medium">{user.name}</span> 👋
            </h1> */}
            <p className="text-2xl font-light max-w-2xl">
              Continúa tu aprendizaje donde lo dejaste
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-20">

        {/* Stats - Fluid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-8 rounded-3xl border-0 bg-gradient-to-br from-purple-50 to-white shadow-lg shadow-purple-100/50 hover:shadow-xl hover:shadow-purple-100 transition-all duration-500">
              <div className="flex flex-col gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-4xl font-light mb-1">3</p>
                  <p className="text-sm text-slate-500 font-light">Cursos Activos</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-8 rounded-3xl border-0 bg-gradient-to-br from-blue-50 to-white shadow-lg shadow-blue-100/50 hover:shadow-xl hover:shadow-blue-100 transition-all duration-500">
              <div className="flex flex-col gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-4xl font-light mb-1">124</p>
                  <p className="text-sm text-slate-500 font-light">Horas Aprendidas</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-8 rounded-3xl border-0 bg-gradient-to-br from-green-50 to-white shadow-lg shadow-green-100/50 hover:shadow-xl hover:shadow-green-100 transition-all duration-500">
              <div className="flex flex-col gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-4xl font-light mb-1">2</p>
                  <p className="text-sm text-slate-500 font-light">Certificados</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-8 rounded-3xl border-0 bg-gradient-to-br from-orange-50 to-white shadow-lg shadow-orange-100/50 hover:shadow-xl hover:shadow-orange-100 transition-all duration-500">
              <div className="flex flex-col gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center">
                  <Flame className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-4xl font-light mb-1">7</p>
                  <p className="text-sm text-slate-500 font-light">Racha Actual</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Courses in Progress */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-light mb-12 tracking-tight">Continúa Aprendiendo</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <Card className="overflow-hidden border-0 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 group bg-white">
                  <div className="p-8">
                    <div className="text-6xl mb-6">{course.image}</div>
                    <Badge variant="outline" className="mb-4 border-slate-200 rounded-full px-4 py-1 text-xs font-light">
                      {course.category}
                    </Badge>
                    <h3 className="font-medium text-xl mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-400 mb-6 font-light">👨‍🏫 {course.instructor}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-light">Progreso</span>
                        <span className="font-medium text-purple-600">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-1.5 bg-slate-100" />
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-5 rounded-2xl mb-6">
                      <p className="text-xs text-purple-500 font-light mb-2">Siguiente lección:</p>
                      <p className="text-sm font-medium text-purple-900">{course.nextLesson}</p>
                    </div>

                    <Link href={`/estudiante/curso/${course.id}`}>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 rounded-full py-6 font-medium shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all duration-300">
                        Continuar Curso
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming & Achievements */}
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="md:col-span-2"
          >
            <Card className="p-8 border-0 rounded-3xl shadow-lg">
              <h3 className="text-3xl font-light mb-8 tracking-tight">Próximas Actividades</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-red-50 to-white rounded-2xl border border-red-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-lg">Examen Final - Machine Learning</p>
                    <p className="text-sm text-slate-400 font-light mt-1">Mañana, 10:00 AM</p>
                  </div>
                  <Badge className="bg-red-100 text-red-600 border-0 rounded-full px-4 py-1.5 font-light">Urgente</Badge>
                </div>
                
                <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-lg">Proyecto: Dashboard React</p>
                    <p className="text-sm text-slate-400 font-light mt-1">Entrega: 15 Nov</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Video className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-lg">Sesión en Vivo - UX Design</p>
                    <p className="text-sm text-slate-400 font-light mt-1">18 Nov, 4:00 PM</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            <Card className="p-8 border-0 rounded-3xl shadow-lg mb-6">
              <h3 className="text-2xl font-light mb-6 tracking-tight">Logros Recientes</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-6 rounded-2xl">
                  <div className="text-4xl mb-3">🏆</div>
                  <p className="text-xs font-medium">Racha 7 días</p>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-6 rounded-2xl">
                  <div className="text-4xl mb-3">⭐</div>
                  <p className="text-xs font-medium">Curso Completo</p>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-2xl">
                  <div className="text-4xl mb-3">🎯</div>
                  <p className="text-xs font-medium">100% Examen</p>
                </div>
                <div className="bg-slate-100 p-6 rounded-2xl opacity-40">
                  <div className="text-4xl mb-3">🔒</div>
                  <p className="text-xs font-medium">Bloqueado</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-0 rounded-3xl shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50">
              <h3 className="font-medium text-lg mb-2">Centro de Ayuda</h3>
              <p className="text-sm text-slate-500 mb-6 font-light">¿Necesitas asistencia?</p>
              <div className="space-y-3">
                <Button variant="outline" className="w-full border-0 bg-white hover:bg-white/80 rounded-full py-6 shadow-sm font-medium">
                  Centro de Ayuda
                </Button>
                <Link href="/estudiante/perfil">
                  <Button variant="outline" className="w-full border-0 bg-white hover:bg-white/80 rounded-full py-6 shadow-sm font-medium">
                    Configuración
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
