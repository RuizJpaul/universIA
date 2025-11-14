"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthRedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("Verificando tu cuenta");

  useEffect(() => {
    const checkAndRedirect = async () => {
      const action = searchParams.get("action"); // "login" o "register"
      
      console.log("AuthRedirect - Status:", status);
      console.log("AuthRedirect - Action:", action);
      console.log("AuthRedirect - Session:", session);

      if (status === "loading") {
        return;
      }

      if (status === "unauthenticated" || !session?.user?.email) {
        console.log("No autenticado, redirigiendo a login");
        router.push("/auth/login");
        return;
      }

      try {
        console.log("Verificando onboarding para:", session.user.email);
        console.log("🔍 Session completa:", JSON.stringify(session, null, 2));
        
        // Verificar si el usuario es nuevo (viene de OAuth sin cuenta previa)
        const isNewUser = (session as any).user?.isNewUser;
        
        console.log("🔍 isNewUser:", isNewUser);
        console.log("🔍 action:", action);
        
        // Si viene de LOGIN, verificar PRIMERO si el usuario existe en la DB
        if (action === "login") {
          setMessage("Verificando tu cuenta...");
          const response = await fetch("/api/auth/check-onboarding");
          const data = await response.json();
          
          console.log("Respuesta de check-onboarding para LOGIN:", data);

          if (response.status === 401 || data.error) {
            // Usuario NO existe en la base de datos
            console.log("❌ Usuario no existe - cerrando sesión y rechazando login");
            setMessage("No tienes cuenta registrada...");
            
            // IMPORTANTE: Cerrar la sesión de OAuth antes de redirigir
            await signOut({ redirect: false });
            
            setTimeout(() => {
              router.push("/auth/login?error=NoAccount");
            }, 1000);
            return;
          }

          // Usuario existe, verificar onboarding
          if (data.needsOnboarding) {
            console.log("Usuario existe pero necesita onboarding");
            router.push("/auth/onboarding");
          } else {
            console.log("Usuario existe y completó onboarding - ir a dashboard");
            router.push("/estudiante/dashboard");
          }
          return;
        }
        
        // Si viene de REGISTRO con usuario nuevo
        if (action === "register") {
          setMessage("Preparando formulario...");
          
          // Guardar datos de OAuth en sessionStorage para autocompletar el formulario
          const oauthData = {
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
            provider: (session as any).oauthData?.provider,
            providerAccountId: (session as any).oauthData?.providerAccountId,
            access_token: (session as any).oauthData?.access_token,
            refresh_token: (session as any).oauthData?.refresh_token,
            expires_at: (session as any).oauthData?.expires_at,
          };
          
          sessionStorage.setItem('oauth_registration_data', JSON.stringify(oauthData));
          
          // Redirigir al formulario de registro con indicador de OAuth
          console.log("Redirigiendo a formulario de registro con datos OAuth");
          router.push("/auth/register?oauth=true");
          return;
        }
        
        // Si NO hay action o es otro caso, verificar en DB por seguridad
        setMessage("Verificando tu cuenta...");
        const response = await fetch("/api/auth/check-onboarding");
        const data = await response.json();
        
        console.log("Respuesta de check-onboarding (sin action):", data);

        if (response.status === 401 || data.error) {
          // Usuario no existe - cerrar sesión
          console.log("Usuario no existe, cerrando sesión y redirigiendo a login");
          await signOut({ redirect: false });
          router.push("/auth/login?error=NoAccount");
          return;
        }

        if (data.needsOnboarding) {
          console.log("Necesita onboarding, redirigiendo...");
          router.push("/auth/onboarding");
        } else {
          console.log("Onboarding completado, redirigiendo a dashboard");
          router.push("/estudiante/dashboard");
        }
      } catch (error) {
        console.error("Error al verificar onboarding:", error);
        router.push("/auth/login?error=ServerError");
      } finally {
        setChecking(false);
      }
    };

    checkAndRedirect();
  }, [session, status, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">Redirigiendo...</p>
          <p className="text-sm text-gray-500">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
