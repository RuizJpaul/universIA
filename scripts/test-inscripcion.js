require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function testInscripcion() {
  try {
    console.log('=== PRUEBA DE INSCRIPCIÓN ===\n');
    
    const email = 'josegato170704@gmail.com';
    const cursoId = 1;
    
    console.log(`Email: ${email}`);
    console.log(`Curso ID: ${cursoId}\n`);
    
    // 1. Buscar usuario
    console.log('1. Buscando usuario...');
    const usuarioResult = await pool.query(
      'SELECT id_usuario, correo, rol FROM usuarios WHERE correo = $1',
      [email]
    );
    
    if (usuarioResult.rows.length === 0) {
      console.log('❌ Usuario NO encontrado');
      await pool.end();
      return;
    }
    
    const usuario = usuarioResult.rows[0];
    console.log(`✅ Usuario encontrado:`, usuario);
    
    // 2. Buscar estudiante
    console.log('\n2. Buscando estudiante...');
    const estudianteResult = await pool.query(
      'SELECT id_estudiante, id_usuario FROM estudiantes WHERE id_usuario = $1',
      [usuario.id_usuario]
    );
    
    if (estudianteResult.rows.length === 0) {
      console.log('❌ Estudiante NO encontrado, creando...');
      
      const nuevoEstudiante = await pool.query(
        `INSERT INTO estudiantes (id_usuario, especialidad, puntos_xp, nivel)
         VALUES ($1, 'INGENIERIA_SISTEMAS', 0, 1)
         RETURNING id_estudiante`,
        [usuario.id_usuario]
      );
      
      console.log('✅ Estudiante creado:', nuevoEstudiante.rows[0]);
      var estudianteId = nuevoEstudiante.rows[0].id_estudiante;
    } else {
      console.log('✅ Estudiante encontrado:', estudianteResult.rows[0]);
      var estudianteId = estudianteResult.rows[0].id_estudiante;
    }
    
    // 3. Verificar si ya está inscrito
    console.log(`\n3. Verificando inscripción existente para estudiante ${estudianteId} y curso ${cursoId}...`);
    const inscripcionExistente = await pool.query(
      'SELECT * FROM inscripciones WHERE id_estudiante = $1 AND id_curso = $2',
      [estudianteId, cursoId]
    );
    
    if (inscripcionExistente.rows.length > 0) {
      console.log('⚠️  Ya está inscrito:', inscripcionExistente.rows[0]);
    } else {
      console.log('✅ No hay inscripción previa');
      
      // 4. Crear inscripción
      console.log('\n4. Creando nueva inscripción...');
      const nuevaInscripcion = await pool.query(
        `INSERT INTO inscripciones (
          id_estudiante,
          id_curso,
          estado,
          progreso_general
        ) VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [estudianteId, cursoId, 'EN_PROGRESO', 0]
      );
      
      console.log('✅ Inscripción creada exitosamente:', nuevaInscripcion.rows[0]);
    }
    
    // 5. Verificar todas las inscripciones del estudiante
    console.log(`\n5. Todas las inscripciones del estudiante ${estudianteId}:`);
    const todasInscripciones = await pool.query(
      `SELECT i.*, c.nombre as curso_nombre 
       FROM inscripciones i
       JOIN cursos c ON i.id_curso = c.id_curso
       WHERE i.id_estudiante = $1
       ORDER BY i.fecha_inscripcion DESC`,
      [estudianteId]
    );
    
    console.log(`Total: ${todasInscripciones.rows.length} inscripciones`);
    todasInscripciones.rows.forEach((insc, idx) => {
      console.log(`\n${idx + 1}. ${insc.curso_nombre}`);
      console.log(`   ID Inscripción: ${insc.id_inscripcion}`);
      console.log(`   Estado: ${insc.estado}`);
      console.log(`   Progreso: ${insc.progreso_general}%`);
      console.log(`   Fecha: ${insc.fecha_inscripcion}`);
    });
    
    await pool.end();
    console.log('\n✅ Prueba completada');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    await pool.end();
    process.exit(1);
  }
}

testInscripcion();
