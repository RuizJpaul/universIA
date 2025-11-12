"use client"

interface CourseFiltersProps {
  selectedLevel: string
  onLevelChange: (level: string) => void
}

export function CourseFilters({ selectedLevel, onLevelChange }: CourseFiltersProps) {
  const levels = [
    { id: "all", label: "Todos" },
    { id: "beginner", label: "Principiante" },
    { id: "intermediate", label: "Intermedio" },
    { id: "advanced", label: "Avanzado" },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {levels.map((level) => (
        <button
          key={level.id}
          onClick={() => onLevelChange(level.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedLevel === level.id
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground hover:bg-primary/10"
          }`}
        >
          {level.label}
        </button>
      ))}
    </div>
  )
}
