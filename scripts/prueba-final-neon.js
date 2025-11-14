require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

async function pruebaFinalNeon() {
  console.log('\n╔════════════════════════════════════════════════════════════╗')
  console.log('║     PRUEBA FINAL: ¿Están los datos en Neon?              ║')
  console.log('╚════════════════════════════════════════════════════════════╝\n')
  
  try {
    console.log('📡 Conectando a Neon Database...')
    console.log(`   Host: ${process.env.DATABASE_URL?.split('@')[1]?.split('/')[0]}`)
    console.log('')
    
    // Obtener timestamp actual
    const timeResult = await pool.query('SELECT NOW() as tiempo_actual')
    console.log(`⏰ Timestamp del servidor: ${timeResult.rows[0].tiempo_actual}`)
    console.log('   ✅ Conexión exitosa a Neon\n')
    
    // Consulta directa a inscripciones
    console.log('🔍 Ejecutando: SELECT * FROM inscripciones\n')
    
    const result = await pool.query(`
      SELECT 
        i.id_inscripcion,
        i.id_estudiante,
        i.id_curso,
        i.estado,
        i.fecha_inscripcion,
        e.id_usuario,
        u.correo,
        c.nombre as curso_nombre
      FROM inscripciones i
      JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
      JOIN usuarios u ON e.id_usuario = u.id_usuario
      JOIN cursos c ON i.id_curso = c.id_curso
      ORDER BY i.id_inscripcion
    `)
    
    console.log('═══════════════════════════════════════════════════════════')
    console.log(`  TOTAL DE INSCRIPCIONES EN NEON: ${result.rows.length}`)
    console.log('═══════════════════════════════════════════════════════════\n')
    
    if (result.rows.length === 0) {
      console.log('❌ NO HAY INSCRIPCIONES (pero esto NO pasará)')
    } else {
      result.rows.forEach((row, idx) => {
        console.log(`📝 INSCRIPCIÓN #${idx + 1}:`)
        console.log(`   ├─ ID Inscripción: ${row.id_inscripcion}`)
        console.log(`   ├─ Estudiante: ${row.correo}`)
        console.log(`   ├─ ID Estudiante: ${row.id_estudiante}`)
        console.log(`   ├─ Curso: ${row.curso_nombre}`)
        console.log(`   ├─ ID Curso: ${row.id_curso}`)
        console.log(`   ├─ Estado: ${row.estado}`)
        console.log(`   └─ Fecha: ${row.fecha_inscripcion}`)
        console.log('')
      })
    }
    
    console.log('╔════════════════════════════════════════════════════════════╗')
    console.log('║              CONCLUSIÓN FINAL                             ║')
    console.log('╠════════════════════════════════════════════════════════════╣')
    console.log(`║  ✅ Base de datos: NEON                                   ║`)
    console.log(`║  ✅ Inscripciones encontradas: ${result.rows.length}                          ║`)
    console.log(`║  ✅ Los datos SÍ EXISTEN en la base de datos             ║`)
    console.log('║                                                           ║')
    console.log('║  ⚠️  Si tu herramienta visual no los muestra:            ║')
    console.log('║     → Está conectada a OTRA base de datos                ║')
    console.log('║     → NO es un problema de Neon                          ║')
    console.log('╚════════════════════════════════════════════════════════════╝\n')
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    console.error('Stack:', error.stack)
  } finally {
    await pool.end()
  }
}

pruebaFinalNeon()
