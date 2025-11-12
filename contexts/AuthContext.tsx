"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  enrolledCourses: string[]
  completedCourses: string[]
  progress: { [courseId: string]: number }
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Usuario de ejemplo para testing
const DEMO_USER: User = {
  id: "1",
  name: "María García",
  email: "maria@example.com",
  avatar: "",
  enrolledCourses: ["1", "2", "3"],
  completedCourses: ["4"],
  progress: {
    "1": 75,
    "2": 45,
    "3": 20,
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Recuperar usuario del localStorage
    const savedUser = localStorage.getItem("universia_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulación de login - En producción esto llamaría a una API
    if (email === "estudiante@universia.com" && password === "demo123") {
      localStorage.setItem("universia_user", JSON.stringify(DEMO_USER))
      setUser(DEMO_USER)
      return true
    }
    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulación de registro
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      enrolledCourses: [],
      completedCourses: [],
      progress: {},
    }
    localStorage.setItem("universia_user", JSON.stringify(newUser))
    setUser(newUser)
    return true
  }

  const logout = () => {
    localStorage.removeItem("universia_user")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
