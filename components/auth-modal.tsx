"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface AuthModalProps {
  mode: "login" | "signup"
  onClose: () => void
}

export function AuthModal({ mode, onClose }: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-foreground/50 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-2xl w-full max-w-md relative shadow-lg">
        <div className="flex justify-between items-center p-8 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{mode === "login" ? "Ingresar" : "Crear cuenta"}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "login" ? "Bienvenido de nuevo" : "Únete a UniversIA"}
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nombre completo</label>
              <input
                type="text"
                placeholder="Juan Pérez"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Correo electrónico</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-foreground hover:bg-foreground/90 text-background h-11 rounded-lg mt-6 font-medium"
          >
            {isLoading ? "Procesando..." : mode === "login" ? "Ingresar" : "Crear cuenta"}
          </Button>
        </form>

        <div className="px-8 py-6 bg-muted/30 border-t border-border rounded-b-2xl text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              ¿No tienes cuenta? <button className="text-primary hover:underline font-medium">Regístrate aquí</button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta? <button className="text-primary hover:underline font-medium">Inicia sesión</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
