import { Pool } from 'pg'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

async function seedNoticiasEventos() {
  const client = await pool.connect()

  try {
    console.log('🌱 Iniciando seed de noticias y eventos...\n')

    // Verificar si existe un administrador
    const adminCheck = await client.query(
      'SELECT id_admin FROM administradores LIMIT 1'
    )

    let adminId: number

    if (adminCheck.rows.length === 0) {
      console.log('⚠️  No se encontró administrador, creando uno...')
      
      // Crear usuario administrador
      const usuarioResult = await client.query(
        `INSERT INTO usuarios (correo, contrasena, rol, estado)
         VALUES ($1, $2, $3, $4)
         RETURNING id_usuario`,
        ['admin@universia.edu.pe', '$2a$10$dummyhash', 'ADMINISTRADOR', 'ACTIVO']
      )

      // Crear administrador
      const adminResult = await client.query(
        `INSERT INTO administradores (id_usuario, nombre, cargo)
         VALUES ($1, $2, $3)
         RETURNING id_admin`,
        [usuarioResult.rows[0].id_usuario, 'Sistema UniversIA', 'Administrador del Sistema']
      )

      adminId = adminResult.rows[0].id_admin
      console.log('✓ Administrador creado\n')
    } else {
      adminId = adminCheck.rows[0].id_admin
      console.log('✓ Administrador encontrado\n')
    }

    // Limpiar noticias y eventos existentes
    await client.query('DELETE FROM eventos WHERE TRUE')
    await client.query('DELETE FROM noticias WHERE TRUE')
    console.log('🗑️  Datos anteriores eliminados\n')

    // Insertar noticias
    const noticias = [
      {
        titulo: 'Nueva funcionalidad: Laboratorios Virtuales de Electrónica',
        subtitulo: 'Simulación de circuitos en tiempo real con Tinkercad y Wokwi',
        contenido: `Estamos emocionados de anunciar la integración de laboratorios virtuales de electrónica en nuestra plataforma. 
        
Ahora los estudiantes pueden:
- Simular circuitos electrónicos en tiempo real
- Trabajar con Arduino y ESP32 virtualmente
- Recibir feedback instantáneo de la IA
- Compartir proyectos con la comunidad

Los laboratorios están integrados con Tinkercad, Wokwi, y otras plataformas líderes en el mercado. Esta funcionalidad está disponible para todos los cursos de Ingeniería Electrónica e Ingeniería de Sistemas.`,
        categoria: 'Tecnología',
        tags: ['laboratorios', 'electrónica', 'simulación', 'arduino'],
        destacada: true,
      },
      {
        titulo: 'Actualización del Sistema de IA Tutora',
        subtitulo: 'Retroalimentación más personalizada basada en tu ritmo de aprendizaje',
        contenido: `Nuestra IA tutora ha recibido una importante actualización que mejora significativamente la experiencia de aprendizaje.

Nuevas características:
- Análisis del ritmo de aprendizaje individual
- Recomendaciones adaptativas de contenido
- Detección temprana de dificultades de comprensión
- Explicaciones multinivel según tu nivel de conocimiento
- Soporte para más de 15 temas técnicos adicionales

La actualización ya está activa para todos los usuarios. ¡Pruébala en tu próxima sesión de estudio!`,
        categoria: 'Actualización',
        tags: ['ia', 'tutor', 'personalización', 'aprendizaje'],
        destacada: true,
      },
      {
        titulo: 'Nuevos Cursos de Certificación Profesional',
        subtitulo: 'Data Science, Cloud Computing y Ciberseguridad',
        contenido: `Ampliamos nuestra oferta académica con 15 nuevos cursos certificados en las áreas más demandadas del mercado tecnológico.

Nuevos cursos disponibles:
- Data Science con Python y R
- Machine Learning Avanzado
- AWS Solutions Architect
- Azure DevOps Engineer
- Google Cloud Professional
- Ethical Hacking y Pentesting
- Security Operations Center (SOC)
- Blockchain Development
- DevSecOps

Todos los cursos incluyen:
✓ Certificación oficial
✓ Proyectos prácticos reales
✓ Mentoría con IA 24/7
✓ Acceso a laboratorios virtuales
✓ Bolsa de trabajo exclusiva`,
        categoria: 'Cursos',
        tags: ['certificación', 'data-science', 'cloud', 'ciberseguridad'],
        destacada: false,
      },
      {
        titulo: 'Concurso de Innovación Tecnológica 2025',
        subtitulo: 'Presenta tu proyecto y gana becas completas',
        contenido: `¡Convocatoria abierta para el Concurso de Innovación Tecnológica 2025!

Premios:
🥇 1er Lugar: Beca completa + $3000
🥈 2do Lugar: Beca completa + $1500
🥉 3er Lugar: 50% de beca + $800

Categorías:
- Inteligencia Artificial aplicada
- IoT y Automatización
- Aplicaciones Web/Mobile innovadoras
- Blockchain y Fintech
- EdTech y Tecnología Educativa

Requisitos:
- Ser estudiante activo de UniversIA
- Proyecto original e innovador
- Presentación en video (5 min)
- Prototipo funcional

Fecha límite: 30 de Noviembre 2025
Premiación: 15 de Diciembre 2025

¡Inscríbete ahora y transforma tu idea en realidad!`,
        categoria: 'Competencia',
        tags: ['concurso', 'innovación', 'becas', 'premios'],
        destacada: true,
      },
      {
        titulo: 'Alianza Estratégica con Google Cloud',
        subtitulo: 'Acceso gratuito a créditos de GCP para estudiantes',
        contenido: `Nos complace anunciar nuestra alianza estratégica con Google Cloud Platform.

Beneficios para estudiantes:
- $300 en créditos de GCP
- Acceso a Google Cloud Skills Boost
- Certificaciones oficiales de Google
- Sandbox environments ilimitados
- Soporte técnico prioritario

Los créditos están disponibles para todos los estudiantes matriculados en cursos de Cloud Computing. 

¿Cómo activar tus créditos?
1. Completa el módulo de introducción a GCP
2. Verifica tu identidad estudiantil
3. Recibe tu código de activación
4. ¡Comienza a desarrollar en la nube!`,
        categoria: 'Alianzas',
        tags: ['google-cloud', 'gcp', 'alianza', 'créditos'],
        destacada: false,
      },
      {
        titulo: 'Sistema de Mentorías Personalizadas',
        subtitulo: 'Conecta con profesionales de la industria',
        contenido: `Lanzamos nuestro nuevo sistema de mentorías personalizadas que conecta estudiantes con profesionales destacados de la industria tecnológica.

Cómo funciona:
1. Completa tu perfil profesional
2. Elige tus áreas de interés
3. Recibe matches con mentores compatibles
4. Agenda sesiones 1-on-1
5. Recibe feedback personalizado

Nuestros mentores:
- Ingenieros de FAANG (Facebook, Amazon, Apple, Netflix, Google)
- CTOs y Tech Leads de startups exitosas
- Investigadores en IA y ML
- Emprendedores tecnológicos

Incluye:
✓ 2 sesiones mensuales (Plan Premium)
✓ Revisión de CV y LinkedIn
✓ Mock interviews técnicas
✓ Orientación de carrera profesional
✓ Networking en comunidad exclusiva`,
        categoria: 'Educación',
        tags: ['mentorías', 'carrera', 'networking', 'profesional'],
        destacada: false,
      },
    ]

    console.log('📰 Insertando noticias...')
    for (const noticia of noticias) {
      await client.query(
        `INSERT INTO noticias (
          id_admin, titulo, subtitulo, contenido, categoria, tags, destacada, estado, visitas, likes_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          adminId,
          noticia.titulo,
          noticia.subtitulo,
          noticia.contenido,
          noticia.categoria,
          noticia.tags,
          noticia.destacada,
          'PUBLICADA',
          Math.floor(Math.random() * 500) + 50, // visitas aleatorias
          Math.floor(Math.random() * 100) + 10, // likes aleatorios
        ]
      )
    }
    console.log(`✓ ${noticias.length} noticias insertadas\n`)

    // Insertar eventos
    const eventos = [
      {
        titulo: 'Webinar: Inteligencia Artificial en la Educación del Futuro',
        descripcion: `Únete a expertos internacionales en una discusión profunda sobre cómo la IA está transformando la educación superior.

Speakers:
- Dr. Andrew Ng - DeepLearning.AI
- Dra. Fei-Fei Li - Stanford AI Lab
- Dr. Yoshua Bengio - Mila Quebec AI Institute

Temas a tratar:
• El rol de la IA en la personalización del aprendizaje
• Ética en sistemas educativos automatizados
• Futuro de las certificaciones y evaluaciones
• Democratización del acceso a educación de calidad

Incluye sesión de Q&A en vivo.`,
        tipo: 'WEBINAR',
        modalidad: 'VIRTUAL',
        fecha_inicio: new Date('2025-11-20T18:00:00'),
        fecha_fin: new Date('2025-11-20T20:00:00'),
        url_transmision: 'https://meet.google.com/xyz-demo-url',
        capacidad_maxima: 500,
        destacado: true,
      },
      {
        titulo: 'Workshop: Machine Learning con Python',
        descripcion: `Taller práctico intensivo de Machine Learning desde cero hasta modelos avanzados.

Contenido:
- Día 1: Fundamentos y Preprocessing
- Día 2: Modelos supervisados (Clasificación y Regresión)
- Día 3: Modelos no supervisados (Clustering, PCA)
- Día 4: Deep Learning con TensorFlow
- Día 5: Proyecto final integrador

Requisitos:
✓ Python básico
✓ Conocimientos de álgebra lineal
✓ Laptop con 8GB RAM mínimo

Incluye:
• Material didáctico completo
• Datasets reales de industria
• Certificado de participación
• Acceso a comunidad exclusiva`,
        tipo: 'TALLER',
        modalidad: 'PRESENCIAL',
        fecha_inicio: new Date('2025-11-25T09:00:00'),
        fecha_fin: new Date('2025-11-29T18:00:00'),
        ubicacion: 'Campus UniversIA - Laboratorio 301',
        capacidad_maxima: 30,
        destacado: true,
      },
      {
        titulo: 'Hackathon Virtual: Soluciones EdTech',
        descripcion: `72 horas intensivas desarrollando soluciones tecnológicas innovadoras para la educación.

Desafíos:
🎯 Track 1: Herramientas de aprendizaje adaptativo
🎯 Track 2: Gamificación educativa
🎯 Track 3: Accesibilidad e inclusión
🎯 Track 4: Evaluación automatizada con IA

Premios totales: $10,000 USD

Cada equipo recibirá:
- Mentoría técnica 24/7
- Créditos de cloud computing
- APIs y herramientas premium
- Feedback de expertos
- Pitch ante inversionistas

Tecnologías sugeridas:
• Frontend: React, Vue, Next.js
• Backend: Node.js, Python, FastAPI
• IA/ML: TensorFlow, PyTorch, OpenAI
• Databases: PostgreSQL, MongoDB

¡Forma tu equipo de 2-5 personas e inscríbete!`,
        tipo: 'HACKATHON',
        modalidad: 'VIRTUAL',
        fecha_inicio: new Date('2025-12-06T18:00:00'),
        fecha_fin: new Date('2025-12-09T18:00:00'),
        url_transmision: 'https://hackathon.universia.edu.pe',
        capacidad_maxima: 200,
        destacado: true,
      },
      {
        titulo: 'Sesión Q&A con Tech Leaders',
        descripcion: `Conversatorio abierto con líderes tecnológicos de empresas reconocidas.

Invitados confirmados:
- CTO de Rappi
- Engineering Manager de Meta
- VP of Engineering de Mercado Libre
- Fundador de startup exitosa (YCombinator)

Temas a discutir:
• Cómo prepararse para entrevistas técnicas
• Habilidades más demandadas en 2025
• Trabajo remoto vs presencial en tech
• Construir un portafolio destacado
• Emprendimiento tecnológico en LATAM

Formato interactivo: 
Envía tus preguntas con anticipación y participa en vivo. Las mejores preguntas ganarán mentorías 1-on-1.`,
        tipo: 'CONFERENCIA',
        modalidad: 'HIBRIDO',
        fecha_inicio: new Date('2025-11-18T16:00:00'),
        fecha_fin: new Date('2025-11-18T18:00:00'),
        ubicacion: 'Auditorio Principal - Campus UniversIA',
        url_transmision: 'https://youtube.com/live/universia-qa',
        capacidad_maxima: 150,
        destacado: false,
      },
      {
        titulo: 'Networking Night: Tech Students',
        descripcion: `Noche de networking exclusiva para estudiantes de tecnología.

Actividades:
🤝 Speed networking (5 min por conexión)
🎮 Gaming zone con juegos técnicos
🍕 Comida y bebidas incluidas
💼 Ronda de pitches de proyectos
🏆 Premios a mejores proyectos presentados

Asistirán:
- Recruiters de empresas tech
- Alumni trabajando en FAANG
- Fundadores de startups
- Inversionistas ángel

Código de vestimenta: Smart Casual

¡Trae tus tarjetas de presentación y portfolio!`,
        tipo: 'NETWORKING',
        modalidad: 'PRESENCIAL',
        fecha_inicio: new Date('2025-11-22T19:00:00'),
        fecha_fin: new Date('2025-11-22T23:00:00'),
        ubicacion: 'WeWork - San Isidro, Lima',
        capacidad_maxima: 80,
        destacado: false,
      },
      {
        titulo: 'Certificación AWS Solutions Architect',
        descripcion: `Bootcamp intensivo de preparación para la certificación AWS Solutions Architect - Associate.

Programa de 4 semanas:
Semana 1: IAM, EC2, VPC, S3
Semana 2: RDS, DynamoDB, ElastiCache
Semana 3: Load Balancing, Auto Scaling, CloudFormation
Semana 4: Exam readiness y simulacros

Incluye:
✓ Voucher de examen oficial AWS ($150 USD)
✓ Práctica con labs hands-on
✓ 6 exámenes de práctica completos
✓ Acceso a AWS Free Tier extendido
✓ Revisión de áreas débiles 1-on-1

Instructores certificados:
- AWS Solutions Architect Professional
- 5+ años experiencia en cloud

Modalidad: Virtual en vivo
Horario: Martes y Jueves 19:00-22:00`,
        tipo: 'TALLER',
        modalidad: 'VIRTUAL',
        fecha_inicio: new Date('2025-12-03T19:00:00'),
        fecha_fin: new Date('2025-12-27T22:00:00'),
        url_transmision: 'https://zoom.us/j/universia-aws',
        capacidad_maxima: 40,
        destacado: false,
      },
    ]

    console.log('📅 Insertando eventos...')
    for (const evento of eventos) {
      await client.query(
        `INSERT INTO eventos (
          id_admin, titulo, descripcion, tipo, modalidad, 
          fecha_inicio, fecha_fin, ubicacion, url_transmision, 
          capacidad_maxima, inscritos_count, estado
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          adminId,
          evento.titulo,
          evento.descripcion,
          evento.tipo,
          evento.modalidad,
          evento.fecha_inicio,
          evento.fecha_fin,
          evento.ubicacion || null,
          evento.url_transmision || null,
          evento.capacidad_maxima,
          Math.floor(Math.random() * (evento.capacidad_maxima * 0.7)), // inscritos aleatorios
          'PROGRAMADO',
        ]
      )
    }
    console.log(`✓ ${eventos.length} eventos insertados\n`)

    console.log('✅ Seed completado exitosamente!')
    console.log('\n📊 Resumen:')
    console.log(`   - ${noticias.length} noticias`)
    console.log(`   - ${eventos.length} eventos`)
    console.log(`   - Administrador ID: ${adminId}`)

  } catch (error) {
    console.error('❌ Error durante el seed:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

// Ejecutar seed
seedNoticiasEventos()
  .then(() => {
    console.log('\n🎉 Proceso finalizado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error fatal:', error)
    process.exit(1)
  })
