# 🤖 Integración del Sistema de IA con UniversIA

## 📋 Tabla de Contenidos
1. [Arquitectura General](#arquitectura-general)
2. [Proyecto Python (Servicio IA)](#proyecto-python-servicio-ia)
3. [API Next.js (Backend)](#api-nextjs-backend)
4. [Flujo de Datos Completo](#flujo-de-datos-completo)
5. [Deployment](#deployment)

---

## 🏗️ Arquitectura General

```
┌──────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 15)                          │
│              /app/estudiante/curso/[id]/page.tsx                  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  Chat Component                                         │      │
│  │  - Envía mensaje del estudiante                         │      │
│  │  - Recibe respuesta de la IA                            │      │
│  │  - Muestra historial                                    │      │
│  └────────────────────────────────────────────────────────┘      │
└────────────────────────────┬─────────────────────────────────────┘
                             │ fetch/WebSocket
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│              BACKEND API (Next.js API Routes)                     │
│                    /api/chat/send.ts                              │
│                    /api/chat/session.ts                           │
│                                                                    │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  1. Valida autenticación (JWT)                          │      │
│  │  2. Obtiene contexto del estudiante (PostgreSQL)        │      │
│  │  3. Prepara prompt con contexto                         │      │
│  │  4. Llama al Servicio IA Python                         │      │
│  │  5. Guarda mensajes (MongoDB)                           │      │
│  │  6. Actualiza métricas (PostgreSQL)                     │      │
│  └────────────────────────────────────────────────────────┘      │
└────────────────────────────┬─────────────────────────────────────┘
                             │ HTTP REST API
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│              SERVICIO IA (Python - FastAPI)                       │
│                  http://localhost:8000                            │
│                                                                    │
│  ┌────────────────────────────────────────────────────────┐      │
│  │  Endpoints:                                             │      │
│  │  - POST /api/v1/chat/completions                       │      │
│  │  - POST /api/v1/chat/stream                            │      │
│  │  - GET  /api/v1/chat/health                            │      │
│  │                                                         │      │
│  │  Funcionalidades:                                      │      │
│  │  - LangChain para manejo de contexto                   │      │
│  │  - RAG con embeddings del curso                        │      │
│  │  - Integración GPT-4/Gemini/Claude                     │      │
│  │  - Sistema de prompts dinámicos                        │      │
│  │  - Evaluación según rúbricas                           │      │
│  └────────────────────────────────────────────────────────┘      │
└────────────────────────────┬─────────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     ┌──────────────┐ ┌──────────┐ ┌────────────┐
     │  PostgreSQL  │ │ MongoDB  │ │ OpenAI API │
     │              │ │          │ │ Gemini API │
     │ - Contexto   │ │ - Chats  │ │ Claude API │
     │ - Progreso   │ │ - Logs   │ └────────────┘
     │ - Rúbricas   │ └──────────┘
     └──────────────┘
```

---

## 🐍 Proyecto Python (Servicio IA)

### **Estructura del Proyecto Python**

```
universia-ia-service/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app
│   ├── config.py                  # Configuración
│   ├── models/
│   │   ├── __init__.py
│   │   ├── chat_models.py         # Pydantic models
│   │   └── context_models.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── chat_service.py        # Lógica principal del chat
│   │   ├── prompt_builder.py      # Construcción de prompts
│   │   ├── rag_service.py         # Retrieval Augmented Generation
│   │   └── llm_service.py         # Integración con OpenAI/Gemini
│   ├── routers/
│   │   ├── __init__.py
│   │   └── chat_router.py         # Endpoints API
│   └── utils/
│       ├── __init__.py
│       ├── db_utils.py            # Helpers de BD
│       └── logger.py
├── tests/
├── requirements.txt
├── .env.example
└── README.md
```

### **Código Base del Servicio Python**

#### **1. `requirements.txt`**
```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.0
pydantic-settings==2.1.0
langchain==0.1.0
langchain-openai==0.0.2
langchain-google-genai==0.0.5
openai==1.10.0
google-generativeai==0.3.2
anthropic==0.8.0
pymongo==4.6.1
psycopg2-binary==2.9.9
python-dotenv==1.0.0
httpx==0.26.0
tiktoken==0.5.2
```

#### **2. `app/config.py`**
```python
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # API Keys
    OPENAI_API_KEY: str
    GEMINI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    
    # Database
    POSTGRES_URL: str
    MONGODB_URL: str
    MONGODB_DB: str = "universia_chat"
    
    # Service Config
    SERVICE_HOST: str = "0.0.0.0"
    SERVICE_PORT: int = 8000
    API_VERSION: str = "v1"
    
    # AI Config
    DEFAULT_MODEL: str = "gpt-4-turbo-preview"
    DEFAULT_TEMPERATURE: float = 0.7
    MAX_TOKENS: int = 1000
    
    # Security
    SECRET_KEY: str
    ALLOWED_ORIGINS: list = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"

settings = Settings()
```

#### **3. `app/models/chat_models.py`**
```python
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class Message(BaseModel):
    role: str = Field(..., description="usuario o asistente")
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatRequest(BaseModel):
    session_id: int
    student_id: int
    course_id: int
    lesson_id: Optional[int] = None
    message: str
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    session_id: int
    message: str
    tokens_used: int
    cost: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[Dict[str, Any]] = None

class StudentContext(BaseModel):
    """Contexto del estudiante para la IA"""
    student_id: int
    course_id: int
    current_lesson_id: Optional[int]
    completed_lessons: List[int] = []
    progress_percentage: float = 0.0
    learning_objectives: List[str] = []
    key_concepts: List[str] = []
    rubric: Optional[Dict[str, Any]] = None
    tutor_config: Dict[str, Any]
```

#### **4. `app/services/chat_service.py`**
```python
from typing import Dict, Any, List
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.schema import HumanMessage, AIMessage, SystemMessage
import psycopg2
from pymongo import MongoClient
from datetime import datetime
from app.config import settings
from app.models.chat_models import ChatRequest, ChatResponse, StudentContext

class ChatService:
    def __init__(self):
        self.pg_conn = psycopg2.connect(settings.POSTGRES_URL)
        self.mongo_client = MongoClient(settings.MONGODB_URL)
        self.mongo_db = self.mongo_client[settings.MONGODB_DB]
        
    def get_student_context(self, student_id: int, course_id: int, lesson_id: Optional[int] = None) -> StudentContext:
        """Obtiene el contexto completo del estudiante desde PostgreSQL"""
        with self.pg_conn.cursor() as cur:
            # Obtener configuración del tutor IA
            cur.execute("""
                SELECT t.modelo_ia, t.prompt_sistema, t.temperatura, t.max_tokens, t.configuracion
                FROM cursos c
                JOIN tutores_ia t ON c.id_tutor = t.id_tutor
                WHERE c.id_curso = %s
            """, (course_id,))
            tutor = cur.fetchone()
            
            # Obtener progreso del estudiante
            cur.execute("""
                SELECT i.progreso_general, 
                       ARRAY_AGG(DISTINCT pl.id_leccion) FILTER (WHERE pl.completado = TRUE) as lecciones_completadas
                FROM inscripciones i
                LEFT JOIN progreso_lecciones pl ON i.id_inscripcion = pl.id_inscripcion
                WHERE i.id_estudiante = %s AND i.id_curso = %s
                GROUP BY i.id_inscripcion, i.progreso_general
            """, (student_id, course_id))
            progress = cur.fetchone()
            
            # Obtener objetivos de la lección actual
            learning_objectives = []
            key_concepts = []
            if lesson_id:
                cur.execute("""
                    SELECT objetivos_aprendizaje, conceptos_clave
                    FROM lecciones
                    WHERE id_leccion = %s
                """, (lesson_id,))
                lesson_data = cur.fetchone()
                if lesson_data:
                    learning_objectives = lesson_data[0] or []
                    key_concepts = lesson_data[1] or []
            
            # Obtener rúbrica del módulo/curso
            rubric = None
            if lesson_id:
                cur.execute("""
                    SELECT r.criterios, r.escala_evaluacion
                    FROM lecciones l
                    JOIN modulos m ON l.id_modulo = m.id_modulo
                    JOIN rubricas r ON (r.id_modulo = m.id_modulo OR r.id_curso = m.id_curso)
                    WHERE l.id_leccion = %s
                    LIMIT 1
                """, (lesson_id,))
                rubric_data = cur.fetchone()
                if rubric_data:
                    rubric = {
                        "criterios": rubric_data[0],
                        "escala": rubric_data[1]
                    }
            
            return StudentContext(
                student_id=student_id,
                course_id=course_id,
                current_lesson_id=lesson_id,
                completed_lessons=progress[1] if progress and progress[1] else [],
                progress_percentage=float(progress[0]) if progress else 0.0,
                learning_objectives=learning_objectives,
                key_concepts=key_concepts,
                rubric=rubric,
                tutor_config={
                    "model": tutor[0],
                    "system_prompt": tutor[1],
                    "temperature": float(tutor[2]) if tutor[2] else 0.7,
                    "max_tokens": tutor[3] or 1000,
                    "extra": tutor[4] or {}
                }
            )
    
    def build_system_prompt(self, context: StudentContext) -> str:
        """Construye el prompt del sistema basado en el contexto"""
        base_prompt = context.tutor_config.get("system_prompt", "Eres un tutor virtual.")
        
        context_info = f"""
        
CONTEXTO DEL ESTUDIANTE:
- Progreso en el curso: {context.progress_percentage:.1f}%
- Lecciones completadas: {len(context.completed_lessons)}

"""
        
        if context.learning_objectives:
            context_info += f"""
OBJETIVOS DE APRENDIZAJE DE ESTA LECCIÓN:
{chr(10).join(f"- {obj}" for obj in context.learning_objectives)}

"""
        
        if context.key_concepts:
            context_info += f"""
CONCEPTOS CLAVE A ENSEÑAR:
{', '.join(context.key_concepts)}

"""
        
        if context.rubric:
            context_info += f"""
RÚBRICA DE EVALUACIÓN:
Usa estos criterios para evaluar la comprensión del estudiante:
{context.rubric.get('criterios', {})}

"""
        
        context_info += """
INSTRUCCIONES:
1. Adapta tus explicaciones al nivel de progreso del estudiante
2. Verifica comprensión antes de avanzar a nuevos conceptos
3. Usa ejemplos prácticos relacionados con los objetivos de la lección
4. Si el estudiante hace preguntas sobre temas no cubiertos aún, guíalo suavemente de vuelta
5. Celebra sus logros y motívalo en sus dificultades
"""
        
        return base_prompt + context_info
    
    def get_chat_history(self, session_id: int, limit: int = 10) -> List[Dict[str, str]]:
        """Obtiene historial de chat desde MongoDB"""
        collection = self.mongo_db.chat_messages
        messages = collection.find(
            {"session_id": session_id}
        ).sort("timestamp", -1).limit(limit)
        
        history = []
        for msg in reversed(list(messages)):
            history.append({
                "role": msg["role"],
                "content": msg["content"]
            })
        return history
    
    async def process_message(self, request: ChatRequest) -> ChatResponse:
        """Procesa el mensaje del estudiante y genera respuesta"""
        # 1. Obtener contexto del estudiante
        context = self.get_student_context(
            request.student_id,
            request.course_id,
            request.lesson_id
        )
        
        # 2. Construir prompt del sistema
        system_prompt = self.build_system_prompt(context)
        
        # 3. Obtener historial de conversación
        history = self.get_chat_history(request.session_id)
        
        # 4. Preparar mensajes para el LLM
        messages = [SystemMessage(content=system_prompt)]
        
        for msg in history:
            if msg["role"] == "usuario":
                messages.append(HumanMessage(content=msg["content"]))
            else:
                messages.append(AIMessage(content=msg["content"]))
        
        messages.append(HumanMessage(content=request.message))
        
        # 5. Llamar al modelo de IA
        model_name = context.tutor_config["model"]
        
        if "gpt" in model_name.lower():
            llm = ChatOpenAI(
                model=model_name,
                temperature=context.tutor_config["temperature"],
                max_tokens=context.tutor_config["max_tokens"],
                api_key=settings.OPENAI_API_KEY
            )
        elif "gemini" in model_name.lower():
            llm = ChatGoogleGenerativeAI(
                model=model_name,
                temperature=context.tutor_config["temperature"],
                max_output_tokens=context.tutor_config["max_tokens"],
                google_api_key=settings.GEMINI_API_KEY
            )
        else:
            raise ValueError(f"Modelo no soportado: {model_name}")
        
        # 6. Generar respuesta
        response = await llm.ainvoke(messages)
        
        # 7. Guardar mensajes en MongoDB
        collection = self.mongo_db.chat_messages
        timestamp = datetime.utcnow()
        
        collection.insert_many([
            {
                "session_id": request.session_id,
                "student_id": request.student_id,
                "course_id": request.course_id,
                "lesson_id": request.lesson_id,
                "role": "usuario",
                "content": request.message,
                "timestamp": timestamp
            },
            {
                "session_id": request.session_id,
                "student_id": request.student_id,
                "course_id": request.course_id,
                "lesson_id": request.lesson_id,
                "role": "asistente",
                "content": response.content,
                "timestamp": timestamp,
                "model": model_name,
                "tokens": getattr(response, 'usage', {}).get('total_tokens', 0)
            }
        ])
        
        # 8. Actualizar métricas en PostgreSQL
        tokens_used = getattr(response, 'usage', {}).get('total_tokens', 0)
        cost = self._calculate_cost(model_name, tokens_used)
        
        with self.pg_conn.cursor() as cur:
            cur.execute("""
                UPDATE sesiones_chat_ia
                SET total_mensajes = total_mensajes + 2,
                    tokens_usados = tokens_usados + %s,
                    costo_api = costo_api + %s,
                    activa = TRUE
                WHERE id_sesion = %s
            """, (tokens_used, cost, request.session_id))
            self.pg_conn.commit()
        
        return ChatResponse(
            session_id=request.session_id,
            message=response.content,
            tokens_used=tokens_used,
            cost=cost,
            metadata={
                "model": model_name,
                "context_used": len(history)
            }
        )
    
    def _calculate_cost(self, model: str, tokens: int) -> float:
        """Calcula el costo aproximado de la llamada a la API"""
        costs_per_1k = {
            "gpt-4": 0.03,
            "gpt-4-turbo": 0.01,
            "gpt-3.5-turbo": 0.002,
            "gemini-pro": 0.0005
        }
        
        for key, cost in costs_per_1k.items():
            if key in model.lower():
                return (tokens / 1000) * cost
        
        return 0.0
```

#### **5. `app/routers/chat_router.py`**
```python
from fastapi import APIRouter, HTTPException, Depends
from app.models.chat_models import ChatRequest, ChatResponse
from app.services.chat_service import ChatService

router = APIRouter(prefix="/api/v1/chat", tags=["chat"])

def get_chat_service():
    return ChatService()

@router.post("/completions", response_model=ChatResponse)
async def chat_completion(
    request: ChatRequest,
    service: ChatService = Depends(get_chat_service)
):
    """Procesa un mensaje del estudiante y retorna la respuesta de la IA"""
    try:
        response = await service.process_message(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    """Verifica que el servicio esté funcionando"""
    return {"status": "healthy", "service": "universia-ia"}
```

#### **6. `app/main.py`**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import chat_router

app = FastAPI(
    title="UniversIA - Servicio de IA",
    version="1.0.0",
    description="Servicio de chat IA para tutorías automatizadas"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(chat_router.router)

@app.get("/")
async def root():
    return {
        "message": "UniversIA IA Service",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.SERVICE_HOST,
        port=settings.SERVICE_PORT,
        reload=True
    )
```

---

## ⚛️ API Next.js (Backend)

### **API Route: `/api/chat/send.ts`**

```typescript
// app/api/chat/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

const IA_SERVICE_URL = process.env.IA_SERVICE_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    // 1. Validar autenticación (obtener de headers/cookies)
    const headersList = headers();
    const token = headersList.get('authorization');
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    // 2. Obtener datos del request
    const body = await request.json();
    const { sessionId, studentId, courseId, lessonId, message } = body;
    
    // 3. Validar datos
    if (!sessionId || !studentId || !courseId || !message) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }
    
    // 4. Llamar al servicio Python de IA
    const iaResponse = await fetch(`${IA_SERVICE_URL}/api/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        student_id: studentId,
        course_id: courseId,
        lesson_id: lessonId,
        message: message,
      }),
    });
    
    if (!iaResponse.ok) {
      const error = await iaResponse.json();
      throw new Error(error.detail || 'Error en servicio de IA');
    }
    
    const iaData = await iaResponse.json();
    
    // 5. Retornar respuesta
    return NextResponse.json({
      success: true,
      data: iaData,
    });
    
  } catch (error: any) {
    console.error('Error en /api/chat/send:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
```

### **API Route: `/api/chat/session.ts`**

```typescript
// app/api/chat/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, courseId, lessonId } = body;
    
    // Crear nueva sesión de chat
    const result = await pool.query(
      `INSERT INTO sesiones_chat_ia (
        id_estudiante, 
        id_curso, 
        id_leccion, 
        id_tutor,
        contexto_sesion
      )
      SELECT $1, $2, $3, c.id_tutor, $4
      FROM cursos c
      WHERE c.id_curso = $2
      RETURNING id_sesion`,
      [
        studentId,
        courseId,
        lessonId,
        JSON.stringify({ created_from: 'web', lesson_id: lessonId }),
      ]
    );
    
    return NextResponse.json({
      success: true,
      sessionId: result.rows[0].id_sesion,
    });
    
  } catch (error: any) {
    console.error('Error creando sesión:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId requerido' },
        { status: 400 }
      );
    }
    
    // Obtener info de la sesión
    const result = await pool.query(
      `SELECT 
        s.*,
        t.nombre as tutor_nombre,
        c.nombre as curso_nombre
      FROM sesiones_chat_ia s
      JOIN tutores_ia t ON s.id_tutor = t.id_tutor
      JOIN cursos c ON s.id_curso = c.id_curso
      WHERE s.id_sesion = $1`,
      [sessionId]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Sesión no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      session: result.rows[0],
    });
    
  } catch (error: any) {
    console.error('Error obteniendo sesión:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

---

## 🔄 Flujo de Datos Completo

### **Flujo Paso a Paso:**

```
1. ESTUDIANTE ENVÍA MENSAJE
   ↓
2. FRONTEND captura mensaje
   → POST /api/chat/send
   ↓
3. NEXT.JS API ROUTE valida autenticación
   → Obtiene sessionId de PostgreSQL (si no existe, crea uno)
   ↓
4. NEXT.JS llama al SERVICIO PYTHON
   → POST http://localhost:8000/api/v1/chat/completions
   {
     "session_id": 123,
     "student_id": 456,
     "course_id": 1,
     "lesson_id": 5,
     "message": "¿Qué es un bucle for?"
   }
   ↓
5. SERVICIO PYTHON (ChatService):
   a) Consulta PostgreSQL:
      - Obtiene progreso del estudiante
      - Obtiene configuración del tutor IA
      - Obtiene objetivos de la lección
      - Obtiene rúbrica del módulo
   
   b) Consulta MongoDB:
      - Obtiene últimos 10 mensajes del chat
   
   c) Construye prompt completo:
      ```
      Sistema: Eres Ada, tutora de programación...
               Progreso del estudiante: 35%
               Lecciones completadas: 12
               Objetivos: Comprender estructuras de control...
               Conceptos clave: bucles, iteración, for, while
      
      Usuario: [mensajes anteriores]
      IA: [respuestas anteriores]
      Usuario: ¿Qué es un bucle for?
      ```
   
   d) Llama a OpenAI/Gemini con el prompt
   
   e) Guarda en MongoDB:
      - Mensaje del usuario
      - Respuesta de la IA
      - Metadata (tokens, modelo, timestamp)
   
   f) Actualiza PostgreSQL:
      - total_mensajes += 2
      - tokens_usados += N
      - costo_api += X
   ↓
