import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { Pool } from 'pg'
import { getOrCreateStudentId } from '@/lib/get-student-id'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    console.log('[API /estudiante/curso/[id]] Iniciando...')
    const session = await auth()
    
    console.log('[API /estudiante/curso/[id]] Session:', session?.user?.email)
    
    if (!session || !session.user?.email) {
      console.log('[API /estudiante/curso/[id]] No autorizado')
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const params = await props.params
    const cursoId = parseInt(params.id)
    const email = session.user.email

    console.log('[API /estudiante/curso/[id]] Curso ID:', cursoId, 'Email:', email)

    const studentId = await getOrCreateStudentId(pool, email)
    console.log('[API /estudiante/curso/[id]] Student ID:', studentId)

    // Obtener datos del curso y la inscripción
    const courseQuery = `
      SELECT 
        c.id_curso,
        c.nombre,
        c.descripcion,
        c.nivel,
        c.duracion_horas,
        c.imagen_portada,
        i.id_inscripcion,
        i.estado,
        i.progreso_general,
        i.fecha_inscripcion
      FROM cursos c
      JOIN inscripciones i ON c.id_curso = i.id_curso
      WHERE c.id_curso = $1 
        AND i.id_estudiante = $2
        AND c.estado = 'PUBLICADO'
    `
    
    const courseResult = await pool.query(courseQuery, [cursoId, studentId])
    
    console.log('[API /estudiante/curso/[id]] Course result rows:', courseResult.rows.length)
    
    if (courseResult.rows.length === 0) {
      console.log('[API /estudiante/curso/[id]] Curso no encontrado')
      return NextResponse.json(
        { error: 'Curso no encontrado o no inscrito' },
        { status: 404 }
      )
    }

    const course = courseResult.rows[0]

    // Obtener módulos con sus lecciones
    const modulesQuery = `
      SELECT 
        m.id_modulo,
        m.titulo,
        m.descripcion,
        m.orden,
        m.duracion_estimada
      FROM modulos m
      WHERE m.id_curso = $1
      ORDER BY m.orden ASC
    `
    
    const modulesResult = await pool.query(modulesQuery, [cursoId])

    // Para cada módulo, obtener sus lecciones con progreso
    const modulesWithLessons = await Promise.all(
      modulesResult.rows.map(async (module) => {
        const lessonsQuery = `
          SELECT 
            l.id_leccion,
            l.titulo,
            l.contenido,
            l.tipo_contenido,
            l.duracion_minutos,
            l.orden,
            l.url_video,
            l.conceptos_clave,
            l.objetivos_aprendizaje,
            COALESCE(pl.completado, false) as completado,
            pl.porcentaje_visto,
            pl.ultima_posicion,
            pl.notas_estudiante
          FROM lecciones l
          LEFT JOIN progreso_lecciones pl ON l.id_leccion = pl.id_leccion 
            AND pl.id_inscripcion = $1
          WHERE l.id_modulo = $2
          ORDER BY l.orden ASC
        `
        
        const lessonsResult = await pool.query(lessonsQuery, [
          course.id_inscripcion,
          module.id_modulo
        ])

        const lessons = lessonsResult.rows.map(lesson => ({
          id: lesson.id_leccion,
          titulo: lesson.titulo,
          contenido: lesson.contenido,
          tipo_contenido: lesson.tipo_contenido,
          duracion_minutos: lesson.duracion_minutos,
          orden: lesson.orden,
          url_video: lesson.url_video,
          conceptos_clave: lesson.conceptos_clave,
          objetivos_aprendizaje: lesson.objetivos_aprendizaje,
          completado: lesson.completado,
          porcentaje_visto: lesson.porcentaje_visto || 0,
          ultima_posicion: lesson.ultima_posicion || 0,
          notas_estudiante: lesson.notas_estudiante || ''
        }))

        const completedCount = lessons.filter(l => l.completado).length
        const progressPercentage = lessons.length > 0 
          ? (completedCount / lessons.length) * 100 
          : 0

        return {
          id: module.id_modulo,
          titulo: module.titulo,
          descripcion: module.descripcion,
          orden: module.orden,
          duracion_estimada_horas: module.duracion_estimada || 0,
          lecciones: lessons,
          progreso: progressPercentage,
          lecciones_completadas: completedCount,
          total_lecciones: lessons.length
        }
      })
    )

    const responseData = {
      success: true,
      course: {
        id: course.id_curso,
        nombre: course.nombre,
        descripcion: course.descripcion,
        nivel: course.nivel,
        duracion_horas: course.duracion_horas,
        imagen_portada: course.imagen_portada,
        estado: course.estado,
        progreso_general: course.progreso_general,
        fecha_inscripcion: course.fecha_inscripcion,
        id_inscripcion: course.id_inscripcion,
        modulos: modulesWithLessons
      }
    }

    console.log('[API /estudiante/curso/[id]] Devolviendo curso:', course.nombre, 'con', modulesWithLessons.length, 'módulos')

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('[API /estudiante/curso/[id]] Error:', error)
    return NextResponse.json(
      { error: 'Error al obtener los detalles del curso' },
      { status: 500 }
    )
  }
}
