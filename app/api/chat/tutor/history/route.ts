import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { Pool } from "pg";

export const runtime = 'nodejs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    // Obtener parámetros de la URL
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    let sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!courseId && !sessionId) {
      return NextResponse.json(
        { error: "courseId o sessionId requerido" },
        { status: 400 }
      );
    }

    // Obtener ID del estudiante
    const studentQuery = await pool.query(
      `SELECT e.id_estudiante 
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

    const studentId = studentQuery.rows[0].id_estudiante;

    let messages;

    if (sessionId) {
      // Obtener mensajes de una sesión específica
      messages = await pool.query(
        `SELECT 
          m.id_mensaje,
          m.emisor,
          m.mensaje,
          m.timestamp,
          s.id_curso
        FROM mensajes_chat m
        JOIN sesiones_chat_ia s ON m.id_sesion = s.id_sesion
        WHERE m.id_sesion = $1 
          AND s.id_estudiante = $2
        ORDER BY m.timestamp ASC
        LIMIT $3`,
        [sessionId, studentId, limit]
      );
    } else {
      // Obtener última sesión activa del curso
      const activeSession = await pool.query(
        `SELECT id_sesion 
        FROM sesiones_chat_ia 
        WHERE id_estudiante = $1 
          AND id_curso = $2 
          AND tipo_sesion = 'TUTORIA'
          AND activa = true
        ORDER BY fecha_inicio DESC
        LIMIT 1`,
        [studentId, courseId]
      );

      if (activeSession.rows.length === 0) {
        return NextResponse.json({
          success: true,
          messages: [],
          sessionId: null,
        });
      }

      const activeSessionId = activeSession.rows[0].id_sesion;

      messages = await pool.query(
        `SELECT 
          m.id_mensaje,
          m.emisor,
          m.mensaje,
          m.timestamp
        FROM mensajes_chat m
        WHERE m.id_sesion = $1
        ORDER BY m.timestamp ASC
        LIMIT $2`,
        [activeSessionId, limit]
      );

      sessionId = activeSessionId;
    }

    return NextResponse.json({
      success: true,
      sessionId: sessionId,
      messages: messages.rows.map(msg => ({
        id: msg.id_mensaje,
        role: msg.emisor === 'IA' ? 'assistant' : 'user',
        content: msg.mensaje,
        timestamp: msg.timestamp,
      })),
    });

  } catch (error: any) {
    console.error("Error obteniendo historial:", error);
    
    return NextResponse.json(
      { error: "Error al obtener historial" },
      { status: 500 }
    );
  }
}
