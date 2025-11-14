import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(request: NextRequest) {
  try {
    console.log('[API /api/cursos] Iniciando petición...');
    
    // Obtener parámetros de búsqueda
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const level = searchParams.get('level') || 'all';
    const categoryId = searchParams.get('categoryId');
    
    console.log('[API /api/cursos] Parámetros:', { search, level, categoryId });

    // Construir query base
    let query = `
      SELECT 
        c.id_curso,
        c.nombre as titulo,
        c.descripcion,
        c.nivel,
        c.duracion_horas as duracion_estimada_horas,
        c.calificacion_promedio,
        c.imagen_portada as imagen_url,
        c.precio_base as precio,
        c.tags,
        c.objetivos,
        c.requisitos,
        c.destacado,
        cat.nombre as categoria,
        cat.icono as categoria_icono,
        t.nombre as tutor_nombre,
        COUNT(DISTINCT i.id_inscripcion) as total_estudiantes,
        COUNT(DISTINCT m.id_modulo) as total_modulos,
        COUNT(DISTINCT l.id_leccion) as total_lecciones
      FROM cursos c
      LEFT JOIN categorias_curso cat ON c.id_categoria = cat.id_categoria
      LEFT JOIN tutores_ia t ON c.id_tutor = t.id_tutor
      LEFT JOIN inscripciones i ON c.id_curso = i.id_curso
      LEFT JOIN modulos m ON c.id_curso = m.id_curso
      LEFT JOIN lecciones l ON m.id_modulo = l.id_modulo
      WHERE c.estado = 'PUBLICADO'
    `;

    const params: any[] = [];
    let paramCount = 1;

    // Filtro por búsqueda
    if (search) {
      query += ` AND (c.nombre ILIKE $${paramCount} OR c.descripcion ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    // Filtro por nivel
    if (level && level !== 'all') {
      query += ` AND c.nivel = $${paramCount}`;
      params.push(level.toUpperCase());
      paramCount++;
    }

    // Filtro por categoría
    if (categoryId) {
      query += ` AND c.id_categoria = $${paramCount}`;
      params.push(categoryId);
      paramCount++;
    }

    query += `
      GROUP BY c.id_curso, cat.nombre, cat.icono, t.nombre
      ORDER BY c.destacado DESC, c.calificacion_promedio DESC, c.creado_en DESC
    `;

    console.log('[API /api/cursos] Ejecutando query con', params.length, 'parámetros');
    const result = await pool.query(query, params);
    console.log('[API /api/cursos] Resultados obtenidos:', result.rows.length, 'cursos');

    const courses = result.rows.map(course => ({
      id: course.id_curso,
      title: course.titulo,
      description: course.descripcion,
      level: course.nivel,
      duration: course.duracion_estimada_horas,
      rating: parseFloat(course.calificacion_promedio) || 0,
      image: course.imagen_url || '/placeholder-course.jpg',
      price: course.precio,
      tags: course.tags || [],
      objectives: course.objetivos || [],
      requirements: course.requisitos || [],
      featured: course.destacado || false,
      category: course.categoria,
      categoryIcon: course.categoria_icono,
      instructor: course.tutor_nombre,
      students: parseInt(course.total_estudiantes) || 0,
      modules: parseInt(course.total_modulos) || 0,
      totalLessons: parseInt(course.total_lecciones) || 0,
    }));

    return NextResponse.json({
      success: true,
      courses,
      total: courses.length,
    });

  } catch (error: any) {
    console.error("[API /api/cursos] Error detallado:", error);
    console.error("[API /api/cursos] Stack:", error.stack);
    
    return NextResponse.json(
      { error: "Error al obtener cursos", details: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
