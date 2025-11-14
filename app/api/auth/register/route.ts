import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { z } from "zod";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

export const runtime = 'nodejs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const registerSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  telefono: z.string().optional(),
  fecha_nacimiento: z.string().optional(),
  especialidad: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    console.log("📝 Iniciando proceso de registro...");
    const body = await request.json();
    console.log("📦 Body recibido:", { ...body, password: '***' });
    
    // Validar datos
    const validatedData = registerSchema.parse(body);
    const { nombre, apellido, email, password, telefono, fecha_nacimiento, especialidad } = validatedData;
    console.log("✅ Datos validados correctamente");

    // Verificar si el usuario ya existe
    const existingUser = await pool.query(
      "SELECT id_usuario FROM usuarios WHERE correo = $1",
      [email]
    );
    console.log("🔍 Verificación de usuario existente:", existingUser.rows.length > 0 ? 'Ya existe' : 'No existe');

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "Este correo ya está registrado" },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    console.log("🔒 Hasheando contraseña...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Contraseña hasheada");

    // Crear usuario
    console.log("👤 Creando usuario en la base de datos...");
    const userResult = await pool.query(
      `INSERT INTO usuarios (correo, contrasena, rol, estado, verificado)
       VALUES ($1, $2, 'ESTUDIANTE', 'ACTIVO', false)
       RETURNING id_usuario, correo, rol`,
      [email, hashedPassword]
    );

    const userId = userResult.rows[0].id_usuario;
    console.log("✅ Usuario creado con ID:", userId);

    // Crear perfil de estudiante con todos los datos
    console.log("📚 Creando perfil de estudiante...");
    await pool.query(
      `INSERT INTO estudiantes (id_usuario, nombre, apellido, telefono, fecha_nacimiento, especialidad, onboarding_completado)
       VALUES ($1, $2, $3, $4, $5, $6, true)`,
      [userId, nombre, apellido, telefono || null, fecha_nacimiento || null, especialidad || null]
    );
    console.log("✅ Perfil de estudiante creado");

    // Marcar usuario como verificado automáticamente (sin código)
    console.log("✅ Marcando usuario como verificado...");
    await pool.query(
      "UPDATE usuarios SET verificado = true WHERE id_usuario = $1",
      [userId]
    );
    console.log("✅ Usuario verificado");

    console.log("🎉 Registro completado exitosamente");
    return NextResponse.json(
      {
        success: true,
        message: "Cuenta creada exitosamente. Ya puedes iniciar sesión.",
        user: {
          id: userId,
          email: userResult.rows[0].correo,
          role: userResult.rows[0].rol,
        },
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("❌ Error en registro:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error stack:", error.stack);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    // Error de base de datos - verificar si es violación de unique constraint
    if (error.code === '23505') { // PostgreSQL unique violation
      return NextResponse.json(
        { error: "Este correo ya está registrado" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al crear la cuenta. Por favor intenta de nuevo." },
      { status: 500 }
    );
  }
}
