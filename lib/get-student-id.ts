import { Pool } from 'pg'

/**
 * Obtiene o crea el ID del estudiante basado en el email del usuario
 * Si el usuario existe pero no tiene registro de estudiante, lo crea automáticamente
 * 
 * @param pool - Pool de conexiones de PostgreSQL
 * @param email - Email del usuario autenticado
 * @returns ID del estudiante
 * @throws Error si el usuario no existe en el sistema
 */
export async function getOrCreateStudentId(pool: Pool, email: string): Promise<number> {
  console.log('[getOrCreateStudentId] Buscando estudiante para email:', email)
  
  // Intentar obtener el estudiante existente
  const studentQuery = await pool.query(
    `SELECT e.id_estudiante 
     FROM estudiantes e
     JOIN usuarios u ON e.id_usuario = u.id_usuario
     WHERE u.correo = $1`,
    [email]
  )

  if (studentQuery.rows.length > 0) {
    console.log('[getOrCreateStudentId] Estudiante encontrado:', studentQuery.rows[0].id_estudiante)
    return studentQuery.rows[0].id_estudiante
  }

  console.log('[getOrCreateStudentId] Estudiante no existe, verificando usuario...')
  
  // El usuario no tiene registro de estudiante, verificar si existe el usuario
  const usuarioQuery = await pool.query(
    `SELECT id_usuario FROM usuarios WHERE correo = $1`,
    [email]
  )

  if (usuarioQuery.rows.length === 0) {
    console.error('[getOrCreateStudentId] Usuario no encontrado para:', email)
    throw new Error('Usuario no encontrado en el sistema')
  }

  const userId = usuarioQuery.rows[0].id_usuario
  console.log('[getOrCreateStudentId] Usuario encontrado:', userId, 'creando estudiante...')

  // Crear registro de estudiante con valores por defecto
  const createStudentQuery = await pool.query(
    `INSERT INTO estudiantes (id_usuario, especialidad, puntos_xp, nivel)
     VALUES ($1, 'INGENIERIA_SISTEMAS', 0, 1)
     RETURNING id_estudiante`,
    [userId]
  )

  const studentId = createStudentQuery.rows[0].id_estudiante
  console.log(`✓ Estudiante creado automáticamente para ${email} - ID: ${studentId}`)

  return studentId
}
