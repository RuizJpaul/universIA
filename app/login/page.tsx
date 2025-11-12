"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { GraduationCap, Mail, Lock, User, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const { login, register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let success = false
      if (isLogin) {
        success = await login(formData.email, formData.password)
      } else {
        success = await register(formData.name, formData.email, formData.password)
      }

      if (success) {
        router.push("/estudiante/dashboard")
      } else {
        setError("Credenciales incorrectas. Usa: estudiante@universia.com / demo123")
      }
    } catch (err) {
      setError("Ocurrió un error. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-purple-50">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 bg-white border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-purple-600" strokeWidth={2.5} />
            <span className="text-2xl font-black">UniversIA</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="font-semibold">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 border-purple-100 shadow-2xl">
            <CardContent className="p-8">
              {/* Logo y Título */}
              <div className="text-center mb-8">
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <GraduationCap className="w-8 h-8 text-white" strokeWidth={2.5} />
                </motion.div>
                <h1 className="text-3xl font-black mb-2">
                  {isLogin ? "Bienvenido de nuevo" : "Únete a UniversIA"}
                </h1>
                <p className="text-slate-600">
                  {isLogin ? "Ingresa tus credenciales para continuar" : "Crea tu cuenta y comienza a aprender"}
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-semibold">
                      Nombre completo
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="María García"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10 h-12 border-2 focus:border-purple-600"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold">
                    Correo electrónico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="estudiante@universia.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 h-12 border-2 focus:border-purple-600"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="font-semibold">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10 h-12 border-2 focus:border-purple-600"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg"
                  >
                    {loading ? "Cargando..." : isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                  </Button>
                </motion.div>
              </form>

              {/* Cuenta demo */}
              {isLogin && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg border-2 border-purple-100">
                  <p className="text-sm font-semibold text-purple-900 mb-2">Cuenta de prueba:</p>
                  <p className="text-xs text-purple-700">
                    <strong>Email:</strong> estudiante@universia.com
                    <br />
                    <strong>Contraseña:</strong> demo123
                  </p>
                </div>
              )}

              {/* Toggle Login/Register */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError("")
                  }}
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {["200+ Cursos", "Certificados", "24/7 Soporte"].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="text-center p-3 bg-white rounded-lg border-2 border-purple-100"
              >
                <p className="text-sm font-bold text-purple-900">{feature}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
