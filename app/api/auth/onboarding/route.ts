import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { Pool } from "pg";

export const runtime = 'nodejs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "No autenticado" },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const { nombre, apellido, especialidad, telefono, fecha_nacimiento, biografia } = body;
    
    // Validaciones
    if (!nombre || !apellido || !especialidad) {
      return NextResponse.json(
        { message: "Nombre, apellido y especialidad son obligatorios" },
        { status: 400 }
      );
    }
    
    // Buscar usuario por email para obtener id_usuario
    const userResult = await pool.query(
      "SELECT id_usuario FROM usuarios WHERE correo = $1",
      [session.user.email]
    );
    
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }
    
    const userId = userResult.rows[0].id_usuario;
    
    // Actualizar perfil de estudiante
    const result = await pool.query(
      `UPDATE estudiantes 
       SET 
         nombre = $1,
         apellido = $2,
         especialidad = $3,
         telefono = $4,
         fecha_nacimiento = $5,
         biografia = $6,
         onboarding_completado = true,
         actualizado_en = CURRENT_TIMESTAMP
       WHERE id_usuario = $7
       RETURNING id_estudiante, nombre, apellido`,
      [nombre, apellido, especialidad, telefono || null, fecha_nacimiento || null, biografia || null, userId]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "Estudiante no encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: "Perfil completado exitosamente",
      estudiante: result.rows[0]
    });
    
  } catch (error: any) {
    console.error("Error en onboarding:", error);
    return NextResponse.json(
      { message: error.message || "Error al completar perfil" },
      { status: 500 }
    );
  }
}
