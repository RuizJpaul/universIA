"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { BookOpen, Users, Target, TrendingUp, ArrowRight, Sparkles } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function Home() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  return (
    <div className="bg-white text-slate-900 overflow-hidden">
      <Navbar />

      <section className="pt-40 pb-32 px-6 text-center relative">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50"
          animate={{ y: [0, -30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"
          animate={{ y: [0, 30, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="max-w-5xl mx-auto space-y-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black leading-none tracking-tight">
              APRENDE EN EL HORARIO QUE MÁS TE CONVENGA.
            </h1>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8 pt-8">
            <motion.h2
              className="text-2xl md:text-3xl font-bold uppercase tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Somos una plataforma educativa de alta calidad dedicada al desarrollo profesional que ofrece acceso
              gratuito.
            </motion.h2>

            <motion.p
              className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              UniversIA es una plataforma abierta para todos. Ofrecemos programas digitales y presenciales diseñados
              para ayudarte a lograr tus objetivos profesionales.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Link href="/programas">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-12 h-14 rounded-none text-lg">
                    EXPLORAR PROGRAMAS
                  </Button>
                </motion.div>
              </Link>
              <Link href="/contacto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className="border-2 border-slate-900 hover:bg-slate-100 font-bold px-12 h-14 rounded-none text-lg">
                    CONTÁCTANOS
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
                    </div>
        </div>
      </section>

      {/* Stats Section with Animations */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { icon: BookOpen, value: "200+", label: "Cursos", color: "text-emerald-600", delay: 0 },
              { icon: Users, value: "150+", label: "Instructores", color: "text-blue-600", delay: 0.1 },
              { icon: Target, value: "95%", label: "Satisfacción", color: "text-amber-600", delay: 0.2 },
              { icon: TrendingUp, value: "24/7", label: "Soporte", color: "text-purple-600", delay: 0.3 },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: stat.delay, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.05 }}
              >
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                  <stat.icon className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 ${stat.color}`} strokeWidth={2} />
                </motion.div>
                <p className={`text-4xl md:text-5xl font-black mb-2 ${stat.color}`}>{stat.value}</p>
                <p className="text-lg md:text-xl font-semibold text-slate-700">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section with Animations */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-center mb-16 uppercase"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Nuestra <span className="text-emerald-600">Comunidad</span>
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                className="aspect-square bg-slate-200 overflow-hidden relative group"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-full h-full bg-linear-to-br from-slate-300 to-slate-400 flex items-center justify-center text-slate-500 transition-all group-hover:from-emerald-400 group-hover:to-blue-400">
                  <motion.div
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Sparkles className="w-16 h-16 group-hover:text-white transition-colors" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA with Parallax */}
      <motion.section className="py-32 px-6 bg-slate-900 text-white relative overflow-hidden" style={{ y }}>
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full opacity-10 blur-3xl"
          animate={{ scale: [1, 1.3, 1], x: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"
          animate={{ scale: [1, 1.4, 1], x: [0, -50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight uppercase"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Únete a la revolución educativa
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Miles de estudiantes ya están transformando su futuro. Descubre todo lo que UniversIA tiene para ofrecerte.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Link href="/servicios">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-white hover:bg-slate-100 text-slate-900 font-bold h-14 px-12 rounded-none text-lg">
                  VER TODOS LOS SERVICIOS
                  <motion.div className="inline-block ml-2" animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
