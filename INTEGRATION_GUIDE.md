# 🔗 Guía de Integración: Next.js ↔ Python IA Services

Esta guía te ayudará a mantener sincronizados tus servicios Python de IA con el frontend Next.js de UniversIA.

---

## 📁 Estructura del Proyecto

```
universIA/                          # Next.js Frontend (este repo)
├── app/api/chat/
│   ├── tutor/route.ts             # API proxy para IA Tutor
│   ├── evaluator/route.ts         # API proxy para IA Evaluador
│   └── ...
├── PYTHON_SERVICES_SPEC.md        # Especificaciones técnicas
└── .env.local                     # URLs de servicios Python

tutor-ia-service/                   # Python IA Tutor (nuevo proyecto)
├── main.py                        # FastAPI app
├── requirements.txt
├── .env
└── ...

evaluator-ia-service/               # Python IA Evaluador (nuevo proyecto)
├── main.py                        # FastAPI app
├── requirements.txt
├── .env
└── ...
```

---

## 🎯 Flujo de Datos

### 1. Chat con IA Tutora
```
Frontend (React)
    ↓ POST /api/chat/tutor
Next.js API Route
    ↓ Valida sesión
    ↓ Verifica inscripción
    ↓ POST http://tutor-service:8000/chat
Python FastAPI (Tutor)
    ↓ LangChain + RAG
    ↓ Consulta Vector DB
    ↓ Genera respuesta
    ↑ Retorna JSON
Next.js API Route
    ↑ Guarda en PostgreSQL
    ↑ Retorna al frontend
Frontend
    ↑ Muestra respuesta
```

### 2. Evaluación con IA
```
Frontend (React)
    ↓ POST /api/chat/evaluator/submit
Next.js API Route
    ↓ Valida sesión
    ↓ Obtiene rúbrica
    ↓ POST http://evaluator-service:8001/submit
Python FastAPI (Evaluador)
    ↓ Analiza código/respuestas
    ↓ Aplica rúbrica con IA
    ↓ Calcula puntaje
    ↑ Retorna calificación
Next.js API Route
    ↑ Guarda resultado en BD
    ↑ Retorna al frontend
Frontend
    ↑ Muestra calificación
```

---

## 🔧 Contratos de API

### Endpoint 1: POST /chat (Tutor)

**Next.js envía:**
```typescript
interface TutorRequest {
  message: string
  course_id: string
  student_id: string
  session_id: string
  student_name: string
  context: {
    progress: number
  }
}
```

**Python debe responder:**
```python
class ChatResponse(BaseModel):
    response: str
    metadata: dict = {}
```

**Ubicación en Next.js:** `app/api/chat/tutor/route.ts` línea 49-70

---

### Endpoint 2: POST /evaluate (Evaluador)

**Next.js envía:**
```typescript
interface EvaluateRequest {
  message: string
  evaluation_id: string
  student_id: string
  session_id: string
  student_name: string
  evaluation_type: "QUIZ" | "EXAMEN" | "PRACTICA" | "PROYECTO_FINAL"
  rubric: {
    criterios: Array<{
      nombre: string
      peso: number
      descripcion: string
    }>
  }
  grading_scale: {
    escala: string
    nota_aprobacion: number
  }
  minimum_score: number
  submission: {
    code?: string
    answer?: string
  }
}
```

**Python debe responder:**
```python
class EvaluateResponse(BaseModel):
    response: str
    score: Optional[float] = None
    feedback: List[str] = []
    suggestions: List[str] = []
    is_final: bool = False
    metadata: dict = {}
```

**Ubicación en Next.js:** `app/api/chat/evaluator/route.ts` línea 51-86

---

### Endpoint 3: POST /submit (Evaluador)

**Next.js envía:**
```typescript
interface SubmitRequest {
  evaluation_id: string
  student_id: string
  student_name: string
  evaluation_type: string
  rubric: object
  grading_scale: object
  questions: Array<{
    id_pregunta: string
    texto_pregunta: string
    tipo: string
    opciones?: string[]
    respuesta_correcta: string
    puntos: number
  }>
  answers: Record<string, any>
  code?: string
  time_spent_minutes: number
}
```

