const { Pool } = require('pg')
require('dotenv').config({ path: '.env.local' })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

async function verCursos() {
  try {
    const result = await pool.query('SELECT id_curso, nombre FROM cursos ORDER BY id_curso')
    console.log('\n📚 Cursos existentes:\n')
    if (result.rows.length === 0) {
      console.log('  ❌ No hay cursos en la base de datos\n')
    } else {
      result.rows.forEach(c => {
        console.log(`  ID ${c.id_curso}: ${c.nombre}`)
      })
      console.log()
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await pool.end()
  }
}

verCursos()
