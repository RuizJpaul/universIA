"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Menu, Bell, User, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CommunityFeed } from "@/components/community-feed"
import { CreatePostModal } from "@/components/create-post-modal"

export default function CommunityPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showCreatePost, setShowCreatePost] = useState(false)
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
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Section */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Comunidad UniversIA</h1>
              <p className="text-muted-foreground">
                Conecta con otros estudiantes, comparte experiencias y crece juntos
              </p>
            </div>

            {/* Search and Create */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar publicaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border"
                />
              </div>
              <Button
                onClick={() => setShowCreatePost(true)}
                className="bg-primary hover:bg-primary/90 whitespace-nowrap"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nueva publicación
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-border">
              {["Para ti", "Trending", "Mis seguidos", "Guardadas"].map((tab) => (
                <button
                  key={tab}
                  className="px-4 py-2 font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-primary/50 transition-colors"
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Feed */}
            <CommunityFeed searchQuery={searchQuery} />
          </div>
        </div>
      </main>

      {/* Modal */}
      {showCreatePost && <CreatePostModal onClose={() => setShowCreatePost(false)} />}
    </div>
  )
}
