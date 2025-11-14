"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { motion } from "framer-motion"
import StudentNavbar from "@/components/student-navbar"
import {
  BookOpen,
  Clock,
  Award,
  Flame,
  Calendar,
  FileText,
  Video,
  Settings,
  User,
  FlaskConical,
  Search,
} from "lucide-react"

export default function StudentDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Estados para datos de la API
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  // Fetch dashboard data from API
  useEffect(() => {
    if (status === "authenticated") {
      async function fetchDashboard() {
        try {
          setLoading(true)
          const res = await fetch('/api/estudiante/dashboard')
          
          if (!res.ok) {
            throw new Error('Error al cargar datos del dashboard')
          }
          
          const data = await res.json()
          
          if (data.success) {
            setDashboardData(data)
          } else {
            throw new Error(data.error || 'Error desconocido')
          }
        } catch (err: any) {
          console.error('Error fetching dashboard:', err)
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }

      fetchDashboard()
    }
  }, [status])

  if (status === "loading" || loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-slate-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Reintentar
          </Button>
        </Card>
      </div>
    )
  }

  const { stats, courses, upcomingEvaluations, recentActivity, weeklyProgress } = dashboardData || {}

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <StudentNavbar />

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
              Hola, <span className="font-medium">{session?.user?.name || session?.user?.email}</span> 👋
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
                  <p className="text-4xl font-light mb-1">{stats?.activeCourses || 0}</p>
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
                  <p className="text-4xl font-light mb-1">{stats?.totalHours || 0}</p>
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
                  <p className="text-4xl font-light mb-1">{stats?.certificates || 0}</p>
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
                  <p className="text-4xl font-light mb-1">{stats?.streak || 0}</p>
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
          
          {courses && courses.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {courses.map((course: any, index: number) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  <Card className="overflow-hidden border-0 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 group bg-white">
                    <div className="p-8">
                      <div className="text-6xl mb-6">
                        {course.nivel === 'BASICO' && '📚'}
                        {course.nivel === 'INTERMEDIO' && '💻'}
                        {course.nivel === 'AVANZADO' && '🚀'}
                        {!course.nivel && '📖'}
                      </div>
                      <Badge variant="outline" className="mb-4 border-slate-200 rounded-full px-4 py-1 text-xs font-light">
                        {course.nivel || 'Curso'}
                      </Badge>
                      <h3 className="font-medium text-xl mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {course.titulo}
                      </h3>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400 font-light">Progreso</span>
                          <span className="font-medium text-purple-600">{Math.round(course.progreso_general || 0)}%</span>
                        </div>
                        <Progress value={course.progreso_general || 0} className="h-1.5 bg-slate-100" />
                      </div>

                      {course.proxima_leccion && (
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-5 rounded-2xl mb-6">
                          <p className="text-xs text-purple-500 font-light mb-2">Siguiente lección:</p>
                          <p className="text-sm font-medium text-purple-900">{course.proxima_leccion}</p>
                        </div>
                      )}

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
          ) : (
            <Card className="p-12 text-center rounded-3xl">
              <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 mb-4">No tienes cursos activos</p>
              <Link href="/estudiante/mis-cursos">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Explorar Cursos
                </Button>
              </Link>
            </Card>
          )}
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
