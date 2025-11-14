# 📘 UniversIA - Contexto Completo del Proyecto

**Versión:** 1.0.0  
**Fecha:** Noviembre 14, 2025  
**Stack:** Next.js 16 + React 19 + NextAuth + PostgreSQL + Python IA Services

---

## 🎯 Visión General

**UniversIA** es una plataforma educativa que utiliza **IA como tutora personalizada** y **evaluadora automática**. Los estudiantes aprenden a su propio ritmo con feedback instantáneo de modelos de lenguaje (GPT-4/Gemini) integrados via RAG (Retrieval Augmented Generation).

### Características Principales:
- 🤖 **IA Tutora**: Chat contextual por curso con LangChain + RAG
- 📝 **IA Evaluadora**: Calificación automática de código, quizzes y proyectos
- 🔬 **Laboratorios Virtuales**: Simuladores integrados (Tinkercad, Wokwi, etc.)
- 📊 **Dashboard Personalizado**: Progreso, certificados, estadísticas
- 🔐 **Autenticación OAuth**: Google, GitHub
- 💾 **Base de Datos Robusta**: 56 tablas en PostgreSQL (Neon)

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 16)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Dashboard    │  │ Cursos       │  │ Chat IA      │         │
│  │ Estudiante   │  │ Módulos      │  │ Evaluaciones │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              NEXT.JS API ROUTES (Middleware)                    │
│  ┌──────────────────┐  ┌──────────────────┐                   │
│  │ /api/chat/tutor  │  │ /api/chat/       │                   │
│  │                  │  │ evaluator        │                   │
│  └──────────────────┘  └──────────────────┘                   │
│         ↓ Validación de sesión                                 │
│         ↓ Verificación de permisos                             │
│         ↓ Guardado en PostgreSQL                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
          ┌───────────────────┴───────────────────┐
          ↓                                       ↓
┌─────────────────────┐              ┌─────────────────────┐
│  PYTHON SERVICE 1   │              │  PYTHON SERVICE 2   │
│   IA TUTORA         │              │   IA EVALUADORA     │
│   Puerto: 8000      │              │   Puerto: 8001      │
│                     │              │                     │
│  ┌───────────────┐  │              │  ┌───────────────┐  │
│  │ LangChain     │  │              │  │ LangChain     │  │
│  │ + RAG         │  │              │  │ + Rubrics     │  │
│  └───────────────┘  │              │  └───────────────┘  │
│  ┌───────────────┐  │              │  ┌───────────────┐  │
│  │ GPT-4/Gemini  │  │              │  │ GPT-4/Gemini  │  │
│  └───────────────┘  │              │  └───────────────┘  │
└─────────────────────┘              └─────────────────────┘
          ↓                                       ↓
          └───────────────────┬───────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BASES DE DATOS                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ PostgreSQL   │  │ Vector DB    │  │ MongoDB      │         │
│  │ (Neon)       │  │ (Pinecone/   │  │ (Opcional)   │         │
│  │ 56 tablas    │  │  FAISS)      │  │ Chat history │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📂 Estructura del Proyecto Next.js

