"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Phone, MapPin, Instagram, Youtube, Facebook } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    mensaje: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Aquí implementarías la lógica de envío
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 text-center bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight">CONTÁCTANOS</h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            ¿Tienes preguntas? Nuestro equipo está listo para ayudarte. Agenda una sesión informativa gratuita o envíanos un mensaje.
          </p>
        </div>
      </section>

      {/* Form & Info Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
                PROGRAMA UNA SESIÓN
              </h2>
              <p className="text-lg text-slate-600">
                Haz un recorrido gratuito de 30 minutos de nuestra plataforma para ayudarte a decidir si UniversIA es
                la opción correcta para ti. Tendrás la oportunidad de explorar los cursos, conocer la comunidad y
                obtener las respuestas a todas tus preguntas.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase tracking-wide">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="rounded-none border-2 border-slate-300 focus:border-slate-900 h-12"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Apellido</label>
                  <Input
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="rounded-none border-2 border-slate-300 focus:border-slate-900 h-12"
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">
                  Correo electrónico <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-none border-2 border-slate-300 focus:border-slate-900 h-12"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Teléfono</label>
                <Input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="rounded-none border-2 border-slate-300 focus:border-slate-900 h-12"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Mensaje</label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 border-slate-300 focus:border-slate-900 focus:outline-none min-h-[150px]"
                  placeholder="Cuéntanos sobre tus objetivos y cómo podemos ayudarte..."
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-14 rounded-none text-lg uppercase"
              >
                ENVIAR MENSAJE
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tight mb-8">INFORMACIÓN DE CONTACTO</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 shrink-0 mt-1" />
                  <div>
                    <p className="font-bold mb-1">Email</p>
                    <a href="mailto:contacto@universia.com" className="text-slate-600 hover:text-slate-900 transition">
                      contacto@universia.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 shrink-0 mt-1" />
                  <div>
                    <p className="font-bold mb-1">Teléfono</p>
                    <a href="tel:+15551234567" className="text-slate-600 hover:text-slate-900 transition">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 shrink-0 mt-1" />
                  <div>
                    <p className="font-bold mb-1">Oficina Principal</p>
                    <p className="text-slate-600">
                      123 Innovation Drive
                      <br />
                      Tech Valley, CA 94000
                      <br />
                      Estados Unidos
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-black uppercase tracking-tight mb-8">HORARIO DE ATENCIÓN</h3>
              <div className="space-y-3 text-slate-600">
                <p>
                  <span className="font-bold text-slate-900">Lunes - Viernes:</span> 9:00 AM - 6:00 PM
                </p>
                <p>
                  <span className="font-bold text-slate-900">Sábado:</span> 10:00 AM - 4:00 PM
                </p>
                <p>
                  <span className="font-bold text-slate-900">Domingo:</span> Cerrado
                </p>
                <p className="text-sm pt-4">
                  * Soporte técnico disponible 24/7 a través de nuestro chat en línea
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-black uppercase tracking-tight mb-8">SÍGUENOS</h3>
              <div className="flex gap-6">
                <a href="#" className="w-12 h-12 bg-slate-900 flex items-center justify-center hover:bg-slate-800 transition">
                  <Instagram className="w-6 h-6 text-white" />
                </a>
                <a href="#" className="w-12 h-12 bg-slate-900 flex items-center justify-center hover:bg-slate-800 transition">
                  <Youtube className="w-6 h-6 text-white" />
                </a>
                <a href="#" className="w-12 h-12 bg-slate-900 flex items-center justify-center hover:bg-slate-800 transition">
                  <Facebook className="w-6 h-6 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black uppercase text-center mb-16">PREGUNTAS FRECUENTES</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-black mb-3">¿Cuánto cuesta la membresía?</h3>
              <p className="text-slate-600 leading-relaxed">
                Ofrecemos acceso gratuito a contenido básico, y planes premium desde $29/mes con acceso ilimitado a
                todos los cursos, mentorías y servicios adicionales.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-black mb-3">¿Ofrecen certificados?</h3>
              <p className="text-slate-600 leading-relaxed">
                Sí, todos nuestros cursos incluyen certificados digitales reconocidos internacionalmente al completar
                el programa satisfactoriamente.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-black mb-3">¿Hay becas disponibles?</h3>
              <p className="text-slate-600 leading-relaxed">
                Absolutamente. Distribuimos más de $5M en becas anualmente. Nuestro sistema automáticamente te empareja
                con becas según tu perfil y rendimiento académico.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-black mb-3">¿Puedo cancelar en cualquier momento?</h3>
              <p className="text-slate-600 leading-relaxed">
                Sí, no hay compromisos a largo plazo. Puedes cancelar tu suscripción en cualquier momento desde tu
                panel de control.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
