"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import StudentNavbar from "@/components/student-navbar"
import {
  Search,
  Star,
  Users,
  Clock,
  Loader2,
  BookmarkPlus,
  CheckCircle,
} from "lucide-react"

interface Course {
  id: string
  title: string
  description: string
  level: string
  duration: number
  rating: number
  image: string
  price: number
  instructor: string
  students: number
  modules: number
  totalLessons: number
  featured: boolean
  category: string
}

export default function CursosEstudiante() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null)
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  // Fetch enrolled courses
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (status === "authenticated") {
        try {
          console.log('🔵 Iniciando fetch de cursos inscritos...')
          const response = await fetch('/api/estudiante/cursos')
          console.log('🔵 Response status:', response.status, response.ok)
          
          const data = await response.json()
          
          console.log('🔵 Cursos inscritos recibidos:', data)
          console.log('🔵 data.success:', data.success)
          console.log('🔵 data.courses:', data.courses)
          console.log('🔵 data.courses.length:', data.courses?.length)
          
          if (data.success && data.courses) {
            console.log('🔵 Mapeando cursos...')
            data.courses.forEach((c: any, idx: number) => {
              console.log(`   Curso ${idx + 1}:`, {
                id: c.id,
                id_curso: c.id_curso,
                titulo: c.titulo,
                stringId: String(c.id_curso || c.id)
              })
            })
            
            const enrolledIds = new Set<string>(
              data.courses.map((c: any) => String(c.id_curso || c.id))
            )
            console.log('🔵 IDs de cursos inscritos (Set):', Array.from(enrolledIds))
            setEnrolledCourses(enrolledIds)
          } else {
            console.log('❌ Condición no cumplida:', { success: data.success, hasCourses: !!data.courses })
          }
        } catch (err) {
          console.error('❌ Error fetching enrolled courses:', err)
        }
      }
    }

    fetchEnrolledCourses()
  }, [status])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        
        const params = new URLSearchParams()
        if (searchQuery) params.append('search', searchQuery)
        if (selectedLevel && selectedLevel !== 'all') params.append('level', selectedLevel)
        
        const response = await fetch(`/api/cursos?${params.toString()}`)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Error al cargar cursos')
        }
        
        console.log('Cursos disponibles recibidos:', data.courses)
        console.log('IDs de cursos disponibles:', data.courses?.map((c: any) => ({ id: c.id, tipo: typeof c.id })))
        
        setCourses(data.courses || [])
      } catch (err: any) {
        console.error('Error fetching courses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [searchQuery, selectedLevel])

  const handleEnroll = async (courseId: string, courseTitle: string) => {
    setEnrollingCourseId(courseId)
    
    try {
      const response = await fetch('/api/estudiante/inscribir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cursoId: courseId }),
      })

      const data = await response.json()
      
      console.log('Respuesta de inscripción:', data, 'Status:', response.status)

      if (response.ok && data.success) {
        setEnrolledCourses(prev => new Set([...prev, courseId]))
        toast({
          title: "¡Inscripción exitosa!",
          description: `Te has inscrito en "${courseTitle}"`,
        })
      } else {
        // Error en la inscripción
        console.error('Error al inscribir:', data)
        toast({
          title: "Error",
          description: data.error || 'No se pudo completar la inscripción',
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error en la petición:', error)
      toast({
        title: "Error",
        description: 'Ocurrió un error al inscribirte en el curso',
        variant: "destructive",
      })
    } finally {
      setEnrollingCourseId(null)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <StudentNavbar />

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Todos los Cursos 📚</h1>
          <p className="text-slate-600">Explora nuestra colección completa de cursos disponibles</p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Buscar cursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-slate-200 focus:border-purple-500"
              />
            </div>
            
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg bg-white focus:border-purple-500 focus:outline-none"
            >
              <option value="all">Todos los niveles</option>
              <option value="PRINCIPIANTE">Principiante</option>
              <option value="INTERMEDIO">Intermedio</option>
              <option value="AVANZADO">Avanzado</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        )}

        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length > 0 ? (
              courses.map((course) => (
                <Card
                  key={course.id}
                  className="overflow-hidden hover:border-purple-500 transition-all hover:shadow-lg cursor-pointer"
                >
                  <div 
                    className="h-40 relative group bg-gradient-to-br from-purple-500 to-purple-600"
                    style={{
                      backgroundImage: course.image && course.image.startsWith('http') 
                        ? `url(${course.image})` 
                        : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                        {course.level === "PRINCIPIANTE"
                          ? "Principiante"
                          : course.level === "INTERMEDIO"
                            ? "Intermedio"
                            : "Avanzado"}
                      </Badge>
                      {course.featured && (
                        <Badge className="bg-yellow-100 text-yellow-700">
                          Destacado
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-semibold text-foreground line-clamp-2 h-14">{course.title}</h3>

                    <p className="text-sm text-slate-600">{course.instructor || 'Tutor IA'}</p>

                    <div className="flex items-center justify-between py-2 border-t border-slate-100 border-b">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{course.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600 text-sm">
                        <Users className="w-4 h-4" />
                        {course.students > 0 ? `${(course.students / 1000).toFixed(1)}K` : '0'}
                      </div>
                      <div className="flex items-center gap-1 text-slate-600 text-sm">
                        <Clock className="w-4 h-4" />
                        {course.duration}h
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-lg font-bold text-purple-600">
                        {course.price > 0 ? `$${course.price}` : 'Gratis'}
                      </span>
                      {enrolledCourses.has(String(course.id)) ? (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          disabled
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Inscrito
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => handleEnroll(String(course.id), course.title)}
                          disabled={enrollingCourseId === String(course.id)}
                        >
                          {enrollingCourseId === String(course.id) ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              Inscribiendo...
                            </>
                          ) : (
                            <>
                              <BookmarkPlus className="w-4 h-4 mr-1" />
                              Inscribirse
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500">No se encontraron cursos.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
