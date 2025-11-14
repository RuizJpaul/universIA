require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function testEndpointCursosPublicos() {
  try {
    console.log('=== SIMULANDO /api/cursos (cursos públicos) ===\n');
    
    const query = `
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
      GROUP BY c.id_curso, cat.nombre, cat.icono, t.nombre
      ORDER BY c.destacado DESC, c.calificacion_promedio DESC, c.creado_en DESC
    `;
    
    console.log('Ejecutando query...\n');
    const result = await pool.query(query);
    
    console.log(`Total cursos publicados: ${result.rows.length}\n`);
    
    if (result.rows.length === 0) {
      console.log('❌ NO HAY CURSOS PUBLICADOS');
    } else {
      console.log('✅ Cursos publicados:\n');
      result.rows.forEach((course, idx) => {
        console.log(`${idx + 1}. ${course.titulo}`);
        console.log(`   id_curso: ${course.id_curso}`);
        console.log(`   total_estudiantes: ${course.total_estudiantes}`);
        console.log('');
      });
      
      // Simular el mapeo del endpoint
      console.log('=== DATOS MAPEADOS (como el API /cursos los retorna) ===\n');
      const mappedCourses = result.rows.map(course => ({
        id: course.id_curso,
        title: course.titulo,
      }));
      
      console.log(JSON.stringify(mappedCourses, null, 2));
    }
    
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    await pool.end();
    process.exit(1);
  }
}

testEndpointCursosPublicos();
