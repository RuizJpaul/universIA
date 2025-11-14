"use client";

import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Trophy, Clock, TrendingUp } from "lucide-react";

interface DashboardClientProps {
  data: {
    estudiante: {
      nombre: string;
      apellido: string;
      especialidad: string | null;
      nivel: number;
      puntos_xp: number;
      foto_perfil: string | null;
    };
    estadisticas: {
      cursosInscritos: number;
      cursosCompletados: number;
      leccionesCompletadas: number;
      horasEstudio: number;
    };
  };
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function DashboardClient({ data, user }: DashboardClientProps) {
  const { estudiante, estadisticas } = data;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={true} />
      
      <main className="flex-1 overflow-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            ¡Bienvenido, {estudiante.nombre} {estudiante.apellido}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {estudiante.especialidad || "Completa tu perfil para una mejor experiencia"}
          </p>
        </div>
        
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cursos Inscritos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticas.cursosInscritos}</div>
              <p className="text-xs text-muted-foreground">
                {estadisticas.cursosCompletados} completados
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nivel</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estudiante.nivel}</div>
              <p className="text-xs text-muted-foreground">
                {estudiante.puntos_xp} puntos XP
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lecciones</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticas.leccionesCompletadas}</div>
              <p className="text-xs text-muted-foreground">
                Completadas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo de Estudio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticas.horasEstudio.toFixed(1)}h</div>
              <p className="text-xs text-muted-foreground">
                Total acumulado
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Mensaje de inicio */}
        <Card>
          <CardHeader>
            <CardTitle>🎓 Comienza tu Aprendizaje con IA</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              UniversIA está lista para ayudarte. Explora cursos, interactúa con tutores de IA,
              y alcanza tus metas académicas.
            </p>
            <div className="flex gap-3">
              <a 
                href="/courses" 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Explorar Cursos
              </a>
              <a 
                href="/tutor" 
                className="px-4 py-2 border rounded-md hover:bg-accent"
              >
                Tutor IA
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
