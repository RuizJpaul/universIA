require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

async function testCursoEndpoint() {
  console.log('\n=== TEST: Endpoint /api/estudiante/curso/1 ===\n')
  
  try {
    const email = 'josegato170704@gmail.com'
    const cursoId = 1
    
    // 1. Obtener usuario
    console.log('1️⃣ Buscando usuario...')
    const userResult = await pool.query(
      'SELECT id_usuario FROM usuarios WHERE correo = $1',
      [email]
    )
    
    if (userResult.rows.length === 0) {
      console.log('❌ Usuario no encontrado')
      return
    }
    
    const userId = userResult.rows[0].id_usuario
    console.log('✅ Usuario ID:', userId)
    
    // 2. Obtener estudiante
    console.log('\n2️⃣ Buscando estudiante...')
    const studentResult = await pool.query(
      'SELECT id_estudiante FROM estudiantes WHERE id_usuario = $1',
      [userId]
    )
    
    if (studentResult.rows.length === 0) {
      console.log('❌ Estudiante no encontrado')
      return
    }
    
    const studentId = studentResult.rows[0].id_estudiante
    console.log('✅ Estudiante ID:', studentId)
    
    // 3. Verificar inscripción
    console.log('\n3️⃣ Verificando inscripción...')
    const courseQuery = `
      SELECT 
        c.id_curso,
        c.nombre,
        c.descripcion,
        c.nivel,
        c.duracion_horas,
        c.imagen_portada,
        i.id_inscripcion,
        i.estado,
        i.progreso_general,
        i.fecha_inscripcion
      FROM cursos c
      JOIN inscripciones i ON c.id_curso = i.id_curso
      WHERE c.id_curso = $1 
        AND i.id_estudiante = $2
        AND c.estado = 'PUBLICADO'
    `
    
    const courseResult = await pool.query(courseQuery, [cursoId, studentId])
    
    console.log('Rows encontrados:', courseResult.rows.length)
    
    if (courseResult.rows.length === 0) {
      console.log('❌ Curso no encontrado o no inscrito')
      
      // Verificar si existe la inscripción
      const inscCheck = await pool.query(
        'SELECT * FROM inscripciones WHERE id_curso = $1 AND id_estudiante = $2',
        [cursoId, studentId]
      )
      console.log('Inscripciones encontradas:', inscCheck.rows.length)
      
      // Verificar estado del curso
      const cursoCheck = await pool.query(
        'SELECT id_curso, nombre, estado FROM cursos WHERE id_curso = $1',
        [cursoId]
      )
      console.log('Curso:', cursoCheck.rows[0])
      
      return
    }
    
    const course = courseResult.rows[0]
    console.log('✅ Curso encontrado:', course.nombre)
    console.log('   Estado:', course.estado)
    console.log('   Progreso:', course.progreso_general)
    
    // 4. Obtener módulos
    console.log('\n4️⃣ Obteniendo módulos...')
    const modulesQuery = `
      SELECT 
        m.id_modulo,
        m.titulo,
        m.descripcion,
        m.orden,
        m.duracion_estimada
      FROM modulos m
      WHERE m.id_curso = $1
      ORDER BY m.orden ASC
    `
    
    const modulesResult = await pool.query(modulesQuery, [cursoId])
    console.log('✅ Módulos encontrados:', modulesResult.rows.length)
    
    // 5. Obtener lecciones del primer módulo
    if (modulesResult.rows.length > 0) {
      const firstModule = modulesResult.rows[0]
      console.log('\n5️⃣ Obteniendo lecciones del módulo:', firstModule.titulo)
      
      const lessonsQuery = `
        SELECT 
          l.id_leccion,
          l.titulo,
          l.tipo_contenido,
          l.duracion_minutos,
          l.orden,
          COALESCE(pl.completado, false) as completado
        FROM lecciones l
        LEFT JOIN progreso_lecciones pl ON l.id_leccion = pl.id_leccion 
          AND pl.id_inscripcion = $1
        WHERE l.id_modulo = $2
        ORDER BY l.orden ASC
      `
      
      const lessonsResult = await pool.query(lessonsQuery, [
        course.id_inscripcion,
        firstModule.id_modulo
      ])
      
      console.log('✅ Lecciones encontradas:', lessonsResult.rows.length)
      
      if (lessonsResult.rows.length > 0) {
        console.log('\nPrimeras 3 lecciones:')
        lessonsResult.rows.slice(0, 3).forEach((l, idx) => {
          console.log(`   ${idx + 1}. ${l.titulo} (${l.tipo_contenido}) - ${l.completado ? 'Completada' : 'Pendiente'}`)
        })
      }
    }
    
    console.log('\n✅ TODO OK - El endpoint debería funcionar')
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    console.error('Stack:', error.stack)
  } finally {
    await pool.end()
  }
}

testCursoEndpoint()
