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

    // Obtener logros del estudiante
    const achievementsQuery = await pool.query(
      `SELECT 
        log.id_logro,
        log.nombre,
        log.descripcion,
        log.icono,
        log.puntos_xp,
        le.fecha_obtenido,
        CASE WHEN le.id_logro_estudiante IS NOT NULL THEN true ELSE false END as obtenido
      FROM logros log
      LEFT JOIN logros_estudiante le ON log.id_logro = le.id_logro AND le.id_estudiante = $1
      ORDER BY le.fecha_obtenido DESC NULLS LAST, log.puntos_xp DESC`,
      [studentId]
    );

    // Obtener certificados
    const certificatesQuery = await pool.query(
      `SELECT 
        cert.id_certificado,
        cert.codigo_verificacion,
        cert.nota_final,
        cert.fecha_emision,
        cert.url_pdf,
        c.nombre as curso_titulo,
        c.imagen_url as curso_imagen
      FROM certificados cert
      JOIN cursos c ON cert.id_curso = c.id_curso
      WHERE cert.id_estudiante = $1
      ORDER BY cert.fecha_emision DESC`,
      [studentId]
    );

    // Progreso mensual (últimos 6 meses)
    const monthlyProgressQuery = await pool.query(
      `SELECT 
        TO_CHAR(fecha, 'Mon') as mes,
        EXTRACT(MONTH FROM fecha) as mes_num,
        lecciones_completadas,
        horas_estudiadas
      FROM (
        SELECT 
          DATE_TRUNC('month', pl.fecha_completado) as fecha,
          COUNT(DISTINCT pl.id_leccion) as lecciones_completadas,
          ROUND(SUM(pl.tiempo_visto_minutos) / 60.0, 1) as horas_estudiadas
        FROM progreso_lecciones pl
        JOIN inscripciones i ON pl.id_inscripcion = i.id_inscripcion
        WHERE i.id_estudiante = $1
          AND pl.fecha_completado >= CURRENT_DATE - INTERVAL '6 months'
          AND pl.completado = true
        GROUP BY DATE_TRUNC('month', pl.fecha_completado)
      ) monthly
      ORDER BY fecha ASC`,
      [studentId]
    );

    // Actividad de aprendizaje detallada
    const learningActivityQuery = await pool.query(
      `SELECT 
        c.nombre as curso,
        c.imagen_portada as curso_imagen,
        COUNT(DISTINCT CASE WHEN pl.completado = true THEN l.id_leccion END) as lecciones_completadas,
        COUNT(DISTINCT l.id_leccion) as total_lecciones,
        ROUND(AVG(CASE WHEN re.aprobado = true THEN re.nota_obtenida END), 1) as promedio_evaluaciones,
        MAX(pl.fecha_completado) as ultima_actividad
      FROM inscripciones i
      JOIN cursos c ON i.id_curso = c.id_curso
      LEFT JOIN modulos m ON c.id_curso = m.id_curso
      LEFT JOIN lecciones l ON m.id_modulo = l.id_modulo
      LEFT JOIN progreso_lecciones pl ON l.id_leccion = pl.id_leccion AND pl.id_inscripcion = i.id_inscripcion
      LEFT JOIN evaluaciones ev ON l.id_leccion = ev.id_leccion
      LEFT JOIN resultados_evaluaciones re ON ev.id_evaluacion = re.id_evaluacion AND re.id_estudiante = i.id_estudiante
      WHERE i.id_estudiante = $1
      GROUP BY c.id_curso
      HAVING MAX(pl.fecha_completado) IS NOT NULL
      ORDER BY ultima_actividad DESC
      LIMIT 10`,
      [studentId]
    );

    // Estadísticas globales
    const globalStatsQuery = await pool.query(
      `SELECT 
        COUNT(DISTINCT i.id_curso) as total_cursos_inscritos,
        COUNT(DISTINCT CASE WHEN i.estado = 'COMPLETADO' THEN i.id_curso END) as cursos_completados,
        COALESCE(SUM(pl.tiempo_visto_minutos), 0) as total_minutos,
        COUNT(DISTINCT pl.id_leccion) FILTER (WHERE pl.completado = true) as total_lecciones_completadas,
        COUNT(DISTINCT re.id_resultado) FILTER (WHERE re.aprobado = true) as evaluaciones_aprobadas,
        COUNT(DISTINCT cert.id_certificado) as total_certificados,
        COUNT(DISTINCT le.id_logro_estudiante) as total_logros_obtenidos,
        (SELECT COUNT(*) FROM logros) as total_logros_disponibles
      FROM estudiantes e
      LEFT JOIN inscripciones i ON e.id_estudiante = i.id_estudiante
      LEFT JOIN progreso_lecciones pl ON i.id_inscripcion = pl.id_inscripcion
      LEFT JOIN resultados_evaluaciones re ON e.id_estudiante = re.id_estudiante
      LEFT JOIN certificados cert ON e.id_estudiante = cert.id_estudiante
      LEFT JOIN logros_estudiante le ON e.id_estudiante = le.id_estudiante
      WHERE e.id_estudiante = $1`,
      [studentId]
    );

    const globalStats = globalStatsQuery.rows[0];

    return NextResponse.json({
      success: true,
      achievements: achievementsQuery.rows.map(a => ({
        id: a.id_logro,
        name: a.nombre,
        description: a.descripcion,
        icon: a.icono,
        points: a.puntos_xp,
        earnedAt: a.fecha_obtenido,
        earned: a.obtenido,
      })),
      certificates: certificatesQuery.rows.map(c => ({
        id: c.id_certificado,
        verificationCode: c.codigo_verificacion,
        finalGrade: parseFloat(c.nota_final),
        issuedAt: c.fecha_emision,
        pdfUrl: c.url_pdf,
        courseTitle: c.curso_titulo,
        courseImage: c.curso_imagen,
      })),
      monthlyProgress: monthlyProgressQuery.rows.map(m => ({
        month: m.mes,
        monthNumber: parseInt(m.mes_num),
        lessonsCompleted: parseInt(m.lecciones_completadas),
        hoursStudied: parseFloat(m.horas_estudiadas),
      })),
      learningActivity: learningActivityQuery.rows.map(la => ({
        course: la.curso,
        courseImage: la.curso_imagen,
        lessonsCompleted: parseInt(la.lecciones_completadas),
        totalLessons: parseInt(la.total_lecciones),
        averageGrade: parseFloat(la.promedio_evaluaciones) || null,
        lastActivity: la.ultima_actividad,
        progress: parseInt(la.total_lecciones) > 0 
          ? Math.round((parseInt(la.lecciones_completadas) / parseInt(la.total_lecciones)) * 100)
          : 0,
      })),
      globalStats: {
        totalCoursesEnrolled: parseInt(globalStats.total_cursos_inscritos) || 0,
        coursesCompleted: parseInt(globalStats.cursos_completados) || 0,
        totalHours: Math.round((parseInt(globalStats.total_minutos) || 0) / 60),
        totalLessonsCompleted: parseInt(globalStats.total_lecciones_completadas) || 0,
        evaluationsPassed: parseInt(globalStats.evaluaciones_aprobadas) || 0,
        certificates: parseInt(globalStats.total_certificados) || 0,
        achievementsEarned: parseInt(globalStats.total_logros_obtenidos) || 0,
        achievementsTotal: parseInt(globalStats.total_logros_disponibles) || 0,
      },
    });

  } catch (error: any) {
    console.error("Error obteniendo progreso:", error);
    
    return NextResponse.json(
      { error: "Error al obtener progreso" },
      { status: 500 }
    );
  }
}
