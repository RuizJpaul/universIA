"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import StudentNavbar from "@/components/student-navbar"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Send,
  Sparkles,
  User,
  Bot,
  Loader2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Leccion {
  id_leccion: number
  titulo: string
  descripcion: string
  tipo_contenido: string
  contenido: string
  url_video: string | null
  duracion_minutos: number
  objetivos_aprendizaje: string[]
  conceptos_clave: string[]
  curso_nombre: string
  modulo_titulo: string
  completado: boolean
}

interface LeccionNavegacion {
  id_leccion: number
  titulo: string
  orden: number
  completado: boolean
}

export default function LeccionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  const cursoId = params.id as string
  const leccionId = params.leccionId as string

  const [leccion, setLeccion] = useState<Leccion | null>(null)
  const [navegacion, setNavegacion] = useState<LeccionNavegacion[]>([])
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    if (status === "authenticated") {
      fetchLeccion()
      startIASession()
    }
  }, [status, leccionId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchLeccion = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/estudiante/curso/${cursoId}/leccion/${leccionId}`)
      const data = await res.json()

      if (data.success) {
        setLeccion(data.leccion)
        setNavegacion(data.navegacion)
      } else {
        toast({
          title: "Error",
          description: data.error || "No se pudo cargar la lección",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Error al cargar la lección",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

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

  const marcarCompletada = async () => {
    try {
      const res = await fetch(`/api/estudiante/progreso/leccion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leccionId: parseInt(leccionId),
          completado: true,
          porcentajeVisto: 100,
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: "¡Lección completada!",
          description: "Has completado esta lección exitosamente",
        })
        setLeccion(prev => prev ? { ...prev, completado: true } : null)
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo marcar como completada",
        variant: "destructive",
      })
    }
  }

  const getCurrentIndex = () => {
    return navegacion.findIndex(l => l.id_leccion === parseInt(leccionId))
  }

  const goToPrevious = () => {
    const currentIndex = getCurrentIndex()
    if (currentIndex > 0) {
      const prevLeccion = navegacion[currentIndex - 1]
      router.push(`/estudiante/curso/${cursoId}/leccion/${prevLeccion.id_leccion}`)
    }
  }

  const goToNext = () => {
    const currentIndex = getCurrentIndex()
    if (currentIndex < navegacion.length - 1) {
      const nextLeccion = navegacion[currentIndex + 1]
      router.push(`/estudiante/curso/${cursoId}/leccion/${nextLeccion.id_leccion}`)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!leccion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <p className="text-slate-600">Lección no encontrada</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <StudentNavbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push(`/estudiante/curso/${cursoId}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al curso
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">
                {leccion.curso_nombre} • {leccion.modulo_titulo}
              </p>
              <h1 className="text-3xl font-black">{leccion.titulo}</h1>
            </div>
            <Badge variant={leccion.completado ? "default" : "outline"}>
              {leccion.completado ? "Completada" : "En progreso"}
            </Badge>
          </div>
        </div>

        {/* Contenido principal: Avatar IA + Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Lado izquierdo: Avatar virtual */}
          <Card className="p-8">
            <div className="aspect-square bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center relative overflow-hidden">
              {/* Placeholder para el avatar */}
              <div className="text-center text-white">
                <Sparkles className="w-24 h-24 mx-auto mb-4 opacity-80" />
                <p className="text-xl font-bold">Tutor IA</p>
                <p className="text-sm opacity-80">Listo para ayudarte</p>
              </div>

              {/* Animación de fondo */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Información de la lección */}
            <div className="mt-6 space-y-4">
              {leccion.objetivos_aprendizaje.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Objetivos de aprendizaje</h3>
                  <ul className="space-y-1">
                    {leccion.objetivos_aprendizaje.map((obj, idx) => (
                      <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {leccion.conceptos_clave.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Conceptos clave</h3>
                  <div className="flex flex-wrap gap-2">
                    {leccion.conceptos_clave.map((concepto, idx) => (
                      <Badge key={idx} variant="secondary">
                        {concepto}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Lado derecho: Chat */}
          <Card className="flex flex-col h-[600px]">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-600" />
                <h2 className="font-semibold">Chat con Tutor IA</h2>
              </div>
              {!iaSessionStarted && !loadingIA && (
                <Button size="sm" onClick={startIASession}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Iniciar clase
                </Button>
              )}
              {loadingIA && (
                <Button size="sm" disabled>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Conectando...
                </Button>
              )}
            </div>

            {/* Mensajes */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
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
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
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
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
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

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Escribe tu mensaje..."
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={!iaSessionStarted || sending}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!iaSessionStarted || !inputMessage.trim() || sending}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Navegación y completar */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={goToPrevious}
              disabled={getCurrentIndex() === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            <Button onClick={marcarCompletada} disabled={leccion.completado}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {leccion.completado ? "Completada" : "Marcar como completada"}
            </Button>

            <Button
              variant="outline"
              onClick={goToNext}
              disabled={getCurrentIndex() === navegacion.length - 1}
            >
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
