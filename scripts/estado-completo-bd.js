require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function mostrarEstadoCompleto() {
  try {
    console.log('=== ESTADO COMPLETO DE LA BASE DE DATOS ===\n');
    
    // 1. Ver TODAS las tablas
    const tablasResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log('📋 TABLAS EN LA BASE DE DATOS:');
    tablasResult.rows.forEach((t, idx) => {
      console.log(`   ${idx + 1}. ${t.table_name}`);
    });
    
    // 2. Ver estructura de inscripciones
    console.log('\n📝 ESTRUCTURA DE LA TABLA inscripciones:');
    const estructuraInsc = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'inscripciones'
      ORDER BY ordinal_position
    `);
    estructuraInsc.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (Nullable: ${col.is_nullable})`);
    });
    
    // 3. INSCRIPCIONES actuales
    console.log('\n📊 INSCRIPCIONES ACTUALES:');
    const inscripciones = await pool.query(`
      SELECT 
        i.id_inscripcion,
        i.id_estudiante,
        i.id_curso,
        i.estado,
        i.progreso_general,
        i.fecha_inscripcion,
        c.nombre as curso_nombre,
        u.correo as estudiante_email
      FROM inscripciones i
      LEFT JOIN cursos c ON i.id_curso = c.id_curso
      LEFT JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
      LEFT JOIN usuarios u ON e.id_usuario = u.id_usuario
      ORDER BY i.fecha_inscripcion DESC
    `);
    
    console.log(`Total: ${inscripciones.rows.length} inscripciones\n`);
    
    if (inscripciones.rows.length === 0) {
      console.log('❌ NO HAY INSCRIPCIONES EN LA BASE DE DATOS\n');
    } else {
      inscripciones.rows.forEach((insc, idx) => {
        console.log(`${idx + 1}. ID: ${insc.id_inscripcion}`);
        console.log(`   Estudiante: ${insc.estudiante_email} (ID: ${insc.id_estudiante})`);
        console.log(`   Curso: ${insc.curso_nombre || 'N/A'} (ID: ${insc.id_curso})`);
        console.log(`   Estado: ${insc.estado}`);
        console.log(`   Progreso: ${insc.progreso_general}%`);
        console.log(`   Fecha: ${insc.fecha_inscripcion}`);
        console.log('');
      });
    }
    
    // 4. CURSOS disponibles
    console.log('\n📚 CURSOS DISPONIBLES:');
    const cursos = await pool.query(`
      SELECT id_curso, nombre, estado
      FROM cursos
      ORDER BY id_curso
    `);
    
    if (cursos.rows.length === 0) {
      console.log('❌ NO HAY CURSOS\n');
    } else {
      cursos.rows.forEach(c => {
        console.log(`   - ID ${c.id_curso}: ${c.nombre} (${c.estado})`);
      });
    }
    
    // 5. ESTUDIANTES registrados
    console.log('\n👨‍🎓 ESTUDIANTES REGISTRADOS:');
    const estudiantes = await pool.query(`
      SELECT e.id_estudiante, u.correo, u.rol
      FROM estudiantes e
      JOIN usuarios u ON e.id_usuario = u.id_usuario
      ORDER BY e.id_estudiante
    `);
    
    if (estudiantes.rows.length === 0) {
      console.log('❌ NO HAY ESTUDIANTES\n');
    } else {
      estudiantes.rows.forEach(est => {
        console.log(`   - ID ${est.id_estudiante}: ${est.correo}`);
      });
    }
    
    // 6. VERIFICAR CONSTRAINTS
    console.log('\n🔒 CONSTRAINTS DE LA TABLA inscripciones:');
    const constraints = await pool.query(`
      SELECT
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name = 'inscripciones'
      ORDER BY tc.constraint_type, tc.constraint_name
    `);
    
    constraints.rows.forEach(c => {
      console.log(`   - ${c.constraint_type}: ${c.constraint_name} (${c.column_name})`);
    });
    
    await pool.end();
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('Stack:', error.stack);
    await pool.end();
    process.exit(1);
  }
}

mostrarEstadoCompleto();
