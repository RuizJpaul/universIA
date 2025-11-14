require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function testEndpointCursos() {
  try {
    console.log('=== SIMULANDO /api/estudiante/cursos ===\n');
    
    const email = 'josegato170704@gmail.com';
    const studentId = 15;
    
    console.log(`Email: ${email}`);
    console.log(`Student ID: ${studentId}\n`);
    
    // Consulta que usa el endpoint
    const query = `
      SELECT 
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
        COUNT(DISTINCT CASE WHEN pl.completado THEN l.id_leccion END) as lecciones_completadas,
        COUNT(DISTINCT l.id_leccion) as total_lecciones
      FROM inscripciones i
      JOIN cursos c ON i.id_curso = c.id_curso
      LEFT JOIN modulos m ON c.id_curso = m.id_curso
      LEFT JOIN lecciones l ON m.id_modulo = l.id_modulo
      LEFT JOIN progreso_lecciones pl ON l.id_leccion = pl.id_leccion AND pl.id_inscripcion = i.id_inscripcion
      WHERE i.id_estudiante = $1 AND c.estado = 'PUBLICADO'
      GROUP BY c.id_curso, i.id_inscripcion
      ORDER BY i.fecha_inscripcion DESC
    `;
    
    console.log('Ejecutando query...\n');
    const result = await pool.query(query, [studentId]);
    
    console.log(`Total cursos inscritos: ${result.rows.length}\n`);
    
    if (result.rows.length === 0) {
      console.log('❌ NO SE ENCONTRARON CURSOS INSCRITOS');
    } else {
      console.log('✅ Cursos encontrados:\n');
      result.rows.forEach((course, idx) => {
        console.log(`${idx + 1}. ${course.titulo}`);
        console.log(`   id_curso: ${course.id_curso}`);
        console.log(`   id_inscripcion: ${course.id_inscripcion}`);
        console.log(`   estado: ${course.estado}`);
        console.log(`   progreso_general: ${course.progreso_general}`);
        console.log(`   total_modulos: ${course.total_modulos}`);
        console.log(`   total_lecciones: ${course.total_lecciones}`);
        console.log(`   lecciones_completadas: ${course.lecciones_completadas}`);
        console.log('');
      });
      
      // Simular el mapeo del endpoint
      console.log('=== DATOS MAPEADOS (como el API los retorna) ===\n');
      const mappedCourses = result.rows.map(course => ({
        id: course.id_curso,
        id_curso: course.id_curso,
        titulo: course.titulo,
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

testEndpointCursos();
