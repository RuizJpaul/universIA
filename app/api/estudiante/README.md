# 📊 API Routes de Datos Reales - UniversIA

Estas API routes conectan el frontend con la base de datos PostgreSQL real en Neon.

---

## 🎯 APIs Creadas

### 1. **GET** `/api/estudiante/cursos`
Obtiene todos los cursos inscritos del estudiante autenticado.

**Headers:**
```
Cookie: session (automático con NextAuth)
```

**Response:**
```json
{
  "success": true,
  "courses": [
    {
      "id": "uuid",
      "title": "Desarrollo Web Full Stack",
      "description": "...",
      "level": "INTERMEDIO",
      "duration": 40,
      "rating": 4.8,
      "image": "/path/to/image.jpg",
      "tags": ["JavaScript", "React"],
      "status": "EN_PROGRESO",
      "progress": 75.5,
      "enrolledAt": "2025-01-15T...",
      "completedAt": null,
      "modules": 4,
      "lessonsCompleted": 15,
      "totalLessons": 20
    }
  ]
}
```

---

### 2. **GET** `/api/estudiante/cursos/[id]`
Obtiene detalles completos de un curso específico.

**Params:**
- `id` - UUID del curso

**Response:**
```json
{
  "success": true,
  "course": {
    "id": "uuid",
    "title": "...",
    "description": "...",
    "progress": 75,
    "modules": [
      {
        "id": "uuid",
        "title": "Módulo 1",
        "progress": 100,
        "topics": ["Tema 1", "Tema 2"],
        "lessons": [
          {
            "id": "uuid",
            "title": "Lección 1",
            "type": "VIDEO",
            "duration": 45,
            "completed": true,
            "timeSpent": 50
          }
        ]
      }
    ],
    "labs": [
      {
        "id": "uuid",
        "name": "Tinkercad Lab",
        "platform": "TINKERCAD",
        "url": "https://...",
        "status": "available",
        "completed": false
      }
    ]
  }
}
```

---

### 3. **GET** `/api/estudiante/dashboard`
Obtiene estadísticas y datos para el dashboard del estudiante.

**Response:**
```json
{
  "success": true,
  "stats": {
    "activeCourses": 3,
    "completedCourses": 5,
    "totalHours": 120,
    "certificates": 5,
    "achievements": 12,
    "streak": 7
  },
  "courses": [...],  // Cursos destacados
  "upcomingEvaluations": [...],
  "recentActivity": [...],
  "weeklyProgress": [...]
}
```

---

### 4. **GET** `/api/estudiante/progreso`
Obtiene el progreso completo del estudiante.

**Response:**
```json
{
  "success": true,
  "achievements": [
    {
      "id": "uuid",
      "name": "Primera Lección",
      "description": "...",
      "icon": "🎯",
      "points": 10,
      "earned": true,
      "earnedAt": "2025-01-20T..."
    }
  ],
  "certificates": [...],
  "monthlyProgress": [...],
  "learningActivity": [...],
  "globalStats": {
    "totalCoursesEnrolled": 8,
    "coursesCompleted": 5,
    "totalHours": 120,
    "evaluationsPassed": 25,
    "achievementsEarned": 12,
    "achievementsTotal": 50
  }
}
```

---

### 5. **GET** `/api/estudiante/perfil`
Obtiene el perfil del estudiante.

**Response:**
```json
{
  "success": true,
  "profile": {
    "id": "uuid",
    "email": "user@email.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "specialty": "INGENIERIA_SISTEMAS",
    "academicLevel": "PREGRADO",
    "bio": "...",
    "profilePicture": "/path/to/image.jpg",
    "linkedinUrl": "...",
    "githubUrl": "...",
    "portfolioUrl": "..."
  }
}
```

### 6. **PUT** `/api/estudiante/perfil`
Actualiza el perfil del estudiante.

**Body:**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "specialty": "INGENIERIA_ELECTRONICA",
  "bio": "Nueva biografía",
  "linkedinUrl": "https://linkedin.com/in/..."
}
```

---

## 🔧 Cómo Usar en Frontend

### Ejemplo con `useEffect`:

```typescript
'use client'

import { useEffect, useState } from 'react'

export default function MisCursos() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/estudiante/cursos')
        const data = await res.json()
        
        if (data.success) {
          setCourses(data.courses)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) return <div>Cargando...</div>

  return (
    <div>
      {courses.map(course => (
        <div key={course.id}>
          <h3>{course.title}</h3>
          <p>Progreso: {course.progress}%</p>
        </div>
      ))}
    </div>
  )
}
```

---

## 🗄️ Tablas de Base de Datos Utilizadas

Estas APIs consultan las siguientes tablas:

- ✅ `usuarios`
- ✅ `estudiantes`
- ✅ `cursos`
- ✅ `modulos`
- ✅ `lecciones`
- ✅ `inscripciones`
- ✅ `progreso_lecciones`
- ✅ `evaluaciones`
- ✅ `resultados_evaluaciones`
- ✅ `laboratorios`
- ✅ `sesiones_laboratorio`
- ✅ `certificados`
- ✅ `logros`
- ✅ `logros_estudiantes`

---

## 🔐 Seguridad

Todas las APIs:
- ✅ Verifican autenticación con NextAuth
- ✅ Obtienen el estudiante desde el email de sesión
- ✅ Filtran datos solo del estudiante autenticado
- ✅ Usan prepared statements (previene SQL injection)
- ✅ Retornan 401 si no hay sesión
- ✅ Retornan 404 si el estudiante no existe

---

## 🧪 Testing

### Probar en Postman/Thunder Client:

1. **Login primero:**
```
POST http://localhost:3000/api/auth/callback/credentials
Body: { email, password }
```

2. **Copiar cookie de sesión**

3. **Hacer request:**
```
GET http://localhost:3000/api/estudiante/cursos
Headers:
  Cookie: <session-cookie>
```

### Probar en navegador:

1. Login en la app
2. Abrir DevTools → Console
3. Ejecutar:
```javascript
fetch('/api/estudiante/cursos')
  .then(r => r.json())
  .then(console.log)
```

---

## 📋 TODO

Próximas APIs a crear:

- [ ] `/api/estudiante/evaluaciones/[id]` - Detalles de evaluación
- [ ] `/api/estudiante/evaluaciones/[id]/submit` - Ya existe en `/api/chat/evaluator/submit`
- [ ] `/api/estudiante/lecciones/[id]` - Detalles de lección
- [ ] `/api/estudiante/lecciones/[id]/complete` - Marcar lección como completada
- [ ] `/api/noticias` - Noticias y eventos
- [ ] `/api/cursos/disponibles` - Catálogo de cursos disponibles

---

## 🐛 Troubleshooting

### Error: "Estudiante no encontrado"
- Verifica que el usuario esté en la tabla `estudiantes`
- Verifica que el email de sesión coincida con `usuarios.correo`

### Error: "No autenticado"
- Verifica que la sesión de NextAuth esté activa
- Verifica cookies en DevTools

### Datos vacíos:
- Verifica que haya datos en las tablas
- Revisa los filtros en las queries SQL
- Revisa logs de PostgreSQL

---

**Última actualización:** Noviembre 14, 2025
