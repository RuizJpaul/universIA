import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Pool } from "pg";

export const runtime = 'nodejs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    // Verificar estado de onboarding
    const result = await pool.query(
      `SELECT e.onboarding_completado 
       FROM usuarios u
       LEFT JOIN estudiantes e ON u.id_usuario = e.id_usuario
       WHERE u.correo = $1`,
      [session.user.email]
    );

    if (result.rows.length === 0) {
      console.log("❌ Usuario no encontrado en DB:", session.user.email);
      return NextResponse.json(
        { error: "Usuario no encontrado en la base de datos" },
        { status: 401 }
      );
    }

    const onboardingCompleted = result.rows[0].onboarding_completado;
    
    console.log("✅ Usuario encontrado, onboarding:", onboardingCompleted);
    
    return NextResponse.json({
      needsOnboarding: !onboardingCompleted
    });

  } catch (error: any) {
    console.error("Error checking onboarding:", error);
    return NextResponse.json(
      { error: "Error al verificar estado" },
      { status: 500 }
    );
  }
}
