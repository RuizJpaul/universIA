"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { motion } from "framer-motion"
import StudentNavbar from "@/components/student-navbar"
import {
  Calendar,
  Users,
  Award,
  Rocket,
  Lightbulb,
  Briefcase,
  GraduationCap,
  Clock,
  ArrowRight,
  Newspaper,
} from "lucide-react"

export default function NoticiasEventos() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [noticiasData, setNoticiasData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  // Fetch noticias y eventos
  useEffect(() => {
    if (status === "authenticated") {
      async function fetchNoticias() {
        try {
          setLoading(true)
          const res = await fetch('/api/estudiante/noticias')
          
          if (!res.ok) {
            throw new Error('Error al cargar noticias')
          }
          
          const data = await res.json()
          
          if (data.success) {
            setNoticiasData(data)
          } else {
            throw new Error(data.error || 'Error desconocido')
          }
        } catch (err: any) {
          console.error('Error fetching noticias:', err)
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }

      fetchNoticias()
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

  const noticias = noticiasData?.noticias || []
  const proximosEventos = noticiasData?.eventos || []

  // Función para formatear fecha
  const formatFecha = (fecha: string) => {
    const date = new Date(fecha)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Hoy'
    if (days === 1) return 'Ayer'
    if (days < 7) return `Hace ${days} días`
    
    return date.toLocaleDateString('es-PE', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  // Mapeo de categorías a colores
  const getCategoriaColor = (categoria: string) => {
    const colores: any = {
      'Tecnología': 'purple',
      'Evento': 'blue',
      'Actualización': 'green',
      'Competencia': 'orange',
      'Cursos': 'indigo',
      'Comunidad': 'pink',
    }
    return colores[categoria] || 'gray'
  }

  // Mapeo de categorías a iconos
  const getCategoriaIcon = (categoria: string) => {
    const iconos: any = {
      'Tecnología': '⚡',
      'Evento': '🎯',
      'Actualización': '🤖',
      'Competencia': '🏆',
      'Cursos': '📚',
      'Comunidad': '💡',
    }
    return iconos[categoria] || '📰'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <StudentNavbar />

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
            {noticias && noticias.length > 0 ? (
              noticias.map((noticia: any, index: number) => {
                const color = getCategoriaColor(noticia.categoria)
                const icon = getCategoriaIcon(noticia.categoria)
                
                return (
                  <motion.div
                    key={noticia.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-8 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-500 group">
                      <div className="flex gap-6">
                        <div className={`w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-4xl shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                          {icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge className={`bg-purple-100 text-purple-700 hover:bg-purple-200`}>
                              {noticia.categoria || 'General'}
                            </Badge>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                              <Clock className="w-4 h-4" />
                              {formatFecha(noticia.fecha_publicacion)}
                            </div>
                          </div>
                          <h3 className="text-2xl font-medium mb-3 group-hover:text-purple-600 transition-colors">
                            {noticia.titulo}
                          </h3>
                          <p className="text-slate-600 mb-4 leading-relaxed">
                            {noticia.subtitulo || noticia.contenido?.substring(0, 150) + '...'}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <div className="flex items-center gap-1">
                              👁️ {noticia.visitas || 0} vistas
                            </div>
                            <div className="flex items-center gap-1">
                              ❤️ {noticia.likes_count || 0} me gusta
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })
            ) : (
              <Card className="p-12 text-center">
                <Newspaper className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">No hay noticias disponibles</p>
              </Card>
            )}
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
                  {proximosEventos && proximosEventos.length > 0 ? (
                    proximosEventos.map((evento: any, index: number) => {
                      const fecha = new Date(evento.fecha_inicio)
                      const dia = fecha.getDate()
                      const mes = fecha.toLocaleDateString('es-PE', { month: 'short' })
                      const hora = fecha.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
                      
                      return (
                        <div
                          key={evento.id}
                          className="flex gap-4 p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 hover:shadow-md transition-all"
                        >
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex flex-col items-center justify-center text-white">
                              <span className="text-xs font-medium">{mes}</span>
                              <span className="text-xl font-bold">{dia}</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium mb-2 text-sm">{evento.titulo}</h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Clock className="w-3 h-3" />
                              {hora}
                            </div>
                            <Badge className="mt-2 text-xs bg-purple-100 text-purple-700">
                              {evento.modalidad || evento.tipo}
                            </Badge>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-4">No hay eventos próximos</p>
                  )}
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
