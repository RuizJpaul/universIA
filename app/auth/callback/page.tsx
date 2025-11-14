import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Pool } from "pg";

export const runtime = 'nodejs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function CallbackPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  // Verificar si el usuario completó el onboarding
  const result = await pool.query(
    `SELECT e.onboarding_completado 
     FROM usuarios u
     LEFT JOIN estudiantes e ON u.id_usuario = e.id_usuario
     WHERE u.correo = $1`,
    [session.user.email]
  );

  if (result.rows.length > 0 && !result.rows[0].onboarding_completado) {
    // Usuario necesita completar onboarding
    redirect("/auth/onboarding");
  }

  // Usuario ya completó onboarding - ir a dashboard
  redirect("/estudiante/dashboard");
}
