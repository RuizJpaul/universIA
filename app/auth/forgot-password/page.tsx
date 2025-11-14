"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Por favor ingresa tu correo electrónico");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setEmailSent(true);
        toast.success("Revisa tu correo para restablecer tu contraseña");
      } else {
        toast.error(data.message || "Error al enviar el email");
      }
      
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Error al enviar el email. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Revisa tu Email</CardTitle>
            <CardDescription>
              Te hemos enviado un enlace para restablecer tu contraseña
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Si existe una cuenta con el email <strong>{email}</strong>, recibirás un correo con instrucciones para restablecer tu contraseña.
            </p>
            
            <p className="text-sm text-muted-foreground">
              El enlace expirará en 1 hora por seguridad.
            </p>
            
            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">¿Olvidaste tu Contraseña?</CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Enviando..." : "Enviar Enlace de Recuperación"}
            </Button>
            
            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
