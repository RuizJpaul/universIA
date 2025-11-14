"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import StudentNavbar from "@/components/student-navbar"
import {
  ChevronRight,
  ChevronDown,
  PlayCircle,
  CheckCircle2,
  FileText,
  Video,
  BookOpen,
  Clock,
  BarChart,
  MessageCircle,
  Download,
  Loader2,
  Bot,
  User,
  Send,
  Sparkles,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Lesson {
  id: number
  titulo: string
  tipo_contenido: string
  duracion_minutos: number
  orden: number
  completado: boolean
  url_video?: string
  contenido?: string
  conceptos_clave?: string[]
  objetivos_aprendizaje?: string[]
  notas_estudiante?: string
}

interface Module {
  id: number
  titulo: string
  descripcion: string
  orden: number
  duracion_estimada_horas: number
  lecciones: Lesson[]
  progreso: number
  lecciones_completadas: number
  total_lecciones: number
  expanded: boolean
}

interface CourseData {
  id: number
  nombre: string
  descripcion: string
  nivel: string
  duracion_horas: number
  progreso_general: number
  modulos: Module[]
  id_inscripcion: number
}

export default function CursoDetalle() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  
  const [courseData, setCourseData] = useState<CourseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [activeTab, setActiveTab] = useState("contenido")
  const [markingComplete, setMarkingComplete] = useState(false)
  
  // Estados para el chat de IA
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [iaSessionStarted, setIaSessionStarted] = useState(false)
  const [loadingIA, setLoadingIA] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      if (!params.id) return

      try {
        setLoading(true)
        console.log('🔵 Fetching curso:', params.id)
        const response = await fetch(`/api/estudiante/curso/${params.id}`)
        
        console.log('🔵 Response status:', response.status, response.ok)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ Response error:', errorText)
          throw new Error('Error al cargar el curso')
        }
        
        const data = await response.json()
        console.log('🔵 Data received:', data)
        
        if (data.success && data.course) {
          console.log('🔵 Setting course data:', data.course.nombre)
          setCourseData(data.course)
          const modulesWithState = data.course.modulos.map((mod: Module) => ({
            ...mod,
            expanded: mod.orden === 1,
          }))
          console.log('🔵 Modules:', modulesWithState.length)
          setModules(modulesWithState)
          
          // Seleccionar primera lección incompleta o primera lección
          const firstIncompleteLesson = modulesWithState
            .flatMap((m: Module) => m.lecciones)
            .find((l: Lesson) => !l.completado)
          
          if (firstIncompleteLesson) {
            setSelectedLesson(firstIncompleteLesson)
          } else if (modulesWithState[0]?.lecciones[0]) {
            setSelectedLesson(modulesWithState[0].lecciones[0])
          }
        }
      } catch (err) {
        console.error('Error fetching course:', err)
        toast({
          title: "Error",
          description: "No se pudo cargar el curso",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchCourse()
    }
  }, [params.id, status, toast])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  // Auto-scroll para mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Iniciar sesión de IA cuando se selecciona una lección
  useEffect(() => {
    if (selectedLesson && !iaSessionStarted) {
      startIASession()
    }
  }, [selectedLesson])

  const startIASession = async () => {
    if (iaSessionStarted || !session?.user?.email || loadingIA) return

    try {
      setLoadingIA(true)
      const tutorServiceUrl = process.env.NEXT_PUBLIC_TUTOR_SERVICE_URL || "https://backend-njoc.onrender.com"
      
      const res = await fetch(`${tutorServiceUrl}/api/ia/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: session.user.email,
        }),
      })

      const data = await res.json()

      if (data.response) {
        setMessages([
          {
            role: "assistant",
            content: data.response,
            timestamp: new Date(),
          },
        ])
        setIaSessionStarted(true)
      } else {
        toast({
          title: "Error",
          description: "No se recibió respuesta del tutor IA",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error starting IA session:", err)
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el tutor IA. Por favor intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setLoadingIA(false)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || sending || !session?.user?.email) return

    const userMessage = inputMessage.trim()
    setInputMessage("")

    // Agregar mensaje del usuario
    const newUserMessage: Message = {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, newUserMessage])

    setSending(true)

    try {
      const tutorServiceUrl = process.env.NEXT_PUBLIC_TUTOR_SERVICE_URL || "https://backend-njoc.onrender.com"

      const res = await fetch(`${tutorServiceUrl}/api/ia/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: session.user.email,
          message: userMessage,
        }),
      })

      const data = await res.json()

      if (data.response) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        toast({
          title: "Error",
          description: "No se recibió respuesta del tutor IA",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error sending message:", err)
      toast({
        title: "Error de conexión",
        description: "No se pudo enviar el mensaje. Verifica tu conexión.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const toggleModule = (moduleId: number) => {
    setModules(modules.map(mod => 
      mod.id === moduleId ? { ...mod, expanded: !mod.expanded } : mod
    ))
  }

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setActiveTab("contenido")
  }

  const markLessonComplete = async () => {
    if (!selectedLesson || markingComplete) return

    try {
      setMarkingComplete(true)
      const response = await fetch('/api/estudiante/progreso/leccion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cursoId: params.id,
          leccionId: selectedLesson.id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Actualizar estado local
        setModules(modules.map(mod => ({
          ...mod,
          lecciones: mod.lecciones.map(l =>
            l.id === selectedLesson.id ? { ...l, completado: true } : l
          ),
        })))

        setSelectedLesson({ ...selectedLesson, completado: true })

        if (courseData) {
          setCourseData({
            ...courseData,
            progreso_general: data.progreso_general
          })
        }

        toast({
          title: "¡Lección completada!",
          description: "Continúa con la siguiente lección",
        })

        // Auto-avanzar a la siguiente lección
        setTimeout(() => {
          const allLessons = modules.flatMap(m => m.lecciones)
          const currentIndex = allLessons.findIndex(l => l.id === selectedLesson.id)
          if (currentIndex < allLessons.length - 1) {
            setSelectedLesson(allLessons[currentIndex + 1])
          }
        }, 1500)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo marcar la lección como completada",
        variant: "destructive",
      })
    } finally {
      setMarkingComplete(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <h2 className="text-2xl font-medium mb-4">Curso no encontrado</h2>
          <p className="text-slate-600 mb-6">
            No pudimos encontrar este curso o no estás inscrito en él.
          </p>
          <Button onClick={() => router.push('/estudiante/mis-cursos')}>
            Volver a Mis Cursos
          </Button>
        </Card>
      </div>
    )
  }

  const totalLessons = modules.reduce((acc, mod) => acc + mod.lecciones.length, 0)
  const completedLessons = modules.reduce(
    (acc, mod) => acc + mod.lecciones.filter(l => l.completado).length,
    0
  )
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  return (
    <div className="min-h-screen bg-slate-50">
      <StudentNavbar />

      {/* Header del Curso */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-2 text-purple-200 mb-4">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">Mis Cursos</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-sm">{courseData.nombre}</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{courseData.nombre}</h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              <span>{courseData.nivel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{courseData.duracion_horas} horas</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>{totalLessons} lecciones</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progreso del curso</span>
              <span className="text-sm font-bold">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-purple-900" />
            <p className="text-xs text-purple-200 mt-1">
              {completedLessons} de {totalLessons} lecciones completadas
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-[350px_1fr] gap-6">
          {/* Sidebar - Módulos y Lecciones */}
          <Card className="h-fit sticky top-6">
            <div className="p-4 bg-purple-50 border-b">
              <h2 className="font-bold text-lg">Contenido del Curso</h2>
              <p className="text-sm text-slate-600 mt-1">
                {modules.length} módulos • {totalLessons} lecciones
              </p>
            </div>
            
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="p-4 space-y-2">
                {modules.map((module, idx) => (
                  <div key={module.id} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-3 flex-1 text-left">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{module.titulo}</h3>
                          <p className="text-xs text-slate-500">
                            {module.lecciones.length} lecciones • {module.duracion_estimada_horas}h
                          </p>
                        </div>
                      </div>
                      {module.expanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    {module.expanded && (
                      <div className="border-t bg-slate-50">
                        {module.lecciones.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => handleLessonClick(lesson)}
                            className={`w-full p-3 flex items-center gap-3 hover:bg-white transition ${
                              selectedLesson?.id === lesson.id ? 'bg-purple-50 border-l-4 border-purple-600' : ''
                            }`}
                          >
                            {lesson.completado ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                            ) : lesson.tipo_contenido === 'VIDEO' ? (
                              <PlayCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                            ) : (
                              <FileText className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            )}
                            
                            <div className="flex-1 text-left">
                              <p className={`text-sm font-medium ${
                                lesson.completado ? 'text-slate-500 line-through' : 'text-slate-700'
                              }`}>
                                {lesson.titulo}
                              </p>
                              <p className="text-xs text-slate-500">
                                {lesson.duracion_minutos} min
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Área Principal - Contenido de la Lección */}
          <div className="space-y-6">
            {selectedLesson ? (
              <>
                <Card>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {selectedLesson.tipo_contenido}
                        </Badge>
                        <h2 className="text-2xl font-bold">{selectedLesson.titulo}</h2>
                      </div>
                      {selectedLesson.completado && (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Completado
                        </Badge>
                      )}
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="contenido">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Contenido
                        </TabsTrigger>
                        <TabsTrigger value="notas">
                          <FileText className="w-4 h-4 mr-2" />
                          Notas
                        </TabsTrigger>
                        <TabsTrigger value="recursos">
                          <Download className="w-4 h-4 mr-2" />
                          Recursos
                        </TabsTrigger>
                        <TabsTrigger value="discusion">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Discusión
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="contenido" className="mt-6">
                        {/* Chat de IA Tutor */}
                        <Card className="flex flex-col overflow-hidden" style={{ height: "calc(100vh - 300px)", minHeight: "500px", maxHeight: "700px" }}>
                          <div className="p-4 border-b flex items-center justify-between bg-purple-50 shrink-0">
                            <div className="flex items-center gap-2">
                              <Bot className="w-5 h-5 text-purple-600" />
                              <h3 className="font-semibold">Tutor IA - {selectedLesson.titulo}</h3>
                            </div>
                            {loadingIA && (
                              <Badge variant="outline">
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Conectando...
                              </Badge>
                            )}
                            {iaSessionStarted && (
                              <Badge className="bg-green-100 text-green-700">
                                <Sparkles className="w-4 h-4 mr-1" />
                                Activo
                              </Badge>
                            )}
                          </div>

                          {/* Mensajes */}
                          <div className="flex-1 overflow-hidden">
                            <ScrollArea className="h-full">
                              <div className="p-4 space-y-4">
                              {loadingIA && messages.length === 0 && (
                                <div className="text-center text-slate-500 py-12">
                                  <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-purple-600" />
                                  <p className="text-sm font-medium">Conectando con el tutor IA...</p>
                                  <p className="text-xs mt-2">Cargando la rúbrica del curso</p>
                                </div>
                              )}

                              {messages.length === 0 && !iaSessionStarted && !loadingIA && (
                                <div className="text-center text-slate-500 py-12">
                                  <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                  <p className="text-sm">
                                    La sesión con el tutor IA se iniciará automáticamente
                                  </p>
                                </div>
                              )}

                              <AnimatePresence>
                                {messages.map((message, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`flex gap-3 ${
                                      message.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                                  >
                                    {message.role === "assistant" && (
                                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                        <Bot className="w-5 h-5 text-purple-600" />
                                      </div>
                                    )}

                                    <div
                                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                        message.role === "user"
                                          ? "bg-purple-600 text-white"
                                          : "bg-slate-100 text-slate-900"
                                      }`}
                                    >
                                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                      <p
                                        className={`text-xs mt-1 ${
                                          message.role === "user" ? "text-purple-200" : "text-slate-500"
                                        }`}
                                      >
                                        {message.timestamp.toLocaleTimeString("es-PE", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </p>
                                    </div>

                                    {message.role === "user" && (
                                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                                        <User className="w-5 h-5 text-white" />
                                      </div>
                                    )}
                                  </motion.div>
                                ))}
                              </AnimatePresence>

                              {sending && (
                                <div className="flex gap-3 justify-start">
                                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-purple-600" />
                                  </div>
                                  <div className="bg-slate-100 rounded-2xl px-4 py-3">
                                    <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
                                  </div>
                                </div>
                              )}

                              <div ref={messagesEndRef} />
                              </div>
                            </ScrollArea>
                          </div>

                          {/* Input de mensaje */}
                          <div className="p-4 border-t bg-slate-50 shrink-0">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Escribe tu pregunta o respuesta..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                disabled={sending || !iaSessionStarted}
                                className="flex-1"
                              />
                              <Button
                                onClick={sendMessage}
                                disabled={sending || !inputMessage.trim() || !iaSessionStarted}
                                size="icon"
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                {sending ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  <Send className="w-5 h-5" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </Card>

                        <Separator />

                        {selectedLesson.objetivos_aprendizaje && selectedLesson.objetivos_aprendizaje.length > 0 && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                              <BarChart className="w-5 h-5" />
                              Objetivos de Aprendizaje
                            </h3>
                            <ul className="space-y-2">
                              {selectedLesson.objetivos_aprendizaje.map((objetivo, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-blue-800">
                                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{objetivo}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="prose max-w-none">
                          <h3 className="text-xl font-bold mb-4">Descripción de la lección</h3>
                          <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {selectedLesson.contenido || 'Contenido de la lección no disponible.'}
                          </div>
                        </div>

                        {selectedLesson.conceptos_clave && selectedLesson.conceptos_clave.length > 0 && (
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <h3 className="font-bold text-purple-900 mb-3">Conceptos Clave</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedLesson.conceptos_clave.map((concepto, idx) => (
                                <Badge key={idx} className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                                  {concepto}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {!selectedLesson.completado && (
                          <div className="flex justify-end gap-3 pt-6 border-t">
                            <Button
                              size="lg"
                              onClick={markLessonComplete}
                              disabled={markingComplete}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {markingComplete ? (
                                <>
                                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                  Marcando...
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-5 h-5 mr-2" />
                                  Marcar como completada
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="notas" className="mt-6">
                        <Card className="p-6">
                          <h3 className="font-bold mb-4">Mis Notas</h3>
                          <textarea
                            className="w-full min-h-[300px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="Escribe tus notas aquí..."
                            defaultValue={selectedLesson.notas_estudiante || ''}
                          />
                          <div className="flex justify-end mt-4">
                            <Button>Guardar Notas</Button>
                          </div>
                        </Card>
                      </TabsContent>

                      <TabsContent value="recursos" className="mt-6">
                        <Card className="p-6">
                          <h3 className="font-bold mb-4">Recursos Descargables</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                              <div className="flex items-center gap-3">
                                <FileText className="w-8 h-8 text-purple-600" />
                                <div>
                                  <p className="font-medium">Material de apoyo.pdf</p>
                                  <p className="text-sm text-slate-500">PDF • 2.4 MB</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Descargar
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </TabsContent>

                      <TabsContent value="discusion" className="mt-6">
                        <Card className="p-6">
                          <h3 className="font-bold mb-4">Foro de Discusión</h3>
                          <p className="text-slate-600">
                            Próximamente: Podrás discutir sobre esta lección con otros estudiantes.
                          </p>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                </Card>

                {/* Navegación entre lecciones */}
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const allLessons = modules.flatMap(m => m.lecciones)
                        const currentIndex = allLessons.findIndex(l => l.id === selectedLesson.id)
                        if (currentIndex > 0) {
                          setSelectedLesson(allLessons[currentIndex - 1])
                        }
                      }}
                      disabled={modules.flatMap(m => m.lecciones).findIndex(l => l.id === selectedLesson.id) === 0}
                    >
                      <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                      Lección Anterior
                    </Button>
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => {
                        const allLessons = modules.flatMap(m => m.lecciones)
                        const currentIndex = allLessons.findIndex(l => l.id === selectedLesson.id)
                        if (currentIndex < allLessons.length - 1) {
                          setSelectedLesson(allLessons[currentIndex + 1])
                        }
                      }}
                      disabled={
                        modules.flatMap(m => m.lecciones).findIndex(l => l.id === selectedLesson.id) === 
                        modules.flatMap(m => m.lecciones).length - 1
                      }
                    >
                      Siguiente Lección
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">Selecciona una lección para comenzar</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
