"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle, Share2, MoreVertical } from "lucide-react"

interface Post {
  id: number
  author: string
  avatar: string
  title: string
  content: string
  category: string
  likes: number
  comments: number
  liked: boolean
  timestamp: string
  replies: number
}

interface CommunityFeedProps {
  searchQuery: string
}

export function CommunityFeed({ searchQuery }: CommunityFeedProps) {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: "María García",
      avatar: "MG",
      title: "Consejo: Cómo dominar React en 30 días",
      content:
        "Acabo de terminar mi viaje de aprendizaje en React y quería compartir algunos consejos que me ayudaron. Lo más importante es practicar con proyectos reales...",
      category: "React",
      likes: 234,
      comments: 45,
      liked: false,
      timestamp: "Hace 2 horas",
      replies: 12,
    },
    {
      id: 2,
      author: "Carlos López",
      avatar: "CL",
      title: "Pregunta: ¿Cuál es la mejor forma de estructurar un proyecto Node.js?",
      content:
        "Estoy comenzando un nuevo proyecto backend con Node.js y me gustaría saber cuáles son las mejores prácticas para la estructura de carpetas...",
      category: "Node.js",
      likes: 156,
      comments: 32,
      liked: false,
      timestamp: "Hace 4 horas",
      replies: 8,
    },
    {
      id: 3,
      author: "Ana Martínez",
      avatar: "AM",
      title: "¡Conseguí mi primer trabajo como desarrolladora!",
      content:
        "Después de 6 meses estudiando en UniversIA, finalmente consigo mi primer trabajo como desarrolladora frontend. Quería agradecer a toda la comunidad por el apoyo...",
      category: "Logros",
      likes: 542,
      comments: 78,
      liked: true,
      timestamp: "Ayer",
      replies: 25,
    },
    {
      id: 4,
      author: "Jorge Ruiz",
      avatar: "JR",
      title: "Recursos: Los mejores tutoriales de Machine Learning",
      content:
        "He compilado una lista de los mejores recursos para aprender Machine Learning. Aquí están mis favoritos con sus pros y contras...",
      category: "Machine Learning",
      likes: 389,
      comments: 56,
      liked: false,
      timestamp: "Hace 1 día",
      replies: 19,
    },
  ])

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post,
      ),
    )
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <Card key={post.id} className="p-6 hover:border-primary/50 transition-colors cursor-pointer">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
                  {post.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{post.category}</span>
                <button className="text-muted-foreground hover:text-foreground transition">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-4 space-y-2">
              <h3 className="text-lg font-semibold text-foreground">{post.title}</h3>
              <p className="text-muted-foreground line-clamp-3">{post.content}</p>
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  post.liked ? "text-red-500 bg-red-500/10" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Heart className={`w-4 h-4 ${post.liked ? "fill-red-500" : ""}`} />
                <span className="text-sm">{post.likes}</span>
              </button>

              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{post.comments}</span>
              </button>

              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Compartir</span>
              </button>
            </div>
          </Card>
        ))
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No se encontraron publicaciones.</p>
        </Card>
      )}
    </div>
  )
}
