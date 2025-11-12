"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Clock } from "lucide-react"

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  duration: string
  type: "webinar" | "workshop" | "conference" | "meetup"
  location: string
  speaker: string
  attendees: number
  capacity: number
  registered: boolean
}

interface EventsCalendarProps {
  searchQuery: string
}

export function EventsCalendar({ searchQuery }: EventsCalendarProps) {
  const events: Event[] = [
    {
      id: 1,
      title: "Webinar: AI en Desarrollo Web",
      description: "Descubre cómo integrar inteligencia artificial en tus proyectos web con ejemplos prácticos.",
      date: "15 de Noviembre",
      time: "18:00 - 19:30",
      duration: "1.5 horas",
      type: "webinar",
      location: "En línea",
      speaker: "Dr. Juan Martínez",
      attendees: 342,
      capacity: 500,
      registered: false,
    },
    {
      id: 2,
      title: "Workshop: React Avanzado",
      description: "Un taller interactivo sobre patrones avanzados de React con ejercicios prácticos.",
      date: "18 de Noviembre",
      time: "14:00 - 17:00",
      duration: "3 horas",
      type: "workshop",
      location: "Centro UniversIA, Madrid",
      speaker: "María García",
      attendees: 45,
      capacity: 50,
      registered: true,
    },
    {
      id: 3,
      title: "Conferencia: Futuros del Trabajo",
      description: "Panel de expertos discutiendo el futuro del trabajo en tecnología y educación.",
      date: "22 de Noviembre",
      time: "09:00 - 12:00",
      duration: "3 horas",
      type: "conference",
      location: "Auditorio Principal",
      speaker: "Panel de Expertos",
      attendees: 280,
      capacity: 500,
      registered: false,
    },
    {
      id: 4,
      title: "Meetup: Comunidad de Desarrolladores",
      description: "Networking y charlas cortas de la comunidad de desarrolladores UniversIA.",
      date: "25 de Noviembre",
      time: "19:00 - 21:00",
      duration: "2 horas",
      type: "meetup",
      location: "Café Tech Hub, Barcelona",
      speaker: "Comunidad",
      attendees: 67,
      capacity: 100,
      registered: false,
    },
    {
      id: 5,
      title: "Webinar: Careers in Tech",
      description: "Aprende cómo construir una carrera exitosa en el sector tecnológico.",
      date: "29 de Noviembre",
      time: "17:00 - 18:30",
      duration: "1.5 horas",
      type: "webinar",
      location: "En línea",
      speaker: "Ana Rodríguez",
      attendees: 156,
      capacity: 500,
      registered: false,
    },
    {
      id: 6,
      title: "Workshop: Machine Learning Práctico",
      description: "Aprende ML desde cero con proyectos reales y datasets públicos.",
      date: "02 de Diciembre",
      time: "15:00 - 18:00",
      duration: "3 horas",
      type: "workshop",
      location: "Centro UniversIA, México",
      speaker: "Carlos López",
      attendees: 38,
      capacity: 40,
      registered: false,
    },
  ]

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getTypeColor = (type: Event["type"]) => {
    switch (type) {
      case "webinar":
        return "bg-blue-500/10 text-blue-600"
      case "workshop":
        return "bg-green-500/10 text-green-600"
      case "conference":
        return "bg-purple-500/10 text-purple-600"
      case "meetup":
        return "bg-orange-500/10 text-orange-600"
    }
  }

  const getTypeLabel = (type: Event["type"]) => {
    const labels = {
      webinar: "Webinar",
      workshop: "Taller",
      conference: "Conferencia",
      meetup: "Meetup",
    }
    return labels[type]
  }

  return (
    <div className="space-y-4">
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event) => (
          <Card key={event.id} className="p-6 hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Date Box */}
              <div className="md:w-24 flex-shrink-0">
                <div className="bg-primary/10 rounded-lg p-3 text-center">
                  <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-xs font-semibold text-foreground text-pretty">{event.date}</p>
                  <p className="text-xs text-muted-foreground mt-1">{event.time}</p>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">{event.description}</p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap ${getTypeColor(event.type)}`}
                  >
                    {getTypeLabel(event.type)}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{event.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>
                      {event.attendees}/{event.capacity}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold">{event.speaker}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-border">
                  {event.registered ? (
                    <Button disabled size="sm" variant="outline">
                      Ya registrado
                    </Button>
                  ) : (
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Registrarse
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    Más info
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No se encontraron eventos.</p>
        </Card>
      )}
    </div>
  )
}
