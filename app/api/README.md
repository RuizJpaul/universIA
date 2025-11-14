# API Routes para Servicios de IA

Este directorio contiene las rutas API de Next.js que actúan como **proxy/middleware** entre el frontend y los servicios de IA en Python (desplegados en Render/Railway).

## 🏗️ Estructura

```
api/
├── chat/
│   ├── tutor/
│   │   ├── route.ts          # POST - Chat con IA Tutora
│   │   └── history/
│   │       └── route.ts      # GET - Historial de chat
│   └── evaluator/
│       ├── route.ts          # POST - Chat con IA Evaluadora
│       └── submit/
│           └── route.ts      # POST - Enviar evaluación completa
└── laboratorios/
    └── [id]/
        └── save/
            └── route.ts      # POST - Guardar progreso de laboratorio
```

## 📡 Endpoints Creados

### 1. Chat con IA Tutora
**POST** `/api/chat/tutor`

Envía mensajes al servicio de IA Tutora para recibir ayuda contextual del curso.

**Request:**
```json
{
  "message": "¿Cómo funciona un transistor?",
  "courseId": "uuid-del-curso",
  "sessionId": "uuid-opcional-sesion-existente"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid-de-la-sesion",
  "response": "Respuesta de la IA...",
  "metadata": {},
  "timestamp": "2025-11-14T..."
}
```

**Flujo:**
1. ✅ Verifica autenticación (NextAuth)
2. ✅ Valida que el estudiante esté inscrito en el curso
3. ✅ Crea/obtiene sesión de chat en BD
4. 🔄 Llama a `TUTOR_SERVICE_URL/chat` (Python FastAPI)
5. ✅ Guarda mensaje del estudiante y respuesta de IA en BD
6. ✅ Retorna respuesta al frontend

---

### 2. Historial de Chat
**GET** `/api/chat/tutor/history?courseId=xxx&sessionId=xxx&limit=50`

Obtiene el historial de mensajes de una sesión de tutoría.

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid",
  "messages": [
    {
      "id": "uuid",
      "role": "user",
      "content": "Pregunta del estudiante",
      "timestamp": "2025-11-14T..."
    },
    {
      "id": "uuid",
      "role": "assistant",
      "content": "Respuesta de la IA",
      "timestamp": "2025-11-14T..."
    }
  ]
}
```

---

### 3. Chat con IA Evaluadora
**POST** `/api/chat/evaluator`

Interacción con la IA Evaluadora durante una evaluación práctica.

**Request:**
```json
{
  "message": "Aquí está mi código",
  "evaluationId": "uuid",
  "sessionId": "uuid-opcional",
  "code": "int main() { ... }",
  "answer": "Respuesta teórica"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid",
  "response": "Feedback de la IA",
  "score": 85.5,
  "feedback": ["Punto 1", "Punto 2"],
  "suggestions": ["Mejora 1", "Mejora 2"],
  "is_final": false,
  "passed": true
}
```

**Flujo:**
1. ✅ Verifica autenticación
2. ✅ Obtiene información de la evaluación y rúbrica
3. ✅ Crea/obtiene sesión de evaluación
4. 🔄 Llama a `EVALUATOR_SERVICE_URL/evaluate` (Python FastAPI)
5. ✅ Guarda conversación en BD
6. ✅ Si `is_final=true`, guarda resultado en `resultados_evaluaciones`

---

### 4. Enviar Evaluación Completa
**POST** `/api/chat/evaluator/submit`

Envía una evaluación completa (quiz, examen, práctica) para calificación automática.

**Request:**
```json
{
  "evaluationId": "uuid",
  "answers": {
    "pregunta1": "respuesta1",
    "pregunta2": ["opcion1", "opcion2"]
  },
  "code": "código completo si es práctica",
  "timeSpentMinutes": 45
}
```

**Response:**
```json
{
  "success": true,
  "resultId": "uuid",
  "attemptNumber": 1,
  "score": 92.5,
  "passed": true,
  "feedback": "Feedback general",
  "detailed_feedback": "Análisis detallado...",
  "suggestions": ["Sugerencia 1", "Sugerencia 2"],
  "breakdown": {
    "criterio1": 10,
    "criterio2": 8.5
  }
}
```

**Flujo:**
1. ✅ Verifica autenticación
2. ✅ Obtiene evaluación, rúbrica y preguntas
3. 🔄 Llama a `EVALUATOR_SERVICE_URL/submit` (Python FastAPI)
4. ✅ Guarda resultado en `resultados_evaluaciones`
5. ✅ Incrementa contador de intentos automáticamente

---

### 5. Guardar Progreso de Laboratorio
**POST** `/api/laboratorios/[id]/save`

Guarda el progreso del estudiante en un laboratorio virtual.

**Request:**
```json
{
  "code": "código del circuito/simulación",
  "screenshots": ["url1.png", "url2.png"],
  "projectUrl": "https://tinkercad.com/...",
  "notes": "Notas del estudiante",
  "completed": false
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid",
  "message": "Progreso guardado"
}
```

---

## 🔐 Seguridad

Todas las rutas incluyen:
- ✅ Verificación de autenticación con NextAuth
- ✅ Validación de permisos (estudiante inscrito, evaluación activa)
- ✅ Validación de datos de entrada
- ✅ Manejo de errores completo
- ✅ Logs para debugging

## 🔄 Comunicación con Python

Las rutas usan `fetch()` para llamar a los servicios Python:

```typescript
const response = await fetch(`${TUTOR_SERVICE_URL}/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ... })
});
```

Las URLs se configuran en `.env.local`:
- `TUTOR_SERVICE_URL` - IA Tutora (puerto 8000)
- `EVALUATOR_SERVICE_URL` - IA Evaluadora (puerto 8001)

## 📊 Base de Datos

Las rutas interactúan con estas tablas:
- `estudiantes` - Validar identidad
- `inscripciones` - Verificar acceso al curso
- `sesiones_chat_ia` - Sesiones de chat
- `mensajes_chat` - Historial de mensajes
- `evaluaciones` - Información de evaluaciones
- `rubricas` - Criterios de calificación
- `resultados_evaluaciones` - Resultados finales
- `laboratorios` - Configuración de labs
- `sesiones_laboratorio` - Progreso en labs

## 🚀 Próximos Pasos

1. **Desplegar servicios Python en Render/Railway**
2. **Actualizar variables de entorno** con URLs reales
3. **Integrar frontend** con estos endpoints
4. **Probar flujo completo** end-to-end
