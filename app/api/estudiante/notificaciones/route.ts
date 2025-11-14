import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { Pool } from 'pg'
import { getOrCreateStudentId } from '@/lib/get-student-id'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      )
    }

    const client = await pool.connect()

    try {
      // Obtener o crear ID del estudiante
      const estudianteId = await getOrCreateStudentId(pool, session.user.email)

      // Obtener notificaciones del estudiante
      const notificationsQuery = `
        WITH nuevas_noticias AS (
          SELECT 
            'noticia' as tipo,
            'Noticia' as categoria,
            n.titulo,
            n.subtitulo as mensaje,
            n.fecha_publicacion as fecha,
            false as leido,
            CASE 
              WHEN n.destacada THEN 'importante'
              ELSE 'info'
            END as prioridad
          FROM noticias n
          WHERE n.estado = 'PUBLICADA'
          AND n.fecha_publicacion >= NOW() - INTERVAL '7 days'
          ORDER BY n.fecha_publicacion DESC
          LIMIT 5
        ),
        proximos_eventos AS (
          SELECT 
            'evento' as tipo,
            'Evento' as categoria,
            e.titulo,
            'Evento próximo: ' || e.tipo as mensaje,
            e.fecha_inicio as fecha,
            false as leido,
            'importante' as prioridad
          FROM eventos e
          WHERE e.estado = 'PROGRAMADO'
          AND e.fecha_inicio BETWEEN NOW() AND NOW() + INTERVAL '7 days'
          ORDER BY e.fecha_inicio ASC
          LIMIT 5
        ),
        evaluaciones_pendientes AS (
          SELECT 
            'evaluacion' as tipo,
            'Evaluación' as categoria,
            'Evaluación pendiente: ' || ev.titulo as titulo,
            'Curso: ' || c.nombre as mensaje,
            ev.fecha_limite as fecha,
            false as leido,
            CASE 
              WHEN ev.fecha_limite <= NOW() + INTERVAL '2 days' THEN 'urgente'
              ELSE 'importante'
            END as prioridad
          FROM evaluaciones ev
          JOIN cursos c ON ev.id_curso = c.id_curso
          JOIN inscripciones i ON i.id_curso = c.id_curso
          WHERE i.id_estudiante = $1
          AND ev.fecha_limite >= NOW()
          AND NOT EXISTS (
            SELECT 1 FROM resultados_evaluaciones re
            WHERE re.id_estudiante = $1
            AND re.id_evaluacion = ev.id_evaluacion
          )
          ORDER BY ev.fecha_limite ASC
          LIMIT 5
        ),
        logros_recientes AS (
          SELECT 
            'logro' as tipo,
            'Logro' as categoria,
            '¡Nuevo logro desbloqueado!' as titulo,
            l.nombre || ' - ' || l.descripcion as mensaje,
            le.fecha_obtenido as fecha,
            false as leido,
            'exito' as prioridad
          FROM logros_estudiante le
          JOIN logros l ON le.id_logro = l.id_logro
          WHERE le.id_estudiante = $1
          AND le.fecha_obtenido >= NOW() - INTERVAL '7 days'
          ORDER BY le.fecha_obtenido DESC
          LIMIT 3
        )
        SELECT * FROM (
          SELECT * FROM nuevas_noticias
          UNION ALL
          SELECT * FROM proximos_eventos
          UNION ALL
          SELECT * FROM evaluaciones_pendientes
          UNION ALL
          SELECT * FROM logros_recientes
        ) notificaciones
        ORDER BY fecha DESC
        LIMIT 20
      `

      const notificationsResult = await client.query(notificationsQuery, [estudianteId])

      // Contar no leídas (todas son no leídas en este caso simplificado)
      const unreadCount = notificationsResult.rows.length

      return NextResponse.json({
        success: true,
        notifications: notificationsResult.rows,
        unreadCount: unreadCount,
      })
    } finally {
      client.release()
    }
  } catch (error: any) {
    console.error('Error al obtener notificaciones:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// Marcar notificación como leída
export async function PUT(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { notificationId, markAllAsRead } = body

    // En esta implementación simplificada, solo retornamos éxito
    // En una implementación completa, actualizaríamos una tabla de notificaciones_estudiante

    return NextResponse.json({
      success: true,
      message: markAllAsRead 
        ? 'Todas las notificaciones marcadas como leídas' 
        : 'Notificación marcada como leída',
    })
  } catch (error: any) {
    console.error('Error al actualizar notificación:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