6. SERVICIO PYTHON responde a Next.js:
   {
     "session_id": 123,
     "message": "Un bucle for es una estructura...",
     "tokens_used": 150,
     "cost": 0.0045
   }
   ↓
7. NEXT.JS API ROUTE responde al frontend
   ↓
8. FRONTEND muestra respuesta al estudiante
```

---

## 🚀 Deployment

### **Opción 1: Docker Compose (Desarrollo)**

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: universia
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - ./database:/docker-entrypoint-initdb.d
      - postgres_data:/var/lib/postgresql/data
  
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
  
  ia-service:
    build: ./universia-ia-service
    ports:
      - "8000:8000"
    environment:
      POSTGRES_URL: postgresql://admin:password@postgres:5432/universia
      MONGODB_URL: mongodb://mongodb:27017/
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      GEMINI_API_KEY: ${GEMINI_API_KEY}
    depends_on:
      - postgres
      - mongodb
  
  nextjs:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://admin:password@postgres:5432/universia
      IA_SERVICE_URL: http://ia-service:8000
    depends_on:
      - postgres
      - ia-service

volumes:
  postgres_data:
  mongo_data:
```

### **Opción 2: Producción (Railway/Vercel + Render)**

```
┌─────────────────────────────────────────┐
│  FRONTEND + NEXT.JS API                  │
│  Vercel / Railway                        │
│  - Maneja UI                             │
│  - API Routes (/api/chat/*)              │
└──────────────────┬──────────────────────┘
                   │
                   ▼ HTTPS
┌─────────────────────────────────────────┐
│  SERVICIO IA (Python)                    │
│  Render / Railway / AWS Lambda           │
│  - Puerto 8000                           │
│  - FastAPI + Uvicorn                     │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
   PostgreSQL  MongoDB    OpenAI API
   (Railway)   (Atlas)    (Cloud)
```

