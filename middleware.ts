import NextAuth from "next-auth";
import { authConfig } from "./auth.config.edge";

export default NextAuth(authConfig).auth;

export const config = {
  // Solo proteger rutas específicas que requieren autenticación
  matcher: [
    '/estudiante/:path*',
    '/admin/:path*',
    '/empresa/:path*',
    '/dashboard-real/:path*',
  ],
};
