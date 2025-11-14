import { Pool } from "pg";
import { auth } from "@/auth";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export interface DashboardData {
  estudiante: {
    nombre: string;
    apellido: string;
    foto_perfil: string | null;
    especialidad: string | null;
    nivel: number;
    puntos_xp: number;
  };
  estadisticas: {
    cursosInscritos: number;
    cursosCompletados: number;
    leccionesCompletadas: number;
    horasEstudio: number;
  };
  cursos: Array<{
    id_curso: string;
    titulo: string;
    descripcion: string;
    imagen_portada: string | null;
    progreso: number;
    ultimaLeccion: string | null;
  }>;
  logros: Array<{
    id_logro: string;
    nombre: string;
    descripcion: string;
    icono: string | null;
    fecha_obtenido: Date;
  }>;
  proximosEventos: Array<{
    id_evento: string;
    nombre: string;
    descripcion: string;
    fecha_inicio: Date;
    modalidad: string;
  }>;
}

export async function getDashboardData(): Promise<DashboardData | null> {
  try {
    const session = await auth();
    
    if (!session || !session.user?.id) {
      return null;
    }
    
    const userId = session.user.id;
    
    // Obtener datos del estudiante
    const estudianteResult = await pool.query(
      `SELECT 
        nombre, apellido, foto_perfil, especialidad, nivel, puntos_xp
       FROM estudiantes 
       WHERE id_usuario = $1`,
      [userId]
    );
    
    if (estudianteResult.rows.length === 0) {
      return null;
    }
    
    const estudiante = estudianteResult.rows[0];
    const idEstudiante = estudiante.id_estudiante;
    
    // Estadísticas
    const statsResult = await pool.query(
      `SELECT 
        COUNT(DISTINCT i.id_inscripcion) as cursos_inscritos,
        COUNT(DISTINCT CASE WHEN i.estado_progreso = 'COMPLETADO' THEN i.id_curso END) as cursos_completados,
        COUNT(DISTINCT pl.id_leccion) as lecciones_completadas,
        COALESCE(SUM(EXTRACT(EPOCH FROM (pl.completado_en - pl.iniciado_en))/3600), 0) as horas_estudio
       FROM inscripciones i
       LEFT JOIN progreso_lecciones pl ON i.id_inscripcion = pl.id_inscripcion
       WHERE i.id_estudiante = $1`,
      [idEstudiante]
    );
    
    const stats = statsResult.rows[0];
    
    // Cursos inscritos con progreso
    const cursosResult = await pool.query(
      `SELECT 
        c.id_curso,
        c.titulo,
        c.descripcion,
        c.imagen_portada,
        ROUND((COUNT(DISTINCT pl.id_leccion)::numeric / 
               NULLIF(COUNT(DISTINCT l.id_leccion), 0) * 100), 0) as progreso,
        MAX(lec.titulo) as ultima_leccion
       FROM inscripciones i
       INNER JOIN cursos c ON i.id_curso = c.id_curso
       LEFT JOIN modulos m ON c.id_curso = m.id_curso
       LEFT JOIN lecciones l ON m.id_modulo = l.id_modulo
       LEFT JOIN progreso_lecciones pl ON l.id_leccion = pl.id_leccion AND pl.id_inscripcion = i.id_inscripcion AND pl.completado = true
       LEFT JOIN LATERAL (
         SELECT titulo 
         FROM lecciones lec2
         INNER JOIN modulos m2 ON lec2.id_modulo = m2.id_modulo
         WHERE m2.id_curso = c.id_curso
         ORDER BY lec2.creado_en DESC
         LIMIT 1
       ) lec ON true
       WHERE i.id_estudiante = $1 AND i.estado = 'ACTIVO'
       GROUP BY c.id_curso, c.titulo, c.descripcion, c.imagen_portada
       ORDER BY i.fecha_inscripcion DESC
       LIMIT 5`,
      [idEstudiante]
    );
    
    // Logros obtenidos
    const logrosResult = await pool.query(
      `SELECT 
        l.id_logro,
        l.nombre,
        l.descripcion,
        l.icono,
        le.fecha_obtenido
       FROM logros_estudiante le
       INNER JOIN logros l ON le.id_logro = l.id_logro
       WHERE le.id_estudiante = $1
       ORDER BY le.fecha_obtenido DESC
       LIMIT 5`,
      [idEstudiante]
    );
    
    // Próximos eventos
    const eventosResult = await pool.query(
      `SELECT 
        e.id_evento,
        e.nombre,
        e.descripcion,
        e.fecha_inicio,
        e.modalidad
       FROM eventos e
       LEFT JOIN inscripciones_evento ie ON e.id_evento = ie.id_evento AND ie.id_estudiante = $1
       WHERE e.fecha_inicio > CURRENT_TIMESTAMP
       AND (e.tipo_publico = 'PUBLICO' OR ie.id_inscripcion_evento IS NOT NULL)
       ORDER BY e.fecha_inicio ASC
       LIMIT 5`,
      [idEstudiante]
    );
    
    return {
      estudiante,
      estadisticas: {
        cursosInscritos: parseInt(stats.cursos_inscritos) || 0,
        cursosCompletados: parseInt(stats.cursos_completados) || 0,
        leccionesCompletadas: parseInt(stats.lecciones_completadas) || 0,
        horasEstudio: parseFloat(stats.horas_estudio) || 0,
      },
      cursos: cursosResult.rows.map(row => ({
        id_curso: row.id_curso,
        titulo: row.titulo,
        descripcion: row.descripcion,
        imagen_portada: row.imagen_portada,
        progreso: parseInt(row.progreso) || 0,
        ultimaLeccion: row.ultima_leccion,
      })),
      logros: logrosResult.rows,
      proximosEventos: eventosResult.rows,
    };
    
  } catch (error) {
    console.error("Error al obtener datos del dashboard:", error);
    return null;
  }
}
