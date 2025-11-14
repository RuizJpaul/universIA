require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function verificarTodosPorEmail() {
  try {
    console.log('=== VERIFICACIÓN COMPLETA POR EMAIL ===\n');
    
    // Listar todos los usuarios estudiantes
    const usuariosResult = await pool.query(`
      SELECT u.id_usuario, u.correo, u.rol, e.id_estudiante
      FROM usuarios u
      LEFT JOIN estudiantes e ON u.id_usuario = e.id_usuario
      WHERE u.rol = 'ESTUDIANTE'
      ORDER BY u.creado_en DESC
      LIMIT 10
    `);
    
    console.log('USUARIOS ESTUDIANTES:\n');
    usuariosResult.rows.forEach((usuario, idx) => {
      console.log(`${idx + 1}. Email: ${usuario.correo}`);
      console.log(`   Usuario ID: ${usuario.id_usuario}`);
      console.log(`   Estudiante ID: ${usuario.id_estudiante || 'NO TIENE'}`);
      console.log('');
    });
    
    // Para cada estudiante, mostrar sus inscripciones
    console.log('\n=== INSCRIPCIONES POR ESTUDIANTE ===\n');
    
    for (const usuario of usuariosResult.rows) {
      if (usuario.id_estudiante) {
        const inscripciones = await pool.query(`
          SELECT i.*, c.nombre as curso_nombre
          FROM inscripciones i
          JOIN cursos c ON i.id_curso = c.id_curso
          WHERE i.id_estudiante = $1
          ORDER BY i.fecha_inscripcion DESC
        `, [usuario.id_estudiante]);
        
        console.log(`📧 ${usuario.correo} (Estudiante ID: ${usuario.id_estudiante})`);
        
        if (inscripciones.rows.length === 0) {
          console.log('   ❌ NO tiene inscripciones\n');
        } else {
          console.log(`   ✅ Tiene ${inscripciones.rows.length} inscripción(es):`);
          inscripciones.rows.forEach((insc, idx) => {
            console.log(`   ${idx + 1}. ${insc.curso_nombre}`);
            console.log(`      ID Inscripción: ${insc.id_inscripcion}`);
            console.log(`      Curso ID: ${insc.id_curso}`);
            console.log(`      Estado: ${insc.estado}`);
            console.log(`      Fecha: ${insc.fecha_inscripcion}`);
          });
          console.log('');
        }
      }
    }
    
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

verificarTodosPorEmail();