---

## 📝 Variables de Entorno

### **Next.js (`.env.local`)**
```env
DATABASE_URL=postgresql://user:pass@host:5432/universia
IA_SERVICE_URL=http://localhost:8000
NEXTAUTH_SECRET=your-secret-key
```

### **Python Service (`.env`)**
```env
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza...
ANTHROPIC_API_KEY=sk-ant-...

POSTGRES_URL=postgresql://user:pass@host:5432/universia
MONGODB_URL=mongodb://host:27017/
MONGODB_DB=universia_chat

SERVICE_HOST=0.0.0.0
SERVICE_PORT=8000

SECRET_KEY=your-secret-key
ALLOWED_ORIGINS=["http://localhost:3000","https://universia.com"]
```

---

## ✅ Checklist de Integración

- [ ] Base de datos actualizada con rúbricas y objetivos
- [ ] Servicio Python creado y funcionando
- [ ] API Routes de Next.js implementadas
- [ ] Frontend actualizado para llamar a las APIs
- [ ] MongoDB configurado para almacenar chats
- [ ] Variables de entorno configuradas
- [ ] Docker Compose para desarrollo local
- [ ] Tests básicos del servicio Python
- [ ] Documentación de endpoints
- [ ] Deployment en producción

---

## 🎯 Próximos Pasos

1. **Crear el proyecto Python** con la estructura propuesta
2. **Actualizar el frontend** para consumir las nuevas APIs
3. **Configurar MongoDB** y crear colección de mensajes
4. **Testear localmente** con Docker Compose
5. **Deploy gradual** (primero desarrollo, luego producción)
