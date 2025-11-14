import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { Pool } from "pg";

export const runtime = 'nodejs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const labId = parseInt(params.id);
    const { 
      code, 
      screenshots, 
      projectUrl, 
      notes,
      completed 
    } = await request.json();

    // Obtener estudiante
    const studentQuery = await pool.query(
      `SELECT id_estudiante FROM estudiantes e
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

    // Verificar si ya existe una sesión activa
    const existingSession = await pool.query(
      `SELECT id_sesion_lab FROM sesiones_laboratorio
       WHERE id_estudiante = $1 AND id_laboratorio = $2 AND fecha_fin IS NULL
       ORDER BY fecha_inicio DESC LIMIT 1`,
      [studentId, labId]
    );

    let sessionId;

    if (existingSession.rows.length > 0) {
      // Actualizar sesión existente
      sessionId = existingSession.rows[0].id_sesion_lab;
      
      await pool.query(
        `UPDATE sesiones_laboratorio
         SET codigo_guardado = $1,
             capturas_pantalla = $2,
             url_proyecto = $3,
             notas = $4,
             completado = $5,
             fecha_fin = CASE WHEN $5 = true THEN CURRENT_TIMESTAMP ELSE fecha_fin END
         WHERE id_sesion_lab = $6`,
        [code, screenshots, projectUrl, notes, completed, sessionId]
      );

      console.log("✅ Sesión actualizada:", sessionId);
    } else {
      // Crear nueva sesión
      const newSession = await pool.query(
        `INSERT INTO sesiones_laboratorio (
          id_estudiante,
          id_laboratorio,
          codigo_guardado,
          capturas_pantalla,
          url_proyecto,
          notas,
          completado,
          fecha_fin
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 
          CASE WHEN $7 = true THEN CURRENT_TIMESTAMP ELSE NULL END
        )
        RETURNING id_sesion_lab`,
        [studentId, labId, code, screenshots, projectUrl, notes, completed]
      );

      sessionId = newSession.rows[0].id_sesion_lab;
      console.log("🆕 Nueva sesión creada:", sessionId);
    }

    return NextResponse.json({
      success: true,
      sessionId: sessionId,
      message: completed ? "Laboratorio completado" : "Progreso guardado",
    });

  } catch (error: any) {
    console.error("❌ Error guardando laboratorio:", error);
    
    return NextResponse.json(
      { error: "Error al guardar laboratorio" },
      { status: 500 }
    );
  }
}
