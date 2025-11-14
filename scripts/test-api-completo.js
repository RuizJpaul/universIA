require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

async function testApiFlow() {
  console.log('\n=== TEST COMPLETO: Flujo del API ===\n')
  
  try {
    // Probar todos los usuarios registrados
    const usuarios = await pool.query(
      `SELECT u.id_usuario, u.correo, u.rol, e.id_estudiante 
       FROM usuarios u 
       LEFT JOIN estudiantes e ON u.id_usuario = e.id_usuario 
       ORDER BY u.correo`
    )
    
    console.log(`📋 Total usuarios registrados: ${usuarios.rows.length}\n`)
    
    for (const user of usuarios.rows) {
      console.log(`\n${'='.repeat(60)}`)
      console.log(`👤 Usuario: ${user.correo}`)
      console.log(`   Rol: ${user.rol}`)
      console.log(`   ID Estudiante: ${user.id_estudiante || 'No registrado'}`)
      
      if (user.id_estudiante) {
        // Contar inscripciones
        const inscripciones = await pool.query(
          `SELECT i.id_inscripcion, i.id_curso, c.nombre, c.estado as estado_curso, i.estado as estado_inscripcion
           FROM inscripciones i
           JOIN cursos c ON i.id_curso = c.id_curso
           WHERE i.id_estudiante = $1
           ORDER BY i.fecha_inscripcion DESC`,
          [user.id_estudiante]
        )
        
        console.log(`   📚 Cursos inscritos: ${inscripciones.rows.length}`)
        
        if (inscripciones.rows.length > 0) {
          inscripciones.rows.forEach((insc, idx) => {
            console.log(`      ${idx + 1}. [ID:${insc.id_curso}] ${insc.nombre}`)
            console.log(`         Estado curso: ${insc.estado_curso}`)
            console.log(`         Estado inscripción: ${insc.estado_inscripcion}`)
          })
        }
        
        // Probar endpoint exacto
        const endpointResult = await pool.query(
          `SELECT 
            c.id_curso,
            c.nombre as titulo,
            c.estado,
            i.id_inscripcion,
            i.estado as estado_inscripcion
          FROM inscripciones i
          JOIN cursos c ON i.id_curso = c.id_curso
          WHERE i.id_estudiante = $1 AND c.estado = 'PUBLICADO'
          GROUP BY c.id_curso, i.id_inscripcion
          ORDER BY i.fecha_inscripcion DESC`,
          [user.id_estudiante]
        )
        
        console.log(`   🔍 Endpoint /api/estudiante/cursos devolvería: ${endpointResult.rows.length} cursos`)
        
        if (endpointResult.rows.length !== inscripciones.rows.length) {
          console.log(`   ⚠️ DIFERENCIA DETECTADA:`)
          console.log(`      - Inscripciones totales: ${inscripciones.rows.length}`)
          console.log(`      - Endpoint devuelve: ${endpointResult.rows.length}`)
          console.log(`      - Posible causa: Cursos no PUBLICADOS`)
        }
      }
    }
    
    console.log(`\n${'='.repeat(60)}\n`)
    
    // Verificar estado de todos los cursos
    console.log('📊 ESTADO DE TODOS LOS CURSOS:\n')
    const cursos = await pool.query(
      'SELECT id_curso, nombre, estado FROM cursos ORDER BY id_curso'
    )
    
    cursos.rows.forEach(curso => {
      const icon = curso.estado === 'PUBLICADO' ? '✅' : '❌'
      console.log(`${icon} [ID:${curso.id_curso}] ${curso.nombre} - Estado: ${curso.estado}`)
    })
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
  } finally {
    await pool.end()
  }
}

testApiFlow()
