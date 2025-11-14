import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

export const runtime = 'nodejs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    
    if (!token) {
      return NextResponse.json(
        { message: "Token no proporcionado" },
        { status: 400 }
      );
    }
    
    // Buscar token en la base de datos
    const tokenResult = await pool.query(
      `SELECT identifier, expires FROM verification_tokens WHERE token = $1`,
      [token]
    );
    
    if (tokenResult.rows.length === 0) {
      return NextResponse.json(
        { message: "Token inválido o expirado" },
        { status: 400 }
      );
    }
    
    const { identifier: email, expires } = tokenResult.rows[0];
    
    // Verificar si el token ha expirado
    if (new Date() > new Date(expires)) {
      await pool.query("DELETE FROM verification_tokens WHERE token = $1", [token]);
      return NextResponse.json(
        { message: "El token ha expirado. Por favor solicita uno nuevo." },
        { status: 400 }
      );
    }
    
    // Marcar usuario como verificado
    await pool.query(
      `UPDATE usuarios 
       SET verificado = true, email_verified = CURRENT_TIMESTAMP 
       WHERE correo = $1`,
      [email]
    );
    
    // Eliminar el token usado
    await pool.query("DELETE FROM verification_tokens WHERE token = $1", [token]);
    
    return NextResponse.json({
      success: true,
      message: "Email verificado correctamente. Ya puedes iniciar sesión."
    });
    
  } catch (error: any) {
    console.error("Error en verify-email:", error);
    return NextResponse.json(
      { message: error.message || "Error al verificar email" },
      { status: 500 }
    );
  }
}
