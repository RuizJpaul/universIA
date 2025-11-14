require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

async function verificarEstructuraCursos() {
  console.log('\n=== ESTRUCTURA DE CURSOS, MÓDULOS Y LECCIONES ===\n')
  
  try {
    // Ver estructura de módulos
    const modulos = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns
      WHERE table_name = 'modulos'
      ORDER BY ordinal_position
    `)
    
    console.log('📦 Tabla MODULOS:')
    modulos.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`)
    })
    
    // Ver estructura de lecciones
    const lecciones = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns
      WHERE table_name = 'lecciones'
      ORDER BY ordinal_position
    `)
    
    console.log('\n📄 Tabla LECCIONES:')
    lecciones.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`)
    })
    
    // Ver un curso de ejemplo con sus módulos y lecciones
    console.log('\n\n=== EJEMPLO: Curso 1 ===\n')
    
    const ejemplo = await pool.query(`
      SELECT 
        c.nombre as curso,
        m.nombre as modulo,
        l.titulo as leccion,
        l.tipo,
        l.duracion_minutos
      FROM cursos c
      JOIN modulos m ON c.id_curso = m.id_curso
      JOIN lecciones l ON m.id_modulo = l.id_modulo
      WHERE c.id_curso = 1
      ORDER BY m.orden, l.orden
      LIMIT 10
    `)
    
    ejemplo.rows.forEach(row => {
      console.log(`📚 ${row.curso}`)
      console.log(`  └─ ${row.modulo}`)
      console.log(`     └─ ${row.leccion} (${row.tipo}, ${row.duracion_minutos} min)`)
      console.log('')
    })
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await pool.end()
  }
}

verificarEstructuraCursos()
