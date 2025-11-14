"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    especialidad: "",
    telefono: "",
    fecha_nacimiento: "",
    biografia: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.apellido || !formData.especialidad) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al completar el perfil");
      }
      
      // Actualizar sesión
      await update();
      
      toast.success("¡Perfil completado exitosamente!");
      router.push("/estudiante/dashboard");
      
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Error al completar el perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Completa tu Perfil</CardTitle>
          <CardDescription>
            Necesitamos algunos datos adicionales para personalizar tu experiencia en UniversIA
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  type="text"
                  placeholder="Tu apellido"
                  value={formData.apellido}
                  onChange={(e) => handleChange("apellido", e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="especialidad">Especialidad *</Label>
              <Select
                value={formData.especialidad}
                onValueChange={(value) => handleChange("especialidad", value)}
              >
                <SelectTrigger id="especialidad">
                  <SelectValue placeholder="Selecciona tu especialidad" />
                </SelectTrigger>
                <SelectContent>
                  {especialidades.map((esp) => (
                    <SelectItem key={esp} value={esp}>
                      {esp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="+51 999 999 999"
                  value={formData.telefono}
                  onChange={(e) => handleChange("telefono", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                <Input
                  id="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => handleChange("fecha_nacimiento", e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="biografia">Cuéntanos sobre ti</Label>
              <Textarea
                id="biografia"
                placeholder="Describe tus intereses, metas académicas o profesionales..."
                value={formData.biografia}
                onChange={(e) => handleChange("biografia", e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                * Campos obligatorios
              </p>
              
              <Button type="submit" disabled={loading} size="lg">
                {loading ? "Guardando..." : "Completar Perfil"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
