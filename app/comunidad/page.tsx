import { GraduationCap, Users, MessageSquare, Award } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function ComunidadPage() {
  const testimonials = [
    {
      quote:
        "UNIVERSIA FUE FUNDAMENTAL PARA AYUDARME A OBTENER LAS HABILIDADES Y EL CONOCIMIENTO PARA MI ÚLTIMA PROMOCIÓN PROFESIONAL.",
      author: "María Rodríguez",
      role: "Gerente Financiera",
    },
    {
      quote:
        "LA COMUNIDAD ES INCREÍBLE. HE HECHO CONTACTOS PROFESIONALES QUE ME AYUDARON A CONSEGUIR MI PRIMER EMPLEO EN TECH.",
      author: "Carlos Mendoza",
      role: "Desarrollador Full Stack",
    },
    {
      quote:
        "LOS MENTORES SON EXCEPCIONALES. ME GUIARON PASO A PASO DESDE LA IDEA HASTA LANZAR MI STARTUP EXITOSAMENTE.",
      author: "Ana García",
      role: "Fundadora de FinTech Startup",
    },
  ]

  const stats = [
    { icon: Users, value: "50,000+", label: "Miembros activos" },
    { icon: MessageSquare, value: "10,000+", label: "Discusiones diarias" },
    { icon: GraduationCap, value: "95%", label: "Tasa de graduación" },
    { icon: Award, value: "500+", label: "Eventos al año" },
  ]

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 text-center bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight">NUESTRA COMUNIDAD</h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Más que una plataforma educativa, somos una comunidad global de estudiantes, profesionales y mentores
            apasionados por el aprendizaje y el crecimiento profesional.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center space-y-6">
                <div className="flex justify-center">
                  <stat.icon className="w-16 h-16" strokeWidth={1.5} />
                </div>
                <p className="text-5xl md:text-6xl font-black">{stat.value}</p>
                <p className="text-slate-600 font-semibold text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-6">HISTORIAS DE ÉXITO</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Escucha directamente de nuestros miembros cómo UniversIA transformó sus carreras y vidas.
            </p>
          </div>

          <div className="space-y-12">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-slate-900 text-white p-12 md:p-16">
                <div className="max-w-4xl mx-auto space-y-8">
                  <div className="text-7xl md:text-9xl font-black opacity-20">"</div>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-relaxed">{testimonial.quote}</h3>
                  <div className="pt-4">
                    <p className="text-xl font-medium">- {testimonial.author}</p>
                    <p className="text-lg text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-6">MOMENTOS DE LA COMUNIDAD</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Eventos, meetups, hackathons y más. Mira lo que hacemos juntos.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="aspect-square bg-slate-200 overflow-hidden group">
                <div className="w-full h-full bg-linear-to-br from-slate-300 to-slate-400 flex items-center justify-center text-slate-500 group-hover:from-slate-400 group-hover:to-slate-500 transition-all">
                  <GraduationCap className="w-16 h-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-6">¿QUÉ HACE ESPECIAL A NUESTRA COMUNIDAD?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-slate-900 flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black uppercase">Networking Global</h3>
              <p className="text-slate-600 leading-relaxed">
                Conecta con estudiantes y profesionales de más de 100 países. Crea relaciones que durarán toda tu
                carrera.
              </p>
            </div>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-slate-900 flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black uppercase">Foros Activos</h3>
              <p className="text-slate-600 leading-relaxed">
                Miles de discusiones diarias sobre temas de finanzas, tecnología y emprendimiento. Aprende de los
                mejores.
              </p>
            </div>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-slate-900 flex items-center justify-center">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black uppercase">Eventos Exclusivos</h3>
              <p className="text-slate-600 leading-relaxed">
                Webinars, workshops, hackathons y conferencias con líderes de la industria. Acceso VIP para miembros.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-black uppercase">ÚNETE A LA COMUNIDAD HOY</h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            Sé parte de algo más grande. Conecta, aprende y crece junto a miles de profesionales apasionados.
          </p>
        </div>
      </section>
    </div>
  )
}
