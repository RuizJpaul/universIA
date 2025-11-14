import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { Pool } from "pg";
import { getOrCreateStudentId } from "@/lib/get-student-id";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    // Obtener o crear ID del estudiante
    const studentId = await getOrCreateStudentId(pool, session.user.email);

    // Estadísticas generales
    const statsQuery = await pool.query(
      `SELECT 
        COUNT(DISTINCT i.id_curso) FILTER (WHERE i.estado = 'EN_PROGRESO') as cursos_activos,
        COUNT(DISTINCT i.id_curso) FILTER (WHERE i.estado = 'COMPLETADO') as cursos_completados,
        COALESCE(SUM(pl.tiempo_visto_minutos), 0) as total_minutos_estudio,
        COUNT(DISTINCT cert.id_certificado) as total_certificados,
        COUNT(DISTINCT le.id_logro_estudiante) as total_logros,
        MAX(pl.fecha_completado) as ultima_actividad
      FROM estudiantes e
      LEFT JOIN inscripciones i ON e.id_estudiante = i.id_estudiante
      LEFT JOIN progreso_lecciones pl ON i.id_inscripcion = pl.id_inscripcion
      LEFT JOIN certificados cert ON e.id_estudiante = cert.id_estudiante
      LEFT JOIN logros_estudiante le ON e.id_estudiante = le.id_estudiante
      WHERE e.id_estudiante = $1`,
      [studentId]
    );

    const stats = statsQuery.rows[0];

    // Cursos en progreso con próximas evaluaciones
    const coursesQuery = await pool.query(
      `SELECT 
        c.id_curso,
        c.nombre as titulo,
        c.imagen_portada as imagen_url,
        i.progreso_general,
        COUNT(DISTINCT ev.id_evaluacion) FILTER (
          WHERE ev.activo = true 
          AND NOT EXISTS (
            SELECT 1 FROM resultados_evaluaciones re 
            WHERE re.id_evaluacion = ev.id_evaluacion 
            AND re.id_estudiante = $1 
            AND re.aprobado = true
          )
        ) as evaluaciones_pendientes
      FROM inscripciones i
      JOIN cursos c ON i.id_curso = c.id_curso
      LEFT JOIN modulos m ON c.id_curso = m.id_curso
      LEFT JOIN lecciones l ON m.id_modulo = l.id_modulo
      LEFT JOIN evaluaciones ev ON l.id_leccion = ev.id_leccion
      WHERE i.id_estudiante = $1 AND i.estado = 'EN_PROGRESO'
      GROUP BY c.id_curso, i.id_inscripcion
      ORDER BY i.fecha_inscripcion DESC
      LIMIT 5`,
      [studentId]
    );

    // Próximas evaluaciones
    const evaluationsQuery = await pool.query(
      `SELECT 
        ev.id_evaluacion,
        ev.titulo,
        ev.tipo,
        ev.duracion_minutos,
        ev.nota_minima,
        c.nombre as curso_titulo,
        c.id_curso,
        l.titulo as leccion_titulo,
        COUNT(re.id_resultado) as intentos_realizados,
        ev.intentos_permitidos
      FROM evaluaciones ev
      JOIN lecciones l ON ev.id_leccion = l.id_leccion
      JOIN modulos m ON l.id_modulo = m.id_modulo
      JOIN cursos c ON m.id_curso = c.id_curso
      JOIN inscripciones i ON c.id_curso = i.id_curso AND i.id_estudiante = $1
      LEFT JOIN resultados_evaluaciones re ON ev.id_evaluacion = re.id_evaluacion 
        AND re.id_estudiante = $1
      WHERE ev.activo = true
        AND i.estado = 'EN_PROGRESO'
        AND NOT EXISTS (
          SELECT 1 FROM resultados_evaluaciones re2 
          WHERE re2.id_evaluacion = ev.id_evaluacion 
          AND re2.id_estudiante = $1 
          AND re2.aprobado = true
        )
      GROUP BY ev.id_evaluacion, c.id_curso, l.id_leccion
      HAVING COUNT(re.id_resultado) < ev.intentos_permitidos OR ev.intentos_permitidos IS NULL
      ORDER BY ev.duracion_minutos ASC
      LIMIT 5`,
      [studentId]
    );

    // Actividad reciente
    const activityQuery = await pool.query(
      `(
        SELECT 
          'lesson' as tipo,
          l.titulo as titulo,
          c.nombre as curso,
          pl.fecha_completado as fecha,
          pl.tiempo_visto_minutos as metadata
        FROM progreso_lecciones pl
        JOIN inscripciones i ON pl.id_inscripcion = i.id_inscripcion
        JOIN lecciones l ON pl.id_leccion = l.id_leccion
        JOIN modulos m ON l.id_modulo = m.id_modulo
        JOIN cursos c ON m.id_curso = c.id_curso
        WHERE i.id_estudiante = $1 AND pl.completado = true
        ORDER BY pl.fecha_completado DESC
        LIMIT 10
      )
      UNION ALL
      (
        SELECT 
          'evaluation' as tipo,
          ev.titulo as titulo,
          c.nombre as curso,
          re.fecha_realizacion as fecha,
          re.nota_obtenida as metadata
        FROM resultados_evaluaciones re
        JOIN evaluaciones ev ON re.id_evaluacion = ev.id_evaluacion
        JOIN lecciones l ON ev.id_leccion = l.id_leccion
        JOIN modulos m ON l.id_modulo = m.id_modulo
        JOIN cursos c ON m.id_curso = c.id_curso
        WHERE re.id_estudiante = $1
        ORDER BY re.fecha_realizacion DESC
        LIMIT 10
      )
      UNION ALL
      (
        SELECT 
          'achievement' as tipo,
          log.nombre as titulo,
          '' as curso,
          le.fecha_obtenido as fecha,
          log.puntos_xp as metadata
        FROM logros_estudiante le
        JOIN logros log ON le.id_logro = log.id_logro
        WHERE le.id_estudiante = $1
        ORDER BY le.fecha_obtenido DESC
        LIMIT 10
      )
      ORDER BY fecha DESC
      LIMIT 15`,
      [studentId]
    );

    // Progreso semanal (últimos 7 días)
    const weeklyProgressQuery = await pool.query(
      `SELECT 
        DATE(pl.fecha_completado) as fecha,
        COUNT(DISTINCT pl.id_leccion) as lecciones_completadas,
        SUM(pl.tiempo_visto_minutos) as minutos_estudiados
      FROM progreso_lecciones pl
      JOIN inscripciones i ON pl.id_inscripcion = i.id_inscripcion
      WHERE i.id_estudiante = $1
        AND pl.fecha_completado >= CURRENT_DATE - INTERVAL '7 days'
        AND pl.completado = true
      GROUP BY DATE(pl.fecha_completado)
      ORDER BY fecha ASC`,
      [studentId]
    );

    return NextResponse.json({
      success: true,
      stats: {
        activeCourses: parseInt(stats.cursos_activos) || 0,
        completedCourses: parseInt(stats.cursos_completados) || 0,
        totalHours: Math.round((parseInt(stats.total_minutos_estudio) || 0) / 60),
        certificates: parseInt(stats.total_certificados) || 0,
        achievements: parseInt(stats.total_logros) || 0,
        lastActivity: stats.ultima_actividad,
        streak: 0, // TODO: Implementar cálculo de racha
      },
      courses: coursesQuery.rows.map(c => ({
        id: c.id_curso,
        title: c.titulo,
        image: c.imagen_url,
        progress: parseFloat(c.progreso_general) || 0,
        pendingEvaluations: parseInt(c.evaluaciones_pendientes) || 0,
      })),
      upcomingEvaluations: evaluationsQuery.rows.map(ev => ({
        id: ev.id_evaluacion,
        title: ev.titulo,
        type: ev.tipo,
        duration: ev.duracion_minutos,
        minimumScore: parseFloat(ev.nota_minima),
        courseTitle: ev.curso_titulo,
        courseId: ev.id_curso,
        lessonTitle: ev.leccion_titulo,
        attempts: parseInt(ev.intentos_realizados) || 0,
        maxAttempts: ev.intentos_permitidos,
      })),
      recentActivity: activityQuery.rows.map(a => ({
        type: a.tipo,
        title: a.titulo,
        course: a.curso,
        date: a.fecha,
        metadata: a.metadata,
      })),
      weeklyProgress: weeklyProgressQuery.rows.map(w => ({
        date: w.fecha,
        lessonsCompleted: parseInt(w.lecciones_completadas) || 0,
        minutesStudied: parseInt(w.minutos_estudiados) || 0,
      })),
    });

  } catch (error: any) {
    console.error("Error obteniendo dashboard:", error);
    console.error("Stack trace:", error.stack);
    console.error("Error completo:", JSON.stringify(error, null, 2));
    
    return NextResponse.json(
      { 
        success: false,
        error: "Error al obtener datos del dashboard",
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
