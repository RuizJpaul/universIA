"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut } from "lucide-react"


export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [userExistsInDB, setUserExistsInDB] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  
  // Verificar si el usuario existe en la DB cuando hay sesión
  useEffect(() => {
    const checkUserInDB = async () => {
      if (status === "authenticated" && session?.user?.email && !isChecking) {
        setIsChecking(true)
        try {
          const response = await fetch("/api/auth/check-onboarding")
          if (response.ok) {
            setUserExistsInDB(true)
          } else {
            // Usuario no existe en DB - cerrar sesión
            setUserExistsInDB(false)
            await signOut({ redirect: false })
          }
        } catch (error) {
          console.error("Error verificando usuario:", error)
          setUserExistsInDB(false)
        } finally {
          setIsChecking(false)
        }
      } else if (status !== "authenticated") {
        setUserExistsInDB(false)
      }
    }
    
    checkUserInDB()
  }, [status, session?.user?.email])
  
  const isAuthenticated = status === "authenticated" && userExistsInDB

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/servicios", label: "Servicios" },
    { href: "/programas", label: "Programas" },
    { href: "/comunidad", label: "Comunidad" },
    { href: "/contacto", label: "Contacto" },
  ]

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="text-3xl font-black tracking-tight hover:opacity-80 transition">
          OPENUP
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-12 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:opacity-60 transition ${
                pathname === link.href ? "opacity-100 font-bold" : "opacity-70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex gap-3 items-center">
          {isAuthenticated ? (
            <>
              <Link href="/estudiante/dashboard">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 rounded-none flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {session?.user?.name || session?.user?.email}
                </Button>
              </Link>
              <Button
                onClick={() => signOut({ callbackUrl: "/" })}
                variant="outline"
                className="border-2 border-slate-900 font-bold px-6 rounded-none"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline" className="border-2 border-slate-900 font-bold px-6 rounded-none">
                  INICIAR SESIÓN
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 rounded-none">
                  ÚNETE A UNIVERSIA
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200">
          <nav className="flex flex-col px-6 py-4 space-y-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-lg font-medium hover:opacity-60 transition ${
                  pathname === link.href ? "opacity-100 font-bold" : "opacity-70"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t space-y-3">
              {isAuthenticated ? (
                <>
                  <Link href="/estudiante/dashboard">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-none">
                      Mi Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      signOut({ callbackUrl: "/" })
                      setMobileMenuOpen(false)
                    }}
                    variant="outline"
                    className="w-full border-2 border-slate-900 font-bold rounded-none"
                  >
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full border-2 border-slate-900 font-bold rounded-none">
                      INICIAR SESIÓN
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-none">
                      ÚNETE A UNIVERSIA
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
