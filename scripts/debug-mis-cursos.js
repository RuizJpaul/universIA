require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

async function debugMisCursos() {
  console.log('\n=== DEBUG: Simular página Mis Cursos ===\n')
  
  try {
    // Paso 1: Identificar el usuario (simulamos josegato170704@gmail.com)
    const testEmail = 'josegato170704@gmail.com'
    console.log(`1️⃣ Buscar usuario: ${testEmail}`)
    
    const userResult = await pool.query(
      'SELECT id_usuario, correo, rol FROM usuarios WHERE correo = $1',
      [testEmail]
    )
    
    if (userResult.rows.length === 0) {
      console.log('❌ Usuario no encontrado')
      return
    }
    
    const user = userResult.rows[0]
    console.log('✅ Usuario encontrado:', {
      id: user.id_usuario,
      email: user.correo,
      rol: user.rol
    })
    
    // Paso 2: Buscar estudiante
    console.log('\n2️⃣ Buscar estudiante asociado...')
    const studentResult = await pool.query(
      'SELECT id_estudiante, id_usuario, especialidad, nivel FROM estudiantes WHERE id_usuario = $1',
      [user.id_usuario]
    )
    
    if (studentResult.rows.length === 0) {
      console.log('❌ Registro de estudiante no encontrado')
      return
    }
    
    const student = studentResult.rows[0]
    console.log('✅ Estudiante encontrado:', {
      id: student.id_estudiante,
      especialidad: student.especialidad,
      nivel: student.nivel
    })
    
    // Paso 3: Consulta EXACTA del endpoint /api/estudiante/cursos
    console.log('\n3️⃣ Ejecutar query del endpoint /api/estudiante/cursos...')
    console.log('Query parameters: [studentId =', student.id_estudiante, ']')
    
    const coursesQuery = await pool.query(
      `SELECT 
        c.id_curso,
        c.nombre as titulo,
        c.descripcion,
        c.nivel,
        c.duracion_horas as duracion_estimada_horas,
        c.calificacion_promedio,
        c.imagen_portada as imagen_url,
        c.tags,
        i.id_inscripcion,
        i.estado,
        i.progreso_general,
        i.fecha_inscripcion,
        i.fecha_completado,
        COUNT(DISTINCT m.id_modulo) as total_modulos,
        COUNT(DISTINCT CASE WHEN pl.completado = true THEN l.id_leccion END) as lecciones_completadas,
        COUNT(DISTINCT l.id_leccion) as total_lecciones
      FROM inscripciones i
      JOIN cursos c ON i.id_curso = c.id_curso
      LEFT JOIN modulos m ON c.id_curso = m.id_curso
      LEFT JOIN lecciones l ON m.id_modulo = l.id_modulo
      LEFT JOIN progreso_lecciones pl ON l.id_leccion = pl.id_leccion AND pl.id_inscripcion = i.id_inscripcion
      WHERE i.id_estudiante = $1 AND c.estado = 'PUBLICADO'
      GROUP BY c.id_curso, i.id_inscripcion
      ORDER BY i.fecha_inscripcion DESC`,
      [student.id_estudiante]
    )
    
    console.log(`\n✅ Cursos encontrados: ${coursesQuery.rows.length}`)
    
    if (coursesQuery.rows.length === 0) {
      console.log('\n❌ NO SE ENCONTRARON CURSOS INSCRITOS')
      console.log('\nVerificando inscripciones directamente...')
      
      const directCheck = await pool.query(
        'SELECT * FROM inscripciones WHERE id_estudiante = $1',
        [student.id_estudiante]
      )
      
      console.log(`Inscripciones en la tabla: ${directCheck.rows.length}`)
      if (directCheck.rows.length > 0) {
        console.log('Inscripciones encontradas:')
        directCheck.rows.forEach((insc, idx) => {
          console.log(`  ${idx + 1}. ID: ${insc.id_inscripcion}, Curso ID: ${insc.id_curso}, Estado: ${insc.estado}`)
        })
        
        // Verificar si los cursos existen
        console.log('\nVerificando cursos referenciados...')
        for (const insc of directCheck.rows) {
          const courseCheck = await pool.query(
            'SELECT id_curso, nombre, estado FROM cursos WHERE id_curso = $1',
            [insc.id_curso]
          )
          
          if (courseCheck.rows.length === 0) {
            console.log(`  ❌ Curso ${insc.id_curso} NO EXISTE`)
          } else {
            const curso = courseCheck.rows[0]
            console.log(`  ✅ Curso ${curso.id_curso}: "${curso.nombre}" (Estado: ${curso.estado})`)
            
            if (curso.estado !== 'PUBLICADO') {
              console.log(`     ⚠️ PROBLEMA: El curso NO está PUBLICADO, por eso no aparece en la query`)
            }
          }
        }
      }
    } else {
      console.log('\n📚 CURSOS INSCRITOS:\n')
      
      coursesQuery.rows.forEach((course, idx) => {
        console.log(`${idx + 1}. ${course.titulo}`)
        console.log(`   - ID Curso: ${course.id_curso}`)
        console.log(`   - ID Inscripción: ${course.id_inscripcion}`)
        console.log(`   - Estado: ${course.estado}`)
        console.log(`   - Progreso: ${course.progreso_general}%`)
        console.log(`   - Lecciones: ${course.lecciones_completadas}/${course.total_lecciones}`)
        console.log(`   - Fecha inscripción: ${course.fecha_inscripcion}`)
        console.log('')
      })
      
      // Mapear como lo hace el endpoint
      const mappedCourses = coursesQuery.rows.map(course => ({
        id: course.id_curso,
        id_curso: course.id_curso,
        titulo: course.titulo,
        descripcion: course.descripcion,
        nivel: course.nivel,
        duracion: course.duracion_estimada_horas,
        calificacion_promedio: parseFloat(course.calificacion_promedio) || 0,
        imagen_url: course.imagen_url || '/placeholder-course.jpg',
        tags: course.tags || [],
        estado: course.estado,
        progreso_general: parseFloat(course.progreso_general) || 0,
        fecha_inscripcion: course.fecha_inscripcion,
        fecha_completado: course.fecha_completado,
        total_modulos: parseInt(course.total_modulos) || 0,
        lecciones_completadas: parseInt(course.lecciones_completadas) || 0,
        total_lecciones: parseInt(course.total_lecciones) || 0,
      }))
      
      console.log('📤 Respuesta del API (formato JSON):')
      console.log(JSON.stringify({
        success: true,
        courses: mappedCourses
      }, null, 2))
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    console.error(error)
  } finally {
    await pool.end()
  }
}

debugMisCursos()