```
universIA/
├── app/
│   ├── api/                        # API Routes (Backend)
│   │   ├── auth/                   # NextAuth endpoints
│   │   │   ├── [...nextauth]/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── check-onboarding/route.ts
│   │   │   └── oauth-register-complete/route.ts
│   │   ├── chat/                   # IA Services Proxy
│   │   │   ├── tutor/
│   │   │   │   ├── route.ts        # POST - Chat con tutor IA
│   │   │   │   └── history/route.ts # GET - Historial
│   │   │   └── evaluator/
│   │   │       ├── route.ts        # POST - Chat evaluación
│   │   │       └── submit/route.ts # POST - Enviar evaluación
│   │   └── laboratorios/
│   │       └── [id]/save/route.ts  # POST - Guardar progreso
│   │
│   ├── auth/                       # Páginas de autenticación
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── redirect/page.tsx       # OAuth redirect handler
│   │   └── onboarding/page.tsx
│   │
│   ├── estudiante/                 # Portal del estudiante
│   │   ├── dashboard/page.tsx
│   │   ├── mis-cursos/page.tsx
│   │   ├── curso/[id]/page.tsx     # Vista de curso + Chat IA
│   │   ├── noticias/page.tsx
│   │   ├── progreso/page.tsx
│   │   └── perfil/page.tsx
│   │
│   ├── layout.tsx                  # Layout raíz
│   ├── page.tsx                    # Homepage
│   └── globals.css
│
├── components/
│   ├── ui/                         # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── tabs.tsx
│   │   └── ... (40+ componentes)
│   │
│   ├── auth-modal.tsx
│   ├── chat-message.tsx
│   ├── courses-grid.tsx
│   ├── dashboard-content.tsx
│   └── sidebar.tsx
│
├── database/
│   └── schema_universia_optimizado.sql  # 56 tablas, 1256 líneas
│
├── lib/
│   └── utils.ts                    # Utilities (cn, etc.)
│
├── auth.ts                         # NextAuth config
├── auth.config.ts                  # NextAuth providers
├── middleware.ts                   # Route protection
│
├── .env.local                      # Variables de entorno
├── .env.example                    # Plantilla de env
│
├── PYTHON_SERVICES_SPEC.md         # Especificaciones Python
├── INTEGRATION_GUIDE.md            # Guía de integración
│
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
└── components.json                 # shadcn/ui config
```

---

## 🗄️ Base de Datos (PostgreSQL en Neon)

### Tablas Principales (56 en total)

#### **Autenticación y Usuarios**
```sql
usuarios (
  id_usuario UUID PRIMARY KEY,
  correo VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  rol VARCHAR(50),  -- ESTUDIANTE, ADMIN, EMPRESA
  verificado BOOLEAN,
  onboarding_completado BOOLEAN
)

estudiantes (
  id_estudiante UUID PRIMARY KEY,
  id_usuario UUID REFERENCES usuarios,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  fecha_nacimiento DATE,
  especialidad VARCHAR(100),
  nivel_academico VARCHAR(50)
)

accounts (  -- Para OAuth (NextAuth)
  id UUID PRIMARY KEY,
  userId UUID REFERENCES usuarios,
  type VARCHAR(50),
  provider VARCHAR(50),  -- google, github
  providerAccountId VARCHAR(255),
  access_token TEXT,
  refresh_token TEXT
)
```

#### **Cursos y Contenido**
```sql
cursos (
  id_curso UUID PRIMARY KEY,
  titulo VARCHAR(200),
  descripcion TEXT,
  id_tutor UUID REFERENCES tutores_ia,  -- IA asignada
  nivel VARCHAR(20),  -- PRINCIPIANTE, INTERMEDIO, AVANZADO
  duracion_estimada_horas INT,
  calificacion_promedio DECIMAL(3,2),
  tags TEXT[],
  objetivos TEXT[],
  requisitos TEXT[],
  activo BOOLEAN DEFAULT true
)

modulos (
  id_modulo UUID PRIMARY KEY,
  id_curso UUID REFERENCES cursos,
  titulo VARCHAR(200),
  descripcion TEXT,
  orden INT,
  duracion_estimada_horas INT
)

lecciones (
  id_leccion UUID PRIMARY KEY,
  id_modulo UUID REFERENCES modulos,
  titulo VARCHAR(200),
  contenido TEXT,
  tipo_contenido VARCHAR(50),  -- VIDEO, TEXTO, INTERACTIVO
  conceptos_clave TEXT[],      -- Para RAG de IA
  objetivos_aprendizaje TEXT[],
  duracion_minutos INT,
  orden INT
)
```

