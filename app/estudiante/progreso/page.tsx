"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Award,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  BookOpen,
  Star,
  Flame,
  Download,
  Share2,
  Bell,
  LogOut,
  Home,
  User,
  ChevronRight,
  Medal,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Progreso() {
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const achievements = [
    { id: 1, title: "Primera Lección", description: "Completa tu primera lección", icon: "🎯", unlocked: true, date: "Hace 3 meses" },
    { id: 2, title: "Maratonista", description: "Estudia 7 días seguidos", icon: "🏃", unlocked: true, date: "Hace 1 semana" },
    { id: 3, title: "Perfeccionista", description: "Obtén 100% en un examen", icon: "💯", unlocked: true, date: "Hace 2 semanas" },
    { id: 4, title: "Graduado", description: "Completa tu primer curso", icon: "🎓", unlocked: true, date: "Hace 1 mes" },
    { id: 5, title: "Experto", description: "Completa 5 cursos", icon: "⭐", unlocked: false, progress: 40 },
    { id: 6, title: "Maestro", description: "Completa 10 cursos", icon: "👑", unlocked: false, progress: 20 },
    { id: 7, title: "Nocturno", description: "Estudia después de medianoche", icon: "🌙", unlocked: false, progress: 0 },
    { id: 8, title: "Madrugador", description: "Estudia antes de las 6am", icon: "☀️", unlocked: false, progress: 0 },
  ]

  const monthlyProgress = [
    { month: "Ene", hours: 18, courses: 2 },
    { month: "Feb", hours: 22, courses: 2 },
    { month: "Mar", hours: 28, courses: 3 },
    { month: "Abr", hours: 32, courses: 3 },
    { month: "May", hours: 35, courses: 4 },
    { month: "Jun", hours: 40, courses: 5 },
  ]

  const certificates = [
    { id: 1, course: "Marketing Digital Avanzado", date: "15 Oct 2024", instructor: "Mtra. Sofia Torres", grade: "98%" },
    { id: 2, course: "Excel para Análisis de Datos", date: "22 Sep 2024", instructor: "Ing. Roberto Silva", grade: "95%" },
  ]

  const stats = {
    totalHours: 124,
    coursesCompleted: 2,
    coursesActive: 3,
    streak: 7,
    totalPoints: 2850,
    nextLevel: 3500,
    rank: "Avanzado",
  }

  const learningActivity = [
    { date: "2024-11-12", lessons: 3, hours: 2.5 },
    { date: "2024-11-11", lessons: 2, hours: 1.5 },
    { date: "2024-11-10", lessons: 4, hours: 3.2 },
    { date: "2024-11-09", lessons: 2, hours: 2.0 },
    { date: "2024-11-08", lessons: 3, hours: 2.8 },
    { date: "2024-11-07", lessons: 1, hours: 1.2 },
    { date: "2024-11-06", lessons: 2, hours: 1.8 },
  ]

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
              <Link href="/estudiante/mis-cursos" className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition">
                <BookOpen className="w-4 h-4" />
                Mis Cursos
              </Link>
              <Link href="/estudiante/progreso" className="flex items-center gap-2 text-purple-600 font-bold">
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
          <h1 className="text-4xl font-black mb-2">Mi Progreso 📊</h1>
          <p className="text-slate-600">Visualiza tu evolución y logros</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white hover:shadow-xl transition-all">
                  <Clock className="w-8 h-8 text-purple-600 mb-3" />
                  <p className="text-3xl font-black mb-1">{stats.totalHours}</p>
                  <p className="text-sm text-slate-600">Horas Totales</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 border-2 border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-xl transition-all">
                  <Award className="w-8 h-8 text-green-600 mb-3" />
                  <p className="text-3xl font-black mb-1">{stats.coursesCompleted}</p>
                  <p className="text-sm text-slate-600">Completados</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white hover:shadow-xl transition-all">
                  <Flame className="w-8 h-8 text-orange-600 mb-3" />
                  <p className="text-3xl font-black mb-1">{stats.streak}</p>
                  <p className="text-sm text-slate-600">Días Racha</p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-xl transition-all">
                  <Zap className="w-8 h-8 text-blue-600 mb-3" />
                  <p className="text-3xl font-black mb-1">{stats.totalPoints}</p>
                  <p className="text-sm text-slate-600">Puntos XP</p>
                </Card>
              </motion.div>
            </div>

            {/* Level Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 border-2 border-purple-200 bg-gradient-to-r from-purple-600 to-purple-400 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm opacity-90">Nivel Actual</p>
                    <h3 className="text-3xl font-black">{stats.rank}</h3>
                  </div>
                  <div className="text-5xl">🏆</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{stats.totalPoints} XP</span>
                    <span>{stats.nextLevel} XP</span>
                  </div>
                  <Progress value={(stats.totalPoints / stats.nextLevel) * 100} className="h-3 bg-purple-300" />
                  <p className="text-sm opacity-90">{stats.nextLevel - stats.totalPoints} XP para el siguiente nivel</p>
                </div>
              </Card>
            </motion.div>

            {/* Monthly Progress Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 border-2 border-slate-200">
                <h3 className="text-xl font-black mb-6">Progreso Mensual</h3>
                <div className="space-y-4">
                  {monthlyProgress.map((month, index) => (
                    <div key={month.month}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-700">{month.month}</span>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-purple-600 font-bold">{month.hours}h</span>
                          <span className="text-slate-600">{month.courses} cursos</span>
                        </div>
                      </div>
                      <Progress value={(month.hours / 40) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Learning Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="p-6 border-2 border-slate-200">
                <h3 className="text-xl font-black mb-6">Actividad Reciente</h3>
                <div className="space-y-3">
                  {learningActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-bold">
                            {new Date(activity.date).toLocaleDateString('es-ES', { 
                              day: 'numeric', 
                              month: 'long',
                              weekday: 'long' 
                            })}
                          </p>
                          <p className="text-sm text-slate-600">
                            {activity.lessons} lecciones completadas
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-purple-600">{activity.hours}h</p>
                        <p className="text-xs text-slate-500">tiempo estudiado</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Certificates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="p-6 border-2 border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black">Mis Certificados 🎓</h3>
                  <Badge className="bg-green-100 text-green-700 border-green-300">
                    {certificates.length} obtenidos
                  </Badge>
                </div>
                <div className="space-y-4">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="p-6 bg-gradient-to-r from-purple-50 to-white rounded-lg border-2 border-purple-200 hover:border-purple-600 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Medal className="w-6 h-6 text-yellow-500" />
                            <h4 className="font-black text-lg">{cert.course}</h4>
                          </div>
                          <p className="text-sm text-slate-600 mb-1">Instructor: {cert.instructor}</p>
                          <p className="text-sm text-slate-600">Emitido el {cert.date}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-purple-600">Calificación: {cert.grade}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <Download className="w-4 h-4 mr-2" />
                            Descargar
                          </Button>
                          <Button size="sm" variant="outline" className="border-2 border-slate-200">
                            <Share2 className="w-4 h-4 mr-2" />
                            Compartir
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar - Achievements */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="p-6 border-2 border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black">Logros</h3>
                  <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        achievement.unlocked
                          ? "bg-gradient-to-r from-yellow-50 to-white border-yellow-300 hover:border-yellow-500"
                          : "bg-slate-50 border-slate-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-bold mb-1">{achievement.title}</h4>
                          <p className="text-xs text-slate-600 mb-2">{achievement.description}</p>
                          {achievement.unlocked ? (
                            <div className="flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{achievement.date}</span>
                            </div>
                          ) : achievement.progress ? (
                            <div className="space-y-1">
                              <Progress value={achievement.progress} className="h-1" />
                              <p className="text-xs text-slate-500">{achievement.progress}% completado</p>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-500">🔒 Bloqueado</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Goals */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <Card className="p-6 border-2 border-slate-200">
                <h3 className="text-xl font-black mb-4">Objetivos Semanales</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold">Estudiar 10 horas</span>
                      <span className="text-sm text-purple-600 font-bold">7/10</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold">Completar 15 lecciones</span>
                      <span className="text-sm text-purple-600 font-bold">12/15</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold">Pasar 2 exámenes</span>
                      <span className="text-sm text-purple-600 font-bold">1/2</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Card className="p-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                <h3 className="text-xl font-black mb-4">Estadísticas Rápidas</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Promedio diario:</span>
                    <span className="font-bold">2.1 horas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Día más productivo:</span>
                    <span className="font-bold">Martes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Curso favorito:</span>
                    <span className="font-bold">Desarrollo Web</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tasa de finalización:</span>
                    <span className="font-bold text-green-600">92%</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
