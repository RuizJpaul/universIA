"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
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
  ChevronRight,
  Medal,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import StudentNavbar from "@/components/student-navbar"

export default function Progreso() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Estados para datos de la API
  const [progresoData, setProgresoData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  // Fetch progreso data from API
  useEffect(() => {
    if (status === "authenticated") {
      async function fetchProgreso() {
        try {
          setLoading(true)
          const res = await fetch('/api/estudiante/progreso')
          
          if (!res.ok) {
            throw new Error('Error al cargar progreso')
          }
          
          const data = await res.json()
          
          if (data.success) {
            setProgresoData(data)
          } else {
            throw new Error(data.error || 'Error desconocido')
          }
        } catch (err: any) {
          console.error('Error fetching progreso:', err)
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }

      fetchProgreso()
    }
  }, [status])

  if (status === "loading" || loading || !session) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
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

  const { achievements, certificates, monthlyProgress, learningActivity, globalStats } = progresoData || {}

  const stats = {
    totalHours: globalStats?.totalHours || 0,
    coursesCompleted: globalStats?.coursesCompleted || 0,
    coursesActive: globalStats?.totalCoursesEnrolled - globalStats?.coursesCompleted || 0,
    streak: 7, // TODO: Calcular desde actividad
    totalPoints: globalStats?.achievementsEarned * 100 || 0,
    nextLevel: 3500,
    rank: "Avanzado",
  }

  return (
    <div className="min-h-screen bg-white">
      <StudentNavbar />

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
                  {monthlyProgress && monthlyProgress.length > 0 ? (
                    monthlyProgress.map((month: any, index: number) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-slate-700">{month.mes}</span>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-purple-600 font-bold">{month.horas_estudiadas || 0}h</span>
                            <span className="text-slate-600">{month.lecciones_completadas || 0} lecciones</span>
                          </div>
                        </div>
                        <Progress value={Math.min((month.horas_estudiadas / 40) * 100, 100)} className="h-2" />
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-center py-4">No hay datos de progreso mensual</p>
                  )}
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
                  {learningActivity && learningActivity.length > 0 ? (
                    learningActivity.map((activity: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-bold">{activity.curso_titulo || 'Curso'}</p>
                            <p className="text-sm text-slate-600">
                              {activity.lecciones_completadas || 0} lecciones completadas
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-purple-600">{activity.horas_estudiadas || 0}h</p>
                          <p className="text-xs text-slate-500">tiempo estudiado</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-center py-4">No hay actividad reciente</p>
                  )}
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
                    {certificates?.length || 0} obtenidos
                  </Badge>
                </div>
                <div className="space-y-4">
                  {certificates && certificates.length > 0 ? (
                    certificates.map((cert: any) => (
                      <div key={cert.id} className="p-6 bg-gradient-to-r from-purple-50 to-white rounded-lg border-2 border-purple-200 hover:border-purple-600 transition-all">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Medal className="w-6 h-6 text-yellow-500" />
                              <h4 className="font-black text-lg">{cert.curso_titulo}</h4>
                            </div>
                            <p className="text-sm text-slate-600">Emitido el {new Date(cert.fecha_emision).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <div className="mt-3 flex items-center gap-2">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-bold text-purple-600">Calificación: {cert.calificacion_final ? `${Math.round(cert.calificacion_final)}%` : 'Aprobado'}</span>
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
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Award className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                      <p className="text-slate-500">Aún no has obtenido certificados</p>
                      <p className="text-sm text-slate-400 mt-2">Completa un curso para obtener tu primer certificado</p>
                    </div>
                  )}
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
                  {achievements && achievements.length > 0 ? (
                    achievements.map((achievement: any) => (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          achievement.obtenido
                            ? "bg-gradient-to-r from-yellow-50 to-white border-yellow-300 hover:border-yellow-500"
                            : "bg-slate-50 border-slate-200 opacity-60"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{achievement.icono || '🏆'}</div>
                          <div className="flex-1">
                            <h4 className="font-bold mb-1">{achievement.nombre}</h4>
                            <p className="text-xs text-slate-600 mb-2">{achievement.descripcion}</p>
                            {achievement.obtenido ? (
                              <div className="flex items-center gap-1 text-xs text-green-600">
                                <span>✓ {achievement.fecha_obtencion ? new Date(achievement.fecha_obtencion).toLocaleDateString('es-ES') : 'Desbloqueado'}</span>
                              </div>
                            ) : (
                              <p className="text-xs text-slate-500">🔒 {achievement.puntos} pts para desbloquear</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-center py-4">No hay logros disponibles</p>
                  )}
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
