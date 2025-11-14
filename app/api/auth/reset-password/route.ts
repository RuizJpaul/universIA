import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

export const runtime = 'nodejs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    
    if (!token || !password) {
      return NextResponse.json(
        { message: "Token y contraseña son requeridos" },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { message: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }
    
    // Buscar y validar token
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
        { message: "El token ha expirado" },
        { status: 400 }
      );
    }
    
    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Actualizar contraseña del usuario
    const updateResult = await pool.query(
      `UPDATE usuarios 
       SET contrasena = $1, actualizado_en = CURRENT_TIMESTAMP 
       WHERE correo = $2 AND estado = 'ACTIVO'
       RETURNING id_usuario`,
      [hashedPassword, email]
    );
    
    if (updateResult.rows.length === 0) {
      return NextResponse.json(
        { message: "Usuario no encontrado o inactivo" },
        { status: 404 }
      );
    }
    
    // Eliminar el token usado
    await pool.query("DELETE FROM verification_tokens WHERE token = $1", [token]);
    
    return NextResponse.json({
      success: true,
      message: "Contraseña restablecida correctamente"
    });
    
  } catch (error: any) {
    console.error("Error en reset-password:", error);
    return NextResponse.json(
      { message: error.message || "Error al restablecer contraseña" },
      { status: 500 }
    );
  }
}
