require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')
const http = require('http')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

async function generarHTML() {
  try {
    const inscripciones = await pool.query(`
      SELECT 
        i.id_inscripcion,
        i.id_estudiante,
        i.id_curso,
        i.estado,
        i.progreso_general,
        i.fecha_inscripcion,
        u.correo as estudiante_email,
        c.nombre as curso_nombre,
        c.nivel as curso_nivel
      FROM inscripciones i
      JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
      JOIN usuarios u ON e.id_usuario = u.id_usuario
      JOIN cursos c ON i.id_curso = c.id_curso
      ORDER BY i.fecha_inscripcion DESC
    `)
    
    const cursos = await pool.query(`
      SELECT id_curso, nombre, nivel, estado, duracion_horas
      FROM cursos
      ORDER BY id_curso
    `)
    
    const estudiantes = await pool.query(`
      SELECT e.id_estudiante, u.correo, e.especialidad, e.nivel, e.puntos_xp
      FROM estudiantes e
      JOIN usuarios u ON e.id_usuario = u.id_usuario
      ORDER BY e.id_estudiante
    `)
    
    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Base de Datos - Neon</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      min-height: 100vh;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    h1 {
      color: white;
      text-align: center;
      margin-bottom: 10px;
      font-size: 2.5rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    .subtitle {
      color: rgba(255,255,255,0.9);
      text-align: center;
      margin-bottom: 30px;
      font-size: 1.1rem;
    }
    .section {
      background: white;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 25px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    h2 {
      color: #667eea;
      margin-bottom: 20px;
      font-size: 1.8rem;
      border-bottom: 3px solid #667eea;
      padding-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 0.5px;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
    }
    tr:hover {
      background: #f8f9ff;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-success {
      background: #d4edda;
      color: #155724;
    }
    .badge-warning {
      background: #fff3cd;
      color: #856404;
    }
    .badge-info {
      background: #d1ecf1;
      color: #0c5460;
    }
    .empty {
      text-align: center;
      padding: 40px;
      color: #999;
      font-style: italic;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    .stat-card h3 {
      font-size: 2.5rem;
      margin-bottom: 5px;
    }
    .stat-card p {
      opacity: 0.9;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .refresh-btn {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: #667eea;
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 50px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
      transition: all 0.3s;
    }
    .refresh-btn:hover {
      background: #764ba2;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(118, 75, 162, 0.5);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 Base de Datos - Neon</h1>
    <p class="subtitle">Conexión: ep-aged-leaf-ac6shjky-pooler.sa-east-1.aws.neon.tech</p>
    
    <div class="stats">
      <div class="stat-card">
        <h3>${inscripciones.rows.length}</h3>
        <p>Inscripciones</p>
      </div>
      <div class="stat-card">
        <h3>${cursos.rows.length}</h3>
        <p>Cursos</p>
      </div>
      <div class="stat-card">
        <h3>${estudiantes.rows.length}</h3>
        <p>Estudiantes</p>
      </div>
    </div>

    <div class="section">
      <h2>📝 Inscripciones</h2>
      ${inscripciones.rows.length === 0 ? '<div class="empty">No hay inscripciones</div>' : `
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Estudiante</th>
              <th>Curso</th>
              <th>Nivel</th>
              <th>Estado</th>
              <th>Progreso</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            ${inscripciones.rows.map(row => `
              <tr>
                <td>#${row.id_inscripcion}</td>
                <td>${row.estudiante_email}</td>
                <td><strong>${row.curso_nombre}</strong></td>
                <td><span class="badge badge-info">${row.curso_nivel}</span></td>
                <td><span class="badge badge-warning">${row.estado}</span></td>
                <td>${row.progreso_general}%</td>
                <td>${new Date(row.fecha_inscripcion).toLocaleString('es-PE')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>

    <div class="section">
      <h2>📚 Cursos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Nivel</th>
            <th>Estado</th>
            <th>Duración</th>
          </tr>
        </thead>
        <tbody>
          ${cursos.rows.map(row => `
            <tr>
              <td>#${row.id_curso}</td>
              <td><strong>${row.nombre}</strong></td>
              <td><span class="badge badge-info">${row.nivel}</span></td>
              <td><span class="badge badge-success">${row.estado}</span></td>
              <td>${row.duracion_horas}h</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>👨‍🎓 Estudiantes</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Especialidad</th>
            <th>Nivel</th>
            <th>Puntos XP</th>
          </tr>
        </thead>
        <tbody>
          ${estudiantes.rows.map(row => `
            <tr>
              <td>#${row.id_estudiante}</td>
              <td><strong>${row.correo}</strong></td>
              <td>${row.especialidad}</td>
              <td>Nivel ${row.nivel}</td>
              <td>${row.puntos_xp} XP</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <button class="refresh-btn" onclick="location.reload()">🔄 Actualizar</button>
</body>
</html>
    `
  } catch (error) {
    return `
<!DOCTYPE html>
<html>
<head><title>Error</title></head>
<body style="font-family: sans-serif; padding: 50px; background: #f44336; color: white;">
  <h1>❌ Error de Conexión</h1>
  <p>${error.message}</p>
  <pre>${error.stack}</pre>
</body>
</html>
    `
  } finally {
    await pool.end()
  }
}

const server = http.createServer(async (req, res) => {
  const html = await generarHTML()
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(html)
  
  console.log('\n✅ Página servida. Presiona Ctrl+C para cerrar el servidor.')
})

const PORT = 3001
server.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════╗')
  console.log('║     Visualizador de Base de Datos - Neon         ║')
  console.log('╚════════════════════════════════════════════════════╝\n')
  console.log(`🌐 Abre tu navegador en: http://localhost:${PORT}`)
  console.log('\n📊 Verás todas las inscripciones, cursos y estudiantes')
  console.log('🔄 Actualiza la página para ver cambios en tiempo real')
  console.log('\n⏹️  Presiona Ctrl+C para detener el servidor\n')
})
