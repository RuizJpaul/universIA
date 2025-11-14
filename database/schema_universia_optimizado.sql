-- ============================================
-- UNIVERSIA - SCHEMA OPTIMIZADO Y ESCALABLE
-- Plataforma Educativa 100% Automatizada con IA
-- Versión: 1.0 (Producción Ready)
-- Fecha: 2025-11-13
-- ============================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- MÓDULO 1: USUARIOS Y AUTENTICACIÓN
-- ============================================

CREATE TABLE usuarios (
    id_usuario UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255), -- Nullable para usuarios OAuth
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('ADMINISTRADOR', 'ESTUDIANTE', 'EMPRESA')),
    estado VARCHAR(20) DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'SUSPENDIDO', 'ELIMINADO', 'PENDIENTE_VERIFICACION')),
    verificado BOOLEAN DEFAULT FALSE,
    token_verificacion VARCHAR(255),
    email_verified TIMESTAMP, -- Para NextAuth.js
    image VARCHAR(500), -- Avatar de OAuth provider
    ultimo_acceso TIMESTAMP,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE estudiantes (
    id_estudiante SERIAL PRIMARY KEY,
    id_usuario UUID UNIQUE NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    nombre VARCHAR(80),
    apellido VARCHAR(80),
    fecha_nacimiento DATE,
    telefono VARCHAR(20),
    especialidad VARCHAR(100),
    foto_perfil VARCHAR(255),
    biografia TEXT,
    linkedin VARCHAR(200),
    github VARCHAR(200),
    portafolio VARCHAR(200),
    puntos_xp INTEGER DEFAULT 0,
    nivel INTEGER DEFAULT 1,
    id_beca INTEGER,
    onboarding_completado BOOLEAN DEFAULT FALSE, -- Si completó el perfil inicial
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE administradores (
    id_admin SERIAL PRIMARY KEY,
    id_usuario UUID UNIQUE NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    nombre VARCHAR(80) NOT NULL,
    cargo VARCHAR(50),
    telefono VARCHAR(20),
    permisos JSONB DEFAULT '{}',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE empresas (
    id_empresa SERIAL PRIMARY KEY,
    id_usuario UUID UNIQUE NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    nombre_comercial VARCHAR(120) NOT NULL,
    razon_social VARCHAR(150),
    ruc VARCHAR(20) UNIQUE,
    rubro VARCHAR(80),
    descripcion TEXT,
    sitio_web VARCHAR(150),
    telefono VARCHAR(20),
    logo VARCHAR(255),
    certificada BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MÓDULO 1.5: OAUTH Y AUTENTICACIÓN (NextAuth.js)
-- ============================================

-- Cuentas OAuth (Google, GitHub, LinkedIn, etc.)
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'oauth', 'email', 'credentials'
    provider VARCHAR(50) NOT NULL, -- 'google', 'github', 'linkedin', 'credentials'
    provider_account_id VARCHAR(255) NOT NULL, -- ID del usuario en el provider
    refresh_token TEXT,
    access_token TEXT,
    expires_at BIGINT,
    token_type VARCHAR(50),
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    oauth_token_secret TEXT,
    oauth_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_account_id)
);

-- Sesiones de usuario (NextAuth.js)
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    expires TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tokens de verificación (email, password reset)
CREATE TABLE verification_tokens (
    identifier VARCHAR(255) NOT NULL, -- Email o user_id
    token VARCHAR(255) UNIQUE NOT NULL,
    expires TIMESTAMP NOT NULL,
    type VARCHAR(50) DEFAULT 'email_verification', -- 'email_verification', 'password_reset'
    PRIMARY KEY (identifier, token)
);

-- Índices para OAuth
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_provider ON accounts(provider, provider_account_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_verification_token ON verification_tokens(token);

-- ============================================
-- MÓDULO 2: LOCALIZACIÓN (Específico Perú)
-- ============================================

CREATE TABLE departamentos (
    id_departamento SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    codigo_ubigeo VARCHAR(2) UNIQUE
);

CREATE TABLE provincias (
    id_provincia SERIAL PRIMARY KEY,
    id_departamento INTEGER NOT NULL REFERENCES departamentos(id_departamento),
    nombre VARCHAR(100) NOT NULL,
    codigo_ubigeo VARCHAR(4) UNIQUE
);

CREATE TABLE distritos (
    id_distrito SERIAL PRIMARY KEY,
    id_provincia INTEGER NOT NULL REFERENCES provincias(id_provincia),
    nombre VARCHAR(100) NOT NULL,
    codigo_ubigeo VARCHAR(6) UNIQUE
);

CREATE TABLE direcciones (
    id_direccion SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiantes(id_estudiante) ON DELETE CASCADE,
    id_empresa INTEGER REFERENCES empresas(id_empresa) ON DELETE CASCADE,
    id_distrito INTEGER NOT NULL REFERENCES distritos(id_distrito),
    tipo VARCHAR(20) CHECK (tipo IN ('DOMICILIO', 'TRABAJO', 'FACTURACION')),
    detalle VARCHAR(150) NOT NULL,
    referencia VARCHAR(150),
    codigo_postal VARCHAR(10),
    es_principal BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (id_estudiante IS NOT NULL AND id_empresa IS NULL) OR
        (id_estudiante IS NULL AND id_empresa IS NOT NULL)
    )
);

-- ============================================
-- MÓDULO 3: FORMACIÓN ACADÉMICA - ESTRUCTURA COMPLETA
-- ============================================

CREATE TABLE categorias_curso (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    descripcion VARCHAR(200),
    icono VARCHAR(100),
    slug VARCHAR(100) UNIQUE,
    orden INTEGER DEFAULT 0
);

CREATE TABLE tutores_ia (
    id_tutor SERIAL PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL,
    especialidad VARCHAR(100),
    modelo_ia VARCHAR(100) NOT NULL, -- 'GPT-4', 'GEMINI-PRO', 'CLAUDE-3'
    personalidad TEXT,
    avatar VARCHAR(255),
    prompt_sistema TEXT, -- Instrucciones base del tutor
    temperatura DECIMAL(3,2) DEFAULT 0.7, -- Creatividad del modelo (0-1)
    max_tokens INTEGER DEFAULT 1000,
    configuracion JSONB DEFAULT '{}',
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cursos (
    id_curso SERIAL PRIMARY KEY,
    id_categoria INTEGER NOT NULL REFERENCES categorias_curso(id_categoria),
    id_tutor INTEGER NOT NULL REFERENCES tutores_ia(id_tutor),
    nombre VARCHAR(120) NOT NULL,
    slug VARCHAR(150) UNIQUE,
    descripcion TEXT,
    descripcion_corta VARCHAR(300),
    nivel VARCHAR(20) CHECK (nivel IN ('PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO', 'EXPERTO')),
    duracion_horas INTEGER,
    imagen_portada VARCHAR(255),
    video_trailer VARCHAR(255),
    objetivos TEXT[],
    requisitos TEXT[],
    tags VARCHAR(50)[],
    precio_base DECIMAL(10,2) DEFAULT 0,
    destacado BOOLEAN DEFAULT FALSE,
    total_estudiantes INTEGER DEFAULT 0,
    calificacion_promedio DECIMAL(3,2) DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'BORRADOR' CHECK (estado IN ('BORRADOR', 'PUBLICADO', 'ARCHIVADO', 'EN_REVISION')),
    creado_por UUID REFERENCES usuarios(id_usuario),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE modulos (
    id_modulo SERIAL PRIMARY KEY,
    id_curso INTEGER NOT NULL REFERENCES cursos(id_curso) ON DELETE CASCADE,
    titulo VARCHAR(120) NOT NULL,
    descripcion TEXT,
    orden INTEGER NOT NULL,
    duracion_estimada INTEGER, -- minutos
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_curso, orden)
);

CREATE TABLE lecciones (
    id_leccion SERIAL PRIMARY KEY,
    id_modulo INTEGER NOT NULL REFERENCES modulos(id_modulo) ON DELETE CASCADE,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    tipo_contenido VARCHAR(20) CHECK (tipo_contenido IN ('VIDEO', 'TEXTO', 'INTERACTIVO', 'CODIGO', 'QUIZ', 'PROYECTO')),
    contenido TEXT,
    url_video VARCHAR(255),
    url_recurso VARCHAR(255),
    recursos_descargables JSONB DEFAULT '[]',
    objetivos_aprendizaje TEXT[], -- Lo que el estudiante debe aprender
    conceptos_clave VARCHAR(100)[], -- Conceptos principales para la IA
    orden INTEGER NOT NULL,
    duracion_minutos INTEGER,
    es_gratuita BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_modulo, orden)
);

-- ============================================
-- MÓDULO 4: INSCRIPCIONES Y PROGRESO
-- ============================================

CREATE TABLE inscripciones (
    id_inscripcion SERIAL PRIMARY KEY,
    id_curso INTEGER NOT NULL REFERENCES cursos(id_curso),
    id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_inicio TIMESTAMP,
    fecha_completado TIMESTAMP,
    progreso_general DECIMAL(5,2) DEFAULT 0 CHECK (progreso_general BETWEEN 0 AND 100),
    estado VARCHAR(20) DEFAULT 'EN_PROGRESO' CHECK (estado IN ('EN_PROGRESO', 'COMPLETADO', 'ABANDONADO', 'PAUSADO')),
    ultima_actividad TIMESTAMP,
    tiempo_total_minutos INTEGER DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_curso, id_estudiante)
);

