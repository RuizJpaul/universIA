"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"


export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuth()

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
          UNIVERSIA
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
                  {user?.name}
                </Button>
              </Link>
              <Button
                onClick={logout}
                variant="outline"
                className="border-2 border-slate-900 font-bold px-6 rounded-none"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" className="border-2 border-slate-900 font-bold px-6 rounded-none">
                  INICIAR SESIÓN
                </Button>
              </Link>
              <Link href="/login">
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
                      logout()
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
                  <Link href="/login">
                    <Button variant="outline" className="w-full border-2 border-slate-900 font-bold rounded-none">
                      INICIAR SESIÓN
                    </Button>
                  </Link>
                  <Link href="/login">
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
