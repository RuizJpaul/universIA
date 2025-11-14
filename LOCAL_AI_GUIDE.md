# 🏠 Guía: Ejecutar IA de UniversIA Localmente

Esta guía te muestra cómo desarrollar y probar los servicios de IA sin gastar en APIs externas.

---

## 🎯 Opciones para Desarrollo Local

### **Opción 1: Ollama + LangChain (Recomendado) 🔥**

**Ventajas:**
- ✅ 100% gratis y privado
- ✅ No necesita internet
- ✅ Modelos potentes (Llama 3, Mistral, CodeLlama)
- ✅ Fácil instalación
- ✅ Compatible con LangChain

**Desventajas:**
- ⚠️ Requiere GPU (recomendado) o CPU potente
- ⚠️ Modelos más lentos que GPT-4
- ⚠️ ~4-8 GB RAM por modelo

#### Instalación:

**Windows:**
```powershell
# Descargar desde: https://ollama.ai/download
# O con winget:
winget install Ollama.Ollama

# Verificar instalación
ollama --version
```

**Iniciar servidor Ollama:**
```powershell
# Ollama se ejecuta automáticamente en segundo plano
# Puerto por defecto: http://localhost:11434
```

**Descargar modelos:**
```powershell
# Modelo general (tutorías)
ollama pull llama3:8b          # 4.7 GB - Excelente para chat

# Modelo para código (evaluaciones)
ollama pull codellama:13b      # 7.4 GB - Especializado en código

# Modelo ligero (desarrollo rápido)
ollama pull mistral:7b         # 4.1 GB - Rápido y eficiente

# Ver modelos instalados
ollama list
```

**Probar modelo:**
```powershell
ollama run llama3:8b "Explica qué es un transistor"
```

#### Integración con Python (FastAPI + LangChain):

**requirements.txt:**
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
langchain==0.1.0
langchain-community==0.0.10
pydantic==2.5.0
psycopg2-binary==2.9.9
python-dotenv==1.0.0
```

**Código de ejemplo (tutor-ia-service/main.py):**
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_community.llms import Ollama
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="UniversIA Tutor IA")

# CORS para Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurar Ollama
llm = Ollama(
    model="llama3:8b",
    base_url="http://localhost:11434",
    temperature=0.7,
)

# Template de prompt para tutor
tutor_template = """Eres un tutor de IA experto en educación universitaria.

Curso: {course_id}
Estudiante: {student_name}
Progreso del estudiante: {progress}%

Pregunta del estudiante: {message}

Proporciona una respuesta educativa, clara y motivadora. Si es un concepto técnico, 
explícalo con ejemplos prácticos. Sé conciso pero completo.

Respuesta:"""

prompt = PromptTemplate(
    input_variables=["course_id", "student_name", "progress", "message"],
    template=tutor_template
)

chain = LLMChain(llm=llm, prompt=prompt)

# Models
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
        # Generar respuesta con Ollama
        response = chain.run(
            course_id=request.course_id,
            student_name=request.student_name,
            progress=request.context.get("progress", 0),
            message=request.message
        )
        
        return ChatResponse(
            response=response.strip(),
            metadata={
                "model": "llama3:8b",
                "local": True,
                "tokens_estimate": len(response.split())
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "tutor",
        "model": "llama3:8b (Ollama)",
        "mode": "local"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**Ejecutar:**
```powershell
cd tutor-ia-service
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

**Probar:**
```powershell
curl -X POST http://localhost:8000/chat `
  -H "Content-Type: application/json" `
  -d '{
    "message": "¿Qué es un transistor?",
    "course_id": "test",
    "student_id": "test",
    "session_id": "test",
    "student_name": "Test",
    "context": {"progress": 50}
  }'
```

---

### **Opción 2: GPT4All (Alternativa a Ollama)**

**Instalación:**
```powershell
pip install gpt4all
```