CREATE TABLE progreso_lecciones (
    id_progreso SERIAL PRIMARY KEY,
    id_inscripcion INTEGER NOT NULL REFERENCES inscripciones(id_inscripcion) ON DELETE CASCADE,
    id_leccion INTEGER NOT NULL REFERENCES lecciones(id_leccion),
    completado BOOLEAN DEFAULT FALSE,
    porcentaje_visto INTEGER DEFAULT 0 CHECK (porcentaje_visto BETWEEN 0 AND 100),
    tiempo_visto_minutos INTEGER DEFAULT 0,
    fecha_inicio TIMESTAMP,
    fecha_completado TIMESTAMP,
    ultima_posicion INTEGER, -- Para videos: segundo donde quedó
    notas_estudiante TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_inscripcion, id_leccion)
);

-- ============================================
-- MÓDULO 5: EVALUACIONES Y QUIZZES
-- ============================================

-- Rúbricas de evaluación (guían a la IA sobre cómo evaluar)
CREATE TABLE rubricas (
    id_rubrica SERIAL PRIMARY KEY,
    id_curso INTEGER REFERENCES cursos(id_curso) ON DELETE CASCADE,
    id_modulo INTEGER REFERENCES modulos(id_modulo) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    criterios JSONB NOT NULL, -- Array de criterios con ponderación
    escala_evaluacion JSONB DEFAULT '{}', -- Escala (ej: Excelente=100, Bueno=80, etc)
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE evaluaciones (
    id_evaluacion SERIAL PRIMARY KEY,
    id_leccion INTEGER REFERENCES lecciones(id_leccion) ON DELETE CASCADE,
    id_modulo INTEGER REFERENCES modulos(id_modulo) ON DELETE CASCADE,
    id_rubrica INTEGER REFERENCES rubricas(id_rubrica),
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(20) CHECK (tipo IN ('QUIZ', 'EXAMEN', 'PRACTICA', 'PROYECTO_FINAL')),
    duracion_minutos INTEGER,
    nota_minima DECIMAL(3,2) DEFAULT 70.00,
    intentos_permitidos INTEGER DEFAULT 3,
    mostrar_respuestas BOOLEAN DEFAULT TRUE,
    orden INTEGER,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (id_leccion IS NOT NULL AND id_modulo IS NULL) OR
        (id_leccion IS NULL AND id_modulo IS NOT NULL)
    )
);

