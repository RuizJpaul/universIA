const { Pool } = require('pg')
require('dotenv').config({ path: '.env.local' })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

async function checkColumns() {
  const result = await pool.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name='cursos' 
    ORDER BY ordinal_position
  `)
  
  console.log('Columnas de la tabla cursos:')
  result.rows.forEach(row => console.log('  -', row.column_name))
  
  await pool.end()
}

checkColumns()
