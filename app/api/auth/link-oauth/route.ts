import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { auth } from "@/auth";

export const runtime = 'nodejs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const { provider, providerAccountId, accessToken, refreshToken, expiresAt, tokenType, scope, idToken } = await request.json();

    // Buscar el ID del usuario en la base de datos
    const userResult = await pool.query(
      "SELECT id_usuario FROM usuarios WHERE correo = $1",
      [session.user.email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const userId = userResult.rows[0].id_usuario;

    // Vincular cuenta OAuth
    await pool.query(
      `INSERT INTO accounts (user_id, type, provider, provider_account_id, access_token, refresh_token, expires_at, token_type, scope, id_token)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (provider, provider_account_id) DO NOTHING`,
      [
        userId,
        'oauth',
        provider,
        providerAccountId,
        accessToken,
        refreshToken,
        expiresAt,
        tokenType,
        scope,
        idToken,
      ]
    );

    return NextResponse.json(
      { success: true, message: "Cuenta vinculada exitosamente" },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error linking OAuth account:", error);
    return NextResponse.json(
      { error: "Error al vincular cuenta" },
      { status: 500 }
    );
  }
}