**Python debe responder:**
```python
class SubmitResponse(BaseModel):
    score: float
    feedback: str
    detailed_feedback: str
    suggestions: List[str] = []
    breakdown: Dict[str, float] = {}
    time_spent_minutes: int
```

**Ubicación en Next.js:** `app/api/chat/evaluator/submit/route.ts` línea 43-72

---

## 🗄️ Esquema de Base de Datos Compartida

### Tablas que Python debe leer:

```sql
-- Información del curso
cursos (
  id_curso UUID PRIMARY KEY,
  titulo VARCHAR(200),
  descripcion TEXT,
  nivel VARCHAR(20),
  tags TEXT[]
)

-- Módulos y lecciones
modulos (
  id_modulo UUID PRIMARY KEY,
  id_curso UUID,
  titulo VARCHAR(200),
  orden INT
)

lecciones (
  id_leccion UUID PRIMARY KEY,
  id_modulo UUID,
  titulo VARCHAR(200),
  contenido TEXT,
  conceptos_clave TEXT[],  -- Para RAG
  objetivos_aprendizaje TEXT[]
)

-- Evaluaciones
evaluaciones (
  id_evaluacion UUID PRIMARY KEY,
  titulo VARCHAR(200),
  tipo VARCHAR(50),  -- QUIZ, EXAMEN, PRACTICA, PROYECTO_FINAL
  id_rubrica UUID,
  nota_minima DECIMAL(5,2)
)

preguntas (
  id_pregunta UUID PRIMARY KEY,
  id_evaluacion UUID,
  texto_pregunta TEXT,
  tipo VARCHAR(50),
  opciones JSONB,
  respuesta_correcta TEXT,
  puntos DECIMAL(5,2)
)

-- Rúbricas para evaluación
rubricas (
  id_rubrica UUID PRIMARY KEY,
  nombre VARCHAR(200),
  criterios JSONB,  -- Array de criterios con peso
  escala_evaluacion JSONB
)
```

### Tablas que Python debe escribir:

```sql
-- Next.js escribe aquí, Python solo lee
sesiones_chat_ia (
  id_sesion UUID PRIMARY KEY,
  id_estudiante UUID,
  id_curso UUID,
  tipo_sesion VARCHAR(50),  -- TUTORIA, EVALUACION
  activa BOOLEAN
)

mensajes_chat (
  id_mensaje UUID PRIMARY KEY,
  id_sesion UUID,
  emisor VARCHAR(20),  -- ESTUDIANTE, IA
  mensaje TEXT,
  metadata JSONB,
  timestamp TIMESTAMP
)

-- Next.js escribe resultados finales
resultados_evaluaciones (
  id_resultado UUID PRIMARY KEY,
  id_estudiante UUID,
  id_evaluacion UUID,
  nota_obtenida DECIMAL(5,2),
  respuestas JSONB,
  aprobado BOOLEAN,
  retroalimentacion_ia TEXT,
  tiempo_empleado_minutos INT
)
```

**Conexión a PostgreSQL desde Python:**
```python
DATABASE_URL = "postgresql://neondb_owner:npg_2Iufbe6Mrwip@ep-aged-leaf-ac6shjky-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require"
```

---

## 🔐 Variables de Entorno

### Next.js (.env.local)
```env
# Base de datos compartida
DATABASE_URL="postgresql://..."

# URLs de servicios Python
TUTOR_SERVICE_URL="http://localhost:8000"          # Desarrollo
# TUTOR_SERVICE_URL="https://tutor.onrender.com"   # Producción

EVALUATOR_SERVICE_URL="http://localhost:8001"      # Desarrollo
# EVALUATOR_SERVICE_URL="https://eval.onrender.com" # Producción
```

