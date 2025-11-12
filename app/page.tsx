"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GraduationCap, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <div className="bg-white text-slate-900 overflow-hidden">
      <Navbar />

      <section className="pt-40 pb-32 px-6 text-center">
        <div className="max-w-5xl mx-auto space-y-12">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black leading-none tracking-tight">
            APRENDE EN EL HORARIO QUE MÁS TE CONVENGA.
          </h1>

          <div className="max-w-4xl mx-auto space-y-8 pt-8">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide">
              Somos una plataforma educativa de alta calidad dedicada al desarrollo profesional que ofrece acceso
              gratuito.
            </h2>

            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              UniversIA es una plataforma abierta para todos. Ofrecemos programas digitales y presenciales diseñados
              para ayudarte a lograr tus objetivos profesionales. Descubre todas las ofertas de nuestra plataforma a
              continuación.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link href="/programas">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-12 h-14 rounded-none text-lg">
                  EXPLORAR PROGRAMAS
                </Button>
              </Link>
              <Link href="/contacto">
                <Button
                  variant="outline"
                  className="border-2 border-slate-900 hover:bg-slate-100 font-bold px-12 h-14 rounded-none text-lg"
                >
                  CONTÁCTANOS
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="text-center space-y-4">
              <p className="text-5xl md:text-6xl font-black">50K+</p>
              <p className="text-slate-600 font-semibold text-base md:text-lg">Estudiantes activos</p>
            </div>
            <div className="text-center space-y-4">
              <p className="text-5xl md:text-6xl font-black">200+</p>
              <p className="text-slate-600 font-semibold text-base md:text-lg">Cursos disponibles</p>
            </div>
            <div className="text-center space-y-4">
              <p className="text-5xl md:text-6xl font-black">4.9/5</p>
              <p className="text-slate-600 font-semibold text-base md:text-lg">Calificación promedio</p>
            </div>
            <div className="text-center space-y-4">
              <p className="text-5xl md:text-6xl font-black">+</p>
              <p className="text-slate-600 font-semibold text-base md:text-lg">Becas distribuidas</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="aspect-square bg-slate-200 overflow-hidden">
              <div className="w-full h-full bg-linear-to-br from-slate-300 to-slate-400 flex items-center justify-center text-slate-500">
                <GraduationCap className="w-16 h-16" />
              </div>
            </div>
            <div className="aspect-square bg-slate-200 overflow-hidden">
              <div className="w-full h-full bg-linear-to-br from-slate-300 to-slate-400 flex items-center justify-center text-slate-500">
                <GraduationCap className="w-16 h-16" />
              </div>
            </div>
            <div className="aspect-square bg-slate-200 overflow-hidden">
              <div className="w-full h-full bg-linear-to-br from-slate-300 to-slate-400 flex items-center justify-center text-slate-500">
                <GraduationCap className="w-16 h-16" />
              </div>
            </div>
            <div className="aspect-square bg-slate-200 overflow-hidden">
              <div className="w-full h-full bg-linear-to-br from-slate-300 to-slate-400 flex items-center justify-center text-slate-500">
                <GraduationCap className="w-16 h-16" />
              </div>
            </div>
            <div className="aspect-square bg-slate-200 overflow-hidden">
              <div className="w-full h-full bg-linear-to-br from-slate-300 to-slate-400 flex items-center justify-center text-slate-500">
                <GraduationCap className="w-16 h-16" />
              </div>
            </div>
            <div className="aspect-square bg-slate-200 overflow-hidden">
              <div className="w-full h-full bg-linear-to-br from-slate-300 to-slate-400 flex items-center justify-center text-slate-500">
                <GraduationCap className="w-16 h-16" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight uppercase">
            Únete a la revolución educativa
          </h2>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Miles de estudiantes ya están transformando su futuro. Descubre todo lo que UniversIA tiene para ofrecerte.
          </p>
          <Link href="/servicios">
            <Button className="bg-white hover:bg-slate-100 text-slate-900 font-bold h-14 px-12 rounded-none text-lg">
              VER TODOS LOS SERVICIOS
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