CREATE TABLE preguntas (
    id_pregunta SERIAL PRIMARY KEY,
    id_evaluacion INTEGER NOT NULL REFERENCES evaluaciones(id_evaluacion) ON DELETE CASCADE,
    enunciado TEXT NOT NULL,
    tipo VARCHAR(20) CHECK (tipo IN ('MULTIPLE', 'VERDADERO_FALSO', 'COMPLETAR', 'CODIGO', 'ORDENAR')),
    opciones JSONB NOT NULL, -- Array de opciones con respuesta_correcta
    explicacion TEXT,
    puntaje DECIMAL(3,2) DEFAULT 1.00,
    orden INTEGER,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resultados_evaluaciones (
    id_resultado SERIAL PRIMARY KEY,
    id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    id_evaluacion INTEGER NOT NULL REFERENCES evaluaciones(id_evaluacion),
    nota_obtenida DECIMAL(5,2) NOT NULL,
    respuestas JSONB NOT NULL,
    aprobado BOOLEAN,
    fecha_realizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tiempo_empleado_minutos INTEGER,
    intento_numero INTEGER DEFAULT 1,
    retroalimentacion_ia TEXT
);

-- ============================================
-- MÓDULO 6: LABORATORIOS VIRTUALES
-- ============================================

CREATE TABLE laboratorios (
    id_laboratorio SERIAL PRIMARY KEY,
    id_leccion INTEGER REFERENCES lecciones(id_leccion) ON DELETE SET NULL,
    id_curso INTEGER REFERENCES cursos(id_curso),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    plataforma VARCHAR(50) CHECK (plataforma IN ('TINKERCAD', 'WOKWI', 'CODESANDBOX', 'REPLIT', 'JUPYTER', 'GITHUB_CODESPACES', 'OTRO')),
    url_laboratorio VARCHAR(255),
    template_url VARCHAR(255),
    instrucciones TEXT,
    objetivos TEXT[],
    dificultad VARCHAR(20) CHECK (dificultad IN ('FACIL', 'MEDIO', 'DIFICIL', 'EXPERTO')),
    tiempo_estimado INTEGER, -- minutos
    recursos_necesarios JSONB DEFAULT '{}',
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sesiones_laboratorio (
    id_sesion_lab SERIAL PRIMARY KEY,
    id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    id_laboratorio INTEGER NOT NULL REFERENCES laboratorios(id_laboratorio),
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP,
    completado BOOLEAN DEFAULT FALSE,
    codigo_guardado TEXT,
    capturas_pantalla VARCHAR(255)[],
    url_proyecto VARCHAR(255),
    notas TEXT,
    calificacion_ia DECIMAL(3,2),
    feedback_ia TEXT,
    tiempo_empleado_minutos INTEGER
);

-- ============================================
-- MÓDULO 7: CHAT IA Y SESIONES DE TUTORÍA
-- ============================================

CREATE TABLE sesiones_chat_ia (
    id_sesion SERIAL PRIMARY KEY,
    id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    id_curso INTEGER REFERENCES cursos(id_curso),
    id_leccion INTEGER REFERENCES lecciones(id_leccion),
    id_tutor INTEGER NOT NULL REFERENCES tutores_ia(id_tutor),
    contexto_sesion JSONB DEFAULT '{}', -- Progreso actual, módulos vistos, etc.
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP,
    total_mensajes INTEGER DEFAULT 0,
    tokens_usados INTEGER DEFAULT 0,
    costo_api DECIMAL(10,4) DEFAULT 0,
    tema_principal VARCHAR(100),
    resumen_conversacion TEXT,
    mongodb_ref VARCHAR(50), -- Referencia a colección de MongoDB
    calificacion_estudiante INTEGER CHECK (calificacion_estudiante BETWEEN 1 AND 5),
    comentario_estudiante TEXT,
    activa BOOLEAN DEFAULT TRUE
);

-- ============================================
-- MÓDULO 8: CERTIFICADOS Y LOGROS
-- ============================================

CREATE TABLE certificados (
    id_certificado SERIAL PRIMARY KEY,
    id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    id_curso INTEGER NOT NULL REFERENCES cursos(id_curso),
    codigo_verificacion VARCHAR(50) UNIQUE NOT NULL,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    url_pdf VARCHAR(255),
    url_compartir VARCHAR(255),
    verificado BOOLEAN DEFAULT TRUE,
    vencimiento DATE,
    credenciales JSONB DEFAULT '{}',
    descargas INTEGER DEFAULT 0,
    compartido_linkedin BOOLEAN DEFAULT FALSE
);

CREATE TABLE logros (
    id_logro SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(200),
    icono VARCHAR(100),
    categoria VARCHAR(50),
    criterio VARCHAR(100),
    puntos_xp INTEGER DEFAULT 0,
    rareza VARCHAR(20) CHECK (rareza IN ('COMUN', 'RARO', 'EPICO', 'LEGENDARIO')),
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE logros_estudiante (
    id_logro_estudiante SERIAL PRIMARY KEY,
    id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    id_logro INTEGER NOT NULL REFERENCES logros(id_logro),
    fecha_obtenido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progreso INTEGER DEFAULT 100,
    UNIQUE(id_estudiante, id_logro)
);

-- ============================================
-- MÓDULO 9: MEMBRESÍAS Y PAGOS
-- ============================================

CREATE TABLE planes_membresia (
    id_plan SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    duracion_dias INTEGER NOT NULL,
    tipo VARCHAR(20) CHECK (tipo IN ('GRATUITO', 'MENSUAL', 'TRIMESTRAL', 'ANUAL', 'VITALICIO')),
    caracteristicas JSONB DEFAULT '{}',
    max_cursos INTEGER,
    descarga_certificados BOOLEAN DEFAULT FALSE,
    soporte_prioritario BOOLEAN DEFAULT FALSE,
    acceso_laboratorios BOOLEAN DEFAULT FALSE,
    sesiones_mentoria INTEGER DEFAULT 0,
    destacado BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE membresias_estudiante (
    id_membresia_estudiante SERIAL PRIMARY KEY,
    id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    id_plan INTEGER NOT NULL REFERENCES planes_membresia(id_plan),
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento TIMESTAMP NOT NULL,
    estado VARCHAR(20) DEFAULT 'ACTIVA' CHECK (estado IN ('ACTIVA', 'VENCIDA', 'CANCELADA', 'PAUSADA')),
    auto_renovacion BOOLEAN DEFAULT FALSE,
    precio_pagado DECIMAL(10,2),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tipos_pago (
    id_tipo_pago SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(100),
    proveedor VARCHAR(50), -- 'YAPE', 'PLIN', 'NIUBIZ', 'MERCADOPAGO', 'PAYPAL'
    activo BOOLEAN DEFAULT TRUE,
    comision_porcentaje DECIMAL(5,2) DEFAULT 0
);

CREATE TABLE pagos (
    id_pago SERIAL PRIMARY KEY,
    id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    id_membresia_estudiante INTEGER REFERENCES membresias_estudiante(id_membresia_estudiante),
    id_tipo_pago INTEGER NOT NULL REFERENCES tipos_pago(id_tipo_pago),
    monto DECIMAL(10,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'PEN',
    estado VARCHAR(20) DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO', 'CANCELADO')),
    referencia_externa VARCHAR(100),
    datos_transaccion JSONB DEFAULT '{}',
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_confirmacion TIMESTAMP,
    ip_origen VARCHAR(45),
    comprobante_url VARCHAR(255),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MÓDULO 10: BECAS
-- ============================================

CREATE TABLE tipos_beca (
    id_tipo_beca SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(200),
    criterios TEXT[]
);

CREATE TABLE becas (
    id_beca SERIAL PRIMARY KEY,
    id_tipo_beca INTEGER NOT NULL REFERENCES tipos_beca(id_tipo_beca),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    porcentaje_descuento DECIMAL(5,2) CHECK (porcentaje_descuento BETWEEN 0 AND 100),
    cantidad_disponible INTEGER,
    cantidad_otorgada INTEGER DEFAULT 0,
    fecha_inicio DATE,
    fecha_fin DATE,
    requisitos TEXT[],
    activa BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE solicitudes_beca (
    id_solicitud SERIAL PRIMARY KEY,
    id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    id_beca INTEGER NOT NULL REFERENCES becas(id_beca),
    estado VARCHAR(20) DEFAULT 'EN_REVISION' CHECK (estado IN ('EN_REVISION', 'APROBADA', 'RECHAZADA', 'VENCIDA')),
    carta_motivacion TEXT,
    documentos_adjuntos VARCHAR(255)[],
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta TIMESTAMP,
    revisado_por INTEGER REFERENCES administradores(id_admin),
    comentarios_revision TEXT
);

-- Agregar FK a estudiantes (beca activa)
ALTER TABLE estudiantes ADD CONSTRAINT fk_estudiante_beca
    FOREIGN KEY (id_beca) REFERENCES becas(id_beca);

-- ============================================
-- MÓDULO 11: EMPLEO Y EMPRESAS
-- ============================================

CREATE TABLE ofertas_laborales (
    id_oferta SERIAL PRIMARY KEY,
    id_empresa INTEGER NOT NULL REFERENCES empresas(id_empresa),
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    requisitos TEXT[],
    responsabilidades TEXT[],
    beneficios TEXT[],
    modalidad VARCHAR(20) CHECK (modalidad IN ('PRESENCIAL', 'REMOTO', 'HIBRIDO')),
    tipo_contrato VARCHAR(30) CHECK (tipo_contrato IN ('TIEMPO_COMPLETO', 'MEDIO_TIEMPO', 'PRACTICAS', 'FREELANCE', 'PROYECTO')),
    salario_min DECIMAL(10,2),
    salario_max DECIMAL(10,2),
    moneda VARCHAR(3) DEFAULT 'PEN',
    ubicacion VARCHAR(100),
    experiencia_requerida VARCHAR(50),
    nivel_educacion VARCHAR(50),
    habilidades_requeridas VARCHAR(50)[],
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre DATE,
    vacantes INTEGER DEFAULT 1,
    estado VARCHAR(20) DEFAULT 'ACTIVA' CHECK (estado IN ('ACTIVA', 'CERRADA', 'PAUSADA', 'COMPLETADA')),
    destacada BOOLEAN DEFAULT FALSE,
    visitas INTEGER DEFAULT 0,
    postulaciones_count INTEGER DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE postulaciones (
    id_postulacion SERIAL PRIMARY KEY,
    id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    id_oferta INTEGER NOT NULL REFERENCES ofertas_laborales(id_oferta),
    estado VARCHAR(20) DEFAULT 'ENVIADA' CHECK (estado IN ('ENVIADA', 'EN_REVISION', 'PRESELECCIONADO', 'ENTREVISTA', 'RECHAZADA', 'ACEPTADA')),
    cv_url VARCHAR(255),
    carta_presentacion TEXT,
    fecha_postulacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP,
    notas_empresa TEXT,
    calificacion_empresa INTEGER CHECK (calificacion_empresa BETWEEN 1 AND 5),
    UNIQUE(id_estudiante, id_oferta)
);

-- ============================================
-- MÓDULO 12: COMUNIDAD Y NETWORKING
-- ============================================

CREATE TABLE publicaciones (
    id_publicacion SERIAL PRIMARY KEY,
    id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    titulo VARCHAR(150),
    contenido TEXT NOT NULL,
    tipo VARCHAR(20) CHECK (tipo IN ('TEXTO', 'IMAGEN', 'VIDEO', 'CODIGO', 'PROYECTO', 'PREGUNTA')),
    imagenes VARCHAR(255)[],
    tags VARCHAR(50)[],
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    editado BOOLEAN DEFAULT FALSE,
    fecha_edicion TIMESTAMP,
    likes_count INTEGER DEFAULT 0,
    comentarios_count INTEGER DEFAULT 0,
    compartidos_count INTEGER DEFAULT 0,
    visibilidad VARCHAR(20) DEFAULT 'PUBLICA' CHECK (visibilidad IN ('PUBLICA', 'AMIGOS', 'PRIVADA')),
    fijada BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comentarios (
    id_comentario SERIAL PRIMARY KEY,
    id_publicacion INTEGER NOT NULL REFERENCES publicaciones(id_publicacion) ON DELETE CASCADE,
    id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    id_comentario_padre INTEGER REFERENCES comentarios(id_comentario),
    contenido TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    editado BOOLEAN DEFAULT FALSE,
    likes_count INTEGER DEFAULT 0
);

CREATE TABLE likes (
    id_like SERIAL PRIMARY KEY,
    id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    id_publicacion INTEGER REFERENCES publicaciones(id_publicacion) ON DELETE CASCADE,
    id_comentario INTEGER REFERENCES comentarios(id_comentario) ON DELETE CASCADE,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (id_publicacion IS NOT NULL AND id_comentario IS NULL) OR
        (id_publicacion IS NULL AND id_comentario IS NOT NULL)
    ),
    UNIQUE(id_estudiante, id_publicacion),
    UNIQUE(id_estudiante, id_comentario)
);

CREATE TABLE amistades (
    id_amistad SERIAL PRIMARY KEY,
    id_estudiante_1 INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    id_estudiante_2 INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    estado VARCHAR(20) DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'BLOQUEADA')),
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_aceptacion TIMESTAMP,
    CHECK (id_estudiante_1 < id_estudiante_2),
    UNIQUE(id_estudiante_1, id_estudiante_2)
);

CREATE TABLE grupos (
    id_grupo SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    imagen_portada VARCHAR(255),
    id_creador INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    tipo VARCHAR(20) CHECK (tipo IN ('PUBLICO', 'PRIVADO', 'SECRETO')),
    categoria VARCHAR(50),
    miembros_count INTEGER DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE miembros_grupo (
    id_miembro_grupo SERIAL PRIMARY KEY,
    id_grupo INTEGER NOT NULL REFERENCES grupos(id_grupo) ON DELETE CASCADE,
    id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    rol VARCHAR(20) DEFAULT 'MIEMBRO' CHECK (rol IN ('CREADOR', 'ADMIN', 'MODERADOR', 'MIEMBRO')),
    fecha_union TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_grupo, id_estudiante)
);

-- ============================================
-- MÓDULO 13: MENSAJERÍA
-- ============================================

CREATE TABLE conversaciones (
    id_conversacion SERIAL PRIMARY KEY,
    tipo VARCHAR(20) CHECK (tipo IN ('INDIVIDUAL', 'GRUPAL')),
    nombre VARCHAR(100),
    id_grupo INTEGER REFERENCES grupos(id_grupo),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_mensaje TIMESTAMP,
    activa BOOLEAN DEFAULT TRUE
);

CREATE TABLE participantes_conversacion (
    id_participante SERIAL PRIMARY KEY,
    id_conversacion INTEGER NOT NULL REFERENCES conversaciones(id_conversacion) ON DELETE CASCADE,
    id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    fecha_union TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_leido TIMESTAMP,
    notificaciones_activas BOOLEAN DEFAULT TRUE,
    UNIQUE(id_conversacion, id_estudiante)
);

CREATE TABLE mensajes (
    id_mensaje SERIAL PRIMARY KEY,
    id_conversacion INTEGER NOT NULL REFERENCES conversaciones(id_conversacion) ON DELETE CASCADE,
    id_remitente INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    contenido TEXT NOT NULL,
    tipo VARCHAR(20) DEFAULT 'TEXTO' CHECK (tipo IN ('TEXTO', 'IMAGEN', 'ARCHIVO', 'AUDIO', 'VIDEO')),
    url_archivo VARCHAR(255),
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    editado BOOLEAN DEFAULT FALSE,
    eliminado BOOLEAN DEFAULT FALSE,
    leido BOOLEAN DEFAULT FALSE
);

-- ============================================
-- MÓDULO 14: NOTICIAS Y EVENTOS
-- ============================================

CREATE TABLE noticias (
    id_noticia SERIAL PRIMARY KEY,
    id_admin INTEGER NOT NULL REFERENCES administradores(id_admin),
    titulo VARCHAR(120) NOT NULL,
    subtitulo VARCHAR(200),
    contenido TEXT NOT NULL,
    imagen_portada VARCHAR(255),
    categoria VARCHAR(50),
    tags VARCHAR(50)[],
    fuente VARCHAR(100),
    url_externa VARCHAR(255),
    destacada BOOLEAN DEFAULT FALSE,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    visitas INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'PUBLICADA' CHECK (estado IN ('BORRADOR', 'PUBLICADA', 'ARCHIVADA')),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE eventos (
    id_evento SERIAL PRIMARY KEY,
    id_admin INTEGER NOT NULL REFERENCES administradores(id_admin),
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    imagen_portada VARCHAR(255),
    tipo VARCHAR(30) CHECK (tipo IN ('WEBINAR', 'TALLER', 'CONFERENCIA', 'HACKATHON', 'NETWORKING', 'OTRO')),
    modalidad VARCHAR(20) CHECK (modalidad IN ('PRESENCIAL', 'VIRTUAL', 'HIBRIDO')),
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    ubicacion VARCHAR(150),
    url_transmision VARCHAR(255),
    capacidad_maxima INTEGER,
    inscritos_count INTEGER DEFAULT 0,
    precio DECIMAL(10,2) DEFAULT 0,
    certificado_asistencia BOOLEAN DEFAULT FALSE,
    estado VARCHAR(20) DEFAULT 'PROGRAMADO' CHECK (estado IN ('PROGRAMADO', 'EN_CURSO', 'FINALIZADO', 'CANCELADO')),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inscripciones_evento (
    id_inscripcion_evento SERIAL PRIMARY KEY,
    id_evento INTEGER NOT NULL REFERENCES eventos(id_evento),
    id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    estado VARCHAR(20) DEFAULT 'CONFIRMADA' CHECK (estado IN ('CONFIRMADA', 'EN_ESPERA', 'CANCELADA', 'ASISTIO', 'NO_ASISTIO')),
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    recordatorios_enviados INTEGER DEFAULT 0,
    UNIQUE(id_evento, id_estudiante)
);

-- ============================================
-- MÓDULO 15: REVIEWS Y MODERACIÓN
-- ============================================

CREATE TABLE reviews_curso (
    id_review SERIAL PRIMARY KEY,
    id_curso INTEGER NOT NULL REFERENCES cursos(id_curso),
    id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    calificacion INTEGER NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    titulo VARCHAR(100),
    comentario TEXT,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    editado BOOLEAN DEFAULT FALSE,
    verificado BOOLEAN DEFAULT FALSE,
    util_count INTEGER DEFAULT 0,
    UNIQUE(id_curso, id_estudiante)
);

CREATE TABLE reportes (
    id_reporte SERIAL PRIMARY KEY,
    id_reportante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    tipo_contenido VARCHAR(30) CHECK (tipo_contenido IN ('PUBLICACION', 'COMENTARIO', 'PERFIL', 'MENSAJE', 'REVIEW')),
    id_contenido INTEGER NOT NULL,
    motivo VARCHAR(50),
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'EN_REVISION', 'RESUELTO', 'RECHAZADO')),
    fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMP,
    resuelto_por INTEGER REFERENCES administradores(id_admin),
    accion_tomada TEXT
);

-- ============================================
-- MÓDULO 16: ANALYTICS Y MÉTRICAS
-- ============================================

CREATE TABLE metricas_estudiante (
    id_metrica SERIAL PRIMARY KEY,
    id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante),
    fecha DATE DEFAULT CURRENT_DATE,
    tiempo_plataforma_minutos INTEGER DEFAULT 0,
    lecciones_completadas INTEGER DEFAULT 0,
    evaluaciones_realizadas INTEGER DEFAULT 0,
    mensajes_chat_ia INTEGER DEFAULT 0,
    sesiones_laboratorio INTEGER DEFAULT 0,
    publicaciones_creadas INTEGER DEFAULT 0,
    UNIQUE(id_estudiante, fecha)
);

CREATE TABLE actividad_plataforma (
    id_actividad SERIAL PRIMARY KEY,
    id_usuario UUID REFERENCES usuarios(id_usuario),
    tipo_actividad VARCHAR(50),
    descripcion TEXT,
    metadata JSONB DEFAULT '{}',
    ip_origen VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================

-- Usuarios y autenticación
CREATE INDEX idx_usuarios_correo ON usuarios(correo);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_estado ON usuarios(estado);
CREATE INDEX idx_estudiantes_usuario ON estudiantes(id_usuario);
CREATE INDEX idx_estudiantes_puntos ON estudiantes(puntos_xp DESC);

-- Cursos y estructura
CREATE INDEX idx_cursos_categoria ON cursos(id_categoria);
CREATE INDEX idx_cursos_estado ON cursos(estado);
CREATE INDEX idx_cursos_destacado ON cursos(destacado) WHERE destacado = TRUE;
CREATE INDEX idx_cursos_calificacion ON cursos(calificacion_promedio DESC);
CREATE INDEX idx_modulos_curso ON modulos(id_curso, orden);
CREATE INDEX idx_lecciones_modulo ON lecciones(id_modulo, orden);

-- Inscripciones y progreso
CREATE INDEX idx_inscripciones_estudiante ON inscripciones(id_estudiante);
CREATE INDEX idx_inscripciones_curso ON inscripciones(id_curso);
CREATE INDEX idx_inscripciones_estado ON inscripciones(estado);
CREATE INDEX idx_progreso_lecciones_inscripcion ON progreso_lecciones(id_inscripcion);
CREATE INDEX idx_progreso_lecciones_completado ON progreso_lecciones(completado);

-- Evaluaciones
CREATE INDEX idx_evaluaciones_leccion ON evaluaciones(id_leccion);
CREATE INDEX idx_preguntas_evaluacion ON preguntas(id_evaluacion);
CREATE INDEX idx_resultados_estudiante ON resultados_evaluaciones(id_estudiante);

-- Laboratorios
CREATE INDEX idx_laboratorios_leccion ON laboratorios(id_leccion);
CREATE INDEX idx_sesiones_lab_estudiante ON sesiones_laboratorio(id_estudiante);

-- Chat IA
CREATE INDEX idx_sesiones_chat_estudiante ON sesiones_chat_ia(id_estudiante);
CREATE INDEX idx_sesiones_chat_curso ON sesiones_chat_ia(id_curso);
CREATE INDEX idx_sesiones_chat_activa ON sesiones_chat_ia(activa) WHERE activa = TRUE;

-- Pagos y membresías
CREATE INDEX idx_pagos_estudiante ON pagos(id_estudiante);
CREATE INDEX idx_pagos_estado ON pagos(estado);
CREATE INDEX idx_pagos_fecha ON pagos(fecha_pago DESC);
CREATE INDEX idx_membresias_estudiante ON membresias_estudiante(id_estudiante);
CREATE INDEX idx_membresias_estado ON membresias_estudiante(estado);

-- Comunidad
CREATE INDEX idx_publicaciones_estudiante ON publicaciones(id_estudiante);
CREATE INDEX idx_publicaciones_fecha ON publicaciones(fecha_publicacion DESC);
CREATE INDEX idx_comentarios_publicacion ON comentarios(id_publicacion);
CREATE INDEX idx_amistades_estudiante ON amistades(id_estudiante_1, id_estudiante_2);

-- Empleo
CREATE INDEX idx_ofertas_empresa ON ofertas_laborales(id_empresa);
CREATE INDEX idx_ofertas_estado ON ofertas_laborales(estado);
CREATE INDEX idx_ofertas_fecha ON ofertas_laborales(fecha_publicacion DESC);
CREATE INDEX idx_postulaciones_estudiante ON postulaciones(id_estudiante);

-- Eventos y noticias
CREATE INDEX idx_noticias_categoria ON noticias(categoria);
CREATE INDEX idx_noticias_fecha ON noticias(fecha_publicacion DESC);
CREATE INDEX idx_eventos_fecha ON eventos(fecha_inicio);
CREATE INDEX idx_eventos_tipo ON eventos(tipo);

-- Índices de texto completo (Full-text search)
CREATE INDEX idx_cursos_busqueda ON cursos USING gin(to_tsvector('spanish', nombre || ' ' || COALESCE(descripcion, '')));
CREATE INDEX idx_publicaciones_busqueda ON publicaciones USING gin(to_tsvector('spanish', COALESCE(titulo, '') || ' ' || contenido));

-- ============================================
-- TRIGGERS PARA AUTOMATIZACIÓN
-- ============================================

-- Actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_usuarios BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();
CREATE TRIGGER trigger_actualizar_estudiantes BEFORE UPDATE ON estudiantes
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();
CREATE TRIGGER trigger_actualizar_cursos BEFORE UPDATE ON cursos
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();
CREATE TRIGGER trigger_actualizar_inscripciones BEFORE UPDATE ON inscripciones
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();
CREATE TRIGGER trigger_actualizar_accounts BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

-- Actualizar contador de estudiantes en curso
CREATE OR REPLACE FUNCTION actualizar_total_estudiantes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE cursos SET total_estudiantes = total_estudiantes + 1
        WHERE id_curso = NEW.id_curso;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE cursos SET total_estudiantes = total_estudiantes - 1
        WHERE id_curso = OLD.id_curso;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_contador_estudiantes
AFTER INSERT OR DELETE ON inscripciones
FOR EACH ROW EXECUTE FUNCTION actualizar_total_estudiantes();

-- Actualizar calificación promedio del curso
CREATE OR REPLACE FUNCTION actualizar_calificacion_curso()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE cursos SET calificacion_promedio = (
        SELECT AVG(calificacion)::DECIMAL(3,2)
        FROM reviews_curso
        WHERE id_curso = NEW.id_curso
    )
    WHERE id_curso = NEW.id_curso;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calificacion_curso
AFTER INSERT OR UPDATE ON reviews_curso
FOR EACH ROW EXECUTE FUNCTION actualizar_calificacion_curso();

-- Actualizar progreso general de inscripción
CREATE OR REPLACE FUNCTION actualizar_progreso_general()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE inscripciones SET progreso_general = (
        SELECT COALESCE(
            (COUNT(CASE WHEN completado = TRUE THEN 1 END)::DECIMAL / NULLIF(COUNT(*), 0) * 100),
            0
        )::DECIMAL(5,2)
        FROM progreso_lecciones
        WHERE id_inscripcion = NEW.id_inscripcion
    )
    WHERE id_inscripcion = NEW.id_inscripcion;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_progreso_general
AFTER INSERT OR UPDATE ON progreso_lecciones
FOR EACH ROW EXECUTE FUNCTION actualizar_progreso_general();

-- Actualizar contadores de likes y comentarios
CREATE OR REPLACE FUNCTION actualizar_contador_publicacion()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'likes' THEN
        IF TG_OP = 'INSERT' AND NEW.id_publicacion IS NOT NULL THEN
            UPDATE publicaciones SET likes_count = likes_count + 1
            WHERE id_publicacion = NEW.id_publicacion;
        ELSIF TG_OP = 'DELETE' AND OLD.id_publicacion IS NOT NULL THEN
            UPDATE publicaciones SET likes_count = likes_count - 1
            WHERE id_publicacion = OLD.id_publicacion;
        END IF;
    ELSIF TG_TABLE_NAME = 'comentarios' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE publicaciones SET comentarios_count = comentarios_count + 1
            WHERE id_publicacion = NEW.id_publicacion;
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE publicaciones SET comentarios_count = comentarios_count - 1
            WHERE id_publicacion = OLD.id_publicacion;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_likes_publicacion
AFTER INSERT OR DELETE ON likes
FOR EACH ROW EXECUTE FUNCTION actualizar_contador_publicacion();

CREATE TRIGGER trigger_comentarios_publicacion
AFTER INSERT OR DELETE ON comentarios
FOR EACH ROW EXECUTE FUNCTION actualizar_contador_publicacion();

-- ============================================
-- DATOS INICIALES (SEED DATA)
-- ============================================

-- Tipos de pago
INSERT INTO tipos_pago (nombre, descripcion, proveedor, activo, comision_porcentaje) VALUES
('Yape', 'Transferencia móvil Yape', 'YAPE', TRUE, 0),
('Plin', 'Transferencia móvil Plin', 'PLIN', TRUE, 0),
('Tarjeta de Crédito/Débito', 'Pago con tarjeta', 'NIUBIZ', TRUE, 3.5),
('Transferencia Bancaria', 'Transferencia directa', 'BANCO', TRUE, 0),
('PayPal', 'Pago internacional', 'PAYPAL', TRUE, 4.5);

-- Planes de membresía
INSERT INTO planes_membresia (nombre, descripcion, precio, duracion_dias, tipo, caracteristicas, max_cursos, descarga_certificados, soporte_prioritario, acceso_laboratorios) VALUES
('Gratuito', 'Plan básico con acceso limitado', 0, 365, 'GRATUITO', 
 '{"cursos_gratuitos": true, "certificados": false, "soporte": "comunidad"}'::jsonb, 
 3, FALSE, FALSE, FALSE),
('Premium Mensual', 'Acceso completo por un mes', 29.90, 30, 'MENSUAL',
 '{"cursos_ilimitados": true, "certificados": true, "soporte": "email", "descuentos_eventos": "10%"}'::jsonb,
 NULL, TRUE, FALSE, TRUE),
('Premium Anual', 'Acceso completo por un año con descuento', 299.00, 365, 'ANUAL',
 '{"cursos_ilimitados": true, "certificados": true, "soporte": "prioritario", "descuentos_eventos": "20%", "mentoria": "2_sesiones"}'::jsonb,
 NULL, TRUE, TRUE, TRUE);

-- Categorías de cursos
INSERT INTO categorias_curso (nombre, descripcion, icono, slug, orden) VALUES
('Programación', 'Desarrollo de software y lenguajes de programación', 'code', 'programacion', 1),
('Inteligencia Artificial', 'Machine Learning, Deep Learning y IA', 'brain', 'inteligencia-artificial', 2),
('Desarrollo Web', 'Frontend, Backend y Full Stack', 'globe', 'desarrollo-web', 3),
('Ciencia de Datos', 'Data Science, Analytics y Big Data', 'bar-chart', 'ciencia-datos', 4),
('Ciberseguridad', 'Seguridad informática y ethical hacking', 'shield', 'ciberseguridad', 5),
('IoT y Robótica', 'Internet de las Cosas y sistemas embebidos', 'cpu', 'iot-robotica', 6),
('DevOps', 'CI/CD, Cloud y automatización', 'cloud', 'devops', 7);

-- Tutores IA
INSERT INTO tutores_ia (nombre, especialidad, modelo_ia, personalidad, avatar, prompt_sistema, temperatura, max_tokens, activo) VALUES
('Ada', 'Programación y Algoritmos', 'GPT-4', 'Paciente, didáctica y motivadora. Experta en explicar conceptos complejos de forma simple.', '/avatars/ada.png', 
'Eres Ada, una tutora de programación. Tu objetivo es guiar al estudiante a través de los módulos del curso. Explica conceptos paso a paso, usa ejemplos prácticos y adapta tu enseñanza según el progreso del estudiante. Siempre verifica la comprensión antes de avanzar.', 
0.7, 1000, TRUE),
('Turing', 'Inteligencia Artificial y Machine Learning', 'GPT-4', 'Analítico y preciso. Enfocado en fundamentos matemáticos y aplicaciones prácticas.', '/avatars/turing.png',
'Eres Turing, un tutor de IA y ML. Enfócate en explicar los fundamentos matemáticos de forma clara. Usa analogías y ejemplos del mundo real. Guía al estudiante según la rúbrica del curso y los objetivos de cada módulo.',
0.6, 1200, TRUE),
('Grace', 'Desarrollo Web y Frontend', 'GEMINI-PRO', 'Creativa y práctica. Especialista en UX/UI y buenas prácticas de desarrollo.', '/avatars/grace.png',
'Eres Grace, tutora de desarrollo web. Ayuda al estudiante a dominar cada módulo con ejemplos de código reales. Enfócate en buenas prácticas, UX/UI y desarrollo responsive. Adapta tu enseñanza según el progreso mostrado.',
0.8, 1000, TRUE),
('Neumann', 'Arquitectura de Software y Sistemas', 'CLAUDE-3', 'Estructurado y detallista. Enfocado en diseño escalable y patrones de arquitectura.', '/avatars/neumann.png',
'Eres Neumann, tutor de arquitectura de software. Guía al estudiante en patrones de diseño, escalabilidad y buenas prácticas. Usa la rúbrica del curso para evaluar su comprensión y ajusta tus explicaciones según sus respuestas.',
0.5, 1500, TRUE);

-- Tipos de becas
INSERT INTO tipos_beca (nombre, descripcion, criterios) VALUES
('Excelencia Académica', 'Para estudiantes destacados', ARRAY['Promedio mayor a 16', 'Certificados de logros académicos']),
('Situación Económica', 'Para estudiantes con necesidades económicas', ARRAY['Declaración jurada', 'Comprobantes de ingresos familiares']),
('Talento Tech', 'Para estudiantes con proyectos destacados', ARRAY['Portafolio de proyectos', 'Participación en hackathons o competencias']),
('Mujer en Tech', 'Fomentar participación femenina en tecnología', ARRAY['Carta de motivación', 'Compromiso de mentoría']);

-- Logros iniciales
INSERT INTO logros (nombre, descripcion, icono, categoria, criterio, puntos_xp, rareza, activo) VALUES
('Primer Paso', 'Completa tu primera lección', '🎯', 'INICIO', 'completar_1_leccion', 10, 'COMUN', TRUE),
('Estudiante Dedicado', 'Completa tu primer curso', '📚', 'CURSOS', 'completar_1_curso', 50, 'RARO', TRUE),
('Maratón de Aprendizaje', 'Estudia 5 días consecutivos', '🔥', 'CONSTANCIA', '5_dias_consecutivos', 30, 'RARO', TRUE),
('Experto en Laboratorios', 'Completa 10 laboratorios prácticos', '⚗️', 'PRACTICAS', 'completar_10_laboratorios', 75, 'EPICO', TRUE),
('Mentor Comunitario', 'Ayuda a 20 compañeros en el foro', '🤝', 'COMUNIDAD', '20_respuestas_utiles', 100, 'EPICO', TRUE),
('Maestro Certificado', 'Obtén 5 certificados', '🏆', 'CERTIFICADOS', '5_certificados', 200, 'LEGENDARIO', TRUE);

-- Datos de localización (Departamentos principales de Perú)
INSERT INTO departamentos (nombre, codigo_ubigeo) VALUES
('Lima', '15'),
('Arequipa', '04'),
('Cusco', '08'),
('La Libertad', '13'),
('Piura', '20'),
('Junín', '12'),
('Lambayeque', '14'),
('Ica', '11'),
('Puno', '21'),
('Ancash', '02');

-- Provincias de Lima (ejemplo)
INSERT INTO provincias (id_departamento, nombre, codigo_ubigeo) VALUES
(1, 'Lima', '1501'),
(1, 'Barranca', '1502'),
(1, 'Cajatambo', '1503'),
(1, 'Canta', '1504'),
(1, 'Cañete', '1505');

-- Distritos de Lima Metropolitana (ejemplo)
INSERT INTO distritos (id_provincia, nombre, codigo_ubigeo) VALUES
(1, 'Lima', '150101'),
(1, 'Miraflores', '150122'),
(1, 'San Isidro', '150130'),
(1, 'Surco', '150141'),
(1, 'San Borja', '150129'),
(1, 'La Molina', '150117'),
(1, 'San Miguel', '150132'),
(1, 'Jesús María', '150108');

-- ============================================
-- VISTAS ÚTILES PARA CONSULTAS
-- ============================================

-- Vista de estudiantes con membresía activa
CREATE OR REPLACE VIEW vista_estudiantes_activos AS
SELECT 
    e.id_estudiante,
    e.nombre,
    e.apellido,
    u.correo,
    p.nombre AS plan_actual,
    me.fecha_vencimiento,
    e.puntos_xp,
    e.nivel,
    COUNT(DISTINCT i.id_curso) AS cursos_inscritos,
    COUNT(DISTINCT CASE WHEN i.estado = 'COMPLETADO' THEN i.id_curso END) AS cursos_completados
FROM estudiantes e
INNER JOIN usuarios u ON e.id_usuario = u.id_usuario
LEFT JOIN membresias_estudiante me ON e.id_estudiante = me.id_estudiante AND me.estado = 'ACTIVA'
LEFT JOIN planes_membresia p ON me.id_plan = p.id_plan
LEFT JOIN inscripciones i ON e.id_estudiante = i.id_estudiante
WHERE u.estado = 'ACTIVO'
GROUP BY e.id_estudiante, e.nombre, e.apellido, u.correo, p.nombre, me.fecha_vencimiento, e.puntos_xp, e.nivel;

-- Vista de cursos populares
CREATE OR REPLACE VIEW vista_cursos_populares AS
SELECT 
    c.id_curso,
    c.nombre,
    c.nivel,
    cat.nombre AS categoria,
    c.total_estudiantes,
    c.calificacion_promedio,
    COUNT(DISTINCT r.id_review) AS total_reviews,
    t.nombre AS tutor_ia
FROM cursos c
INNER JOIN categorias_curso cat ON c.id_categoria = cat.id_categoria
LEFT JOIN reviews_curso r ON c.id_curso = r.id_curso
INNER JOIN tutores_ia t ON c.id_tutor = t.id_tutor
WHERE c.estado = 'PUBLICADO'
GROUP BY c.id_curso, c.nombre, c.nivel, cat.nombre, c.total_estudiantes, c.calificacion_promedio, t.nombre
ORDER BY c.total_estudiantes DESC, c.calificacion_promedio DESC;

-- Vista de progreso detallado del estudiante
CREATE OR REPLACE VIEW vista_progreso_estudiante AS
SELECT 
    i.id_estudiante,
    c.id_curso,
    c.nombre AS curso,
    i.progreso_general,
    i.estado,
    COUNT(DISTINCT pl.id_leccion) AS lecciones_completadas,
    COUNT(DISTINCT l.id_leccion) AS total_lecciones,
    SUM(pl.tiempo_visto_minutos) AS tiempo_total_minutos,
    i.fecha_inscripcion,
    i.ultima_actividad
FROM inscripciones i
INNER JOIN cursos c ON i.id_curso = c.id_curso
LEFT JOIN progreso_lecciones pl ON i.id_inscripcion = pl.id_inscripcion AND pl.completado = TRUE
LEFT JOIN modulos m ON c.id_curso = m.id_curso
LEFT JOIN lecciones l ON m.id_modulo = l.id_modulo
GROUP BY i.id_estudiante, c.id_curso, c.nombre, i.progreso_general, i.estado, i.fecha_inscripcion, i.ultima_actividad;

-- ============================================
-- FUNCIONES ÚTILES
-- ============================================

-- Función para verificar si un estudiante tiene membresía activa
CREATE OR REPLACE FUNCTION tiene_membresia_activa(p_id_estudiante INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    v_tiene_membresia BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM membresias_estudiante
        WHERE id_estudiante = p_id_estudiante
        AND estado = 'ACTIVA'
        AND fecha_vencimiento > CURRENT_TIMESTAMP
    ) INTO v_tiene_membresia;
    
    RETURN v_tiene_membresia;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener nivel del estudiante según XP
CREATE OR REPLACE FUNCTION calcular_nivel(p_puntos_xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN FLOOR(SQRT(p_puntos_xp / 100)) + 1;
END;
$$ LANGUAGE plpgsql;

-- Función para generar código de verificación de certificado
CREATE OR REPLACE FUNCTION generar_codigo_certificado(
    p_id_estudiante INTEGER,
    p_id_curso INTEGER
)
RETURNS VARCHAR AS $$
DECLARE
    v_codigo VARCHAR(50);
BEGIN
    v_codigo := 'CERT-' || 
                TO_CHAR(CURRENT_DATE, 'YYYY') || '-' ||
                LPAD(p_id_curso::TEXT, 4, '0') || '-' ||
                LPAD(p_id_estudiante::TEXT, 6, '0') || '-' ||
                UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6));
    RETURN v_codigo;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- ============================================

COMMENT ON TABLE usuarios IS 'Tabla principal de autenticación para todos los tipos de usuarios';
COMMENT ON TABLE estudiantes IS 'Información detallada de estudiantes con perfil de gamificación';
COMMENT ON TABLE cursos IS 'Catálogo completo de cursos con tutor IA asignado';
COMMENT ON TABLE sesiones_chat_ia IS 'Registro de sesiones de chat con IA. Los mensajes completos se almacenan en MongoDB';
COMMENT ON TABLE laboratorios IS 'Laboratorios virtuales integrados (Tinkercad, Wokwi, CodeSandbox, etc.)';
COMMENT ON TABLE certificados IS 'Certificados verificables con código único';
COMMENT ON TABLE membresias_estudiante IS 'Membresías activas de estudiantes con fechas de vencimiento';

-- ============================================
-- FIN DEL SCHEMA
-- ============================================

-- Para verificar el tamaño de la base de datos:
-- SELECT pg_size_pretty(pg_database_size('universia'));

-- Para listar todas las tablas:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
