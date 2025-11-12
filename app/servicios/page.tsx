import {
  GraduationCap,
  BookOpen,
  Users,
  TrendingUp,
  Sparkles,
  Building2,
  Award,
  Lock,
  BarChart3,
  Globe,
  Zap,
  MessageSquare,
} from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function ServiciosPage() {
  const services = [
    {
      icon: Sparkles,
      title: "Tutorías con IA 24/7",
      description:
        "Asistente inteligente disponible las 24 horas para responder preguntas, explicar conceptos y ayudarte con tus tareas académicas.",
    },
    {
      icon: BookOpen,
      title: "Cursos premium",
      description:
        "Acceso ilimitado a más de 200 cursos en finanzas, tecnología y emprendimiento impartidos por expertos de la industria.",
    },
    {
      icon: Users,
      title: "Mentores personales",
      description:
        "Conexión directa con profesionales experimentados que te guiarán en tu desarrollo profesional y académico.",
    },
    {
      icon: Building2,
      title: "Red empresarial",
      description:
        "Acceso a nuestra red de empresas asociadas para oportunidades de empleo, pasantías y networking profesional.",
    },
    {
      icon: Award,
      title: "Certificaciones globales",
      description:
        "Obtén certificados reconocidos internacionalmente que validan tus habilidades y conocimientos adquiridos.",
    },
    {
      icon: Lock,
      title: "Portal FinTech",
      description:
        "Plataforma integrada para gestión de pagos, becas, préstamos educativos y planificación financiera personal.",
    },
    {
      icon: TrendingUp,
      title: "Análisis de progreso",
      description:
        "Dashboard personalizado con métricas detalladas de tu avance académico, puntos fuertes y áreas de mejora.",
    },
    {
      icon: BarChart3,
      title: "Becas automáticas",
      description:
        "Sistema inteligente que te empareja automáticamente con becas y ayudas financieras según tu perfil y rendimiento.",
    },
    {
      icon: Zap,
      title: "Dashboard financiero",
      description:
        "Herramientas completas para monitorear gastos educativos, planificar presupuestos y optimizar tus finanzas.",
    },
    {
      icon: Globe,
      title: "Comunidad global",
      description:
        "Únete a una red de más de 50,000 estudiantes de todo el mundo. Comparte experiencias y colabora en proyectos.",
    },
    {
      icon: GraduationCap,
      title: "Laboratorios virtuales",
      description:
        "Entornos de práctica simulados para aplicar tus conocimientos en escenarios reales sin riesgo.",
    },
    {
      icon: MessageSquare,
      title: "Foros y discusiones",
      description:
        "Espacios de diálogo donde puedes hacer preguntas, compartir conocimientos y aprender de tus compañeros.",
    },
  ]

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 text-center bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight">
            SERVICIOS ADICIONALES
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            En UniversIA, siempre ampliamos nuestros servicios adicionales para satisfacer las necesidades de nuestra
            comunidad. ¿Hay algo que te gustaría que añadiéramos a la lista? Envía una solicitud.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div
                key={i}
                className="p-8 bg-white border-2 border-slate-200 hover:border-slate-900 transition-all group"
              >
                <service.icon className="w-12 h-12 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-black uppercase">¿Listo para comenzar?</h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            Todos estos servicios están disponibles para ti. Únete a UniversIA hoy y transforma tu futuro educativo.
          </p>
        </div>
      </section>
    </div>
  )
}
