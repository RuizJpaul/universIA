import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { Pool } from "pg";

export const runtime = 'nodejs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const EVALUATOR_SERVICE_URL = process.env.EVALUATOR_SERVICE_URL || 'http://localhost:8001';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const { 
      evaluationId, 
      answers,
      code,
      timeSpentMinutes
    } = await request.json();

    console.log("📤 Enviando evaluación completa:", { evaluationId });

    // Obtener estudiante
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

    // Obtener evaluación y rúbrica
    const evaluationQuery = await pool.query(
      `SELECT 
        e.*,
        r.criterios,
        r.escala_evaluacion
      FROM evaluaciones e
      LEFT JOIN rubricas r ON e.id_rubrica = r.id_rubrica
      WHERE e.id_evaluacion = $1`,
      [evaluationId]
    );

    if (evaluationQuery.rows.length === 0) {
      return NextResponse.json(
        { error: "Evaluación no encontrada" },
        { status: 404 }
      );
    }

    const evaluation = evaluationQuery.rows[0];

    // Obtener preguntas si es QUIZ o EXAMEN
    let questions = [];
    if (['QUIZ', 'EXAMEN'].includes(evaluation.tipo)) {
      const questionsQuery = await pool.query(
        `SELECT * FROM preguntas 
         WHERE id_evaluacion = $1 
         ORDER BY orden`,
        [evaluationId]
      );
      questions = questionsQuery.rows;
    }

    // Llamar a IA Evaluadora para calificar
    const evaluatorResponse = await fetch(`${EVALUATOR_SERVICE_URL}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        evaluation_id: evaluationId,
        student_id: student.id_estudiante,
        student_name: `${student.nombre} ${student.apellido}`,
        evaluation_type: evaluation.tipo,
        rubric: evaluation.criterios || {},
        grading_scale: evaluation.escala_evaluacion || {},
        questions: questions,
        answers: answers || {},
        code: code || null,
        time_spent_minutes: timeSpentMinutes || 0,
      }),
    });

    if (!evaluatorResponse.ok) {
      const errorData = await evaluatorResponse.json().catch(() => ({}));
      console.error("❌ Error al calificar:", errorData);
      
      return NextResponse.json(
        { error: "Error al calificar la evaluación" },
        { status: evaluatorResponse.status }
      );
    }

    const result = await evaluatorResponse.json();

    // Guardar resultado en BD
    const savedResult = await pool.query(
      `INSERT INTO resultados_evaluaciones (
        id_estudiante,
        id_evaluacion,
        nota_obtenida,
        respuestas,
        aprobado,
        retroalimentacion_ia,
        tiempo_empleado_minutos,
        intento_numero
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 
        (SELECT COALESCE(MAX(intento_numero), 0) + 1 
         FROM resultados_evaluaciones 
         WHERE id_estudiante = $1 AND id_evaluacion = $2)
      )
      RETURNING id_resultado, intento_numero`,
      [
        student.id_estudiante,
        evaluationId,
        result.score,
        JSON.stringify({ answers, code }),
        result.score >= evaluation.nota_minima,
        result.detailed_feedback,
        timeSpentMinutes || 0
      ]
    );

    console.log("✅ Resultado guardado:", savedResult.rows[0]);

    return NextResponse.json({
      success: true,
      resultId: savedResult.rows[0].id_resultado,
      attemptNumber: savedResult.rows[0].intento_numero,
      score: result.score,
      passed: result.score >= evaluation.nota_minima,
      feedback: result.feedback,
      detailed_feedback: result.detailed_feedback,
      suggestions: result.suggestions,
      breakdown: result.breakdown,
    });

  } catch (error: any) {
    console.error("❌ Error al enviar evaluación:", error);
    
    return NextResponse.json(
      { error: "Error al enviar evaluación" },
      { status: 500 }
    );
  }
}
