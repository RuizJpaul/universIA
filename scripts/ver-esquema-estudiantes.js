require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

async function verificarEsquema() {
  console.log('\n=== ESTRUCTURA DE LA TABLA estudiantes ===\n')
  
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, character_maximum_length, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'estudiantes'
      ORDER BY ordinal_position
    `)
    
    console.log('Columnas de la tabla estudiantes:\n')
    result.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type}${col.character_maximum_length ? `(${col.character_maximum_length})` : ''}) ${col.is_nullable === 'NO' ? '- NOT NULL' : '- nullable'}`)
    })
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await pool.end()
  }
}

verificarEsquema()
