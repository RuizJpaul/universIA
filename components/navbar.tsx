"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { AuthModal } from "@/components/auth-modal"

export function Navbar() {
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode)
    setShowAuth(true)
  }

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/servicios", label: "Servicios" },
    { href: "/programas", label: "Programas" },
    { href: "/comunidad", label: "Comunidad" },
    { href: "/contacto", label: "Contacto" },
  ]

  return (
    <>
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
            <Button
              onClick={() => openAuth("signup")}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 rounded-none"
            >
              ÚNETE A UNIVERSIA
            </Button>
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
              <Button
                onClick={() => {
                  openAuth("signup")
                  setMobileMenuOpen(false)
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-none w-full"
              >
                ÚNETE A UNIVERSIA
              </Button>
            </nav>
          </div>
        )}
      </header>

      {showAuth && <AuthModal mode={authMode} onClose={() => setShowAuth(false)} />}
    </>
  )
}
