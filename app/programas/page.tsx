"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
  TrendingUp,
  Code,
  Lightbulb,
  ArrowRight,
  BookOpen,
  Users,
  Award,
  Clock,
  CheckCircle2,
  Star,
  Briefcase,
  Target,
  Sparkles,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"

export default function ProgramasPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const programs = [
    {
      icon: TrendingUp,
      title: "Finanzas Profesionales",
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
      bgColor: "bg-emerald-50",
      accentColor: "bg-emerald-500",
      borderColor: "border-emerald-500",
      textColor: "text-emerald-700",
      level: "Principiante a Avanzado",
      duration: "6-12 meses",
      students: "15,000+",
    },
    {
      icon: Code,
      title: "Tecnología & Desarrollo",
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
      bgColor: "bg-blue-50",
      accentColor: "bg-blue-500",
      borderColor: "border-blue-500",
      textColor: "text-blue-700",
      level: "Todos los niveles",
      duration: "8-16 meses",
      students: "22,000+",
    },
    {
      icon: Lightbulb,
      title: "Emprendimiento & Negocios",
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
      bgColor: "bg-amber-50",
      accentColor: "bg-amber-500",
      borderColor: "border-amber-500",
      textColor: "text-amber-700",
      level: "Intermedio a Avanzado",
      duration: "4-8 meses",
      students: "13,000+",
    },
  ]

  const benefits = [
    {
      icon: Award,
      title: "Certificación Oficial",
      description: "Certificados reconocidos internacionalmente",
    },
    {
      icon: Users,
      title: "Mentores Expertos",
      description: "Profesionales con 10+ años de experiencia",
    },
    {
      icon: Clock,
      title: "Aprende a tu ritmo",
      description: "Acceso 24/7 a todo el contenido",
    },
    {
      icon: Briefcase,
      title: "Casos Prácticos",
      description: "Proyectos reales de la industria",
    },
  ]

  return (
    <div className="bg-linear-to-b from-white to-slate-50 min-h-screen overflow-hidden">
      <Navbar />

      {/* Hero Section - Interactive & Animated */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Floating animated shapes */}
        <motion.div
          className="absolute top-20 right-10 w-32 h-32 bg-emerald-200 rounded-full opacity-30 blur-2xl"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-40 h-40 bg-blue-200 rounded-full opacity-30 blur-2xl"
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-amber-200 rounded-full opacity-20 blur-2xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating icons */}
        <motion.div
          className="absolute top-32 left-12 hidden lg:block"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="bg-white p-4 rounded-2xl shadow-xl border-2 border-emerald-200">
            <Sparkles className="w-8 h-8 text-emerald-500" />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-48 right-20 hidden lg:block"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="bg-white p-4 rounded-2xl shadow-xl border-2 border-blue-200">
            <Zap className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-32 right-1/4 hidden lg:block"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="bg-white p-4 rounded-2xl shadow-xl border-2 border-amber-200">
            <Target className="w-8 h-8 text-amber-500" />
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 text-sm font-bold transition-colors cursor-pointer">
              🎓 Programas Profesionales 2025
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-linear-to-r from-emerald-600 via-blue-600 to-amber-600 bg-clip-text text-transparent leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Transforma Tu Carrera
            <br />
            Con Nuestros Programas
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-10 leading-relaxed px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Programas diseñados por expertos de la industria. Aprende habilidades demandadas con proyectos reales y
            obtén certificaciones que impulsan tu carrera profesional.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/contacto">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-14 px-8 text-lg w-full sm:w-auto shadow-lg"
                >
                  Comenzar Ahora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 font-bold h-14 px-8 text-lg w-full sm:w-auto transition-colors"
              >
                Ver Demo Gratuita
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Programs Grid - Interactive Cards */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">Explora Nuestros Programas</h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Elige el programa que mejor se adapte a tus objetivos profesionales
            </p>
          </motion.div>

          <div className="space-y-12 md:space-y-20">
            {programs.map((program, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card
                    className={`${program.bgColor} border-4 ${program.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer`}
                  >
                    <CardContent className="p-0">
                      <div className="grid lg:grid-cols-2 gap-0">
                        {/* Content Side */}
                        <div className={`p-6 sm:p-8 md:p-12 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                          {/* Header with Icon */}
                          <motion.div
                            className="flex items-start gap-4 mb-6"
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <motion.div
                              className={`${program.accentColor} p-4 rounded-2xl`}
                              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                              transition={{ duration: 0.5 }}
                            >
                              <program.icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={2} />
                            </motion.div>
                            <div className="flex-1">
                              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2">{program.title}</h3>
                              <p className={`text-lg sm:text-xl font-bold ${program.textColor}`}>{program.subtitle}</p>
                            </div>
                          </motion.div>

                          {/* Description */}
                          <p className="text-base sm:text-lg text-slate-700 mb-6 leading-relaxed">{program.description}</p>

                          {/* Info Badges */}
                          <div className="flex flex-wrap gap-2 mb-8">
                            {[
                              { icon: "📚", text: program.level },
                              { icon: "⏱️", text: program.duration },
                              { icon: "�", text: `${program.students} estudiantes` },
                            ].map((badge, idx) => (
                              <motion.div
                                key={idx}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Badge variant="secondary" className="px-3 py-1 text-sm cursor-pointer">
                                  {badge.icon} {badge.text}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>

                          {/* Courses List */}
                          <div className="mb-8">
                            <motion.h4
                              className="font-black text-lg mb-4 flex items-center gap-2"
                              whileHover={{ x: 5 }}
                            >
                              <BookOpen className="w-5 h-5" />
                              Cursos Incluidos:
                            </motion.h4>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {program.courses.map((course, j) => (
                                <motion.div
                                  key={j}
                                  className="flex items-start gap-2"
                                  initial={{ opacity: 0, x: -20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: j * 0.1 }}
                                  whileHover={{ x: 5 }}
                                >
                                  <CheckCircle2 className={`w-5 h-5 ${program.textColor} shrink-0 mt-0.5`} />
                                  <span className="text-sm sm:text-base text-slate-700 font-medium">{course}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* CTA Button */}
                          <Link href="/contacto">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                className={`${program.accentColor} hover:opacity-90 text-white font-bold h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg w-full sm:w-auto shadow-lg`}
                              >
                                Inscribirme Ahora
                                <motion.div
                                  animate={{ x: [0, 5, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                  className="ml-2"
                                >
                                  <ArrowRight className="w-5 h-5" />
                                </motion.div>
                              </Button>
                            </motion.div>
                          </Link>
                        </div>

                        {/* Visual Side - Animated */}
                        <div className={`relative min-h-[300px] lg:min-h-full ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                          <div className={`absolute inset-0 ${program.accentColor} opacity-10`}></div>
                          <div className="absolute inset-0 flex items-center justify-center p-8">
                            <div className="text-center space-y-6">
                              <motion.div
                                animate={{
                                  rotate: [0, 5, -5, 0],
                                  scale: [1, 1.05, 1],
                                }}
                                transition={{
                                  duration: 4,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              >
                                <program.icon
                                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 text-white opacity-20 mx-auto"
                                  strokeWidth={1}
                                />
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                                className="space-y-4"
                              >
                                <motion.div
                                  className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border-2 border-white shadow-xl"
                                  whileHover={{ scale: 1.05, rotate: 2 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  <div className="flex items-center justify-center gap-2 mb-2">
                                    {[...Array(5)].map((_, idx) => (
                                      <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.7 + idx * 0.1 }}
                                      >
                                        <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-amber-400" />
                                      </motion.div>
                                    ))}
                                  </div>
                                  <p className="font-bold text-base sm:text-lg">4.9/5 de satisfacción</p>
                                </motion.div>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Animated Grid */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-linear-to-br from-emerald-50 via-blue-50 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">¿Por Qué Elegir UniversIA?</h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              Aprende con la mejor plataforma educativa de América Latina
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map((benefit, i) => {
              const colors = [
                "from-emerald-500 to-teal-500",
                "from-blue-500 to-indigo-500",
                "from-amber-500 to-orange-500",
                "from-purple-500 to-pink-500",
              ]
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -10, rotate: 2 }}
                >
                  <Card className="border-4 border-slate-900 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white h-full">
                    <CardContent className="p-6 sm:p-8 text-center">
                      <motion.div
                        className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-linear-to-br ${colors[i]} rounded-2xl flex items-center justify-center shadow-xl`}
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.6 }}
                      >
                        <benefit.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={2} />
                      </motion.div>
                      <h3 className="font-black text-lg sm:text-xl mb-2 sm:mb-3">{benefit.title}</h3>
                      <p className="text-sm sm:text-base text-slate-600">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section - Animated Numbers */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="bg-slate-900 rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl overflow-hidden relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated background shapes */}
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full opacity-10 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                x: [0, -50, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 relative z-10">
              {[
                { value: "200+", label: "Cursos Totales", color: "text-emerald-400" },
                { value: "150+", label: "Instructores", color: "text-blue-400" },
                { value: "95%", label: "Satisfacción", color: "text-amber-400" },
                { value: "24/7", label: "Soporte", color: "text-purple-400" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  <motion.p
                    className={`text-4xl sm:text-5xl md:text-6xl font-black mb-2 sm:mb-3 ${stat.color}`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-sm sm:text-base md:text-lg font-semibold text-white">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Gradient with Parallax */}
      <motion.section
        className="py-16 md:py-24 px-4 sm:px-6 bg-linear-to-r from-emerald-500 via-blue-500 to-purple-500 relative overflow-hidden"
        style={{ y }}
      >
        {/* Floating shapes */}
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full opacity-10"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full opacity-10"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Target className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8" strokeWidth={2} />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6">¿Listo Para Comenzar?</h2>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 opacity-95 leading-relaxed px-4">
              Nuestro equipo de asesores académicos te ayudará a diseñar el plan de estudios perfecto según tus
              objetivos y experiencia previa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Link href="/contacto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="bg-white text-slate-900 hover:bg-slate-100 font-bold h-14 px-8 text-lg shadow-xl w-full sm:w-auto"
                  >
                    Hablar con un Asesor
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/servicios">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/10 font-bold h-14 px-8 text-lg w-full sm:w-auto"
                  >
                    Ver Todos los Servicios
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
