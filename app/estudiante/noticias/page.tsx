"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  BookOpen,
  Bell,
  LogOut,
  Home,
  TrendingUp,
  Newspaper,
  Calendar,
  Users,
  Award,
  Rocket,
  Lightbulb,
  Briefcase,
  GraduationCap,
  Clock,
  ArrowRight,
  User,
} from "lucide-react"

export default function NoticiasEventos() {
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

  const noticias = [
    {
      id: 1,
      titulo: "Nueva funcionalidad: Laboratorios Virtuales de Electrónica",
      categoria: "Tecnología",
      fecha: "Hace 2 horas",
      imagen: "⚡",
      extracto: "Ahora puedes simular circuitos electrónicos directamente desde la plataforma con integración de Tinkercad y Wokwi.",
      tipo: "novedad",
      color: "purple",
    },
    {
      id: 2,
      titulo: "Webinar: Inteligencia Artificial en la Educación del Futuro",
      categoria: "Evento",
      fecha: "15 de Noviembre, 2025",
      imagen: "🎯",
      extracto: "Únete a expertos internacionales en una discusión sobre cómo la IA está transformando la educación superior.",
      tipo: "evento",
      color: "blue",
      hora: "18:00 hrs",
    },
    {
      id: 3,
      titulo: "Actualización del Sistema de IA Tutora",
      categoria: "Actualización",
      fecha: "Hace 1 día",
      imagen: "🤖",
      extracto: "Nuestra IA tutora ahora puede proporcionar retroalimentación más personalizada basada en tu ritmo de aprendizaje.",
      tipo: "actualizacion",
      color: "green",
    },
    {
      id: 4,
      titulo: "Concurso de Innovación Tecnológica 2025",
      categoria: "Competencia",
      fecha: "Inscripciones abiertas",
      imagen: "🏆",
      extracto: "Presenta tu proyecto innovador y gana becas completas. Fecha límite: 30 de Noviembre.",
      tipo: "competencia",
      color: "orange",
    },
    {
      id: 5,
      titulo: "Nuevos Cursos de Certificación Profesional",
      categoria: "Cursos",
      fecha: "Hace 3 días",
      imagen: "📚",
      extracto: "Amplía tu oferta académica con 15 nuevos cursos certificados en Data Science, Cloud Computing y Ciberseguridad.",
      tipo: "novedad",
      color: "indigo",
    },
    {
      id: 6,
      titulo: "Hackathon Virtual: Soluciones para la Educación",
      categoria: "Evento",
      fecha: "20-22 de Noviembre, 2025",
      imagen: "💡",
      extracto: "72 horas de desarrollo colaborativo para crear herramientas educativas innovadoras.",
      tipo: "evento",
      color: "pink",
    },
  ]

  const proximosEventos = [
    {
      id: 1,
      titulo: "Sesión Q&A con Dr. Carlos Ruiz",
      fecha: "14 Nov",
      hora: "16:00",
      tipo: "Virtual",
    },
    {
      id: 2,
      titulo: "Workshop: Machine Learning Básico",
      fecha: "16 Nov",
      hora: "10:00",
      tipo: "Presencial",
    },
    {
      id: 3,
      titulo: "Networking Tech Students",
      fecha: "18 Nov",
      hora: "19:00",
      tipo: "Híbrido",
    },
  ]

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
              <Link href="/estudiante/mis-cursos" className="flex items-center gap-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-full transition-colors">
                <BookOpen className="w-4 h-4" />
                Mis Cursos
              </Link>
              <Link href="/estudiante/noticias" className="flex items-center gap-2 text-purple-600 font-medium hover:bg-purple-50 px-4 py-2 rounded-full transition-colors">
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

      <div className="max-w-7xl mx-auto px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Newspaper className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-light tracking-tight">Noticias y Eventos</h1>
              <p className="text-xl text-slate-500 font-light mt-2">Mantente al día con las últimas novedades</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal - Noticias */}
          <div className="lg:col-span-2 space-y-8">
            {noticias.map((noticia, index) => (
              <motion.div
                key={noticia.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-500 group">
                  <div className="flex gap-6">
                    <div className={`w-20 h-20 bg-gradient-to-br from-${noticia.color}-400 to-${noticia.color}-600 rounded-2xl flex items-center justify-center text-4xl shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                      {noticia.imagen}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={`bg-${noticia.color}-100 text-${noticia.color}-700 hover:bg-${noticia.color}-200`}>
                          {noticia.categoria}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Clock className="w-4 h-4" />
                          {noticia.fecha}
                        </div>
                      </div>
                      <h3 className="text-2xl font-medium mb-3 group-hover:text-purple-600 transition-colors">
                        {noticia.titulo}
                      </h3>
                      <p className="text-slate-600 mb-4 leading-relaxed">
                        {noticia.extracto}
                      </p>
                      <Button variant="ghost" className="text-purple-600 hover:bg-purple-50 rounded-full px-6 group-hover:gap-3 transition-all">
                        Leer más
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Sidebar - Próximos eventos */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-8 rounded-3xl border-0 shadow-lg sticky top-24">
                <div className="flex items-center gap-3 mb-8">
                  <Calendar className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-medium">Próximos Eventos</h2>
                </div>

                <div className="space-y-6">
                  {proximosEventos.map((evento, index) => (
                    <div
                      key={evento.id}
                      className="flex gap-4 p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 hover:shadow-md transition-all"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex flex-col items-center justify-center text-white">
                          <span className="text-xs font-medium">{evento.fecha.split(' ')[1]}</span>
                          <span className="text-xl font-bold">{evento.fecha.split(' ')[0]}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-2 text-sm">{evento.titulo}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {evento.hora}
                        </div>
                        <Badge className="mt-2 text-xs bg-purple-100 text-purple-700">
                          {evento.tipo}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full mt-8 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 rounded-full py-6 font-medium shadow-lg shadow-purple-200">
                  <Calendar className="w-4 h-4 mr-2" />
                  Ver todos los eventos
                </Button>
              </Card>
            </motion.div>

            {/* Categorías rápidas */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-8 rounded-3xl border-0 shadow-lg">
                <h3 className="text-xl font-medium mb-6">Categorías</h3>
                <div className="space-y-3">
                  {[
                    { nombre: "Tecnología", icono: Rocket, count: 12 },
                    { nombre: "Eventos", icono: Calendar, count: 8 },
                    { nombre: "Competencias", icono: Award, count: 5 },
                    { nombre: "Actualizaciones", icono: Lightbulb, count: 15 },
                  ].map((cat) => (
                    <button
                      key={cat.nombre}
                      className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-purple-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <cat.icono className="w-5 h-5 text-slate-400 group-hover:text-purple-600 transition-colors" />
                        <span className="font-medium">{cat.nombre}</span>
                      </div>
                      <Badge className="bg-slate-100 text-slate-600 group-hover:bg-purple-100 group-hover:text-purple-700">
                        {cat.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
