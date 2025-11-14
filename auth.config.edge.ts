import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

// Configuración básica sin PostgreSQL (para middleware/edge)
export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    
    // Credentials provider (la lógica real está en auth.ts)
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async () => null, // Se maneja en auth.ts
    }),
  ],
  
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).rol || "ESTUDIANTE";
        token.estado = (user as any).estado;
        token.verificado = (user as any).verificado;
        token.needsOnboarding = (user as any).needsOnboarding || false;
        token.isNewUser = (user as any).isNewUser || false;
      }
      
      if (account?.provider && profile) {
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.tokenType = account.token_type;
        token.scope = account.scope;
        token.idToken = account.id_token;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.estado = token.estado as string;
        session.user.verificado = token.verificado as boolean;
        session.user.provider = token.provider as string | undefined;
        session.user.needsOnboarding = token.needsOnboarding as boolean;
        (session.user as any).isNewUser = token.isNewUser as boolean;
        
        // Datos de OAuth para vincular cuenta
        (session as any).oauthData = {
          provider: token.provider,
          providerAccountId: token.providerAccountId,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          expiresAt: token.expiresAt,
          tokenType: token.tokenType,
          scope: token.scope,
          idToken: token.idToken,
        };
      }
      
      return session;
    },
    
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAuthPage = nextUrl.pathname.startsWith('/auth');
      
      // Rutas públicas que no requieren autenticación
      const publicRoutes = [
        '/',
        '/news',
        '/community',
        '/courses',
        '/course',
        '/fintech',
        '/tutor',
        '/dashboard',
        '/api',
      ];
      
      const isOnPublicPage = publicRoutes.some(route => 
        nextUrl.pathname === route || nextUrl.pathname.startsWith(route + '/')
      );
      
      // Si está en página de auth y ya está logueado, redirigir al dashboard
      if (isOnAuthPage && isLoggedIn) {
        return Response.redirect(new URL('/dashboard-real', nextUrl));
      }
      
      // Solo proteger rutas que explícitamente requieren autenticación
      const protectedRoutes = ['/estudiante', '/admin', '/empresa', '/dashboard-real'];
      const isProtectedRoute = protectedRoutes.some(route => 
        nextUrl.pathname.startsWith(route)
      );
      
      if (isProtectedRoute && !isLoggedIn) {
        return Response.redirect(new URL('/auth/login', nextUrl));
      }
      
      return true;
    },
  },
  
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  
  debug: process.env.NODE_ENV === "development",
};