#### **IA y Chat**
```sql
tutores_ia (
  id_tutor UUID PRIMARY KEY,
  nombre VARCHAR(100),
  modelo VARCHAR(100),  -- GPT-4, GEMINI-PRO
  especialidad VARCHAR(100),
  configuracion JSONB,  -- Parámetros del modelo
  activo BOOLEAN DEFAULT true
)

sesiones_chat_ia (
  id_sesion UUID PRIMARY KEY,
  id_estudiante UUID REFERENCES estudiantes,
  id_curso UUID REFERENCES cursos,
  id_evaluacion UUID REFERENCES evaluaciones,
  tipo_sesion VARCHAR(50),  -- TUTORIA, EVALUACION
  fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultima_interaccion TIMESTAMP,
  activa BOOLEAN DEFAULT true
)

mensajes_chat (
  id_mensaje UUID PRIMARY KEY,
  id_sesion UUID REFERENCES sesiones_chat_ia,
  emisor VARCHAR(20),  -- ESTUDIANTE, IA
  mensaje TEXT,
  metadata JSONB,      -- Tokens, confianza, fuentes
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

#### **Evaluaciones y Calificaciones**
```sql
evaluaciones (
  id_evaluacion UUID PRIMARY KEY,
  id_leccion UUID REFERENCES lecciones,
  titulo VARCHAR(200),
  tipo VARCHAR(50),  -- QUIZ, EXAMEN, PRACTICA, PROYECTO_FINAL
  descripcion TEXT,
  duracion_minutos INT,
  intentos_permitidos INT,
  nota_minima DECIMAL(5,2),
  id_rubrica UUID REFERENCES rubricas,
  activo BOOLEAN DEFAULT true
)

preguntas (
  id_pregunta UUID PRIMARY KEY,
  id_evaluacion UUID REFERENCES evaluaciones,
  texto_pregunta TEXT,
  tipo VARCHAR(50),  -- MULTIPLE_CHOICE, VERDADERO_FALSO, ABIERTA, CODIGO
  opciones JSONB,
  respuesta_correcta TEXT,
  explicacion TEXT,
  puntos DECIMAL(5,2),
  orden INT
)

rubricas (
  id_rubrica UUID PRIMARY KEY,
  nombre VARCHAR(200),
  descripcion TEXT,
  criterios JSONB,  -- Array de {nombre, peso, descripcion}
  escala_evaluacion JSONB,  -- {min, max, pasos}
  creado_por UUID REFERENCES usuarios
)

