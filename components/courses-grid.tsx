"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Users, Clock, Loader2 } from "lucide-react"

interface CoursesGridProps {
  searchQuery: string
  level: string
}

interface Course {
  id: string
  title: string
  description: string
  level: string
  duration: number
  rating: number
  image: string
  price: number
  instructor: string
  students: number
  modules: number
  totalLessons: number
  featured: boolean
  category: string
}

export function CoursesGrid({ searchQuery, level }: CoursesGridProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const params = new URLSearchParams()
        if (searchQuery) params.append('search', searchQuery)
        if (level && level !== 'all') params.append('level', level)
        
        const response = await fetch(`/api/cursos?${params.toString()}`)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Error al cargar cursos')
        }
        
        setCourses(data.courses || [])
      } catch (err: any) {
        console.error('Error fetching courses:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [searchQuery, level])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-destructive">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.length > 0 ? (
        courses.map((course) => (
          <Card
            key={course.id}
            className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer"
          >
            {/* Course Image */}
            <div 
              className="h-40 relative group bg-gradient-to-br from-primary/80 to-primary"
              style={{
                backgroundImage: course.image && course.image.startsWith('http') 
                  ? `url(${course.image})` 
                  : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-foreground ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            {/* Course Info */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                  {course.level === "PRINCIPIANTE"
                    ? "Principiante"
                    : course.level === "INTERMEDIO"
                      ? "Intermedio"
                      : "Avanzado"}
                </span>
                {course.featured && (
                  <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                    Destacado
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-foreground line-clamp-2 h-14">{course.title}</h3>

              <p className="text-sm text-muted-foreground">{course.instructor || 'Tutor IA'}</p>

              {/* Rating and Students */}
              <div className="flex items-center justify-between py-2 border-t border-border border-b">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-foreground">{course.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Users className="w-4 h-4" />
                  {course.students > 0 ? `${(course.students / 1000).toFixed(1)}K` : '0'}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Clock className="w-4 h-4" />
                  {course.duration}h
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-bold text-primary">
                  {course.price > 0 ? `$${course.price}` : 'Gratis'}
                </span>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Inscribirse
                </Button>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">No se encontraron cursos.</p>
        </div>
      )}
    </div>
  )
}
