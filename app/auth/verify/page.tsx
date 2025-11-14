"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2, Mail } from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown para reenviar código
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email) {
      setError("Email no proporcionado");
      setIsLoading(false);
      return;
    }

    if (code.length !== 6) {
      setError("El código debe tener 6 dígitos");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Código inválido");
      }

      setSuccess(true);
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);

    } catch (error: any) {
      setError(error.message || "Error al verificar el código");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al reenviar código");
      }

      setResendCooldown(60); // 60 segundos de cooldown
      alert("Código reenviado exitosamente. Revisa tu email.");

    } catch (error: any) {
      setError(error.message || "Error al reenviar el código");
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Email no proporcionado. Por favor regístrate nuevamente.
              </AlertDescription>
            </Alert>
            <Button
              className="w-full mt-4"
              onClick={() => router.push("/auth/register")}
            >
              Ir a Registro
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 via-white to-blue-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
            <h2 className="text-2xl font-bold">¡Email Verificado!</h2>
            <p className="text-muted-foreground">
              Tu cuenta ha sido verificada exitosamente. Redirigiendo al inicio de sesión...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Mail className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Verifica tu Email
          </CardTitle>
          <CardDescription>
            Hemos enviado un código de 6 dígitos a<br />
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código de Verificación</Label>
              <Input
                id="code"
                name="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                disabled={isLoading}
                required
                className="text-center text-2xl tracking-widest font-mono"
              />
              <p className="text-xs text-muted-foreground text-center">
                El código expira en 15 minutos
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar Código"
              )}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              ¿No recibiste el código?
            </p>
            <Button
              variant="outline"
              onClick={handleResendCode}
              disabled={isLoading || resendCooldown > 0}
              className="w-full"
            >
              {resendCooldown > 0
                ? `Reenviar en ${resendCooldown}s`
                : "Reenviar Código"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