### Python (.env para ambos servicios)
```env
# Base de datos (misma que Next.js)
DATABASE_URL="postgresql://..."

# APIs de IA
OPENAI_API_KEY="sk-..."
# O usa Gemini
GEMINI_API_KEY="..."

# Vector Database (para RAG)
PINECONE_API_KEY="..."
PINECONE_INDEX_NAME="universia-courses"

# Opcional: MongoDB para historial
MONGODB_URI="mongodb+srv://..."

# Puerto del servicio
PORT=8000  # Tutor
# PORT=8001  # Evaluador
```

---

## 🧪 Pruebas de Integración

### 1. Probar servicio Python localmente:
```bash
# En tu proyecto Python
uvicorn main:app --reload --port 8000

# Probar endpoint
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hola",
    "course_id": "test",
    "student_id": "test",
    "session_id": "test",
    "student_name": "Test"
  }'
```

### 2. Probar integración con Next.js:
```bash
# Terminal 1: Python
cd tutor-ia-service
uvicorn main:app --reload --port 8000

# Terminal 2: Next.js
cd universIA
pnpm dev

# Navegar a: http://localhost:3000/estudiante/curso/1
# Probar chat con IA
```

### 3. Verificar logs:
- **Next.js:** Consola del navegador + Terminal de pnpm dev
- **Python:** Terminal de uvicorn
- **PostgreSQL:** Verifica que se guarden mensajes en `mensajes_chat`

---

## 🚀 Deployment Checklist

### Antes de desplegar:

- [ ] Python: Todos los endpoints implementados según spec
- [ ] Python: Variables de entorno configuradas
- [ ] Python: requirements.txt actualizado
- [ ] Python: Dockerfile creado (si usas contenedores)
- [ ] Next.js: URLs de producción en .env.local
- [ ] Next.js: Código testeado en desarrollo
- [ ] Base de datos: Esquema actualizado en Neon
- [ ] Vector DB: Índice creado con contenido de cursos

### Deploy Python a Render:

1. Crear nuevo Web Service en Render
2. Conectar repositorio de GitHub
3. Configurar:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Agregar variables de entorno
5. Deploy
6. Copiar URL (ej: `https://tutor-xxx.onrender.com`)

### Actualizar Next.js:

1. Editar `.env.local`:
   ```env
   TUTOR_SERVICE_URL="https://tutor-xxx.onrender.com"
   EVALUATOR_SERVICE_URL="https://eval-xxx.onrender.com"
   ```
2. Commit y push a Vercel
3. Verificar deployment

---

## 📞 Puntos de Sincronización

### Cuando cambies algo en Next.js:
- ✅ Actualiza `PYTHON_SERVICES_SPEC.md`
- ✅ Notifica al proyecto Python si cambió el contrato
- ✅ Actualiza este archivo si es necesario

### Cuando cambies algo en Python:
- ✅ Verifica que el response siga el contrato
- ✅ Actualiza documentación si agregaste metadata
- ✅ Notifica si necesitas nuevos datos del frontend

---

## 🐛 Troubleshooting

### Error: CORS en llamada a Python
**Solución:** Agrega middleware CORS en FastAPI
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://tu-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Error: Connection refused a Python service
**Solución:** 
- Verifica que Python esté corriendo
- Verifica que la URL en `.env.local` sea correcta
- Verifica que el puerto sea el correcto

### Error: 401 Unauthorized en Next.js
**Solución:**
- Verifica que estés autenticado
- Verifica que la sesión esté activa
- Revisa cookies en DevTools

### Error: Datos no se guardan en BD
**Solución:**
- Verifica conexión a PostgreSQL
- Revisa logs de Next.js API route
- Verifica que los UUIDs existan

---

## 📚 Recursos Adicionales

- **Especificaciones técnicas completas:** `PYTHON_SERVICES_SPEC.md`
- **Documentación API:** `app/api/README.md`
- **Schema de BD:** `database/schema_universia_optimizado.sql`

---

**Última actualización:** Noviembre 14, 2025
**Versión:** 1.0.0
