"use client"

import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  LogOut,
  Home,
  BookOpen,
  TrendingUp,
  Newspaper,
} from "lucide-react"

export default function StudentNavbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const navItems = [
    {
      href: "/estudiante/dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/estudiante/cursos",
      label: "Cursos",
      icon: BookOpen,
    },
    {
      href: "/estudiante/mis-cursos",
      label: "Mis Cursos",
      icon: BookOpen,
    },
    {
      href: "/estudiante/noticias",
      label: "Noticias",
      icon: Newspaper,
    },
    {
      href: "/estudiante/progreso",
      label: "Progreso",
      icon: TrendingUp,
    },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-light tracking-wide hover:opacity-80 transition">
            UNIVERSIA
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    isActive
                      ? "text-purple-600 font-medium hover:bg-purple-50"
                      : "text-slate-600 hover:text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-purple-50">
              <Bell className="w-5 h-5" />
            </Button>
            
            <Link href="/estudiante/perfil">
              <div className="flex items-center gap-3 hover:bg-slate-50 px-4 py-2 rounded-full transition-all cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                  {(session?.user?.name || session?.user?.email || 'U').charAt(0)}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="font-medium text-sm">{session?.user?.name || session?.user?.email}</p>
                  <p className="text-xs text-slate-400">Ver perfil</p>
                </div>
              </div>
            </Link>

            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
