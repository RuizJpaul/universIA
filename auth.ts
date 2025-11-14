import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { z } from "zod";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Contraseña debe tener al menos 6 caracteres" }),
});

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers.filter(p => p.id !== "credentials"),
    // Override Credentials con la lógica real
    {
      id: "credentials",
      name: "credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          const validatedFields = loginSchema.safeParse(credentials);
          
          if (!validatedFields.success) {
            return null;
          }
          
          const { email, password } = validatedFields.data;
          
          const result = await pool.query(
            `SELECT 
              u.id_usuario as id,
              u.correo as email,
              u.contrasena as password,
              u.rol,
              u.estado,
              u.verificado,
              u.image,
              COALESCE(e.nombre || ' ' || e.apellido, a.nombre, emp.nombre_comercial) as name
            FROM usuarios u
            LEFT JOIN estudiantes e ON u.id_usuario = e.id_usuario
            LEFT JOIN administradores a ON u.id_usuario = a.id_usuario
            LEFT JOIN empresas emp ON u.id_usuario = emp.id_usuario
            WHERE u.correo = $1`,
            [email]
          );
          
          const user = result.rows[0];
          
          if (!user) {
            throw new Error("Usuario no encontrado");
          }
          
          if (!user.password) {
            throw new Error("Este usuario está registrado con Google o GitHub. Por favor usa ese método para iniciar sesión.");
          }
          
          const passwordMatch = await bcrypt.compare(password, user.password);
          
          if (!passwordMatch) {
            throw new Error("Contraseña incorrecta");
          }
          
          if (user.estado !== "ACTIVO") {
            throw new Error("Tu cuenta está suspendida o eliminada");
          }
          
          await pool.query(
            "UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id_usuario = $1",
            [user.id]
          );
          
          const { password: _, ...userWithoutPassword } = user;
          return userWithoutPassword;
          
        } catch (error: any) {
          console.error("Error en authorize:", error);
          throw new Error(error.message || "Error al iniciar sesión");
        }
      },
    },
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile, credentials }) {
      try {
        console.log("=== signIn Callback ===");
        console.log("Provider:", account?.provider);
        console.log("User email:", user.email);
        console.log("Full account object:", JSON.stringify(account, null, 2));
        
        if (account?.provider !== "credentials") {
          const email = user.email;
          
          if (!email) {
            console.log("No email provided");
            return false;
          }
          
          const existingUserQuery = await pool.query(
            `SELECT u.id_usuario, u.rol, u.estado, e.onboarding_completado
             FROM usuarios u
             LEFT JOIN estudiantes e ON u.id_usuario = e.id_usuario
             WHERE u.correo = $1`,
            [email]
          );
          
          console.log("Existing user query result:", existingUserQuery.rows);
          
          if (existingUserQuery.rows.length === 0) {
            // Usuario NO existe
            console.log("Usuario no encontrado en la base de datos");
            
            // Marcar como nuevo usuario y permitir continuar
            // El redirect page verificará el action y decidirá si crear cuenta o rechazar
            (user as any).isNewUser = true;
            console.log("⚠️ Marcado como nuevo usuario - redirect page decidirá");
            return true;
          } else {
            const existingUser = existingUserQuery.rows[0];
            console.log("User exists, onboarding completed:", existingUser.onboarding_completado);
            
            // Actualizar último acceso e imagen
            await pool.query(
              `UPDATE usuarios 
               SET email_verified = CURRENT_TIMESTAMP, 
                   ultimo_acceso = CURRENT_TIMESTAMP,
                   image = COALESCE(image, $2)
               WHERE correo = $1`,
              [email, user.image]
            );
            
            // Si no completó onboarding, marcar para redirección
            if (!existingUser.onboarding_completado) {
              (user as any).needsOnboarding = true;
              console.log("Marked for onboarding (existing user)");
            }
          }
        }
        
        console.log("signIn callback returning true");
        return true;
      } catch (error) {
        console.error("Error en signIn callback:", error);
        return false;
      }
    },
  },
  events: {
    async signIn(message: any) {
      console.log(`Usuario ${message.user.email} ha iniciado sesión con ${message.account?.provider}`);
    },
    
    async signOut(message: any) {
      console.log(`Usuario ha cerrado sesión`);
    },
  },
});