resultados_evaluaciones (
  id_resultado UUID PRIMARY KEY,
  id_estudiante UUID REFERENCES estudiantes,
  id_evaluacion UUID REFERENCES evaluaciones,
  nota_obtenida DECIMAL(5,2),
  respuestas JSONB,
  aprobado BOOLEAN,
  retroalimentacion_ia TEXT,
  tiempo_empleado_minutos INT,
  intento_numero INT,
  fecha_realizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

#### **Laboratorios Virtuales**
```sql
laboratorios (
  id_laboratorio UUID PRIMARY KEY,
  id_leccion UUID REFERENCES lecciones,
  titulo VARCHAR(200),
  descripcion TEXT,
  plataforma VARCHAR(50),  -- TINKERCAD, WOKWI, CODESANDBOX, etc.
  url_laboratorio TEXT,
  template_url TEXT,
  instrucciones TEXT,
  objetivos TEXT[],
  activo BOOLEAN DEFAULT true
)

sesiones_laboratorio (
  id_sesion_lab UUID PRIMARY KEY,
  id_estudiante UUID REFERENCES estudiantes,
  id_laboratorio UUID REFERENCES laboratorios,
  codigo_guardado TEXT,
  capturas_pantalla TEXT[],  -- URLs
  url_proyecto TEXT,
  notas TEXT,
  completado BOOLEAN DEFAULT false,
  calificacion_ia TEXT,
  feedback_ia TEXT,
  fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_fin TIMESTAMP
)
```

#### **Inscripciones y Progreso**
```sql
inscripciones (
  id_inscripcion UUID PRIMARY KEY,
  id_estudiante UUID REFERENCES estudiantes,
  id_curso UUID REFERENCES cursos,
  fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(50),  -- EN_PROGRESO, COMPLETADO, ABANDONADO
  progreso_general DECIMAL(5,2),  -- 0-100
  fecha_completado TIMESTAMP
)

progreso_lecciones (
  id_progreso UUID PRIMARY KEY,
  id_estudiante UUID REFERENCES estudiantes,
  id_leccion UUID REFERENCES lecciones,
  completado BOOLEAN DEFAULT false,
  tiempo_dedicado_minutos INT,
  ultima_posicion INT,  -- Para videos/contenido
  fecha_inicio TIMESTAMP,
  fecha_completado TIMESTAMP
)
```

#### **Certificados y Logros**
```sql
certificados (
  id_certificado UUID PRIMARY KEY,
  id_estudiante UUID REFERENCES estudiantes,
  id_curso UUID REFERENCES cursos,
  codigo_verificacion VARCHAR(100) UNIQUE,
  nota_final DECIMAL(5,2),
  fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  url_pdf TEXT
)

logros (
  id_logro UUID PRIMARY KEY,
  nombre VARCHAR(100),
  descripcion TEXT,
  icono VARCHAR(50),
  criterio JSONB,  -- Condiciones para obtenerlo
  puntos INT
)

logros_estudiantes (
  id UUID PRIMARY KEY,
  id_estudiante UUID REFERENCES estudiantes,
  id_logro UUID REFERENCES logros,
  fecha_obtencion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

---

## 🔐 Autenticación y Autorización

### NextAuth 5.0 Configuration

**Archivo:** `auth.ts`

```typescript
// Providers configurados:
- Google OAuth
- GitHub OAuth  
- Credentials (email/password)

// Callbacks importantes:
signIn: Valida que el usuario exista en BD
jwt: Agrega datos personalizados al token
session: Expone datos al cliente

// Features implementadas:
✅ OAuth con auto-registro
✅ Verificación de cuenta en BD
✅ Redirección inteligente (login vs register)
✅ Session storage para OAuth
✅ Protección de rutas con middleware
```

### Flujo de Autenticación

#### **Login con Email/Password:**
```
1. Usuario → /auth/login
2. Submit form → /api/auth/callback/credentials
3. Verificar password con bcrypt
4. Crear sesión JWT
5. Redirect → /estudiante/dashboard
```

#### **Registro con Email/Password:**
```
1. Usuario → /auth/register
2. Submit form → /api/auth/register
3. Crear usuario + estudiante en BD
4. Hash password con bcrypt
5. Auto-login
6. Redirect → /estudiante/dashboard
```

#### **OAuth (Google):**
```
1. Click "Continuar con Google"
2. Google OAuth flow
3. Callback → /auth/redirect?action=login/register
4. Si action=register:
   - Guardar datos en sessionStorage
   - Redirect → /auth/register?oauth=true
   - Form pre-llenado (nombre, email)
   - Submit → /api/auth/oauth-register-complete
   - Crear usuario + estudiante + account
5. Si action=login:
   - Verificar usuario existe en BD
   - Si NO existe → signOut()
   - Si existe → crear sesión
6. Redirect → /estudiante/dashboard
```

### Protección de Rutas

**Archivo:** `middleware.ts`

```typescript
// Rutas protegidas:
/estudiante/*  → Requiere autenticación
/admin/*       → Requiere autenticación + rol ADMIN

// Rutas públicas:
/, /auth/*, /api/auth/*
```

---

## 🤖 Integración con IA

### API Route: `/api/chat/tutor` (POST)

**Responsabilidades:**
1. ✅ Verificar autenticación (NextAuth session)
2. ✅ Obtener estudiante desde BD
3. ✅ Validar inscripción en curso
4. ✅ Crear/obtener sesión de chat
5. 🔄 **Llamar a Python IA Tutor** (puerto 8000)
6. ✅ Guardar mensaje estudiante en `mensajes_chat`
7. ✅ Guardar respuesta IA en `mensajes_chat`
8. ✅ Actualizar timestamp de sesión
9. ✅ Retornar respuesta al frontend

**Request a Python:**
```json
{
  "message": "¿Cómo funciona un transistor?",
  "course_id": "uuid",
  "student_id": "uuid",
  "session_id": "uuid",
  "student_name": "Juan Pérez",
  "context": {
    "progress": 45.5
  }
}
```

**Response esperada de Python:**
```json
{
  "response": "Un transistor es...",
  "metadata": {
    "tokens_used": 150,
    "model": "gpt-4",
    "sources": ["modulo-3-leccion-2"]
  }
}
```

### API Route: `/api/chat/evaluator` (POST)

**Responsabilidades:**
1. ✅ Verificar autenticación
2. ✅ Obtener evaluación y rúbrica
3. ✅ Crear/obtener sesión de evaluación
4. 🔄 **Llamar a Python IA Evaluador** (puerto 8001)
5. ✅ Guardar conversación
6. ✅ Si `is_final=true` → Guardar en `resultados_evaluaciones`

**Request a Python:**
```json
{
  "message": "Aquí está mi código",
  "evaluation_id": "uuid",
  "student_id": "uuid",
  "session_id": "uuid",
  "evaluation_type": "PRACTICA",
  "rubric": { "criterios": [...] },
  "submission": {
    "code": "int main() { ... }"
  }
}
```

**Response esperada:**
```json
{
  "response": "He revisado tu código...",
  "score": 85.5,
  "feedback": ["Lógica correcta", "Falta manejo de errores"],
  "suggestions": ["Agrega validación", "Usa constantes"],
  "is_final": false
}
```

### API Route: `/api/chat/evaluator/submit` (POST)

**Para envío final de evaluación completa:**

```json
{
  "evaluation_id": "uuid",
  "student_id": "uuid",
  "evaluation_type": "QUIZ",
  "rubric": {...},
  "questions": [...],
  "answers": {
    "q1": "B) Semiconductor",
    "q2": "Explicación..."
  },
  "time_spent_minutes": 45
}
```

**Python califica todo y retorna:**
```json
{
  "score": 92.5,
  "feedback": "Excelente trabajo",
  "detailed_feedback": "Pregunta 1: Correcto...",
  "breakdown": {
    "Funcionalidad": 38,
    "Eficiencia": 28
  }
}
```

---

## 🎨 Frontend - Componentes Clave

### Dashboard del Estudiante
**Archivo:** `app/estudiante/dashboard/page.tsx`

```typescript
// Features:
- 4 tarjetas de estadísticas (cursos activos, horas, certificados, racha)
- Curso destacado con botón "Continuar"
- Próximas evaluaciones
- Eventos del calendario
- Actividad reciente
- Acciones rápidas
- Gráfico de progreso semanal

// Datos mockeados actualmente (TODO: conectar con BD)
```

### Vista de Curso con IA
**Archivo:** `app/estudiante/curso/[id]/page.tsx`

```typescript
// Tabs:
1. IA Tutor - Chat en tiempo real
   - ScrollArea con mensajes
   - Input + botón enviar
   - Indicador "typing..."
   - TODO: Conectar con /api/chat/tutor

2. Módulos - Lista de módulos con progreso
   - Progress bars
   - Lista de temas
   - Botones CTA

3. Laboratorios - Tarjetas de labs virtuales
   - Tinkercad, Wokwi, CodeSandbox, etc.
   - Abrir en nueva pestaña
   - TODO: Guardar progreso con /api/laboratorios/[id]/save

// Estado actual:
- Chat con respuestas simuladas (setTimeout)
- Datos hardcodeados (courseData object)
- UI completamente funcional
- Listo para conectar con APIs reales
```

### Componentes UI (shadcn/ui)
```
- Button, Card, Input, Tabs
- Progress, Badge, ScrollArea
- Dialog, Sheet, Dropdown
- Calendar, Chart, Table
- Toast, Skeleton, Spinner
- 40+ componentes listos
```

---

## 🔄 Flujos Completos

### Flujo: Estudiante toma un curso

```
1. Login → /auth/login
   ↓
2. Dashboard → /estudiante/dashboard
   ↓
3. Ver cursos → /estudiante/mis-cursos
   ↓
4. Entrar a curso → /estudiante/curso/[id]
   ↓
5. Tab "IA Tutor"
   - Escribir pregunta
   - Submit → handleSendMessage()
   - TODO: fetch('/api/chat/tutor', { message, courseId })
   - Mostrar respuesta
   ↓
6. Tab "Módulos"
   - Ver progreso
   - Clickear "Continuar módulo"
   - TODO: Ir a /estudiante/curso/[id]/modulo/[moduleId]
   ↓
7. Tomar evaluación
   - TODO: /estudiante/curso/[id]/evaluacion/[evalId]
   - Responder preguntas/código
   - Submit → fetch('/api/chat/evaluator/submit')
   - Ver resultado y feedback IA
   ↓
8. Completar curso
   - Progreso → 100%
   - Generar certificado
   - Aparece en /estudiante/progreso
```

### Flujo: IA califica código del estudiante

```
1. Estudiante escribe código en evaluación práctica
   ↓
2. Click "Enviar para revisión"
   ↓
3. Frontend → POST /api/chat/evaluator/submit
   {
     evaluation_id, student_id, code, answers
   }
   ↓
4. Next.js API:
   - Verifica sesión ✓
   - Obtiene evaluación de BD
   - Obtiene rúbrica de BD
   - Obtiene preguntas de BD
   ↓
5. Next.js → Python IA Evaluador
   POST http://evaluator-service:8001/submit
   {
     evaluation_type: "PRACTICA",
     rubric: { criterios: [...] },
     code: "estudiante's code",
     questions: [...]
   }
   ↓
6. Python IA Evaluador:
   - Analiza código con LangChain
   - Ejecuta tests si es necesario
   - Compara con rúbrica
   - Genera feedback con GPT-4
   - Calcula puntaje ponderado
   ↓
7. Python → Next.js
   {
     score: 88.5,
     feedback: "Bien estructurado...",
     detailed_feedback: "Línea 5: ...",
     suggestions: ["Usa try/catch", ...],
     breakdown: { Funcionalidad: 40, Estilo: 30, ... }
   }
   ↓
8. Next.js API:
   - INSERT INTO resultados_evaluaciones
   - Guarda score, respuestas, feedback
   - Calcula si aprobó (score >= nota_minima)
   ↓
9. Next.js → Frontend
   {
     success: true,
     resultId: "uuid",
     score: 88.5,
     passed: true,
     feedback: "...",
     breakdown: {...}
   }
   ↓
10. Frontend muestra:
    - Puntaje con animación
    - Badge "Aprobado" verde
    - Feedback detallado
    - Sugerencias de mejora
    - Desglose por criterio
```

---

## 🚀 Deployment

### Current Setup:
- **Frontend:** Vercel (Next.js)
- **Database:** Neon PostgreSQL (serverless)
- **IA Services:** Pendiente (Render/Railway recomendado)

### Variables de Entorno (.env.local)

```env
# Database
DATABASE_URL="postgresql://neondb_owner:npg_xxx@ep-xxx.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"  # Cambiar en producción
NEXTAUTH_SECRET="7rK9mP2vQ4xW8yB5nL3jH6fD1gS0aT9cE4uI7oP2mN5qR8tY1wV6zX3bA0cF5hK"

# OAuth
GOOGLE_CLIENT_ID="224218632810-xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"
GITHUB_CLIENT_ID="tu-github-client-id"
GITHUB_CLIENT_SECRET="tu-github-secret"

# Email (Resend)
RESEND_API_KEY="re_VDXrXcb8_xxx"

# IA Services (Python)
TUTOR_SERVICE_URL="http://localhost:8000"  # Desarrollo
# TUTOR_SERVICE_URL="https://tutor-xxx.onrender.com"  # Producción

EVALUATOR_SERVICE_URL="http://localhost:8001"  # Desarrollo
# EVALUATOR_SERVICE_URL="https://eval-xxx.onrender.com"  # Producción
```

---

## 📊 Estado Actual del Proyecto

### ✅ Completado:
- [x] Autenticación completa (OAuth + Credentials)
- [x] Base de datos diseñada (56 tablas)
- [x] UI/UX completa con Tailwind + shadcn
- [x] Dashboard del estudiante
- [x] Vista de curso con tabs (IA, Módulos, Labs)
- [x] Chat UI con mensajes simulados
- [x] Sistema de progreso
- [x] API Routes para IA (proxy layer)
- [x] Documentación técnica

### 🔄 En Desarrollo (Siguiente fase):
- [ ] Servicios Python de IA (Tutor + Evaluador)
- [ ] Conectar chat real con APIs
- [ ] RAG con contenido de cursos
- [ ] Vector database (Pinecone/FAISS)
- [ ] Sistema de calificación automática
- [ ] Integración con laboratorios virtuales

### 📋 TODO (Backlog):
- [ ] Panel de administración
- [ ] Creación de cursos por profesores
- [ ] Sistema de notificaciones
- [ ] Gamificación (logros, puntos)
- [ ] Analytics y reportes
- [ ] Mobile responsive improvements
- [ ] PWA (Progressive Web App)
- [ ] Internacionalización (i18n)

---

## 🐍 Proyecto Python (Por crear)

### Estructura Recomendada:

```
tutor-ia-service/
├── main.py                    # FastAPI app
├── routers/
│   └── chat.py               # POST /chat endpoint
├── services/
│   ├── langchain_service.py  # LangChain logic
│   └── rag_service.py        # RAG con vector DB
├── models/
│   └── schemas.py            # Pydantic models
├── database/
│   └── connection.py         # PostgreSQL connection
├── requirements.txt
├── .env
├── Dockerfile
└── README.md

evaluator-ia-service/
├── main.py
├── routers/
│   ├── evaluate.py           # POST /evaluate
│   └── submit.py             # POST /submit
├── services/
│   ├── grading_service.py    # Lógica de calificación
│   └── rubric_analyzer.py    # Análisis de rúbricas
├── models/
│   └── schemas.py
├── database/
│   └── connection.py
├── requirements.txt
├── .env
├── Dockerfile
└── README.md
```

### Dependencies (requirements.txt):

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
langchain==0.1.0
langchain-openai==0.0.2
pinecone-client==3.0.0
psycopg2-binary==2.9.9
python-dotenv==1.0.0
```

---

## 🔗 Links Útiles

- **Repositorio GitHub:** https://github.com/RuizJpaul/universIA
- **Base de Datos:** Neon Console
- **Deployment:** Vercel
- **Documentación:**
  - `PYTHON_SERVICES_SPEC.md` - Specs Python
  - `INTEGRATION_GUIDE.md` - Guía integración
  - `app/api/README.md` - API routes

---

## 📞 Contacto y Soporte

**Developer:** Jean Paul Ruiz  
**Email:** [tu-email]  
**GitHub:** @RuizJpaul

---

**Última actualización:** Noviembre 14, 2025  
**Versión del documento:** 1.0.0
