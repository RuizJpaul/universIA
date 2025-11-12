"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Menu, Bell, User, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { NewsGrid } from "@/components/news-grid"
import { EventsCalendar } from "@/components/events-calendar"

type ViewType = "news" | "events"

export default function NewsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [view, setView] = useState<ViewType>("news")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["Todos", "Educación", "Tecnología", "Oportunidades", "Comunidad", "Webinars"]

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
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Section */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Noticias y Eventos</h1>
              <p className="text-muted-foreground">
                Mantente actualizado con las últimas noticias y eventos educativos
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex gap-4 items-center flex-wrap">
              <div className="flex gap-2">
                <button
                  onClick={() => setView("news")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    view === "news"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-primary/10"
                  }`}
                >
                  Noticias
                </button>
                <button
                  onClick={() => setView("events")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    view === "events"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-primary/10"
                  }`}
                >
                  Eventos
                </button>
              </div>
              <div className="flex-1 relative min-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder={view === "news" ? "Buscar noticias..." : "Buscar eventos..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border"
                />
              </div>
            </div>

            {/* Categories Filter */}
            {view === "news" && (
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category.toLowerCase().replace(" ", "-"))}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === "all" || selectedCategory === category.toLowerCase().replace(" ", "-")
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-primary/10"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            {/* Content */}
            {view === "news" ? <NewsGrid searchQuery={searchQuery} /> : <EventsCalendar searchQuery={searchQuery} />}
          </div>
        </div>
      </main>
    </div>
  )
}
