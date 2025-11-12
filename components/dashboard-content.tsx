"use client"

import { Menu, Bell, User } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/components/progress-bar"

interface DashboardContentProps {
  onToggleSidebar: () => void
}

export function DashboardContent({ onToggleSidebar }: DashboardContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Top Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <button onClick={onToggleSidebar} className="text-foreground hover:text-primary transition">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-4">
          <button className="text-foreground hover:text-primary transition">
            <Bell className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">¡Bienvenido de vuelta!</h1>
          <p className="text-muted-foreground">Hoy es un gran día para aprender</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: "Cursos Activos", value: "5", color: "bg-primary/10 text-primary" },
            { label: "Horas Estudiadas", value: "24.5", color: "bg-secondary/10 text-secondary" },
            { label: "Puntos UniversIA", value: "1,240", color: "bg-accent/10 text-accent" },
          ].map((stat, idx) => (
            <Card key={idx} className="p-6">
              <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Courses Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Mis Cursos</h2>
            <Button variant="outline" className="text-foreground bg-transparent">
              Ver todos
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "React Avanzado",
                progress: 65,
                lessons: "8/12",
                instructor: "María García",
              },
              {
                title: "Machine Learning 101",
                progress: 45,
                lessons: "6/13",
                instructor: "Carlos López",
              },
              {
                title: "Finanzas Personales",
                progress: 80,
                lessons: "9/11",
                instructor: "Ana Martínez",
              },
              {
                title: "Emprendimiento Digital",
                progress: 30,
                lessons: "3/10",
                instructor: "Jorge Ruiz",
              },
            ].map((course, idx) => (
              <Card key={idx} className="p-6 cursor-pointer hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.instructor}</p>
                  </div>
                </div>
                <ProgressBar progress={course.progress} />
                <p className="text-xs text-muted-foreground mt-2">Lecciones: {course.lessons}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Tutor Suggestion */}
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Tu Tutor IA sugiere:</h3>
              <p className="text-muted-foreground">
                Basado en tu progreso, te recomendamos revisar los conceptos de Array Methods en React. Esto mejorará tu
                comprensión un 25%.
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap">
              Ver lección
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
