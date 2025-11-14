import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export const runtime = 'nodejs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { message: "Email es requerido" },
        { status: 400 }
      );
    }
    
    // Buscar usuario
    const userResult = await pool.query(
      `SELECT 
        u.id_usuario,
        u.correo,
        COALESCE(e.nombre || ' ' || e.apellido, a.nombre, emp.nombre_comercial) as nombre
       FROM usuarios u
       LEFT JOIN estudiantes e ON u.id_usuario = e.id_usuario
       LEFT JOIN administradores a ON u.id_usuario = a.id_usuario
       LEFT JOIN empresas emp ON u.id_usuario = emp.id_usuario
       WHERE u.correo = $1 AND u.estado = 'ACTIVO'`,
      [email]
    );
    
    // Por seguridad, siempre retornar éxito aunque el usuario no exista
    if (userResult.rows.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Si el email existe, recibirás un enlace de recuperación"
      });
    }
    
    const user = userResult.rows[0];
    
    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    
    // Eliminar tokens antiguos del mismo usuario
    await pool.query(
      "DELETE FROM verification_tokens WHERE identifier = $1",
      [email]
    );
    
    // Guardar nuevo token
    await pool.query(
      `INSERT INTO verification_tokens (identifier, token, expires)
       VALUES ($1, $2, $3)`,
      [email, resetToken, expiresAt]
    );
    
    // Enviar email
    try {
      await sendPasswordResetEmail({
        email,
        nombre: user.nombre || email.split('@')[0],
        token: resetToken,
      });
    } catch (emailError) {
      console.error("Error al enviar email:", emailError);
      return NextResponse.json(
        { message: "Error al enviar el email. Por favor intenta de nuevo." },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Email de recuperación enviado correctamente"
    });
    
  } catch (error: any) {
    console.error("Error en forgot-password:", error);
    return NextResponse.json(
      { message: error.message || "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
