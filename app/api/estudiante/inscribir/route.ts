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
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { cursoId } = await request.json()
    
    console.log('[API /inscribir] Datos recibidos:', { cursoId, tipo: typeof cursoId })

    if (!cursoId) {
      return NextResponse.json(
        { success: false, error: 'ID de curso requerido' },
        { status: 400 }
      )
    }

    // Convertir cursoId a número si viene como string
    const cursoIdNumerico = parseInt(cursoId)
    
    if (isNaN(cursoIdNumerico)) {
      return NextResponse.json(
        { success: false, error: 'ID de curso inválido' },
        { status: 400 }
      )
    }

    // Obtener estudiante (crea automáticamente si no existe)
    const estudianteId = await getOrCreateStudentId(pool, session.user.email)
    
    console.log('[API /inscribir] IDs obtenidos:', { estudianteId, cursoIdNumerico })

    console.log('[API /inscribir] IDs obtenidos:', { estudianteId, cursoIdNumerico })

    // Verificar si ya está inscrito
    const inscripcionExistente = await pool.query(
      `SELECT id_inscripcion 
       FROM inscripciones 
       WHERE id_estudiante = $1 AND id_curso = $2`,
      [estudianteId, cursoIdNumerico]
    )
    
    console.log('[API /inscribir] Inscripción existente:', inscripcionExistente.rows.length)

    if (inscripcionExistente.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Ya estás inscrito en este curso' },
        { status: 400 }
      )
    }

    // Crear inscripción
    console.log('[API /inscribir] Creando inscripción...')
    const nuevaInscripcion = await pool.query(
      `INSERT INTO inscripciones (
        id_estudiante,
        id_curso,
        estado,
        progreso_general
      ) VALUES ($1, $2, $3, $4)
      RETURNING id_inscripcion`,
      [estudianteId, cursoIdNumerico, 'EN_PROGRESO', 0]
    )
    
    console.log('[API /inscribir] Inscripción creada:', nuevaInscripcion.rows[0])

    return NextResponse.json({
      success: true,
      message: 'Inscripción exitosa',
      inscripcionId: nuevaInscripcion.rows[0].id_inscripcion
    })

  } catch (error: any) {
    console.error('[API /inscribir] Error completo:', error)
    console.error('[API /inscribir] Stack trace:', error.stack)
    return NextResponse.json(
      { success: false, error: error.message || 'Error al inscribir en curso' },
      { status: 500 }
    )
  }
}
