import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { Pool } from 'pg'

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
      // Query para obtener noticias
      const noticiasQuery = `
        SELECT 
          n.id_noticia as id,
          n.titulo,
          n.subtitulo,
          n.contenido,
          n.imagen_portada,
          n.categoria,
          n.tags,
          n.destacada,
          n.fecha_publicacion,
          n.visitas,
          n.likes_count,
          a.nombre as autor
        FROM noticias n
        LEFT JOIN administradores a ON n.id_admin = a.id_admin
        WHERE n.estado = 'PUBLICADA'
        ORDER BY n.fecha_publicacion DESC
        LIMIT 20
      `

      const noticiasResult = await client.query(noticiasQuery)

      // Query para obtener eventos próximos
      const eventosQuery = `
        SELECT 
          e.id_evento as id,
          e.titulo,
          e.descripcion,
          e.imagen_portada,
          e.tipo,
          e.modalidad,
          e.fecha_inicio,
          e.fecha_fin,
          e.ubicacion,
          e.url_transmision,
          e.capacidad_maxima,
          e.inscritos_count,
          e.estado
        FROM eventos e
        WHERE e.fecha_inicio >= NOW()
        AND e.estado = 'PROGRAMADO'
        ORDER BY e.fecha_inicio ASC
        LIMIT 10
      `

      const eventosResult = await client.query(eventosQuery)

      return NextResponse.json({
        success: true,
        noticias: noticiasResult.rows,
        eventos: eventosResult.rows,
      })
    } finally {
      client.release()
    }
  } catch (error: any) {
    console.error('Error al obtener noticias:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
