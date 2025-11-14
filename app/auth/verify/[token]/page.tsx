"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmailPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verifyEmail() {
      try {
        const response = await fetch(`/api/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: params.token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email verificado correctamente");
          
          // Redirigir al login después de 3 segundos
          setTimeout(() => {
            router.push("/auth/login?verified=true");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.message || "Error al verificar el email");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Error al verificar el email. Por favor intenta de nuevo.");
      }
    }

    verifyEmail();
  }, [params.token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {status === "loading" && "Verificando Email"}
            {status === "success" && "¡Email Verificado!"}
            {status === "error" && "Error de Verificación"}
          </CardTitle>
          <CardDescription className="text-center">
            {status === "loading" && "Por favor espera..."}
            {status === "success" && "Tu cuenta ha sido activada"}
            {status === "error" && "No pudimos verificar tu email"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center gap-4">
          {status === "loading" && (
            <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
          )}
          
          {status === "success" && (
            <>
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <p className="text-center text-muted-foreground">{message}</p>
              <p className="text-sm text-center text-muted-foreground">
                Redirigiendo al login...
              </p>
            </>
          )}
          
          {status === "error" && (
            <>
              <XCircle className="h-16 w-16 text-red-500" />
              <p className="text-center text-muted-foreground">{message}</p>
              <Button
                onClick={() => router.push("/auth/login")}
                className="mt-4"
              >
                Ir al Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
