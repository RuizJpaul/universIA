import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { Pool } from "pg";
import { getOrCreateStudentId } from "@/lib/get-student-id";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const courseId = params.id;

    // Obtener o crear ID del estudiante
    const studentId = await getOrCreateStudentId(pool, session.user.email);

    // Obtener datos del curso
    const courseQuery = await pool.query(
      `SELECT 
        c.*,
        i.progreso_general,
        i.estado as estado_inscripcion,
        i.fecha_inscripcion
      FROM cursos c
      LEFT JOIN inscripciones i ON c.id_curso = i.id_curso AND i.id_estudiante = $2
      WHERE c.id_curso = $1 AND c.activo = true`,
      [courseId, studentId]
    );

    if (courseQuery.rows.length === 0) {
      return NextResponse.json(
        { error: "Curso no encontrado" },
        { status: 404 }
      );
    }

    const course = courseQuery.rows[0];

    // Obtener módulos con lecciones
    const modulesQuery = await pool.query(
      `SELECT 
        m.id_modulo,
        m.titulo,
        m.descripcion,
        m.orden,
        m.duracion_estimada_horas,
        COUNT(l.id_leccion) as total_lecciones,
        COUNT(CASE WHEN pl.completado = true THEN 1 END) as lecciones_completadas
      FROM modulos m
      LEFT JOIN lecciones l ON m.id_modulo = l.id_modulo
      LEFT JOIN progreso_lecciones pl ON l.id_leccion = pl.id_leccion AND pl.id_inscripcion = (
        SELECT id_inscripcion FROM inscripciones WHERE id_estudiante = $2 AND id_curso = $1 LIMIT 1
      )
      WHERE m.id_curso = $1
      GROUP BY m.id_modulo
      ORDER BY m.orden ASC`,
      [courseId, studentId]
    );

    const modules = await Promise.all(
      modulesQuery.rows.map(async (module) => {
        // Obtener lecciones del módulo
        const lessonsQuery = await pool.query(
          `SELECT 
            l.id_leccion,
            l.titulo,
            l.tipo_contenido,
            l.duracion_minutos,
            l.orden,
            l.conceptos_clave,
            pl.completado,
            pl.tiempo_visto_minutos
          FROM lecciones l
          LEFT JOIN progreso_lecciones pl ON l.id_leccion = pl.id_leccion AND pl.id_inscripcion = (
            SELECT id_inscripcion FROM inscripciones 
            WHERE id_estudiante = $2 AND id_curso = (
              SELECT id_curso FROM modulos WHERE id_modulo = $1 LIMIT 1
            ) LIMIT 1
          )
          WHERE l.id_modulo = $1
          ORDER BY l.orden ASC`,
          [module.id_modulo, studentId]
        );

        const totalLessons = parseInt(module.total_lecciones) || 0;
        const completedLessons = parseInt(module.lecciones_completadas) || 0;
        const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        return {
          id: module.id_modulo,
          title: module.titulo,
          description: module.descripcion,
          order: module.orden,
          duration: module.duracion_estimada_horas,
          progress,
          topics: lessonsQuery.rows.map(l => l.titulo),
          lessons: lessonsQuery.rows.map(l => ({
            id: l.id_leccion,
            title: l.titulo,
            type: l.tipo_contenido,
            duration: l.duracion_minutos,
            order: l.orden,
            concepts: l.conceptos_clave || [],
            completed: l.completado || false,
            timeSpent: l.tiempo_visto_minutos || 0,
          })),
        };
      })
    );

    // Obtener laboratorios del curso
    const labsQuery = await pool.query(
      `SELECT 
        lab.id_laboratorio,
        lab.titulo,
        lab.descripcion,
        lab.plataforma,
        lab.url_laboratorio,
        lab.template_url,
        lab.instrucciones,
        lab.objetivos,
        l.titulo as leccion_titulo,
        sl.completado,
        sl.fecha_inicio as ultima_sesion
      FROM laboratorios lab
      JOIN lecciones l ON lab.id_leccion = l.id_leccion
      JOIN modulos m ON l.id_modulo = m.id_modulo
      LEFT JOIN sesiones_laboratorio sl ON lab.id_laboratorio = sl.id_laboratorio 
        AND sl.id_estudiante = $2
        AND sl.fecha_inicio = (
          SELECT MAX(fecha_inicio) 
          FROM sesiones_laboratorio 
          WHERE id_laboratorio = lab.id_laboratorio 
            AND id_estudiante = $2
        )
      WHERE m.id_curso = $1 AND lab.activo = true
      ORDER BY l.orden ASC`,
      [courseId, studentId]
    );

    const labs = labsQuery.rows.map(lab => ({
      id: lab.id_laboratorio,
      name: lab.titulo,
      description: lab.descripcion,
      platform: lab.plataforma,
      url: lab.url_laboratorio,
      templateUrl: lab.template_url,
      instructions: lab.instrucciones,
      objectives: lab.objetivos || [],
      lessonTitle: lab.leccion_titulo,
      completed: lab.completado || false,
      lastSession: lab.ultima_sesion,
      status: lab.completado ? 'completed' : 'available',
    }));

    // Calcular progreso general
    const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
    const completedLessons = modules.reduce(
      (sum, m) => sum + (m.lessons?.filter(l => l.completed).length || 0), 
      0
    );
    const calculatedProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return NextResponse.json({
      success: true,
      course: {
        id: course.id_curso,
        title: course.titulo,
        description: course.descripcion,
        level: course.nivel,
        duration: course.duracion_estimada_horas,
        rating: parseFloat(course.calificacion_promedio) || 0,
        image: course.imagen_url,
        tags: course.tags || [],
        objectives: course.objetivos || [],
        requirements: course.requisitos || [],
        progress: course.progreso_general || calculatedProgress,
        enrollmentStatus: course.estado_inscripcion,
        enrolledAt: course.fecha_inscripcion,
        modules,
        labs,
      },
    });

  } catch (error: any) {
    console.error("Error obteniendo curso:", error);
    
    return NextResponse.json(
      { error: "Error al obtener curso" },
      { status: 500 }
    );
  }
}
