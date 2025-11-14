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
      `SELECT expires FROM verification_tokens WHERE token = $1`,
      [token]
    );
    
    if (tokenResult.rows.length === 0) {
      return NextResponse.json(
        { message: "Token inválido" },
        { status: 400 }
      );
    }
    
    const { expires } = tokenResult.rows[0];
    
    // Verificar si el token ha expirado
    if (new Date() > new Date(expires)) {
      await pool.query("DELETE FROM verification_tokens WHERE token = $1", [token]);
      return NextResponse.json(
        { message: "Token expirado" },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Token válido"
    });
    
  } catch (error: any) {
    console.error("Error en validate-reset-token:", error);
    return NextResponse.json(
      { message: error.message || "Error al validar token" },
      { status: 500 }
    );
  }
}
