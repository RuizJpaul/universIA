import type { NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

// Configuración de NextAuth sin PostgreSQL (compatible con Edge Runtime)
// La lógica de base de datos está en auth.ts
export const authConfig: NextAuthConfig = {
  // Sin adaptador - gestionamos sesiones manualmente con JWT
  
  providers: [
    // Google OAuth
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    
    // GitHub OAuth
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    
    // Credentials (Email y Password tradicional)
    // La implementación real está en auth.ts
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials: any) {
        // Esta función será sobreescrita en auth.ts
        return null;
      },
    }),
  ],
  
  // Callbacks personalizados
  callbacks: {
    // Se ejecuta cuando se crea/actualiza el JWT
    async jwt({ token, user, account, profile }: { token: JWT; user?: any; account?: any; profile?: any }) {
      // Agregar datos del usuario al token en el primer login
      if (user) {
        token.id = user.id;
        token.role = (user as any).rol || "ESTUDIANTE";
        token.estado = (user as any).estado;
        token.verificado = (user as any).verificado;
      }
      
      // Si es OAuth, guardar datos adicionales
      if (account?.provider && profile) {
        token.provider = account.provider;
      }
      
      return token;
    },
    
    // Se ejecuta cuando se accede a la sesión (en el cliente)
    async session({ session, token }: { session: any; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.estado = token.estado as string;
        session.user.verificado = token.verificado as boolean;
        session.user.provider = token.provider as string | undefined;
      }
      
      return session;
    },
  },
  
  // Páginas personalizadas
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
    newUser: "/auth/onboarding",
  },
  
  // Configuración de sesión
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  
  // Configuración de JWT
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  
  // Debug en desarrollo
  debug: process.env.NODE_ENV === "development",
};
