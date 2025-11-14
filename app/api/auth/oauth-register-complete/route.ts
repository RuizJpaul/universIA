import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

export const runtime = 'nodejs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(request: NextRequest) {
  try {
    const { 
      email, 
      nombre, 
      apellido, 
      telefono, 
      fecha_nacimiento, 
      especialidad,
      image,
      oauthProvider,
      oauthProviderAccountId,
      oauthAccessToken,
      oauthRefreshToken,
      oauthExpiresAt
    } = await request.json();

    console.log("📝 OAuth Register Complete - Email:", email);
    console.log("📝 Nombre completo:", nombre, apellido);

    if (!email || !nombre || !apellido) {
      return NextResponse.json(
        { error: "Email, nombre y apellido son requeridos" },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe (creado por oauth-register incompleto)
    const existingUser = await pool.query(
      "SELECT id_usuario FROM usuarios WHERE correo = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      const userId = existingUser.rows[0].id_usuario;
      console.log("⚠️ Usuario ya existe (ID:", userId, "), eliminando registro incompleto...");
      
      // Eliminar estudiante asociado
      await pool.query(
        "DELETE FROM estudiantes WHERE id_usuario = $1",
        [userId]
      );
      
      // Eliminar cuentas OAuth asociadas
      await pool.query(
        "DELETE FROM accounts WHERE user_id = $1",
        [userId]
      );
      
      // Eliminar usuario
      await pool.query(
        "DELETE FROM usuarios WHERE id_usuario = $1",
        [userId]
      );
      
      console.log("✅ Usuario incompleto eliminado, procediendo con registro...");
    }

    console.log("✅ Email disponible, creando usuario...");

    // Crear usuario
    const userResult = await pool.query(
      `INSERT INTO usuarios (correo, rol, estado, verificado, email_verified, image)
       VALUES ($1, 'ESTUDIANTE', 'ACTIVO', true, CURRENT_TIMESTAMP, $2)
       RETURNING id_usuario`,
      [email, image]
    );

    const userId = userResult.rows[0].id_usuario;
    console.log("👤 Usuario creado con ID:", userId);

    // Crear perfil de estudiante con todos los datos
    await pool.query(
      `INSERT INTO estudiantes (
        id_usuario, 
        nombre, 
        apellido, 
        telefono, 
        fecha_nacimiento, 
        especialidad,
        foto_perfil, 
        onboarding_completado
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        userId, 
        nombre, 
        apellido, 
        telefono || null, 
        fecha_nacimiento || null, 
        especialidad || null,
        image, 
        true // Ya completó el onboarding al llenar el formulario
      ]
    );

    console.log("📚 Perfil de estudiante creado");

    // Vincular cuenta OAuth si se proporcionaron los datos
    if (oauthProvider && oauthProviderAccountId) {
      console.log("🔗 Intentando vincular cuenta OAuth...");
      console.log("Provider:", oauthProvider);
      console.log("Provider Account ID:", oauthProviderAccountId);
      
      try {
        await pool.query(
          `INSERT INTO accounts (
            user_id, 
            type, 
            provider, 
            provider_account_id, 
            access_token,
            refresh_token,
            expires_at
          )
          VALUES ($1, 'oauth', $2, $3, $4, $5, $6)
          ON CONFLICT (provider, provider_account_id) DO UPDATE 
          SET user_id = EXCLUDED.user_id,
              access_token = EXCLUDED.access_token,
              refresh_token = EXCLUDED.refresh_token,
              expires_at = EXCLUDED.expires_at`,
          [
            userId,
            oauthProvider,
            oauthProviderAccountId,
            oauthAccessToken || null,
            oauthRefreshToken || null,
            oauthExpiresAt || null
          ]
        );
        
        console.log("✅ Cuenta OAuth vinculada exitosamente");
      } catch (linkError: any) {
        console.error("⚠️ Error al vincular cuenta OAuth:", linkError);
        console.error("⚠️ Error details:", linkError.message);
        // No fallar el registro si no se puede vincular
      }
    } else {
      console.log("⚠️ No se proporcionaron datos OAuth para vincular");
    }

    console.log("🎉 Registro completado exitosamente");

    return NextResponse.json(
      {
        success: true,
        userId,
        message: "Cuenta creada exitosamente"
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("❌ Error en OAuth register complete:", error);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);
    
    return NextResponse.json(
      { 
        error: "Error al crear la cuenta",
        details: error.message,
        debug: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
