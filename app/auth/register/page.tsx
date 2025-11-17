"use client";

import { signIn, signOut } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const especialidades = [
  "Ingeniería de Sistemas",
  "Ingeniería Industrial",
  "Administración de Empresas",
  "Contabilidad",
  "Economía",
  "Derecho",
  "Medicina",
  "Psicología",
  "Arquitectura",
  "Marketing",
  "Diseño Gráfico",
  "Comunicaciones",
  "Educación",
  "Enfermería",
  "Otro"
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOAuthRegistration, setIsOAuthRegistration] = useState(false);
  const [oauthData, setOauthData] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    fecha_nacimiento: "",
    especialidad: "",
  });

  // Cargar datos de OAuth si viene de Google
  useEffect(() => {
    const isOAuth = searchParams.get('oauth') === 'true';
    if (isOAuth) {
      const storedData = sessionStorage.getItem('oauth_registration_data');
      if (storedData) {
        try {
          const data = JSON.parse(storedData);
          setIsOAuthRegistration(true);
          setOauthData(data);
          
          // Autocompletar campos con datos de Google
          const nameParts = data.name?.split(' ') || ['', ''];
          setFormData(prev => ({
            ...prev,
            nombre: nameParts[0] || '',
            apellido: nameParts.slice(1).join(' ') || '',
            email: data.email || '',
          }));
        } catch (error) {
          console.error('Error al cargar datos OAuth:', error);
        }
      }
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validaciones
    if (!formData.nombre || !formData.apellido || !formData.email) {
      setError("Por favor completa todos los campos obligatorios");
      setIsLoading(false);
      return;
    }

    // Solo validar contraseña si NO es OAuth
    if (!isOAuthRegistration) {
      if (!formData.password) {
        setError("La contraseña es requerida");
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Las contraseñas no coinciden");
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        setIsLoading(false);
        return;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email inválido");
      setIsLoading(false);
      return;
    }

    try {
      // Si es OAuth, usar endpoint especial que también vincula la cuenta
      if (isOAuthRegistration && oauthData) {
        console.log("📤 Enviando registro OAuth con datos:", {
          email: formData.email,
          nombre: formData.nombre,
          apellido: formData.apellido,
          especialidad: formData.especialidad,
          provider: oauthData?.provider,
        });
        
        const response = await fetch("/api/auth/oauth-register-complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            nombre: formData.nombre,
            apellido: formData.apellido,
            telefono: formData.telefono,
            fecha_nacimiento: formData.fecha_nacimiento,
            especialidad: formData.especialidad,
            image: oauthData?.image,
            oauthProvider: oauthData?.provider,
            oauthProviderAccountId: oauthData?.providerAccountId,
            oauthAccessToken: oauthData?.access_token,
            oauthRefreshToken: oauthData?.refresh_token,
            oauthExpiresAt: oauthData?.expires_at,
          }),
        });

        const data = await response.json();
        
        console.log("📥 Respuesta del servidor:", {
          status: response.status,
          ok: response.ok,
          data
        });

        if (!response.ok) {
          console.error("❌ Error del servidor:", data);
          throw new Error(data.error || data.details || "Error al registrarse");
        }
        
        console.log("✅ Registro OAuth exitoso");

        // Limpiar sessionStorage
        sessionStorage.removeItem('oauth_registration_data');
        
        // Cerrar sesión OAuth temporal
        console.log("🚪 Cerrando sesión temporal de OAuth...");
        await signOut({ redirect: false });
      } else {
        // Registro normal con email/contraseña
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: formData.nombre,
            apellido: formData.apellido,
            email: formData.email,
            password: formData.password,
            telefono: formData.telefono,
            fecha_nacimiento: formData.fecha_nacimiento,
            especialidad: formData.especialidad,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al registrarse");
        }
      }

      // Redirigir a login con mensaje de éxito
      router.push(`/auth/login?registered=true`);

    } catch (error: any) {
      setError(error.message || "Error al registrarse. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Registro con Google
  const handleGoogleRegister = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Marcar en localStorage que viene de registro
      localStorage.setItem('oauth_action', 'register');
      
      await signIn("google", { 
        callbackUrl: "/auth/redirect?action=register",
        redirect: true 
      });
    } catch (error) {
      setError("Error al registrarse con Google");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-2xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Únete a UniversIA
          </CardTitle>
          <CardDescription className="text-center">
            Crea tu cuenta y comienza tu viaje educativo
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Mensaje de error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Botón de Google */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleRegister}
              disabled={isLoading}
              type="button"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Registrarse con Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                O regístrate con email
              </span>
            </div>
          </div>

          {/* Formulario de registro */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  placeholder="Juan"
                  value={formData.nombre}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  name="apellido"
                  placeholder="Pérez"
                  value={formData.apellido}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono (opcional)</Label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                placeholder="+51 999 999 999"
                value={formData.telefono}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                <Input
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="especialidad">Especialidad</Label>
                <select
                  id="especialidad"
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecciona una especialidad</option>
                  {especialidades.map((esp) => (
                    <option key={esp} value={esp}>
                      {esp}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mensaje informativo para OAuth */}
            {isOAuthRegistration && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-800 text-sm">
                  ℹ️ Estás registrándote con Google. No necesitas crear una contraseña.
                </AlertDescription>
              </Alert>
            )}

            {/* Solo mostrar campos de contraseña si NO es registro OAuth */}
            {!isOAuthRegistration && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Repite tu contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Crear cuenta"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/auth/login" className="text-purple-600 hover:underline font-medium">
              Inicia sesión
            </Link>
          </div>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
