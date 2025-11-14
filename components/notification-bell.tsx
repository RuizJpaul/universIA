"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bell,
  CheckCheck,
  Calendar,
  Trophy,
  FileText,
  Newspaper,
  AlertCircle,
  Info,
  CheckCircle,
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { motion, AnimatePresence } from "framer-motion"

interface Notification {
  tipo: string
  categoria: string
  titulo: string
  mensaje: string
  fecha: string
  leido: boolean
  prioridad: 'urgente' | 'importante' | 'info' | 'exito'
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/estudiante/notificaciones')
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setNotifications(data.notifications)
          setUnreadCount(data.unreadCount)
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch on mount and periodically
  useEffect(() => {
    fetchNotifications()
    
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    
    return () => clearInterval(interval)
  }, [])

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await fetch('/api/estudiante/notificaciones', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true }),
      })
      
      setNotifications(prev => prev.map(n => ({ ...n, leido: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  // Get icon by type
  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'noticia':
        return <Newspaper className="w-5 h-5" />
      case 'evento':
        return <Calendar className="w-5 h-5" />
      case 'evaluacion':
        return <FileText className="w-5 h-5" />
      case 'logro':
        return <Trophy className="w-5 h-5" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  // Get color by priority
  const getColor = (prioridad: string) => {
    switch (prioridad) {
      case 'urgente':
        return 'from-red-500 to-red-600'
      case 'importante':
        return 'from-purple-500 to-purple-600'
      case 'exito':
        return 'from-green-500 to-green-600'
      default:
        return 'from-blue-500 to-blue-600'
    }
  }

  // Format time ago
  const formatTimeAgo = (fecha: string) => {
    const date = new Date(fecha)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Ahora'
    if (minutes < 60) return `Hace ${minutes} min`
    if (hours < 24) return `Hace ${hours}h`
    if (days < 7) return `Hace ${days}d`
    
    return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-purple-50 relative"
        >
          <Bell className="w-5 h-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
              >
                <span className="text-[10px] text-white font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-lg">Notificaciones</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              Marcar todas
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <Bell className="w-12 h-12 mb-2" />
              <p className="text-sm">No hay notificaciones</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 mb-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors ${
                    !notification.leido ? 'bg-purple-50/50' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${getColor(
                        notification.prioridad
                      )} flex items-center justify-center text-white shrink-0`}
                    >
                      {getIcon(notification.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-sm line-clamp-1">
                          {notification.titulo}
                        </p>
                        <span className="text-xs text-slate-400 shrink-0">
                          {formatTimeAgo(notification.fecha)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {notification.mensaje}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-xs"
                        >
                          {notification.categoria}
                        </Badge>
                        {notification.prioridad === 'urgente' && (
                          <Badge className="text-xs bg-red-100 text-red-700 border-red-200">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Urgente
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-200">
            <Button
              variant="ghost"
              className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              onClick={() => setIsOpen(false)}
            >
              Ver todas las notificaciones
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
