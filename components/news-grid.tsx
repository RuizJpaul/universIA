"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bookmark, Share2, Eye } from "lucide-react"

interface NewsArticle {
  id: number
  title: string
  excerpt: string
  category: string
  image: string
  author: string
  date: string
  readTime: string
  views: number
  saved: boolean
}

interface NewsGridProps {
  searchQuery: string
}

export function NewsGrid({ searchQuery }: NewsGridProps) {
  const articles: NewsArticle[] = [
    {
      id: 1,
      title: "React 19 Lanzado: Nuevas Características Revolucionarias",
      excerpt:
        "La nueva versión de React trae mejoras significativas en rendimiento y experiencia de desarrollador. Descubre qué es nuevo.",
      category: "Tecnología",
      image: "bg-gradient-to-br from-blue-500 to-blue-600",
      author: "María García",
      date: "Hace 2 horas",
      readTime: "5 min",
      views: 1200,
      saved: false,
    },
    {
      id: 2,
      title: "Oportunidades de Pasantías en Tech Companies 2025",
      excerpt:
        "Las principales compañías tech abren sus puertas para estudiantes. Conoce los requisitos y cómo aplicar.",
      category: "Oportunidades",
      image: "bg-gradient-to-br from-green-500 to-green-600",
      author: "Carlos López",
      date: "Hace 5 horas",
      readTime: "8 min",
      views: 2400,
      saved: false,
    },
    {
      id: 3,
      title: "Webinar Gratuito: AI en Desarrollo Web",
      excerpt: "Aprende cómo integrar inteligencia artificial en tus proyectos web. Registro abierto ahora.",
      category: "Webinars",
      image: "bg-gradient-to-br from-purple-500 to-purple-600",
      author: "Dr. Juan Martínez",
      date: "Hace 8 horas",
      readTime: "3 min",
      views: 890,
      saved: false,
    },
    {
      id: 4,
      title: "TypeScript vs JavaScript: Una Comparativa Profunda",
      excerpt: "Análisis detallado de las diferencias, ventajas y casos de uso de TypeScript vs JavaScript en 2025.",
      category: "Educación",
      image: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      author: "Ana Rodríguez",
      date: "Ayer",
      readTime: "12 min",
      views: 3100,
      saved: false,
    },
    {
      id: 5,
      title: "Comunidad UniversIA Alcanza 50,000 Miembros",
      excerpt: "Celebramos este hito importante con nuevas características y sorpresas para nuestra comunidad.",
      category: "Comunidad",
      image: "bg-gradient-to-br from-pink-500 to-pink-600",
      author: "Sofia Ruiz",
      date: "Ayer",
      readTime: "4 min",
      views: 1560,
      saved: false,
    },
    {
      id: 6,
      title: "Tendencias en Desarrollo Backend para 2025",
      excerpt: "Descubre las tecnologías y prácticas que dominarán el desarrollo backend este año.",
      category: "Tecnología",
      image: "bg-gradient-to-br from-red-500 to-red-600",
      author: "Miguel Torres",
      date: "Hace 2 días",
      readTime: "10 min",
      views: 2800,
      saved: false,
    },
  ]

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {filteredArticles.length > 0 ? (
        filteredArticles.map((article) => (
          <Card
            key={article.id}
            className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer group"
          >
            {/* Image */}
            <div className={`${article.image} h-40 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                  {article.category}
                </span>
                <span className="text-xs text-muted-foreground">{article.readTime}</span>
              </div>

              <h3 className="font-semibold text-foreground line-clamp-2 h-14 group-hover:text-primary transition-colors">
                {article.title}
              </h3>

              <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{article.author}</span>
                  <span className="text-xs text-muted-foreground">{article.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Eye className="w-3 h-3" />
                  {(article.views / 1000).toFixed(1)}K
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-border">
                <Button variant="outline" size="sm" className="flex-1 h-8 bg-transparent">
                  Leer
                </Button>
                <button className="px-3 h-8 rounded-lg border border-input hover:bg-muted transition-colors flex items-center justify-center">
                  <Bookmark className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="px-3 h-8 rounded-lg border border-input hover:bg-muted transition-colors flex items-center justify-center">
                  <Share2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <Card className="col-span-full p-12 text-center">
          <p className="text-muted-foreground">No se encontraron artículos.</p>
        </Card>
      )}
    </div>
  )
}
