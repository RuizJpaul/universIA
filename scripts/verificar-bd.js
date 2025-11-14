require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function verificarBaseDatos() {
  try {
    console.log('=== VERIFICACIÓN DE BASE DE DATOS ===\n');
    console.log('Connection String:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':****@'));
    
    // Verificar cursos
    const cursosResult = await pool.query('SELECT COUNT(*) as total FROM cursos');
    console.log(`\n📚 Total CURSOS: ${cursosResult.rows[0].total}`);
    
    if (cursosResult.rows[0].total > 0) {
      const cursos = await pool.query('SELECT id_curso, nombre, estado FROM cursos LIMIT 5');
      cursos.rows.forEach(c => {
        console.log(`   - ID ${c.id_curso}: ${c.nombre} (${c.estado})`);
      });
    }
    
    // Verificar estudiantes
    const estudiantesResult = await pool.query('SELECT COUNT(*) as total FROM estudiantes');
    console.log(`\n👨‍🎓 Total ESTUDIANTES: ${estudiantesResult.rows[0].total}`);
    
    if (estudiantesResult.rows[0].total > 0) {
      const estudiantes = await pool.query(`
        SELECT e.id_estudiante, u.correo 
        FROM estudiantes e
        JOIN usuarios u ON e.id_usuario = u.id_usuario
        LIMIT 5
      `);
      estudiantes.rows.forEach(e => {
        console.log(`   - ID ${e.id_estudiante}: ${e.correo}`);
      });
    }
    
    // Verificar inscripciones
    const inscripcionesResult = await pool.query('SELECT COUNT(*) as total FROM inscripciones');
    console.log(`\n📝 Total INSCRIPCIONES: ${inscripcionesResult.rows[0].total}`);
    
    if (inscripcionesResult.rows[0].total > 0) {
      const inscripciones = await pool.query(`
        SELECT i.id_inscripcion, i.id_estudiante, i.id_curso, c.nombre
        FROM inscripciones i
        LEFT JOIN cursos c ON i.id_curso = c.id_curso
        LIMIT 5
      `);
      inscripciones.rows.forEach(i => {
        console.log(`   - Inscripción ${i.id_inscripcion}: Estudiante ${i.id_estudiante} → Curso ${i.id_curso} (${i.nombre || 'CURSO NO EXISTE'})`);
      });
    }
    
    // Verificar módulos
    const modulosResult = await pool.query('SELECT COUNT(*) as total FROM modulos');
    console.log(`\n📖 Total MÓDULOS: ${modulosResult.rows[0].total}`);
    
    // Verificar lecciones
    const leccionesResult = await pool.query('SELECT COUNT(*) as total FROM lecciones');
    console.log(`\n📄 Total LECCIONES: ${leccionesResult.rows[0].total}`);
    
    console.log('\n=== RESUMEN ===');
    if (cursosResult.rows[0].total === '0') {
      console.log('❌ NO HAY CURSOS - La base de datos está vacía');
      console.log('📌 Necesitas ejecutar el script de seed para crear cursos');
    } else {
      console.log('✅ Base de datos tiene datos');
    }
    
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

verificarBaseDatos();
