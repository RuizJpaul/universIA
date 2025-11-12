"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Users, Clock } from "lucide-react"

interface CoursesGridProps {
  searchQuery: string
  level: string
}

export function CoursesGrid({ searchQuery, level }: CoursesGridProps) {
  const courses = [
    {
      id: 1,
      title: "React: De Cero a Experto",
      instructor: "María García",
      level: "beginner",
      rating: 4.9,
      students: 12500,
      price: "$49.99",
      duration: "40 horas",
      image: "bg-gradient-to-br from-blue-500 to-blue-600",
      progress: 0,
      enrolled: false,
    },
    {
      id: 2,
      title: "Node.js Avanzado",
      instructor: "Carlos López",
      level: "advanced",
      rating: 4.8,
      students: 8300,
      price: "$59.99",
      duration: "50 horas",
      image: "bg-gradient-to-br from-green-500 to-green-600",
      progress: 0,
      enrolled: false,
    },
    {
      id: 3,
      title: "Machine Learning con Python",
      instructor: "Dr. Juan Martínez",
      level: "intermediate",
      rating: 4.7,
      students: 6200,
      price: "$79.99",
      duration: "60 horas",
      image: "bg-gradient-to-br from-purple-500 to-purple-600",
      progress: 0,
      enrolled: false,
    },
    {
      id: 4,
      title: "TypeScript Completo",
      instructor: "Ana Rodríguez",
      level: "intermediate",
      rating: 4.9,
      students: 9800,
      price: "$49.99",
      duration: "35 horas",
      image: "bg-gradient-to-br from-cyan-500 to-cyan-600",
      progress: 0,
      enrolled: false,
    },
    {
      id: 5,
      title: "Web3 y Blockchain",
      instructor: "Pedro Sánchez",
      level: "advanced",
      rating: 4.6,
      students: 4500,
      price: "$89.99",
      duration: "55 horas",
      image: "bg-gradient-to-br from-orange-500 to-orange-600",
      progress: 0,
      enrolled: false,
    },
    {
      id: 6,
      title: "Diseño UX/UI Moderno",
      instructor: "Laura Fernández",
      level: "beginner",
      rating: 4.8,
      students: 11200,
      price: "$44.99",
      duration: "32 horas",
      image: "bg-gradient-to-br from-pink-500 to-pink-600",
      progress: 0,
      enrolled: false,
    },
    {
      id: 7,
      title: "AWS Cloud Solutions",
      instructor: "Miguel Torres",
      level: "intermediate",
      rating: 4.7,
      students: 7600,
      price: "$69.99",
      duration: "48 horas",
      image: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      progress: 0,
      enrolled: false,
    },
    {
      id: 8,
      title: "Next.js 15 Masterclass",
      instructor: "Sofia Ruiz",
      level: "advanced",
      rating: 4.9,
      students: 5400,
      price: "$64.99",
      duration: "42 horas",
      image: "bg-gradient-to-br from-red-500 to-red-600",
      progress: 0,
      enrolled: false,
    },
  ]

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = level === "all" || course.level === level
    return matchesSearch && matchesLevel
  })

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCourses.length > 0 ? (
        filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer"
          >
            {/* Course Image */}
            <div className={`${course.image} h-40 relative group`}>
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
              <div>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                  {course.level === "beginner"
                    ? "Principiante"
                    : course.level === "intermediate"
                      ? "Intermedio"
                      : "Avanzado"}
                </span>
              </div>

              <h3 className="font-semibold text-foreground line-clamp-2 h-14">{course.title}</h3>

              <p className="text-sm text-muted-foreground">{course.instructor}</p>

              {/* Rating and Students */}
              <div className="flex items-center justify-between py-2 border-t border-border border-b">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-foreground">{course.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Users className="w-4 h-4" />
                  {(course.students / 1000).toFixed(1)}K
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-bold text-primary">{course.price}</span>
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
