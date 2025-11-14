import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { Pool } from 'pg'
import { getOrCreateStudentId } from '@/lib/get-student-id'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { cursoId, leccionId, porcentajeVisto, ultimaPosicion, notas } = body

    if (!cursoId || !leccionId) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      )
    }

    const email = session.user.email
    const studentId = await getOrCreateStudentId(pool, email)

    // Obtener la inscripción del estudiante
    const inscripcionQuery = `
      SELECT id_inscripcion
      FROM inscripciones
      WHERE id_estudiante = $1 AND id_curso = $2
    `
    
    const inscripcionResult = await pool.query(inscripcionQuery, [studentId, cursoId])
    
    if (inscripcionResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'No estás inscrito en este curso' },
        { status: 404 }
      )
    }

    const idInscripcion = inscripcionResult.rows[0].id_inscripcion

    // Verificar si ya existe un registro de progreso para esta lección
    const checkQuery = `
      SELECT id_progreso
      FROM progreso_lecciones
      WHERE id_inscripcion = $1 AND id_leccion = $2
    `
    
    const checkResult = await pool.query(checkQuery, [idInscripcion, leccionId])

    if (checkResult.rows.length > 0) {
      // Actualizar progreso existente
      const updateQuery = `
        UPDATE progreso_lecciones
        SET 
          completado = true,
          porcentaje_visto = COALESCE($3, porcentaje_visto, 100),
          ultima_posicion = COALESCE($4, ultima_posicion),
          notas_estudiante = COALESCE($5, notas_estudiante),
          fecha_completado = CASE WHEN completado = false THEN NOW() ELSE fecha_completado END
        WHERE id_progreso = $1 AND id_leccion = $2
        RETURNING *
      `
      
      await pool.query(updateQuery, [
        checkResult.rows[0].id_progreso,
        leccionId,
        porcentajeVisto || 100,
        ultimaPosicion,
        notas
      ])
    } else {
      // Crear nuevo registro de progreso
      const insertQuery = `
        INSERT INTO progreso_lecciones (
          id_inscripcion,
          id_leccion,
          completado,
          porcentaje_visto,
          ultima_posicion,
          notas_estudiante,
          fecha_inicio,
          fecha_completado
        ) VALUES ($1, $2, true, $3, $4, $5, NOW(), NOW())
        RETURNING *
      `
      
      await pool.query(insertQuery, [
        idInscripcion,
        leccionId,
        porcentajeVisto || 100,
        ultimaPosicion || 0,
        notas || ''
      ])
    }

    // Actualizar progreso general del curso
    const updateProgressQuery = `
      WITH leccion_stats AS (
        SELECT 
          COUNT(*) FILTER (WHERE pl.completado = true) as completadas,
          COUNT(*) as total
        FROM lecciones l
        JOIN modulos m ON l.id_modulo = m.id_modulo
        LEFT JOIN progreso_lecciones pl ON l.id_leccion = pl.id_leccion 
          AND pl.id_inscripcion = $1
        WHERE m.id_curso = $2
      )
      UPDATE inscripciones
      SET progreso_general = CASE 
        WHEN (SELECT total FROM leccion_stats) > 0 
        THEN ROUND((SELECT completadas::decimal / total * 100 FROM leccion_stats), 2)
        ELSE 0
      END
      WHERE id_inscripcion = $1
      RETURNING progreso_general
    `
    
    const progressResult = await pool.query(updateProgressQuery, [idInscripcion, cursoId])

    return NextResponse.json({
      success: true,
      message: 'Lección marcada como completada',
      progreso_general: progressResult.rows[0]?.progreso_general || 0
    })

  } catch (error) {
    console.error('Error marking lesson complete:', error)
    return NextResponse.json(
      { error: 'Error al marcar la lección como completada' },
      { status: 500 }
    )
  }
}