**Código:**
```python
from langchain_community.llms import GPT4All

llm = GPT4All(
    model="mistral-7b-openorca.Q4_0.gguf",
    max_tokens=2048,
)
```

---

### **Opción 3: LM Studio (GUI para modelos locales)**

**Ventajas:**
- ✅ Interfaz gráfica amigable
- ✅ Descarga de modelos fácil
- ✅ API compatible con OpenAI
- ✅ No necesitas código para probar

**Instalación:**
1. Descargar: https://lmstudio.ai/
2. Abrir LM Studio
3. Buscar y descargar modelo (ej: Llama 3 8B)
4. Iniciar servidor local (pestaña "Local Server")
5. Puerto: `http://localhost:1234`

**Código Python (compatible con OpenAI SDK):**
```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    base_url="http://localhost:1234/v1",  # LM Studio
    api_key="not-needed",
    model="llama-3-8b-instruct",
    temperature=0.7,
)
```

---

### **Opción 4: APIs Gratuitas (sin instalación local)**

#### **Google Gemini (Gratis con límites generosos)**

**Crear API Key:**
1. https://makersuite.google.com/app/apikey
2. Crear proyecto
3. Copiar API key

**Límites gratis:**
- 60 requests/minuto
- 1,500 requests/día
- ¡Suficiente para desarrollo!

**Código:**
```python
pip install langchain-google-genai

from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-pro",
    google_api_key="TU_API_KEY_AQUI",
    temperature=0.7,
)
```

**.env:**
```env
GEMINI_API_KEY=tu_api_key_de_google
```

#### **Groq (GPT-4 level, gratis)**

**Ventajas:**
- ✅ Rapidísimo (más rápido que GPT-4)
- ✅ Gratis con límites altos
- ✅ Modelo Llama 3 70B gratis

**Crear API Key:**
1. https://console.groq.com/
2. Registrarse
3. Crear API key

**Código:**
```python
pip install langchain-groq

from langchain_groq import ChatGroq

llm = ChatGroq(
    groq_api_key="tu_groq_api_key",
    model_name="llama3-70b-8192",
    temperature=0.7,
)
```

---

## 🔄 Desarrollo Híbrido (Recomendado)

**Estrategia óptima para desarrollo:**

1. **Desarrollo local:** Ollama (gratis, rápido para probar)
2. **Testing:** Gemini/Groq (gratis, mejor calidad)
3. **Producción:** OpenAI GPT-4 (pagado, máxima calidad)

**Configuración dinámica (.env):**
```env
# Desarrollo
LLM_PROVIDER=ollama
OLLAMA_MODEL=llama3:8b
OLLAMA_BASE_URL=http://localhost:11434

# Testing
# LLM_PROVIDER=gemini
# GEMINI_API_KEY=tu_key
# GEMINI_MODEL=gemini-pro

# Producción
# LLM_PROVIDER=openai
# OPENAI_API_KEY=sk-xxx
# OPENAI_MODEL=gpt-4-turbo
```

**Código adaptable:**
```python
import os
from dotenv import load_dotenv
from langchain_community.llms import Ollama
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI

load_dotenv()

def get_llm():
    provider = os.getenv("LLM_PROVIDER", "ollama")
    
    if provider == "ollama":
        return Ollama(
            model=os.getenv("OLLAMA_MODEL", "llama3:8b"),
            base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
        )
    
    elif provider == "gemini":
        return ChatGoogleGenerativeAI(
            model=os.getenv("GEMINI_MODEL", "gemini-pro"),
            google_api_key=os.getenv("GEMINI_API_KEY"),
        )
    
    elif provider == "openai":
        return ChatOpenAI(
            model=os.getenv("OPENAI_MODEL", "gpt-4-turbo"),
            api_key=os.getenv("OPENAI_API_KEY"),
        )
    
    else:
        raise ValueError(f"Provider no soportado: {provider}")

# Usar en tu código
llm = get_llm()
```

---

