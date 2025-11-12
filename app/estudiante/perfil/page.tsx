"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Camera,
  Save,
  Bell,
  Lock,
  CreditCard,
  Shield,
  LogOut,
  Home,
  BookOpen,
  TrendingUp,
  Settings,
  Upload,
  Edit,
  Check,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Perfil() {
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+34 612 345 678",
    location: "Madrid, España",
    birthday: "1995-05-15",
    website: "www.ejemplo.com",
    bio: "Apasionado por la tecnología y el aprendizaje continuo. Estudiante de desarrollo web full stack.",
    linkedin: "linkedin.com/in/usuario",
    github: "github.com/usuario",
    twitter: "@usuario",
  })

  const [notifications, setNotifications] = useState({
    emailCourses: true,
    emailMessages: true,
    emailUpdates: false,
    pushCourses: true,
    pushMessages: true,
    pushUpdates: false,
  })

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showProgress: true,
    showCertificates: true,
    allowMessages: true,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar del Estudiante */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-black">
              UNIVERSIA
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/estudiante/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition">
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link href="/estudiante/mis-cursos" className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition">
                <BookOpen className="w-4 h-4" />
                Mis Cursos
              </Link>
              <Link href="/estudiante/progreso" className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition">
                <TrendingUp className="w-4 h-4" />
                Progreso
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="font-bold text-sm">{user.name}</p>
                  <p className="text-xs text-slate-500">Estudiante</p>
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="icon"
                  className="border-slate-200"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black mb-2">Mi Perfil ⚙️</h1>
          <p className="text-slate-600">Gestiona tu información personal y configuración</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 border-2 border-slate-200 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-5xl font-black">
                    {user.name.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center text-white border-4 border-white transition-all">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
                
                <h3 className="text-xl font-black mb-1">{user.name}</h3>
                <p className="text-slate-600 mb-4">{user.email}</p>
                
                <Badge className="bg-purple-100 text-purple-700 border-purple-300 mb-4">
                  Estudiante Avanzado
                </Badge>

                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-2xl font-black text-purple-600">5</p>
                    <p className="text-xs text-slate-600">Cursos</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-2xl font-black text-purple-600">2</p>
                    <p className="text-xs text-slate-600">Certificados</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-2xl font-black text-purple-600">124</p>
                    <p className="text-xs text-slate-600">Horas</p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-4">
                  Miembro desde Enero 2024
                </p>

                <Button className="w-full bg-purple-600 hover:bg-purple-700 font-bold">
                  <Upload className="w-4 h-4 mr-2" />
                  Cambiar Foto
                </Button>
              </Card>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 border-2 border-slate-200">
                <h3 className="font-black mb-4">Enlaces Rápidos</h3>
                <div className="space-y-2">
                  <Link href="/estudiante/mis-cursos">
                    <Button variant="ghost" className="w-full justify-start">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Mis Cursos
                    </Button>
                  </Link>
                  <Link href="/estudiante/progreso">
                    <Button variant="ghost" className="w-full justify-start">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Mi Progreso
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-100">
                  <TabsTrigger value="personal" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    <User className="w-4 h-4 mr-2" />
                    Personal
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    <Bell className="w-4 h-4 mr-2" />
                    Notificaciones
                  </TabsTrigger>
                  <TabsTrigger value="security" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    <Lock className="w-4 h-4 mr-2" />
                    Seguridad
                  </TabsTrigger>
                  <TabsTrigger value="billing" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Facturación
                  </TabsTrigger>
                </TabsList>

                {/* Personal Info Tab */}
                <TabsContent value="personal" className="mt-6">
                  <Card className="border-2 border-slate-200">
                    <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-black">Información Personal</h3>
                        <p className="text-sm text-slate-600">Actualiza tus datos personales</p>
                      </div>
                      <Button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className={isEditing ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>Guardando...</>
                        ) : isEditing ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Guardar
                          </>
                        ) : (
                          <>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="flex items-center gap-2">
                            <User className="w-4 h-4 text-purple-600" />
                            Nombre Completo
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            disabled={!isEditing}
                            className="border-2 border-slate-200 focus:border-purple-600"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-purple-600" />
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            disabled={!isEditing}
                            className="border-2 border-slate-200 focus:border-purple-600"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-purple-600" />
                            Teléfono
                          </Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            disabled={!isEditing}
                            className="border-2 border-slate-200 focus:border-purple-600"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location" className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-purple-600" />
                            Ubicación
                          </Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => handleChange("location", e.target.value)}
                            disabled={!isEditing}
                            className="border-2 border-slate-200 focus:border-purple-600"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="birthday" className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            Fecha de Nacimiento
                          </Label>
                          <Input
                            id="birthday"
                            type="date"
                            value={formData.birthday}
                            onChange={(e) => handleChange("birthday", e.target.value)}
                            disabled={!isEditing}
                            className="border-2 border-slate-200 focus:border-purple-600"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="website" className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-purple-600" />
                            Sitio Web
                          </Label>
                          <Input
                            id="website"
                            value={formData.website}
                            onChange={(e) => handleChange("website", e.target.value)}
                            disabled={!isEditing}
                            className="border-2 border-slate-200 focus:border-purple-600"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Biografía</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => handleChange("bio", e.target.value)}
                          disabled={!isEditing}
                          rows={4}
                          className="border-2 border-slate-200 focus:border-purple-600 resize-none"
                        />
                      </div>

                      <div className="border-t pt-6">
                        <h4 className="font-black mb-4">Redes Sociales</h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input
                              id="linkedin"
                              value={formData.linkedin}
                              onChange={(e) => handleChange("linkedin", e.target.value)}
                              disabled={!isEditing}
                              className="border-2 border-slate-200 focus:border-purple-600"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="github">GitHub</Label>
                            <Input
                              id="github"
                              value={formData.github}
                              onChange={(e) => handleChange("github", e.target.value)}
                              disabled={!isEditing}
                              className="border-2 border-slate-200 focus:border-purple-600"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="twitter">Twitter/X</Label>
                            <Input
                              id="twitter"
                              value={formData.twitter}
                              onChange={(e) => handleChange("twitter", e.target.value)}
                              disabled={!isEditing}
                              className="border-2 border-slate-200 focus:border-purple-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="mt-6">
                  <Card className="border-2 border-slate-200 p-6">
                    <h3 className="text-xl font-black mb-6">Preferencias de Notificaciones</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-bold mb-4 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-purple-600" />
                          Notificaciones por Email
                        </h4>
                        <div className="space-y-4 ml-6">
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-bold">Actualizaciones de cursos</p>
                              <p className="text-sm text-slate-600">Recibe notificaciones sobre nuevas lecciones</p>
                            </div>
                            <Switch
                              checked={notifications.emailCourses}
                              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailCourses: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-bold">Mensajes de instructores</p>
                              <p className="text-sm text-slate-600">Notificaciones de mensajes directos</p>
                            </div>
                            <Switch
                              checked={notifications.emailMessages}
                              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailMessages: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-bold">Boletín y promociones</p>
                              <p className="text-sm text-slate-600">Novedades y ofertas especiales</p>
                            </div>
                            <Switch
                              checked={notifications.emailUpdates}
                              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailUpdates: checked }))}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h4 className="font-bold mb-4 flex items-center gap-2">
                          <Bell className="w-4 h-4 text-purple-600" />
                          Notificaciones Push
                        </h4>
                        <div className="space-y-4 ml-6">
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-bold">Recordatorios de estudio</p>
                              <p className="text-sm text-slate-600">Mantén tu racha de aprendizaje</p>
                            </div>
                            <Switch
                              checked={notifications.pushCourses}
                              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushCourses: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-bold">Mensajes importantes</p>
                              <p className="text-sm text-slate-600">Comunicaciones urgentes</p>
                            </div>
                            <Switch
                              checked={notifications.pushMessages}
                              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushMessages: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-bold">Actualizaciones de la plataforma</p>
                              <p className="text-sm text-slate-600">Nuevas funcionalidades</p>
                            </div>
                            <Switch
                              checked={notifications.pushUpdates}
                              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushUpdates: checked }))}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="mt-6">
                  <Card className="border-2 border-slate-200 p-6">
                    <h3 className="text-xl font-black mb-6">Seguridad y Privacidad</h3>
                    
                    <div className="space-y-6">
                      <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                        <div className="flex items-start gap-3">
                          <Shield className="w-6 h-6 text-purple-600 mt-1" />
                          <div>
                            <h4 className="font-bold mb-1">Cambiar Contraseña</h4>
                            <p className="text-sm text-slate-600 mb-4">
                              Actualiza tu contraseña regularmente para mantener tu cuenta segura
                            </p>
                            <Button className="bg-purple-600 hover:bg-purple-700">
                              Cambiar Contraseña
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-lg">
                        <h4 className="font-bold mb-4">Autenticación de Dos Factores</h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-600">Añade una capa extra de seguridad</p>
                            <Badge className="mt-2 bg-red-100 text-red-700 border-red-300">Desactivado</Badge>
                          </div>
                          <Button variant="outline" className="border-2 border-slate-200">
                            Activar 2FA
                          </Button>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h4 className="font-bold mb-4">Configuración de Privacidad</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-bold">Perfil público</p>
                              <p className="text-sm text-slate-600">Permite que otros vean tu perfil</p>
                            </div>
                            <Switch
                              checked={privacy.profilePublic}
                              onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, profilePublic: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-bold">Mostrar progreso</p>
                              <p className="text-sm text-slate-600">Comparte tu avance en cursos</p>
                            </div>
                            <Switch
                              checked={privacy.showProgress}
                              onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showProgress: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-bold">Mostrar certificados</p>
                              <p className="text-sm text-slate-600">Muestra tus logros públicamente</p>
                            </div>
                            <Switch
                              checked={privacy.showCertificates}
                              onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showCertificates: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-bold">Permitir mensajes</p>
                              <p className="text-sm text-slate-600">Recibe mensajes de otros estudiantes</p>
                            </div>
                            <Switch
                              checked={privacy.allowMessages}
                              onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, allowMessages: checked }))}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                          <h4 className="font-bold text-red-900 mb-2">Zona de Peligro</h4>
                          <p className="text-sm text-red-700 mb-4">
                            Acciones irreversibles que afectarán permanentemente tu cuenta
                          </p>
                          <Button variant="outline" className="border-2 border-red-300 text-red-600 hover:bg-red-50">
                            Eliminar Cuenta
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                {/* Billing Tab */}
                <TabsContent value="billing" className="mt-6">
                  <Card className="border-2 border-slate-200 p-6">
                    <h3 className="text-xl font-black mb-6">Facturación y Suscripciones</h3>
                    
                    <div className="space-y-6">
                      <div className="p-6 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm opacity-90">Plan Actual</p>
                            <h4 className="text-3xl font-black">Premium</h4>
                          </div>
                          <Badge className="bg-white text-purple-600 border-0 text-lg px-4 py-2">
                            €29.99/mes
                          </Badge>
                        </div>
                        <p className="text-sm opacity-90 mb-4">Acceso ilimitado a todos los cursos</p>
                        <Button className="bg-white text-purple-600 hover:bg-slate-100 font-bold">
                          Gestionar Suscripción
                        </Button>
                      </div>

                      <div>
                        <h4 className="font-bold mb-4">Método de Pago</h4>
                        <div className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-bold">•••• •••• •••• 4242</p>
                              <p className="text-sm text-slate-600">Expira 12/2025</p>
                            </div>
                          </div>
                          <Button variant="outline" className="border-2 border-slate-200">
                            Actualizar
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold mb-4">Historial de Facturas</h4>
                        <div className="space-y-3">
                          {[
                            { date: "01 Nov 2024", amount: "€29.99", status: "Pagado", invoice: "#INV-2024-11" },
                            { date: "01 Oct 2024", amount: "€29.99", status: "Pagado", invoice: "#INV-2024-10" },
                            { date: "01 Sep 2024", amount: "€29.99", status: "Pagado", invoice: "#INV-2024-09" },
                          ].map((bill, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
                              <div>
                                <p className="font-bold">{bill.invoice}</p>
                                <p className="text-sm text-slate-600">{bill.date}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <Badge className="bg-green-100 text-green-700 border-green-300">
                                  {bill.status}
                                </Badge>
                                <p className="font-bold">{bill.amount}</p>
                                <Button variant="outline" size="sm" className="border-2 border-slate-200">
                                  Descargar
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
