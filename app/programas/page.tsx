import { TrendingUp, Code, Lightbulb, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"

export default function ProgramasPage() {
  const programs = [
    {
      icon: TrendingUp,
      title: "FINANZAS",
      subtitle: "Domina el mundo financiero",
      description:
        "Aprende inversión, análisis financiero y gestión de portafolios con expertos de la industria. Desde conceptos básicos hasta estrategias avanzadas de trading e inversión.",
      courses: [
        "Análisis Financiero Fundamental",
        "Mercados de Valores y Trading",
        "Gestión de Portafolios",
        "Finanzas Corporativas",
        "Criptomonedas y Blockchain",
        "Análisis Técnico Avanzado",
      ],
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Code,
      title: "TECNOLOGÍA",
      subtitle: "Conviértete en desarrollador experto",
      description:
        "Domina programación, desarrollo web, ciencia de datos y tecnologías emergentes. Aprende los lenguajes y frameworks más demandados por la industria.",
      courses: [
        "Desarrollo Web Full Stack",
        "Python para Data Science",
        "Inteligencia Artificial y Machine Learning",
        "Desarrollo de Apps Móviles",
        "DevOps y Cloud Computing",
        "Ciberseguridad",
      ],
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Lightbulb,
      title: "EMPRENDIMIENTO",
      subtitle: "Construye tu propio camino",
      description:
        "Desarrolla habilidades empresariales, pitch de negocios y estrategias de crecimiento. Aprende a transformar tus ideas en negocios exitosos y escalables.",
      courses: [
        "Fundamentos de Emprendimiento",
        "Business Model Canvas",
        "Marketing Digital y Growth Hacking",
        "Fundraising e Inversión",
        "Liderazgo y Gestión de Equipos",
        "Innovación y Design Thinking",
      ],
      color: "from-purple-500 to-pink-600",
    },
  ]

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 text-center bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight">
            NUESTROS PROGRAMAS
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Explora nuestras tres áreas principales de especialización. Cada programa está diseñado por expertos de la
            industria y actualizado constantemente con las últimas tendencias.
          </p>
        </div>
      </section>

      {/* Programs */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-32">
          {programs.map((program, i) => (
            <div key={i} className={`grid lg:grid-cols-2 gap-16 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className={`aspect-square bg-gradient-to-br ${program.color} rounded-2xl flex items-center justify-center`}>
                  <program.icon className="w-32 h-32 text-white" strokeWidth={1.5} />
                </div>
              </div>

              <div className={`space-y-8 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="space-y-4">
                  <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tight">{program.title}</h2>
                  <p className="text-2xl font-bold text-slate-600">{program.subtitle}</p>
                </div>

                <p className="text-lg text-slate-600 leading-relaxed">{program.description}</p>

                <div>
                  <h3 className="text-xl font-black uppercase mb-4">Cursos destacados:</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {program.courses.map((course, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="text-slate-400 mt-1">•</span>
                        <span className="text-slate-700">{course}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/contacto">
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 px-8 rounded-none mt-6">
                    COMENZAR AHORA
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="text-center space-y-4">
              <p className="text-5xl md:text-6xl font-black">200+</p>
              <p className="text-slate-600 font-semibold">Cursos totales</p>
            </div>
            <div className="text-center space-y-4">
              <p className="text-5xl md:text-6xl font-black">150+</p>
              <p className="text-slate-600 font-semibold">Instructores expertos</p>
            </div>
            <div className="text-center space-y-4">
              <p className="text-5xl md:text-6xl font-black">95%</p>
              <p className="text-slate-600 font-semibold">Tasa de satisfacción</p>
            </div>
            <div className="text-center space-y-4">
              <p className="text-5xl md:text-6xl font-black">24/7</p>
              <p className="text-slate-600 font-semibold">Soporte disponible</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-black uppercase">¿No sabes por dónde empezar?</h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            Nuestro equipo de asesores académicos te ayudará a diseñar el plan de estudios perfecto según tus objetivos
            y experiencia previa.
          </p>
          <Link href="/contacto">
            <Button className="bg-white hover:bg-slate-100 text-slate-900 font-bold h-14 px-12 rounded-none text-lg">
              HABLAR CON UN ASESOR
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
