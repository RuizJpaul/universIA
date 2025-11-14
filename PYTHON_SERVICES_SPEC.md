# 🤖 Especificaciones para Servicios Python de IA

Este documento especifica exactamente qué endpoints deben exponer tus servicios Python (FastAPI) para que funcionen con Next.js.

---

## 🎓 Servicio 1: IA Tutora (Puerto 8000)

### Endpoint Principal: POST /chat

**URL:** `http://localhost:8000/chat` (desarrollo) / `https://tu-servicio.onrender.com/chat` (producción)

**Request Body:**
```json
{
  "message": "¿Cómo funciona un transistor BJT?",
  "course_id": "550e8400-e29b-41d4-a716-446655440000",
  "student_id": "660e8400-e29b-41d4-a716-446655440001",
  "session_id": "770e8400-e29b-41d4-a716-446655440002",
  "student_name": "Juan Pérez",
  "context": {
    "progress": 45.5
  }
}
```

**Response Esperada:**
```json
{
  "response": "Un transistor BJT (Bipolar Junction Transistor) es un dispositivo semiconductor...",
  "metadata": {
    "tokens_used": 150,
    "model": "gpt-4",
    "confidence": 0.95,
    "sources": ["modulo-3-leccion-2", "modulo-3-leccion-3"]
  }
}
```

**Código Python de Ejemplo (FastAPI):**
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain.chains import ConversationalRetrievalChain
from langchain_openai import ChatOpenAI
# ... tus imports de LangChain

app = FastAPI()

class ChatRequest(BaseModel):
    message: str
    course_id: str
    student_id: str
    session_id: str
    student_name: str
    context: dict = {}

class ChatResponse(BaseModel):
    response: str
    metadata: dict = {}

