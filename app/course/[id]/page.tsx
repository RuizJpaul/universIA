"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Menu, Bell, User, Play, Download, Share2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/components/progress-bar"

export default function CoursePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<"lessons" | "comments">("lessons")

  const courseData = {
    title: "React: De Cero a Experto",
    instructor: "María García",
    rating: 4.9,
    progress: 65,
    description:
      "Aprende React desde los conceptos básicos hasta técnicas avanzadas. Incluye proyectos reales y mejores prácticas de la industria.",
  }

  const lessons = [
    { id: 1, title: "Introducción a React", duration: "15 min", completed: true },
    { id: 2, title: "JSX y Componentes", duration: "20 min", completed: true },
    { id: 3, title: "Props y State", duration: "25 min", completed: true },
    { id: 4, title: "Hooks Fundamentales", duration: "30 min", completed: false },
    { id: 5, title: "Context API", duration: "25 min", completed: false },
    { id: 6, title: "Custom Hooks", duration: "28 min", completed: false },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} />

      <main className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-foreground hover:text-primary transition"
          >
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

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Video Player */}
          <div className="space-y-4">
            <div className="bg-secondary/20 rounded-lg aspect-video flex items-center justify-center">
              <button className="w-16 h-16 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition">
                <Play className="w-7 h-7 text-primary-foreground ml-1" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{courseData.title}</h1>
                <p className="text-muted-foreground">por {courseData.instructor}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar
                </Button>
              </div>
            </div>
          </div>

          {/* Course Info */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Descripción</h2>
                <p className="text-muted-foreground">{courseData.description}</p>
              </Card>

              {/* Tabs */}
              <Card className="p-0 overflow-hidden">
                <div className="flex border-b border-border">
                  <button
                    onClick={() => setActiveTab("lessons")}
                    className={`flex-1 px-6 py-3 font-medium transition-colors ${
                      activeTab === "lessons"
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Lecciones
                  </button>
                  <button
                    onClick={() => setActiveTab("comments")}
                    className={`flex-1 px-6 py-3 font-medium transition-colors ${
                      activeTab === "comments"
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Comentarios
                  </button>
                </div>

                <div className="p-6">
                  {activeTab === "lessons" && (
                    <div className="space-y-3">
                      {lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              lesson.completed ? "bg-primary border-primary" : "border-muted-foreground"
                            }`}
                          >
                            {lesson.completed && <span className="text-primary-foreground text-xs">✓</span>}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{lesson.title}</p>
                          </div>
                          <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "comments" && (
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0"></div>
                        <div className="flex-1">
                          <textarea
                            placeholder="Agrega tu comentario..."
                            className="w-full px-4 py-2 bg-muted border border-input rounded-lg text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50"
                            rows={3}
                          ></textarea>
                          <Button className="mt-2 bg-primary hover:bg-primary/90">Comentar</Button>
                        </div>
                      </div>

                      {/* Sample Comments */}
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3 border-t border-border pt-4">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">Usuario {i}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Este curso es excelente. Las explicaciones son muy claras y los ejemplos son muy útiles.
                            </p>
                            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                              <button className="hover:text-primary">Me gusta</button>
                              <button className="hover:text-primary">Responder</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar - Course Summary */}
            <div className="space-y-4">
              <Card className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Progreso del curso</p>
                  <ProgressBar progress={courseData.progress} />
                  <p className="text-sm text-muted-foreground mt-2">{courseData.progress}% completado</p>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90">Continuar aprendiendo</Button>

                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lecciones completadas</span>
                    <span className="font-semibold text-foreground">3/6</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Certificado</span>
                    <span className="font-semibold text-foreground">50% para obtener</span>
                  </div>
                </div>
              </Card>

              {/* Recursos Descargables */}
              <Card className="p-6 space-y-3">
                <h3 className="font-semibold text-foreground">Recursos</h3>
                <div className="space-y-2">
                  {["Slides.pdf", "Código fuente.zip", "Ejercicios.pdf"].map((resource, i) => (
                    <button
                      key={i}
                      className="w-full flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors text-left"
                    >
                      <span className="text-sm text-foreground">{resource}</span>
                      <Download className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
