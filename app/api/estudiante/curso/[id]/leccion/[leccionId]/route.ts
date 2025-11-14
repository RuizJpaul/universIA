import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { Pool } from "pg"
import { getOrCreateStudentId } from "@/lib/get-student-id"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string; leccionId: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const params = await props.params
    const cursoId = parseInt(params.id)
    const leccionId = parseInt(params.leccionId)
    const studentId = await getOrCreateStudentId(pool, session.user.email)

    // Obtener detalles de la lección
    const leccionQuery = await pool.query(
      `SELECT 
        l.id_leccion,
        l.titulo,
        l.descripcion,
        l.tipo_contenido,
        l.contenido,
        l.url_video,
        l.duracion_minutos,
        l.objetivos_aprendizaje,
        l.conceptos_clave,
        l.recursos_descargables,
        m.titulo as modulo_titulo,
        m.id_modulo,
        c.nombre as curso_nombre,
        pl.completado,
        pl.porcentaje_visto,
        pl.notas_estudiante
      FROM lecciones l
      JOIN modulos m ON l.id_modulo = m.id_modulo
      JOIN cursos c ON m.id_curso = c.id_curso
      JOIN inscripciones i ON c.id_curso = i.id_curso
      LEFT JOIN progreso_lecciones pl ON l.id_leccion = pl.id_leccion 
        AND pl.id_inscripcion = i.id_inscripcion
      WHERE l.id_leccion = $1 
        AND c.id_curso = $2 
        AND i.id_estudiante = $3`,
      [leccionId, cursoId, studentId]
    )

    if (leccionQuery.rows.length === 0) {
      return NextResponse.json(
        { error: "Lección no encontrada o no tienes acceso" },
        { status: 404 }
      )
    }

    const leccion = leccionQuery.rows[0]

    // Obtener lecciones del módulo para navegación
    const leccionesModuloQuery = await pool.query(
      `SELECT 
        l.id_leccion,
        l.titulo,
        l.tipo_contenido,
        l.orden,
        pl.completado
      FROM lecciones l
      LEFT JOIN progreso_lecciones pl ON l.id_leccion = pl.id_leccion
        AND pl.id_inscripcion = (
          SELECT id_inscripcion FROM inscripciones 
          WHERE id_curso = $1 AND id_estudiante = $2
        )
      WHERE l.id_modulo = $3
      ORDER BY l.orden`,
      [cursoId, studentId, leccion.id_modulo]
    )

    return NextResponse.json({
      success: true,
      leccion: {
        id_leccion: leccion.id_leccion,
        titulo: leccion.titulo,
        descripcion: leccion.descripcion,
        tipo_contenido: leccion.tipo_contenido,
        contenido: leccion.contenido,
        url_video: leccion.url_video,
        duracion_minutos: leccion.duracion_minutos,
        objetivos_aprendizaje: leccion.objetivos_aprendizaje || [],
        conceptos_clave: leccion.conceptos_clave || [],
        recursos_descargables: leccion.recursos_descargables || [],
        modulo_titulo: leccion.modulo_titulo,
        curso_nombre: leccion.curso_nombre,
        completado: leccion.completado || false,
        porcentaje_visto: leccion.porcentaje_visto || 0,
        notas_estudiante: leccion.notas_estudiante || "",
      },
      navegacion: leccionesModuloQuery.rows.map(l => ({
        id_leccion: l.id_leccion,
        titulo: l.titulo,
        tipo_contenido: l.tipo_contenido,
        orden: l.orden,
        completado: l.completado || false,
      })),
    })
  } catch (error: any) {
    console.error("Error obteniendo lección:", error)
    return NextResponse.json({ error: "Error al obtener lección" }, { status: 500 })
  }
}