## 🚀 RAG Local (Vector Database)

### **Opción 1: FAISS (100% local, gratis)**

```powershell
pip install faiss-cpu langchain-community
```

**Código:**
```python
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import OllamaEmbeddings

# Embeddings locales con Ollama
embeddings = OllamaEmbeddings(
    model="llama3:8b",
    base_url="http://localhost:11434"
)

# Crear vector store local
vectorstore = FAISS.from_texts(
    texts=["Contenido del curso 1", "Contenido del curso 2"],
    embedding=embeddings
)

# Guardar para reutilizar
vectorstore.save_local("vectorstore_cursos")

# Cargar
vectorstore = FAISS.load_local(
    "vectorstore_cursos",
    embeddings,
    allow_dangerous_deserialization=True
)

# Buscar
results = vectorstore.similarity_search("transistor", k=3)
```

### **Opción 2: Chroma (Local, más fácil)**

```powershell
pip install chromadb
```

**Código:**
```python
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import OllamaEmbeddings

embeddings = OllamaEmbeddings(model="llama3:8b")

vectorstore = Chroma(
    collection_name="cursos_universia",
    embedding_function=embeddings,
    persist_directory="./chroma_db"
)

# Agregar documentos
vectorstore.add_texts(["contenido 1", "contenido 2"])
```

---

## 💰 Comparación de Costos

| Opción | Costo Desarrollo | Costo Producción | Velocidad | Calidad |
|--------|-----------------|------------------|-----------|---------|
| **Ollama (local)** | $0 | $0* | Media | Buena |
| **Gemini (gratis)** | $0 | $0-$10/mes | Rápida | Muy buena |
| **Groq (gratis)** | $0 | $0-$20/mes | Muy rápida | Excelente |
| **OpenAI GPT-4** | $30/mes | $100-500/mes | Rápida | Excelente |

*Ollama requiere servidor con GPU para producción (~$20-50/mes)

---

## 📋 Checklist de Setup Local

### Desarrollo Inicial (Todo gratis):

- [ ] Instalar Ollama
- [ ] Descargar `ollama pull llama3:8b`
- [ ] Descargar `ollama pull codellama:13b`
- [ ] Crear proyecto Python FastAPI
- [ ] Instalar dependencias
- [ ] Configurar LangChain con Ollama
- [ ] Crear vector store FAISS local
- [ ] Probar endpoints
- [ ] Conectar con Next.js (localhost:3000 → localhost:8000)

### Cuando funcione local:

- [ ] Registrar en Gemini (gratis)
- [ ] Actualizar código para usar Gemini
- [ ] Comparar resultados vs Ollama
- [ ] Decidir modelo para producción

---

## 🐛 Troubleshooting

### Ollama no responde:
```powershell
# Reiniciar Ollama
ollama serve

# Ver logs
Get-Process ollama
```

### Error "Out of memory":
```powershell
# Usar modelo más pequeño
ollama pull mistral:7b  # En vez de llama3:8b
```

### Respuestas muy lentas:
- Usa GPU si es posible
- Reduce `max_tokens`
- Usa modelo más pequeño (mistral:7b)
- O cambia a Gemini/Groq (API, más rápido)

---

## 🎯 Recomendación Final

**Para empezar HOY:**

1. **Instala Ollama** (5 minutos)
2. **Descarga Llama 3** (`ollama pull llama3:8b`)
3. **Crea proyecto Python** con el código de ejemplo arriba
4. **Prueba localmente** sin gastar nada
5. **Cuando funcione**, migra a Gemini gratis para mejor calidad
6. **En producción**, evalúa si necesitas GPT-4

**Mi setup personal recomendado:**
- Desarrollo: Ollama Llama 3 (gratis, privado)
- Testing: Gemini Pro (gratis, buena calidad)
- Producción: Groq Llama 3 70B (gratis con límites, excelente)

---

¿Quieres que te ayude a configurar Ollama paso a paso? 🚀
