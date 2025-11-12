"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Menu, Bell, User, DollarSign, TrendingDown, TrendingUp, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FinTechTabs } from "@/components/fintech-tabs"

export default function FinTechPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "payments" | "scholarships" | "loans" | "history">("overview")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} />

      <main className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-foreground hover:text-primary transition"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <button className="text-foreground hover:text-primary transition">
              <Bell className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Section */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Portal Financiero</h1>
              <p className="text-muted-foreground">Gestiona tus pagos, solicita becas y préstamos educativos</p>
            </div>

            {/* Balance Card */}
            <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8 border-0">
              <div className="space-y-4">
                <p className="text-sm opacity-90">Saldo de cuenta</p>
                <p className="text-4xl font-bold">$2,450.00</p>
                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Hacer pago
                  </Button>
                  <Button
                    variant="outline"
                    className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                  >
                    Retirar fondos
                  </Button>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Pagos pendientes</p>
                    <p className="text-2xl font-bold text-foreground">$349.00</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-red-500/30" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Beca activa</p>
                    <p className="text-2xl font-bold text-foreground">$500/mes</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-primary/30" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Préstamo disponible</p>
                    <p className="text-2xl font-bold text-foreground">$3,000</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500/30" />
                </div>
              </Card>
            </div>

            {/* Tabs */}
            <FinTechTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      </main>
    </div>
  )
}
