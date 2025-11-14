import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

export const runtime = 'nodejs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email requerido" },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const userResult = await pool.query(
      `SELECT u.id_usuario, e.nombre, e.apellido
       FROM usuarios u
       LEFT JOIN estudiantes e ON u.id_usuario = e.id_usuario
       WHERE u.correo = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    // Eliminar tokens anteriores
    await pool.query(
      "DELETE FROM verification_tokens WHERE identifier = $1",
      [email]
    );

    // Generar nuevo código de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Guardar nuevo token
    await pool.query(
      `INSERT INTO verification_tokens (identifier, token, expires)
       VALUES ($1, $2, $3)`,
      [email, verificationCode, expiresAt]
    );

    // Enviar email
    try {
      await sendVerificationEmail({
        email,
        nombre: `${user.nombre} ${user.apellido}`,
        token: verificationCode,
      });
    } catch (emailError) {
      console.error("Error al enviar email:", emailError);
      return NextResponse.json(
        { error: "Error al enviar el email de verificación" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Código reenviado exitosamente" },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error al reenviar código:", error);
    return NextResponse.json(
      { error: "Error al reenviar el código" },
      { status: 500 }
    );
  }
}
