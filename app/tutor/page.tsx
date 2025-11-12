"use client"

import { useState, useRef, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Menu, Bell, User, Send, MessageSquare, Settings, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  suggestions?: string[]
}

export default function TutorPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hola, soy tu tutor IA. Estoy aquí para ayudarte con tus dudas sobre cualquier tema. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
      suggestions: ["Explícame closures en JavaScript", "Ayuda con React Hooks", "Diferencia entre var, let y const"],
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      content:
        "Esta es una respuesta de demostración. En una implementación real, esto sería procesado por el API de IA. " +
        messageText.substring(0, 20) +
        "...",
      timestamp: new Date(),
      suggestions: ["Explícame más", "Muestra un ejemplo", "Siguiente concepto"],
    }

    setMessages((prev) => [...prev, aiMessage])
    setIsLoading(false)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} />

      <main className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-foreground hover:text-primary transition"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Tutor IA</h2>
                <p className="text-xs text-muted-foreground">Disponible 24/7</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-foreground hover:text-primary transition">
              <Settings className="w-5 h-5" />
            </button>
            <button className="text-foreground hover:text-primary transition">
              <Bell className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </button>
          </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-auto p-6 space-y-4 flex flex-col">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-md px-4 py-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none border border-border"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.type === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {/* Suggestions */}
            {messages.length > 0 &&
              messages[messages.length - 1].type === "ai" &&
              messages[messages.length - 1].suggestions && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {messages[messages.length - 1].suggestions?.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(suggestion)}
                      className="text-sm px-3 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground px-4 py-3 rounded-lg rounded-bl-none border border-border">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-card border-t border-border p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-background border border-input rounded-lg focus-within:ring-2 focus-within:ring-primary/50">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Haz tu pregunta..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isLoading}
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 w-12 p-0 flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>

            {/* Info Footer */}
            <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10 text-center text-sm text-muted-foreground">
              El tutor IA puede cometer errores. Siempre verifica información importante.
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
