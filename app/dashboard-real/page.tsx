import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Pool } from "pg";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, TrendingUp } from "lucide-react";

// Forzar Node.js runtime en lugar de Edge
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function getDashboardData(userId: string) {
  try {
    // Obtener datos del estudiante
    const estudianteResult = await pool.query(
      `SELECT 
        id_estudiante, nombre, apellido, foto_perfil, especialidad, nivel, puntos_xp, onboarding_completado
       FROM estudiantes 
       WHERE id_usuario = $1`,
      [userId]
    );
    
    if (estudianteResult.rows.length === 0) {
      return null;
    }
    
    const estudiante = estudianteResult.rows[0];
    
    // Si no completó onboarding, redirigir
    if (!estudiante.onboarding_completado) {
      redirect("/auth/onboarding");
    }
    
    const idEstudiante = estudiante.id_estudiante;
    
    // Estadísticas básicas
    const statsResult = await pool.query(
      `SELECT 
        COUNT(DISTINCT i.id_inscripcion)::int as cursos_inscritos,
        COUNT(DISTINCT CASE WHEN i.estado_progreso = 'COMPLETADO' THEN i.id_curso END)::int as cursos_completados,
        COUNT(DISTINCT pl.id_leccion)::int as lecciones_completadas,
        COALESCE(SUM(EXTRACT(EPOCH FROM (pl.completado_en - pl.iniciado_en))/3600), 0)::numeric as horas_estudio
       FROM inscripciones i
       LEFT JOIN progreso_lecciones pl ON i.id_inscripcion = pl.id_inscripcion
       WHERE i.id_estudiante = $1`,
      [idEstudiante]
    );
    
    return {
      estudiante: {
        nombre: estudiante.nombre || "",
        apellido: estudiante.apellido || "",
        especialidad: estudiante.especialidad,
        nivel: estudiante.nivel || 1,
        puntos_xp: estudiante.puntos_xp || 0,
        foto_perfil: estudiante.foto_perfil,
      },
      estadisticas: {
        cursosInscritos: statsResult.rows[0]?.cursos_inscritos || 0,
        cursosCompletados: statsResult.rows[0]?.cursos_completados || 0,
        leccionesCompletadas: statsResult.rows[0]?.lecciones_completadas || 0,
        horasEstudio: parseFloat(statsResult.rows[0]?.horas_estudio || "0"),
      }
    };
    
  } catch (error) {
    console.error("Error al obtener datos del dashboard:", error);
    return null;
  }
}

export default async function Dashboard() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect("/auth/login");
  }
  
  const dashboardData = await getDashboardData(session.user.id);
  
  if (!dashboardData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Error al cargar datos. Por favor intenta de nuevo.</p>
      </div>
    );
  }
  
  const { estudiante, estadisticas } = dashboardData;

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
