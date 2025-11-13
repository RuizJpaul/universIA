"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bot,
  Send,
  FlaskConical,
  BookOpen,
  Home,
  TrendingUp,
  Bell,
  LogOut,
  MessageCircle,
  Newspaper,
  ChevronRight,
  ExternalLink,
  Zap,
  CircuitBoard,
  Monitor,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function CursoConIA() {
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string
  const [chatMessages, setChatMessages] = useState<Array<{role: string, message: string}>>([
    {
      role: "assistant",
      message: "¡Hola! Soy tu tutor de IA para este curso. Estoy aquí para ayudarte a entender los conceptos, resolver dudas y guiarte en tus ejercicios. ¿En qué puedo ayudarte hoy?"
    }
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const courseData: { [key: string]: any } = {
    "1": {
      id: "1",
      title: "Desarrollo Web Full Stack",
      description: "Aprende a construir aplicaciones web modernas con IA como tu tutor personal",
      progress: 75,
      modules: [
        {
          id: 1,
          title: "Módulo 1: Fundamentos de HTML y CSS",
          progress: 100,
          topics: ["Estructura HTML básica", "Etiquetas semánticas", "CSS básico y selectores", "Flexbox y Grid", "Diseño responsive"]
        },
        {
          id: 2,
          title: "Módulo 2: JavaScript Moderno",
          progress: 100,
          topics: ["Variables y tipos de datos", "Funciones y scope", "Arrays y objetos", "ES6+ características", "Async/await"]
        },
        {
          id: 3,
          title: "Módulo 3: React Fundamentals",
          progress: 60,
          topics: ["JSX y componentes", "Props y estado", "React Hooks", "Context API", "Custom hooks"]
        },
        {
          id: 4,
          title: "Módulo 4: Backend con Node.js",
          progress: 0,
          topics: ["Introducción a Node.js", "Express.js", "APIs RESTful", "MongoDB", "Autenticación JWT"]
        }
      ],
      labs: [
        {
          id: 1,
          name: "Tinkercad",
          description: "Simulador de circuitos electrónicos y Arduino",
          icon: "⚡",
          url: "https://www.tinkercad.com/",
          category: "Electrónica",
          status: "available"
        },
        {
          id: 2,
          name: "Wokwi",
          description: "Simulador ESP32, Arduino y Raspberry Pi Pico",
          icon: "🔌",
          url: "https://wokwi.com/",
          category: "Microcontroladores",
          status: "available"
        },
        {
          id: 3,
          name: "CodeSandbox",
          description: "IDE en línea para desarrollo web",
          icon: "💻",
          url: "https://codesandbox.io/",
          category: "Desarrollo Web",
          status: "available"
        },
        {
          id: 4,
          name: "Replit",
          description: "Entorno de desarrollo colaborativo",
          icon: "🚀",
          url: "https://replit.com/",
          category: "Programación",
          status: "available"
        }
      ]
    },
    "2": {
      id: "2",
      title: "Machine Learning con Python",
      description: "Domina el aprendizaje automático con IA personalizada",
      progress: 45,
      modules: [
        {
          id: 1,
          title: "Módulo 1: Fundamentos de Python",
          progress: 100,
          topics: ["Sintaxis básica", "Estructuras de datos", "POO en Python", "Numpy y Pandas", "Matplotlib"]
        },
        {
          id: 2,
          title: "Módulo 2: Machine Learning Básico",
          progress: 45,
          topics: ["Regresión lineal", "Clasificación", "Árboles de decisión", "K-means", "Evaluación de modelos"]
        }
      ],
      labs: [
        {
          id: 1,
          name: "Google Colab",
          description: "Notebooks de Python con GPU gratis",
          icon: "🔬",
          url: "https://colab.research.google.com/",
          category: "Data Science",
          status: "available"
        },
        {
          id: 2,
          name: "Kaggle Notebooks",
          description: "Plataforma de competencias de ML",
          icon: "📊",
          url: "https://www.kaggle.com/",
          category: "Machine Learning",
          status: "available"
        }
      ]
    },
    "3": {
      id: "3",
      title: "Diseño UX/UI Profesional",
      description: "Crea experiencias increíbles con orientación de IA",
      progress: 20,
      modules: [
        {
          id: 1,
          title: "Módulo 1: Principios de Diseño",
          progress: 20,
          topics: ["Teoría del color", "Tipografía", "Composición", "Espaciado y alineación", "Jerarquía visual"]
        }
      ],
      labs: [
        {
          id: 1,
          name: "Figma",
          description: "Herramienta de diseño colaborativo",
          icon: "🎨",
          url: "https://www.figma.com/",
          category: "Diseño",
          status: "available"
        }
      ]
    }
  }

  const course = courseData[courseId] || courseData["1"]

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return

    setChatMessages([...chatMessages, { role: "user", message: inputMessage }])
    setInputMessage("")
    setIsTyping(true)

    setTimeout(() => {
      const responses = [
        "Excelente pregunta. Basándome en el módulo actual, te puedo explicar que...",
        "Entiendo tu duda. Este concepto es fundamental porque...",
        "Déjame ayudarte con eso. La forma correcta de abordar esto es...",
        "Muy bien, veo que estás en el tema correcto. Para profundizar...",
        "Perfecto, puedo guiarte paso a paso en este ejercicio..."
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      setChatMessages(prev => [...prev, { 
        role: "assistant", 
        message: `${randomResponse} En este punto del curso, es importante que practiques con los laboratorios virtuales disponibles. ¿Te gustaría que te explique algún concepto específico?` 
      }])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-light tracking-wide hover:opacity-80 transition">
              UNIVERSIA
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/estudiante/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-full transition-colors">
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link href="/estudiante/mis-cursos" className="flex items-center gap-2 text-purple-600 font-medium hover:bg-purple-50 px-4 py-2 rounded-full transition-colors">
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

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header del curso */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link href="/estudiante/mis-cursos" className="hover:text-purple-600">Mis Cursos</Link>
            <ChevronRight className="w-4 h-4" />
            <span>{course.title}</span>
          </div>
          
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-light tracking-tight mb-3">{course.title}</h1>
              <p className="text-lg text-slate-600 font-light">{course.description}</p>
            </div>
            <Badge className="bg-purple-100 text-purple-700 px-4 py-2">
              {course.progress}% Completado
            </Badge>
          </div>

          <Progress value={course.progress} className="h-2" />
        </motion.div>

        <Tabs defaultValue="ia-tutor" className="space-y-8">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-2xl">
            <TabsTrigger value="ia-tutor" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Bot className="w-4 h-4 mr-2" />
              IA Tutor
            </TabsTrigger>
            <TabsTrigger value="modulos" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <BookOpen className="w-4 h-4 mr-2" />
              Módulos
            </TabsTrigger>
            <TabsTrigger value="laboratorios" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <FlaskConical className="w-4 h-4 mr-2" />
              Laboratorios
            </TabsTrigger>
          </TabsList>

          {/* Tab IA Tutor */}
          <TabsContent value="ia-tutor" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chat principal */}
              <div className="lg:col-span-2">
                <Card className="rounded-3xl border-0 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-6 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-medium">Tutor IA</h2>
                        <p className="text-purple-100 text-sm">Disponible 24/7 para ayudarte</p>
                      </div>
                    </div>
                  </div>

                  <ScrollArea className="h-[500px] p-6">
                    <div className="space-y-4">
                      {chatMessages.map((msg, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] rounded-2xl p-4 ${
                            msg.role === 'user' 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            <p className="text-sm leading-relaxed">{msg.message}</p>
                          </div>
                        </motion.div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-slate-100 rounded-2xl p-4">
                            <div className="flex gap-2">
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  <div className="p-6 border-t border-slate-100">
                    <div className="flex gap-3">
                      <Input
                        placeholder="Escribe tu pregunta o duda..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="rounded-full border-slate-200 focus:border-purple-600"
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 rounded-full px-6"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-slate-400 mt-3 text-center">
                      La IA está entrenada en todo el contenido del curso
                    </p>
                  </div>
                </Card>
              </div>

              {/* Módulos rápidos */}
              <div>
                <Card className="rounded-3xl border-0 shadow-lg p-6">
                  <h3 className="text-xl font-medium mb-6">Progreso por Módulo</h3>
                  <div className="space-y-4">
                    {course.modules.map((module: any) => (
                      <div key={module.id} className="p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-sm">{module.title}</h4>
                          <Badge className="bg-purple-100 text-purple-700 text-xs">
                            {module.progress}%
                          </Badge>
                        </div>
                        <Progress value={module.progress} className="h-1.5 mb-3" />
                        <div className="space-y-1">
                          {module.topics.slice(0, 3).map((topic: string, idx: number) => (
                            <p key={idx} className="text-xs text-slate-500">• {topic}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 rounded-full py-6">
                    Continuar aprendiendo
                  </Button>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tab Módulos */}
          <TabsContent value="modulos" className="mt-8">
            <div className="grid gap-6">
              {course.modules.map((module: any, index: number) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="rounded-3xl border-0 shadow-lg p-8 hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
                            module.progress === 100 ? 'bg-green-500' : 
                            module.progress > 0 ? 'bg-purple-500' : 'bg-slate-300'
                          }`}>
                            {module.progress === 100 ? '✓' : index + 1}
                          </div>
                          <div>
                            <h3 className="text-2xl font-medium">{module.title}</h3>
                            <p className="text-sm text-slate-500 mt-1">{module.topics.length} temas • {module.progress}% completado</p>
                          </div>
                        </div>
                        <Progress value={module.progress} className="h-2 mb-4" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {module.topics.map((topic: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm text-slate-700">{topic}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 rounded-full">
                        {module.progress === 0 ? 'Comenzar módulo' : module.progress === 100 ? 'Revisar' : 'Continuar'}
                      </Button>
                      <Button variant="outline" className="rounded-full px-6">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Preguntar a IA
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Tab Laboratorios Virtuales */}
          <TabsContent value="laboratorios" className="mt-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="rounded-3xl border-0 shadow-lg p-8 mb-8 bg-gradient-to-br from-purple-50 to-purple-100/50">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                    <FlaskConical className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-light mb-3">Laboratorios Virtuales</h2>
                    <p className="text-slate-600 leading-relaxed">
                      Practica tus conocimientos en entornos simulados profesionales. Estos laboratorios te permiten 
                      experimentar sin riesgos y obtener feedback instantáneo de la IA.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {course.labs.map((lab: any, index: number) => (
                  <motion.div
                    key={lab.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="rounded-3xl border-0 shadow-lg p-8 hover:shadow-xl transition-all group">
                      <div className="flex items-start gap-6 mb-6">
                        <div className="text-6xl">{lab.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-2xl font-medium group-hover:text-purple-600 transition-colors">
                              {lab.name}
                            </h3>
                            <Badge className="bg-green-100 text-green-700">
                              {lab.status === 'available' ? 'Disponible' : 'Próximamente'}
                            </Badge>
                          </div>
                          <Badge className="bg-purple-100 text-purple-700 mb-3">
                            {lab.category}
                          </Badge>
                          <p className="text-slate-600 leading-relaxed">
                            {lab.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 rounded-full"
                          onClick={() => window.open(lab.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Abrir Laboratorio
                        </Button>
                        <Button variant="outline" className="rounded-full px-6">
                          <Bot className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="mt-6 pt-6 border-t border-slate-100 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Zap className="w-4 h-4 text-purple-600" />
                          <span>Feedback en tiempo real</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CircuitBoard className="w-4 h-4 text-purple-600" />
                          <span>Simulación realista</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Monitor className="w-4 h-4 text-purple-600" />
                          <span>Integrado con el curso</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