@app.post("/chat", response_model=ChatResponse)
async def chat_tutor(request: ChatRequest):
    try:
        # 1. Cargar contexto del curso desde tu vector DB
        # vectorstore = load_course_context(request.course_id)
        
        # 2. Obtener historial de la sesión (opcional)
        # chat_history = get_session_history(request.session_id)
        
        # 3. Tu lógica de LangChain + RAG
        # llm = ChatOpenAI(model="gpt-4", temperature=0.7)
        # chain = ConversationalRetrievalChain.from_llm(llm, vectorstore)
        # result = chain({"question": request.message, "chat_history": chat_history})
        
        # EJEMPLO TEMPORAL (reemplaza con tu código real):
        response_text = "Respuesta de tu modelo IA aquí"
        
        return ChatResponse(
            response=response_text,
            metadata={
                "tokens_used": 150,
                "model": "gpt-4",
                "confidence": 0.95
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "tutor"}
```

**Variables de Entorno Requeridas (.env en Python):**
```bash
DATABASE_URL=postgresql://...  # Neon PostgreSQL (mismo que Next.js)
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...           # Si usas Pinecone
PINECONE_INDEX_NAME=universia-courses
```

---

## 📝 Servicio 2: IA Evaluadora (Puerto 8001)

### Endpoint 1: POST /evaluate

Para chat interactivo durante una evaluación (feedback progresivo).

**Request Body:**
```json
{
  "message": "Aquí está mi implementación del circuito",
  "evaluation_id": "880e8400-e29b-41d4-a716-446655440003",
  "student_id": "660e8400-e29b-41d4-a716-446655440001",
  "session_id": "990e8400-e29b-41d4-a716-446655440004",
  "student_name": "Juan Pérez",
  "evaluation_type": "PRACTICA",
  "rubric": {
    "criterios": [
      {
        "nombre": "Funcionalidad",
        "peso": 40,
        "descripcion": "El circuito funciona correctamente"
      },
      {
        "nombre": "Eficiencia",
        "peso": 30,
        "descripcion": "Uso óptimo de componentes"
      }
    ]
  },
  "grading_scale": {
    "escala": "0-100",
    "nota_aprobacion": 70
  },
  "minimum_score": 70,
  "submission": {
    "code": "int led = 13;\nvoid setup() { pinMode(led, OUTPUT); }...",
    "answer": null
  }
}
```

**Response Esperada:**
```json
{
  "response": "He analizado tu código. El circuito está bien diseñado pero podrías optimizar...",
  "score": null,
  "feedback": [
    "La lógica es correcta",
    "Falta resistencia limitadora de corriente"
  ],
  "suggestions": [
    "Agrega resistencia de 220Ω al LED",
    "Considera usar constantes para los pines"
  ],
  "is_final": false,
  "metadata": {
    "analysis_type": "incremental",
    "criteria_checked": ["syntax", "logic"]
  }
}
```

---

### Endpoint 2: POST /submit

Para evaluación completa y calificación final.

**Request Body:**
```json
{
  "evaluation_id": "880e8400-e29b-41d4-a716-446655440003",
  "student_id": "660e8400-e29b-41d4-a716-446655440001",
  "student_name": "Juan Pérez",
  "evaluation_type": "QUIZ",
  "rubric": {
    "criterios": [...]
  },
  "grading_scale": {
    "escala": "0-100"
  },
  "questions": [
    {
      "id_pregunta": "q1",
      "texto_pregunta": "¿Qué es un transistor?",
      "tipo": "MULTIPLE_CHOICE",
      "opciones": ["A) Resistencia", "B) Semiconductor", "C) Capacitor"],
      "respuesta_correcta": "B) Semiconductor",
      "puntos": 10
    }
  ],
  "answers": {
    "q1": "B) Semiconductor",
    "q2": "Explicación detallada..."
  },
  "code": null,
  "time_spent_minutes": 45
}
```

**Response Esperada:**
```json
{
  "score": 92.5,
  "feedback": "Excelente trabajo general. Dominaste los conceptos principales.",
  "detailed_feedback": "Pregunta 1: Correcto (10/10)\nPregunta 2: Muy bien explicado (9/10)...",
  "suggestions": [
    "Revisa el concepto de polarización inversa",
    "Practica más con circuitos en paralelo"
  ],
  "breakdown": {
    "Funcionalidad": 38,
    "Eficiencia": 28,
    "Documentación": 26.5
  },
  "time_spent_minutes": 45
}
```

**Código Python de Ejemplo:**
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, List, Any

app = FastAPI()

class EvaluateRequest(BaseModel):
    message: str
    evaluation_id: str
    student_id: str
    session_id: str
    student_name: str
    evaluation_type: str
    rubric: dict
    grading_scale: dict
    minimum_score: float
    submission: dict

class EvaluateResponse(BaseModel):
    response: str
    score: Optional[float] = None
    feedback: List[str] = []
    suggestions: List[str] = []
    is_final: bool = False
    metadata: dict = {}

@app.post("/evaluate", response_model=EvaluateResponse)
async def evaluate_chat(request: EvaluateRequest):
    try:
        # Tu lógica de evaluación incremental con IA
        # Aquí usarías tu modelo para analizar el código/respuesta
        # y dar feedback sin calificación final
        
        return EvaluateResponse(
            response="Feedback de la IA sobre el progreso",
            score=None,  # No final aún
            feedback=["Punto positivo 1", "Punto positivo 2"],
            suggestions=["Mejora 1", "Mejora 2"],
            is_final=False
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class SubmitRequest(BaseModel):
    evaluation_id: str
    student_id: str
    student_name: str
    evaluation_type: str
    rubric: dict
    grading_scale: dict
    questions: List[dict] = []
    answers: dict = {}
    code: Optional[str] = None
    time_spent_minutes: int = 0

class SubmitResponse(BaseModel):
    score: float
    feedback: str
    detailed_feedback: str
    suggestions: List[str] = []
    breakdown: Dict[str, float] = {}
    time_spent_minutes: int

@app.post("/submit", response_model=SubmitResponse)
async def submit_evaluation(request: SubmitRequest):
    try:
        # 1. Calificar cada pregunta/criterio según la rúbrica
        # 2. Usar IA para evaluar respuestas abiertas y código
        # 3. Calcular puntaje total ponderado
        
        # EJEMPLO (reemplaza con tu lógica real):
        total_score = 92.5
        breakdown = {
            "Funcionalidad": 38,
            "Eficiencia": 28,
            "Documentación": 26.5
        }
        
        return SubmitResponse(
            score=total_score,
            feedback="Excelente trabajo",
            detailed_feedback="Análisis detallado...",
            suggestions=["Sugerencia 1", "Sugerencia 2"],
            breakdown=breakdown,
            time_spent_minutes=request.time_spent_minutes
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "evaluator"}
```

---

## 🐳 Deployment en Render/Railway

### requirements.txt
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

### Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Comando de inicio (Render/Railway):
```bash
# Para Tutor (puerto 8000)
uvicorn main:app --host 0.0.0.0 --port 8000

# Para Evaluador (puerto 8001)
uvicorn main:app --host 0.0.0.0 --port 8001
```

---

## ✅ Checklist de Integración

### Servicio Python:
- [ ] Endpoints `/chat`, `/evaluate`, `/submit` implementados
- [ ] Modelos Pydantic definidos (request/response)
- [ ] Variables de entorno configuradas
- [ ] Health check endpoint `/health`
- [ ] Manejo de errores (try/except)
- [ ] CORS habilitado si es necesario:
  ```python
  from fastapi.middleware.cors import CORSMiddleware
  
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["https://tu-app.vercel.app"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```

### Next.js (Ya completado ✅):
- [x] API routes creadas
- [x] Variables de entorno configuradas
- [x] Autenticación verificada
- [x] Conexión a PostgreSQL
- [x] Logs de debugging

---

## 🧪 Pruebas Locales

### 1. Iniciar servicio Python:
```bash
cd tu-proyecto-python-tutor
uvicorn main:app --reload --port 8000
```

### 2. Probar endpoint directamente:
```bash
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

### 3. Iniciar Next.js:
```bash
cd universIA
pnpm dev
```

### 4. Probar desde frontend o Postman a Next.js:
```
POST http://localhost:3000/api/chat/tutor
Body: { "message": "Hola", "courseId": "uuid-real" }
Headers: Cookie con sesión autenticada
```

---

## 📞 Contacto entre Servicios

```
Frontend (React)
    ↓ fetch
Next.js API (/api/chat/tutor)
    ↓ fetch + validación + DB
Python FastAPI (puerto 8000)
    ↓ LangChain + RAG + GPT-4
Response ↑
    ↑ guardar en DB
    ↑ retornar
    ↑
Frontend recibe respuesta
```

---

¿Listo para subir tus modelos Python a Render? 🚀
