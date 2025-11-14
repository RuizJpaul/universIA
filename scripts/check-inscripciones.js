require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function checkInscripciones() {
  try {
    console.log('Conectando a la base de datos...\n');
    
    // Verificar inscripciones
    const inscripcionesResult = await pool.query(`
      SELECT 
        i.id_inscripcion,
        i.id_estudiante,
        i.id_curso,
        c.nombre as curso,
        i.estado,
        i.progreso_general,
        i.fecha_inscripcion
      FROM inscripciones i
      JOIN cursos c ON i.id_curso = c.id_curso
      ORDER BY i.fecha_inscripcion DESC
      LIMIT 10
    `);
    
    console.log('=== INSCRIPCIONES EN LA BASE DE DATOS ===');
    console.log(`Total encontradas: ${inscripcionesResult.rows.length}\n`);
    
    if (inscripcionesResult.rows.length === 0) {
      console.log('❌ NO HAY INSCRIPCIONES EN LA BASE DE DATOS');
    } else {
      inscripcionesResult.rows.forEach((row, idx) => {
        console.log(`${idx + 1}. ID: ${row.id_inscripcion}`);
        console.log(`   Estudiante ID: ${row.id_estudiante}`);
        console.log(`   Curso ID: ${row.id_curso} - ${row.curso}`);
        console.log(`   Estado: ${row.estado}`);
        console.log(`   Progreso: ${row.progreso_general}%`);
        console.log(`   Fecha: ${row.fecha_inscripcion}`);
        console.log('');
      });
    }
    
    // Verificar estudiantes
    const estudiantesResult = await pool.query(`
      SELECT id_estudiante, id_usuario, nombre, apellido
      FROM estudiantes
      ORDER BY id_estudiante DESC
      LIMIT 5
    `);
    
    console.log('\n=== ESTUDIANTES ===');
    console.log(`Total: ${estudiantesResult.rows.length}\n`);
    estudiantesResult.rows.forEach(row => {
      console.log(`ID: ${row.id_estudiante}, Usuario ID: ${row.id_usuario}, Nombre: ${row.nombre || 'N/A'} ${row.apellido || ''}`);
    });
    
    // Verificar cursos
    const cursosResult = await pool.query(`
      SELECT id_curso, nombre, estado
      FROM cursos
      WHERE estado = 'PUBLICADO'
      ORDER BY id_curso
    `);
    
    console.log('\n=== CURSOS PUBLICADOS ===');
    console.log(`Total: ${cursosResult.rows.length}\n`);
    cursosResult.rows.forEach(row => {
      console.log(`ID: ${row.id_curso} - ${row.nombre}`);
    });
    
    await pool.end();
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

checkInscripciones();
