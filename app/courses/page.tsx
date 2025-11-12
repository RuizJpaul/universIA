"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { CoursesGrid } from "@/components/courses-grid"
import { CourseFilters } from "@/components/course-filters"
import { Menu, Bell, User, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function CoursesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

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
          {/* Search and Filter */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Explorar Cursos</h1>
              <p className="text-muted-foreground">Descubre miles de cursos para mejorar tus habilidades</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar cursos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border"
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90">Filtrar</Button>
            </div>
          </div>

          {/* Filters */}
          <CourseFilters selectedLevel={selectedLevel} onLevelChange={setSelectedLevel} />

          {/* Courses Grid */}
          <CoursesGrid searchQuery={searchQuery} level={selectedLevel} />
        </div>
      </main>
    </div>
  )
}
