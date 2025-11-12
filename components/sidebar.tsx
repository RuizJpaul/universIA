"use client"

import Link from "next/link"
import { BookOpen, BarChart3, Users, Zap, Briefcase, Calendar, DollarSign, Settings, LogOut } from "lucide-react"

interface SidebarProps {
  open: boolean
}

export function Sidebar({ open }: SidebarProps) {
  const menuItems = [
    { icon: BookOpen, label: "Cursos", href: "#" },
    { icon: BarChart3, label: "Mi Progreso", href: "#" },
    { icon: Zap, label: "Tutor IA", href: "#" },
    { icon: Users, label: "Comunidad", href: "#" },
    { icon: Calendar, label: "Eventos", href: "#" },
    { icon: Briefcase, label: "Empleos", href: "#" },
    { icon: DollarSign, label: "Finanzas", href: "#" },
  ]

  return (
    <aside
      className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${open ? "w-64" : "w-20"}`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border h-16">
        {open && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-bold text-sidebar-foreground">UniversIA</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 flex-1">
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              open
                ? "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                : "justify-center text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {open && <span className="text-sm font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Link
          href="#"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors ${
            !open && "justify-center"
          }`}
        >
          <Settings className="w-5 h-5" />
          {open && <span className="text-sm">Configuración</span>}
        </Link>
        <button
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors ${
            !open && "justify-center"
          }`}
        >
          <LogOut className="w-5 h-5" />
          {open && <span className="text-sm">Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  )
}
