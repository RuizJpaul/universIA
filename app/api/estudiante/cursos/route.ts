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
    
    console.log('[API /estudiante/cursos] Sesión:', session?.user?.email);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    // Obtener o crear ID del estudiante
    const studentId = await getOrCreateStudentId(pool, session.user.email);
    
    console.log('[API /estudiante/cursos] Student ID:', studentId);

    // Obtener cursos inscritos del estudiante
    const coursesQuery = await pool.query(
      `SELECT 
        c.id_curso,
        c.nombre as titulo,
        c.descripcion,
        c.nivel,
        c.duracion_horas as duracion_estimada_horas,
        c.calificacion_promedio,
        c.imagen_portada as imagen_url,
        c.tags,
        i.id_inscripcion,
        i.estado,
        i.progreso_general,
        i.fecha_inscripcion,
        i.fecha_completado,
        COUNT(DISTINCT m.id_modulo) as total_modulos,
        COUNT(DISTINCT CASE WHEN pl.completado = true THEN l.id_leccion END) as lecciones_completadas,
        COUNT(DISTINCT l.id_leccion) as total_lecciones
      FROM inscripciones i
      JOIN cursos c ON i.id_curso = c.id_curso
      LEFT JOIN modulos m ON c.id_curso = m.id_curso
      LEFT JOIN lecciones l ON m.id_modulo = l.id_modulo
      LEFT JOIN progreso_lecciones pl ON l.id_leccion = pl.id_leccion AND pl.id_inscripcion = i.id_inscripcion
      WHERE i.id_estudiante = $1 AND c.estado = 'PUBLICADO'
      GROUP BY c.id_curso, i.id_inscripcion
      ORDER BY i.fecha_inscripcion DESC`,
      [studentId]
    )
    
    console.log('[API /estudiante/cursos] Cursos encontrados:', coursesQuery.rows.length);
    console.log('[API /estudiante/cursos] Cursos raw:', coursesQuery.rows);

    const courses = coursesQuery.rows.map(course => ({
      id: course.id_curso,
      id_curso: course.id_curso,
      titulo: course.titulo,
      descripcion: course.descripcion,
      nivel: course.nivel,
      duracion: course.duracion_estimada_horas,
      calificacion_promedio: parseFloat(course.calificacion_promedio) || 0,
      imagen_url: course.imagen_url || '/placeholder-course.jpg',
      tags: course.tags || [],
      estado: course.estado,
      progreso_general: parseFloat(course.progreso_general) || 0,
      fecha_inscripcion: course.fecha_inscripcion,
      fecha_completado: course.fecha_completado,
      total_modulos: parseInt(course.total_modulos) || 0,
      lecciones_completadas: parseInt(course.lecciones_completadas) || 0,
      total_lecciones: parseInt(course.total_lecciones) || 0,
    }));
    
    console.log('[API /estudiante/cursos] Cursos mapeados:', courses.map(c => ({ id: c.id, id_curso: c.id_curso, titulo: c.titulo })));

    return NextResponse.json({
      success: true,
      courses,
    });

  } catch (error: any) {
    console.error("Error obteniendo cursos:", error);
    
    return NextResponse.json(
      { error: "Error al obtener cursos" },
      { status: 500 }
    );
  }
}
