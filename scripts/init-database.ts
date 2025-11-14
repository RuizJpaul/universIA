import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function initDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL no está definida en .env.local');
    process.exit(1);
  }
  
  console.log('DATABASE_URL:', databaseUrl.substring(0, 30) + '...');
  
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('Conectando a la base de datos Neon...');
    
    const client = await pool.connect();
    console.log('✓ Conexión establecida');

    // Leer el archivo SQL
    const schemaPath = path.join(__dirname, '..', 'database', 'schema_universia_optimizado.sql');
    console.log(`Leyendo schema desde: ${schemaPath}`);
    
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('✓ Schema leído correctamente');

    console.log('Ejecutando schema...');
    console.log('⚠ Este proceso puede tardar varios minutos...');
    
    await client.query(schema);
    
    console.log('✓ Schema ejecutado exitosamente');
    console.log('✓ Base de datos inicializada correctamente');
    
    // Verificar algunas tablas
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`\n✓ Tablas creadas (${result.rows.length}):`);
    result.rows.forEach((row: any) => {
      console.log(`  - ${row.table_name}`);
    });
    
    client.release();
  } catch (error: any) {
    console.error('❌ Error al inicializar la base de datos:');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();
