import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { Pool } from "pg";

export const runtime = 'nodejs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// URL del servicio de IA Evaluadora en Render
const EVALUATOR_SERVICE_URL = process.env.EVALUATOR_SERVICE_URL || 'http://localhost:8001';

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
    const { 
      message, 
      evaluationId, 
      sessionId,
      code,
      answer 
    } = await request.json();

    console.log("📝 Chat Evaluador - Request:", {
      user: session.user.email,
      evaluationId,
      hasCode: !!code,
      hasAnswer: !!answer
    });

    if (!message || !evaluationId) {
      return NextResponse.json(
        { error: "Mensaje y evaluationId son requeridos" },
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

    // 4. Obtener información de la evaluación
    const evaluationQuery = await pool.query(
      `SELECT 
        e.id_evaluacion,
        e.titulo,
        e.tipo,
        e.id_rubrica,
        e.nota_minima,
        r.criterios,
        r.escala_evaluacion
      FROM evaluaciones e
      LEFT JOIN rubricas r ON e.id_rubrica = r.id_rubrica
      WHERE e.id_evaluacion = $1 AND e.activo = true`,
      [evaluationId]
    );

    if (evaluationQuery.rows.length === 0) {
      return NextResponse.json(
        { error: "Evaluación no encontrada" },
        { status: 404 }
      );
    }

    const evaluation = evaluationQuery.rows[0];

    // 5. Crear o obtener sesión de chat de evaluación
    let chatSessionId = sessionId;
    
    if (!chatSessionId) {
      const newSessionQuery = await pool.query(
        `INSERT INTO sesiones_chat_ia (
          id_estudiante, 
          id_evaluacion,
          tipo_sesion, 
          activa
        ) VALUES ($1, $2, 'EVALUACION', true)
        RETURNING id_sesion`,
        [student.id_estudiante, evaluationId]
      );
      
      chatSessionId = newSessionQuery.rows[0].id_sesion;
      console.log("🆕 Nueva sesión de evaluación creada:", chatSessionId);
    }

    // 6. Llamar al servicio de IA Evaluadora (Python)
    console.log("🤖 Llamando a IA Evaluadora:", EVALUATOR_SERVICE_URL);
    
    const evaluatorResponse = await fetch(`${EVALUATOR_SERVICE_URL}/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        evaluation_id: evaluationId,
        student_id: student.id_estudiante,
        session_id: chatSessionId,
        student_name: `${student.nombre} ${student.apellido}`,
        evaluation_type: evaluation.tipo,
        rubric: evaluation.criterios || {},
        grading_scale: evaluation.escala_evaluacion || {},
        minimum_score: evaluation.nota_minima,
        submission: {
          code: code || null,
          answer: answer || null,
        }
      }),
    });

    if (!evaluatorResponse.ok) {
      const errorData = await evaluatorResponse.json().catch(() => ({}));
      console.error("❌ Error del servicio IA Evaluadora:", errorData);
      
      return NextResponse.json(
        { 
          error: "Error al comunicarse con el evaluador IA",
          details: errorData 
        },
        { status: evaluatorResponse.status }
      );
    }

    const evaluatorData = await evaluatorResponse.json();

    // 7. Guardar mensaje del estudiante
    await pool.query(
      `INSERT INTO mensajes_chat (
        id_sesion,
        emisor,
        mensaje,
        metadata,
        timestamp
      ) VALUES ($1, 'ESTUDIANTE', $2, $3, CURRENT_TIMESTAMP)`,
      [
        chatSessionId, 
        message,
        JSON.stringify({ code, answer })
      ]
    );

    // 8. Guardar respuesta de la IA
    await pool.query(
      `INSERT INTO mensajes_chat (
        id_sesion,
        emisor,
        mensaje,
        metadata,
        timestamp
      ) VALUES ($1, 'IA', $2, $3, CURRENT_TIMESTAMP)`,
      [
        chatSessionId, 
        evaluatorData.response,
        JSON.stringify({
          score: evaluatorData.score,
          feedback: evaluatorData.feedback,
          suggestions: evaluatorData.suggestions,
        })
      ]
    );

    // 9. Si hay un puntaje final, guardar el resultado
    if (evaluatorData.is_final && evaluatorData.score !== undefined) {
      await pool.query(
        `INSERT INTO resultados_evaluaciones (
          id_estudiante,
          id_evaluacion,
          nota_obtenida,
          respuestas,
          aprobado,
          retroalimentacion_ia,
          tiempo_empleado_minutos
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          student.id_estudiante,
          evaluationId,
          evaluatorData.score,
          JSON.stringify({ code, answer }),
          evaluatorData.score >= evaluation.nota_minima,
          evaluatorData.detailed_feedback,
          evaluatorData.time_spent_minutes || 0
        ]
      );

      console.log("📊 Resultado guardado - Puntaje:", evaluatorData.score);
    }

    // 10. Actualizar última interacción
    await pool.query(
      `UPDATE sesiones_chat_ia 
       SET ultima_interaccion = CURRENT_TIMESTAMP
       WHERE id_sesion = $1`,
      [chatSessionId]
    );

    console.log("✅ Evaluación procesada exitosamente");

    // 11. Retornar respuesta
    return NextResponse.json({
      success: true,
      sessionId: chatSessionId,
      response: evaluatorData.response,
      score: evaluatorData.score,
      feedback: evaluatorData.feedback,
      suggestions: evaluatorData.suggestions,
      is_final: evaluatorData.is_final || false,
      passed: evaluatorData.score >= evaluation.nota_minima,
      metadata: evaluatorData.metadata || {},
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error("❌ Error en chat evaluador:", error);
    
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
