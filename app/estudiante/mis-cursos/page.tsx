"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
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
  Calendar,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import StudentNavbar from "@/components/student-navbar"

export default function MisCursos() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Estados para API data
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  // Fetch courses from API
  useEffect(() => {
    if (status === "authenticated") {
      async function fetchCourses() {
        try {
          setLoading(true)
          const res = await fetch('/api/estudiante/cursos')
          
          if (!res.ok) {
            throw new Error('Error al cargar cursos')
          }
          
          const data = await res.json()
          
          if (data.success) {
            setCourses(data.courses || [])
          } else {
            throw new Error(data.error || 'Error desconocido')
          }
        } catch (err: any) {
          console.error('Error fetching courses:', err)
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }

      fetchCourses()
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

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    if (!course || !course.titulo) return false
    
    const matchesSearch = course.titulo.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (filterStatus === "all") return matchesSearch
    if (filterStatus === "active") return matchesSearch && course.estado !== "COMPLETADO"
    if (filterStatus === "completed") return matchesSearch && course.estado === "COMPLETADO"
    
    return matchesSearch
  })

  const activeCourses = courses.filter((c) => c && c.estado !== "COMPLETADO").length
  const completedCourses = courses.filter((c) => c && c.estado === "COMPLETADO").length

  const stats = {
    active: activeCourses,
    completed: completedCourses,
    totalHours: courses.reduce((acc, c) => acc + (c?.duracion || 0), 0),
    avgProgress: courses.length > 0 
      ? Math.round(courses.reduce((acc, c) => acc + (c?.progreso_general || 0), 0) / courses.length)
      : 0,
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
          {filteredCourses.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">No se encontraron cursos</p>
            </div>
          ) : (
            filteredCourses.map((course: any, index: number) => (
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
                        <div className="text-5xl">
                          {course.nivel === 'BASICO' && '📚'}
                          {course.nivel === 'INTERMEDIO' && '💻'}
                          {course.nivel === 'AVANZADO' && '🚀'}
                          {!course.nivel && '📖'}
                        </div>
                        <Badge className={course.estado === "COMPLETADO" ? "bg-green-100 text-green-700 border-green-300" : "bg-purple-100 text-purple-700 border-purple-300"}>
                          {course.estado === "COMPLETADO" ? "Completado" : "En Progreso"}
                        </Badge>
                      </div>

                      <Badge variant="outline" className="mb-3 border-slate-300">
                        {course.nivel || 'Curso'}
                      </Badge>

                      <h3 className="font-black text-lg mb-2 line-clamp-2 group-hover:text-purple-600 transition">
                        {course.titulo}
                      </h3>

                      <p className="text-sm text-slate-600 mb-4">{course.descripcion?.substring(0, 100)}...</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Progreso</span>
                          <span className="font-bold text-purple-600">{Math.round(course.progreso_general || 0)}%</span>
                        </div>
                        <Progress value={course.progreso_general || 0} className="h-2" />
                        <p className="text-xs text-slate-500">
                          {course.lecciones_completadas || 0} de {course.total_lecciones || 0} lecciones
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                        <Clock className="w-4 h-4" />
                        <span>{course.duracion || 0} horas</span>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/estudiante/curso/${course.id}`} className="flex-1">
                          <Button className="w-full bg-purple-600 hover:bg-purple-700 font-bold">
                            <Play className="w-4 h-4 mr-2" />
                            {course.estado === "COMPLETADO" ? "Revisar" : "Continuar"}
                          </Button>
                        </Link>
                        {course.estado === "COMPLETADO" && (
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
                      <div className="text-6xl">
                        {course.nivel === 'BASICO' && '📚'}
                        {course.nivel === 'INTERMEDIO' && '💻'}
                        {course.nivel === 'AVANZADO' && '🚀'}
                        {!course.nivel && '📖'}
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline" className="border-slate-300">
                                {course.nivel || 'Curso'}
                              </Badge>
                              <Badge className={course.estado === "COMPLETADO" ? "bg-green-100 text-green-700 border-green-300" : "bg-purple-100 text-purple-700 border-purple-300"}>
                                {course.estado === "COMPLETADO" ? "Completado" : "En Progreso"}
                              </Badge>
                            </div>
                            <h3 className="font-black text-xl mb-1 hover:text-purple-600 transition">
                              {course.titulo}
                            </h3>
                            <p className="text-sm text-slate-600">{course.descripcion?.substring(0, 150)}...</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{course.duracion || 0} horas</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            <span>{course.total_lecciones || 0} lecciones</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Progreso del curso</span>
                            <span className="font-bold text-purple-600">{Math.round(course.progreso_general || 0)}%</span>
                          </div>
                          <Progress value={course.progreso_general || 0} className="h-2" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Link href={`/estudiante/curso/${course.id}`}>
                          <Button className="bg-purple-600 hover:bg-purple-700 font-bold w-full md:w-auto">
                            <Play className="w-4 h-4 mr-2" />
                            {course.estado === "COMPLETADO" ? "Revisar" : "Continuar"}
                          </Button>
                        </Link>
                        {course.estado === "COMPLETADO" && (
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
            ))
          )}
        </div>

        {filteredCourses.length === 0 && courses.length > 0 && (
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
