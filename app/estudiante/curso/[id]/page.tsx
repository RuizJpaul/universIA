"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Play,
  CheckCircle2,
  Lock,
  Download,
  FileText,
  Video,
  BookOpen,
  Star,
  Clock,
  Users,
  Award,
  Share2,
  Heart,
  ChevronRight,
  Home,
  TrendingUp,
  Bell,
  LogOut,
  MessageCircle,
  ThumbsUp,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function CursoDetalle() {
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string
  const [activeLesson, setActiveLesson] = useState(0)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  // Datos del curso (en una app real vendría de una API)
  const courseData: { [key: string]: any } = {
    "1": {
      id: "1",
      title: "Desarrollo Web Full Stack",
      instructor: {
        name: "Dr. Carlos Ruiz",
        avatar: "👨‍🏫",
        title: "Full Stack Developer & Educator",
        students: "50,000+",
        rating: 4.9,
      },
      category: "Tecnología",
      progress: 75,
      image: "💻",
      rating: 4.8,
      reviews: 3245,
      students: "3,245 estudiantes",
      duration: "12 semanas",
      level: "Intermedio",
      language: "Español",
      lastUpdate: "Octubre 2024",
      description: "Aprende a construir aplicaciones web modernas desde cero. Domina HTML, CSS, JavaScript, React, Node.js y bases de datos.",
      whatYouLearn: [
        "Crear interfaces modernas con HTML5 y CSS3",
        "Desarrollar aplicaciones interactivas con JavaScript",
        "Construir SPAs con React y hooks avanzados",
        "Crear APIs RESTful con Node.js y Express",
        "Trabajar con bases de datos MongoDB y SQL",
        "Desplegar aplicaciones en producción",
      ],
      requirements: [
        "Conocimientos básicos de programación",
        "Computadora con acceso a internet",
        "Ganas de aprender y dedicación",
      ],
      modules: [
        {
          title: "Módulo 1: Fundamentos de HTML y CSS",
          lessons: 12,
          duration: "3h 45min",
          completed: 12,
          lessons_detail: [
            { id: 1, title: "Introducción al desarrollo web", duration: "15:30", type: "video", completed: true },
            { id: 2, title: "Estructura HTML básica", duration: "20:15", type: "video", completed: true },
            { id: 3, title: "Etiquetas semánticas", duration: "18:45", type: "video", completed: true },
            { id: 4, title: "CSS básico y selectores", duration: "25:30", type: "video", completed: true },
            { id: 5, title: "Box model y layout", duration: "22:15", type: "video", completed: true },
            { id: 6, title: "Flexbox en profundidad", duration: "28:45", type: "video", completed: true },
            { id: 7, title: "CSS Grid", duration: "30:00", type: "video", completed: true },
            { id: 8, title: "Diseño responsive", duration: "25:15", type: "video", completed: true },
            { id: 9, title: "Ejercicio práctico 1", duration: "30:00", type: "exercise", completed: true },
            { id: 10, title: "Recursos descargables", duration: "5:00", type: "resource", completed: true },
            { id: 11, title: "Quiz módulo 1", duration: "15:00", type: "quiz", completed: true },
            { id: 12, title: "Proyecto: Landing page", duration: "45:00", type: "project", completed: true },
          ],
        },
        {
          title: "Módulo 2: JavaScript Moderno",
          lessons: 16,
          duration: "5h 20min",
          completed: 16,
          lessons_detail: [
            { id: 13, title: "Introducción a JavaScript", duration: "18:30", type: "video", completed: true },
            { id: 14, title: "Variables y tipos de datos", duration: "22:15", type: "video", completed: true },
            { id: 15, title: "Operadores y expresiones", duration: "20:45", type: "video", completed: true },
            { id: 16, title: "Estructuras de control", duration: "25:30", type: "video", completed: true },
            { id: 17, title: "Funciones y scope", duration: "28:15", type: "video", completed: true },
            { id: 18, title: "Arrays y métodos", duration: "30:00", type: "video", completed: true },
            { id: 19, title: "Objetos en JavaScript", duration: "25:45", type: "video", completed: true },
            { id: 20, title: "ES6+ características", duration: "32:30", type: "video", completed: true },
            { id: 21, title: "Arrow functions", duration: "18:15", type: "video", completed: true },
            { id: 22, title: "Destructuring y spread", duration: "20:00", type: "video", completed: true },
            { id: 23, title: "Promesas y async/await", duration: "35:45", type: "video", completed: true },
            { id: 24, title: "Módulos ES6", duration: "22:30", type: "video", completed: true },
            { id: 25, title: "Ejercicios prácticos", duration: "40:00", type: "exercise", completed: true },
            { id: 26, title: "DOM manipulation", duration: "28:15", type: "video", completed: true },
            { id: 27, title: "Eventos y listeners", duration: "25:00", type: "video", completed: true },
            { id: 28, title: "Proyecto: App interactiva", duration: "60:00", type: "project", completed: true },
          ],
        },
        {
          title: "Módulo 3: React Fundamentals",
          lessons: 14,
          duration: "4h 50min",
          completed: 8,
          lessons_detail: [
            { id: 29, title: "¿Qué es React?", duration: "15:30", type: "video", completed: true },
            { id: 30, title: "Configuración del entorno", duration: "20:15", type: "video", completed: true },
            { id: 31, title: "JSX y componentes", duration: "25:45", type: "video", completed: true },
            { id: 32, title: "Props y estado", duration: "28:30", type: "video", completed: true },
            { id: 33, title: "Eventos en React", duration: "22:15", type: "video", completed: true },
            { id: 34, title: "Listas y keys", duration: "20:00", type: "video", completed: true },
            { id: 35, title: "Renderizado condicional", duration: "18:45", type: "video", completed: true },
            { id: 36, title: "Forms en React", duration: "25:30", type: "video", completed: true },
            { id: 37, title: "React Hooks Avanzados", duration: "32:15", type: "video", completed: false },
            { id: 38, title: "useEffect en detalle", duration: "28:45", type: "video", completed: false },
            { id: 39, title: "Custom hooks", duration: "30:00", type: "video", completed: false },
            { id: 40, title: "Context API", duration: "25:30", type: "video", completed: false },
            { id: 41, title: "Ejercicios React", duration: "45:00", type: "exercise", completed: false },
            { id: 42, title: "Proyecto: Dashboard", duration: "75:00", type: "project", completed: false },
          ],
        },
        {
          title: "Módulo 4: Backend con Node.js",
          lessons: 12,
          duration: "4h 15min",
          completed: 0,
          lessons_detail: [
            { id: 43, title: "Introducción a Node.js", duration: "18:30", type: "video", completed: false },
            { id: 44, title: "NPM y dependencias", duration: "20:15", type: "video", completed: false },
            { id: 45, title: "Express.js básico", duration: "25:45", type: "video", completed: false },
            { id: 46, title: "Routing y middleware", duration: "28:30", type: "video", completed: false },
            { id: 47, title: "REST APIs", duration: "30:00", type: "video", completed: false },
            { id: 48, title: "MongoDB y Mongoose", duration: "32:15", type: "video", completed: false },
            { id: 49, title: "Autenticación JWT", duration: "35:45", type: "video", completed: false },
            { id: 50, title: "Validación de datos", duration: "22:30", type: "video", completed: false },
            { id: 51, title: "Manejo de errores", duration: "20:15", type: "video", completed: false },
            { id: 52, title: "Testing APIs", duration: "28:45", type: "video", completed: false },
            { id: 53, title: "Despliegue en producción", duration: "25:30", type: "video", completed: false },
            { id: 54, title: "Proyecto Final", duration: "90:00", type: "project", completed: false },
          ],
        },
      ],
      resources: [
        { name: "Código fuente completo", type: "zip", size: "15 MB" },
        { name: "Guía de referencia HTML/CSS", type: "pdf", size: "2.5 MB" },
        { name: "Cheat sheet JavaScript", type: "pdf", size: "1.8 MB" },
        { name: "Plantillas de proyectos", type: "zip", size: "8 MB" },
      ],
    },
  }

  const course = courseData[courseId]

  if (!course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Curso no encontrado</h1>
          <Link href="/estudiante/mis-cursos">
            <Button className="bg-purple-600 hover:bg-purple-700">Volver a Mis Cursos</Button>
          </Link>
        </div>
      </div>
    )
  }

  const totalLessons = course.modules.reduce((acc: number, mod: any) => acc + mod.lessons, 0)
  const completedLessons = course.modules.reduce((acc: number, mod: any) => acc + mod.completed, 0)

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

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/estudiante/mis-cursos" className="hover:text-purple-600">Mis Cursos</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-bold">{course.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-6xl">{course.image}</div>
                <div className="flex-1">
                  <Badge variant="outline" className="mb-2 border-slate-300">
                    {course.category}
                  </Badge>
                  <h1 className="text-3xl md:text-4xl font-black mb-2">{course.title}</h1>
                  <p className="text-slate-600">{course.description}</p>
                </div>
              </div>

              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 text-sm text-slate-600 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{course.rating}</span>
                  <span>({course.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{course.students}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{totalLessons} lecciones</span>
                </div>
              </div>

              {/* Progress Bar */}
              <Card className="p-4 border-2 border-purple-200 bg-purple-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-purple-900">Tu progreso</span>
                  <span className="text-2xl font-black text-purple-600">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-3 mb-2" />
                <p className="text-sm text-purple-700">
                  {completedLessons} de {totalLessons} lecciones completadas
                </p>
              </Card>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-100">
                  <TabsTrigger value="content" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    Contenido
                  </TabsTrigger>
                  <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    Resumen
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    Recursos
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    Reviews
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="mt-6">
                  <Card className="border-2 border-slate-200">
                    <div className="p-6">
                      <h3 className="text-xl font-black mb-4">Contenido del Curso</h3>
                      <Accordion type="single" collapsible className="space-y-4">
                        {course.modules.map((module: any, index: number) => (
                          <AccordionItem key={index} value={`module-${index}`} className="border-2 border-slate-200 rounded-lg px-4">
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center justify-between w-full pr-4">
                                <div className="text-left">
                                  <p className="font-black">{module.title}</p>
                                  <p className="text-sm text-slate-600 mt-1">
                                    {module.lessons} lecciones • {module.duration} • {module.completed}/{module.lessons} completadas
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {module.completed === module.lessons && (
                                    <Badge className="bg-green-100 text-green-700 border-green-300">
                                      Completado
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 mt-4">
                                {module.lessons_detail.map((lesson: any) => (
                                  <div
                                    key={lesson.id}
                                    className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                                      lesson.completed
                                        ? "bg-green-50 border-green-200"
                                        : "bg-slate-50 border-slate-200"
                                    } hover:border-purple-600 transition-all cursor-pointer`}
                                  >
                                    <div className="flex items-center gap-3">
                                      {lesson.completed ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                      ) : lesson.id > 36 ? (
                                        <Lock className="w-5 h-5 text-slate-400" />
                                      ) : (
                                        <Play className="w-5 h-5 text-purple-600" />
                                      )}
                                      <div>
                                        <p className={`font-bold ${lesson.completed ? "text-green-900" : ""}`}>
                                          {lesson.title}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                                          {lesson.type === "video" && <Video className="w-3 h-3" />}
                                          {lesson.type === "exercise" && <FileText className="w-3 h-3" />}
                                          {lesson.type === "quiz" && <Award className="w-3 h-3" />}
                                          {lesson.type === "project" && <BookOpen className="w-3 h-3" />}
                                          <span>{lesson.duration}</span>
                                        </div>
                                      </div>
                                    </div>
                                    {!lesson.completed && lesson.id <= 36 && (
                                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                        {lesson.id === 37 ? "Continuar" : "Ver"}
                                      </Button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="overview" className="mt-6">
                  <Card className="border-2 border-slate-200 p-6">
                    <h3 className="text-xl font-black mb-4">¿Qué aprenderás?</h3>
                    <div className="grid md:grid-cols-2 gap-3 mb-6">
                      {course.whatYouLearn.map((item: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                          <p className="text-slate-700">{item}</p>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-xl font-black mb-4 mt-8">Requisitos</h3>
                    <ul className="space-y-2">
                      {course.requirements.map((req: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-slate-700">
                          <ChevronRight className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </TabsContent>

                <TabsContent value="resources" className="mt-6">
                  <Card className="border-2 border-slate-200 p-6">
                    <h3 className="text-xl font-black mb-4">Recursos Descargables</h3>
                    <div className="space-y-3">
                      {course.resources.map((resource: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-purple-600 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-bold">{resource.name}</p>
                              <p className="text-sm text-slate-600">{resource.type.toUpperCase()} • {resource.size}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="border-2 border-slate-200">
                            <Download className="w-4 h-4 mr-2" />
                            Descargar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <Card className="border-2 border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-black">Valoraciones</h3>
                      <div className="flex items-center gap-2">
                        <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-black">{course.rating}</span>
                        <span className="text-slate-600">({course.reviews} reviews)</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { name: "María González", rating: 5, comment: "Excelente curso, muy completo y bien explicado. El instructor es muy claro.", date: "Hace 2 días" },
                        { name: "Juan Pérez", rating: 5, comment: "Me encantó! Los proyectos prácticos son muy útiles.", date: "Hace 1 semana" },
                        { name: "Ana Silva", rating: 4, comment: "Muy buen contenido, aunque algunos temas podrían profundizarse más.", date: "Hace 2 semanas" },
                      ].map((review, index) => (
                        <div key={index} className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-bold">{review.name}</p>
                              <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-slate-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-slate-500">{review.date}</span>
                          </div>
                          <p className="text-slate-700">{review.comment}</p>
                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <button className="flex items-center gap-1 text-slate-600 hover:text-purple-600">
                              <ThumbsUp className="w-4 h-4" />
                              Útil (12)
                            </button>
                            <button className="flex items-center gap-1 text-slate-600 hover:text-purple-600">
                              <MessageCircle className="w-4 h-4" />
                              Responder
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructor Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-2 border-slate-200 p-6">
                <h3 className="font-black mb-4">Instructor</h3>
                <div className="text-center">
                  <div className="text-6xl mb-3">{course.instructor.avatar}</div>
                  <h4 className="font-black text-lg">{course.instructor.name}</h4>
                  <p className="text-sm text-slate-600 mb-4">{course.instructor.title}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-2xl font-black text-purple-600">{course.instructor.rating}</p>
                      <p className="text-xs text-slate-600">Rating</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-2xl font-black text-purple-600">{course.instructor.students}</p>
                      <p className="text-xs text-slate-600">Estudiantes</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full border-2 border-slate-200">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contactar
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-2 border-slate-200 p-6">
                <h3 className="font-black mb-4">Acciones Rápidas</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 font-bold">
                    <Play className="w-4 h-4 mr-2" />
                    Continuar Lección
                  </Button>
                  <Button variant="outline" className="w-full border-2 border-slate-200">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar Recursos
                  </Button>
                  <Button variant="outline" className="w-full border-2 border-slate-200">
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir Curso
                  </Button>
                  <Button variant="outline" className="w-full border-2 border-slate-200">
                    <Heart className="w-4 h-4 mr-2" />
                    Guardar en Favoritos
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Course Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-2 border-slate-200 p-6">
                <h3 className="font-black mb-4">Información</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Nivel:</span>
                    <span className="font-bold">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Idioma:</span>
                    <span className="font-bold">{course.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Duración:</span>
                    <span className="font-bold">{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Lecciones:</span>
                    <span className="font-bold">{totalLessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Última actualización:</span>
                    <span className="font-bold">{course.lastUpdate}</span>
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
