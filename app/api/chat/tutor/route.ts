import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { Pool } from "pg";

export const runtime = 'nodejs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// URL del servicio de IA Tutora en Render
const TUTOR_SERVICE_URL = process.env.TUTOR_SERVICE_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    // 2. Obtener datos del request
    const { message, courseId, sessionId } = await request.json();

    console.log("📨 Chat Tutor - Request:", {
      user: session.user.email,
      courseId,
      messageLength: message?.length
    });

    if (!message || !courseId) {
      return NextResponse.json(
        { error: "Mensaje y courseId son requeridos" },
        { status: 400 }
      );
    }

    // 3. Obtener ID del estudiante
    const studentQuery = await pool.query(
      `SELECT e.id_estudiante, e.nombre, e.apellido 
       FROM estudiantes e
       JOIN usuarios u ON e.id_usuario = u.id_usuario
       WHERE u.correo = $1`,
      [session.user.email]
    );

    if (studentQuery.rows.length === 0) {
      return NextResponse.json(
        { error: "Estudiante no encontrado" },
        { status: 404 }
      );
    }

    const student = studentQuery.rows[0];

    // 4. Verificar que el estudiante esté inscrito en el curso
    const enrollmentQuery = await pool.query(
      `SELECT id_inscripcion, progreso_general 
       FROM inscripciones 
       WHERE id_curso = $1 AND id_estudiante = $2 AND estado = 'EN_PROGRESO'`,
      [courseId, student.id_estudiante]
    );

    if (enrollmentQuery.rows.length === 0) {
      return NextResponse.json(
        { error: "No estás inscrito en este curso" },
        { status: 403 }
      );
    }

    // 5. Crear o obtener sesión de chat
    let chatSessionId = sessionId;
    
    if (!chatSessionId) {
      const newSessionQuery = await pool.query(
        `INSERT INTO sesiones_chat_ia (
          id_estudiante, 
          id_curso, 
          tipo_sesion, 
          activa
        ) VALUES ($1, $2, 'TUTORIA', true)
        RETURNING id_sesion`,
        [student.id_estudiante, courseId]
      );
      
      chatSessionId = newSessionQuery.rows[0].id_sesion;
      console.log("🆕 Nueva sesión creada:", chatSessionId);
    }

    // 6. Llamar al servicio de IA Tutora (Python)
    console.log("🤖 Llamando a IA Tutora:", TUTOR_SERVICE_URL);
    
    const tutorResponse = await fetch(`${TUTOR_SERVICE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        course_id: courseId,
        student_id: student.id_estudiante,
        session_id: chatSessionId,
        student_name: `${student.nombre} ${student.apellido}`,
        context: {
          progress: enrollmentQuery.rows[0].progreso_general,
        }
      }),
    });

    if (!tutorResponse.ok) {
      const errorData = await tutorResponse.json().catch(() => ({}));
      console.error("❌ Error del servicio IA:", errorData);
      
      return NextResponse.json(
        { 
          error: "Error al comunicarse con el tutor IA",
          details: errorData 
        },
        { status: tutorResponse.status }
      );
    }

    const tutorData = await tutorResponse.json();

    // 7. Guardar mensaje del estudiante en la BD
    await pool.query(
      `INSERT INTO mensajes_chat (
        id_sesion,
        emisor,
        mensaje,
        timestamp
      ) VALUES ($1, 'ESTUDIANTE', $2, CURRENT_TIMESTAMP)`,
      [chatSessionId, message]
    );

    // 8. Guardar respuesta de la IA en la BD
    await pool.query(
      `INSERT INTO mensajes_chat (
        id_sesion,
        emisor,
        mensaje,
        timestamp
      ) VALUES ($1, 'IA', $2, CURRENT_TIMESTAMP)`,
      [chatSessionId, tutorData.response]
    );

    // 9. Actualizar última actividad de la sesión
    await pool.query(
      `UPDATE sesiones_chat_ia 
       SET ultima_interaccion = CURRENT_TIMESTAMP
       WHERE id_sesion = $1`,
      [chatSessionId]
    );

    console.log("✅ Chat procesado exitosamente");

    // 10. Retornar respuesta
    return NextResponse.json({
      success: true,
      sessionId: chatSessionId,
      response: tutorData.response,
      metadata: tutorData.metadata || {},
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error("❌ Error en chat tutor:", error);
    
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
