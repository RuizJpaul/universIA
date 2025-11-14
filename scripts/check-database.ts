import { Pool } from 'pg';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function checkDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL no está definida en .env.local');
    process.exit(1);
  }
  
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('Conectando a la base de datos Neon...\n');
    
    const client = await pool.connect();
    console.log('✓ Conexión establecida\n');

    // Verificar tablas
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`📊 Tablas existentes (${tablesResult.rows.length}):`);
    tablesResult.rows.forEach((row: any) => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Verificar si existen las tablas OAuth
    const oauthTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('accounts', 'sessions', 'verification_tokens', 'usuarios', 'estudiantes')
      ORDER BY table_name
    `);
    
    console.log(`\n🔐 Tablas de autenticación:`);
    oauthTables.rows.forEach((row: any) => {
      console.log(`  ✓ ${row.table_name}`);
    });
    
    // Verificar estructura de tabla usuarios
    const usuariosColumns = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'usuarios' 
      ORDER BY ordinal_position
    `);
    
    console.log(`\n👤 Estructura tabla 'usuarios':`);
    usuariosColumns.rows.forEach((row: any) => {
      console.log(`  - ${row.column_name} (${row.data_type}) ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    // Verificar si hay usuarios
    const usuariosCount = await client.query('SELECT COUNT(*) FROM usuarios');
    console.log(`\n📈 Total usuarios: ${usuariosCount.rows[0].count}`);
    
    const estudiantesCount = await client.query('SELECT COUNT(*) FROM estudiantes');
    console.log(`📈 Total estudiantes: ${estudiantesCount.rows[0].count}`);
    
    client.release();
  } catch (error: any) {
    console.error('\n❌ Error:');
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

checkDatabase();
