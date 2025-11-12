"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Download, Filter } from "lucide-react"

type TabType = "overview" | "payments" | "scholarships" | "loans" | "history"

interface FinTechTabsProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}

export function FinTechTabs({ activeTab, setActiveTab }: FinTechTabsProps) {
  const tabs: { id: TabType; label: string }[] = [
    { id: "overview", label: "Resumen" },
    { id: "payments", label: "Pagos" },
    { id: "scholarships", label: "Becas" },
    { id: "loans", label: "Préstamos" },
    { id: "history", label: "Historial" },
  ]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "payments" && <PaymentsTab />}
        {activeTab === "scholarships" && <ScholarshipsTab />}
        {activeTab === "loans" && <LoansTab />}
        {activeTab === "history" && <HistoryTab />}
      </div>
    </div>
  )
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Transacciones recientes</h3>
        <div className="space-y-3">
          {[
            { desc: "Pago de matrícula - Curso React", amount: "-$49.99", date: "Hoy", status: "completed" },
            { desc: "Beca mensual transferida", amount: "+$500.00", date: "Ayer", status: "completed" },
            { desc: "Préstamo educativo", amount: "+$1,000.00", date: "Hace 3 días", status: "completed" },
            { desc: "Pago de seguro estudiantil", amount: "-$25.00", date: "Hace 5 días", status: "completed" },
          ].map((transaction, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-foreground text-sm">{transaction.desc}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
              </div>
              <p
                className={`font-semibold ${transaction.amount.startsWith("+") ? "text-green-600" : "text-foreground"}`}
              >
                {transaction.amount}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function PaymentsTab() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button className="bg-primary hover:bg-primary/90">Hacer nuevo pago</Button>
        <Button variant="outline">Agendar pago</Button>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Pagos pendientes</h3>
        <div className="space-y-3">
          {[
            { concept: "Matrícula Mes 2", amount: "$199.99", dueDate: "En 5 días", priority: "high" },
            { concept: "Matrícula Mes 3", amount: "$199.99", dueDate: "En 35 días", priority: "low" },
            { concept: "Asegurado", amount: "$25.00", dueDate: "En 15 días", priority: "medium" },
          ].map((payment, idx) => (
            <div key={idx} className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">{payment.concept}</h4>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    payment.priority === "high"
                      ? "bg-red-500/10 text-red-600"
                      : payment.priority === "medium"
                        ? "bg-yellow-500/10 text-yellow-600"
                        : "bg-green-500/10 text-green-600"
                  }`}
                >
                  {payment.priority === "high" ? "Urgente" : payment.priority === "medium" ? "Próximo" : "Próximo"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-foreground">{payment.amount}</p>
                <div className="flex gap-2">
                  <p className="text-sm text-muted-foreground">{payment.dueDate}</p>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Pagar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function ScholarshipsTab() {
  return (
    <div className="space-y-6">
      <Button className="bg-primary hover:bg-primary/90">Solicitar nueva beca</Button>

      <div className="space-y-4">
        {[
          {
            name: "Beca por Méritos Académicos",
            amount: "$500/mes",
            status: "active",
            progress: 100,
            description: "Beca otorgada por excelente desempeño académico",
          },
          {
            name: "Beca de Emprendimiento",
            amount: "$300/mes",
            status: "pending",
            progress: 60,
            description: "Solicitud en revisión",
          },
          {
            name: "Beca de Inclusión Social",
            amount: "$250/mes",
            status: "rejected",
            progress: 0,
            description: "Solicitud rechazada",
          },
        ].map((scholarship, idx) => (
          <Card key={idx} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">{scholarship.name}</h3>
                <p className="text-sm text-muted-foreground">{scholarship.description}</p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold ${
                  scholarship.status === "active"
                    ? "bg-green-500/10 text-green-600"
                    : scholarship.status === "pending"
                      ? "bg-yellow-500/10 text-yellow-600"
                      : "bg-red-500/10 text-red-600"
                }`}
              >
                {scholarship.status === "active"
                  ? "Activa"
                  : scholarship.status === "pending"
                    ? "Pendiente"
                    : "Rechazada"}
              </span>
            </div>
            <p className="text-2xl font-bold text-primary mb-4">{scholarship.amount}</p>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${scholarship.progress}%` }}
              ></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function LoansTab() {
  return (
    <div className="space-y-6">
      <Button className="bg-primary hover:bg-primary/90">Solicitar préstamo</Button>

      <Card className="p-6 bg-primary/5 border-primary/20">
        <h3 className="font-semibold text-foreground mb-2">Límite de préstamo disponible</h3>
        <p className="text-3xl font-bold text-primary">$5,000</p>
        <p className="text-sm text-muted-foreground mt-2">Tasa de interés: 5% anual</p>
      </Card>

      <div className="space-y-4">
        {[
          {
            id: "LOAN001",
            amount: "$1,000",
            status: "active",
            startDate: "01/03/2025",
            endDate: "01/03/2027",
            balance: "$850",
            rate: "5% anual",
          },
          {
            id: "LOAN002",
            amount: "$2,000",
            status: "pending",
            startDate: "Pendiente de aprobación",
            endDate: "-",
            balance: "-",
            rate: "5% anual",
          },
        ].map((loan) => (
          <Card key={loan.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">Préstamo {loan.id}</h3>
                <p className="text-sm text-muted-foreground">{loan.startDate}</p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold ${
                  loan.status === "active" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"
                }`}
              >
                {loan.status === "active" ? "Activo" : "Pendiente"}
              </span>
            </div>
            <div className="grid md:grid-cols-4 gap-4 py-4 border-t border-b border-border">
              <div>
                <p className="text-muted-foreground text-xs">Monto</p>
                <p className="font-bold text-foreground">{loan.amount}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Saldo</p>
                <p className="font-bold text-foreground">{loan.balance}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Fecha fin</p>
                <p className="font-bold text-foreground">{loan.endDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Tasa</p>
                <p className="font-bold text-foreground">{loan.rate}</p>
              </div>
            </div>
            {loan.status === "active" && (
              <Button variant="outline" size="sm" className="mt-4 bg-transparent">
                Ver detalles
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

function HistoryTab() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filtrar
        </Button>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Descargar
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Fecha</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Descripción</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Tipo</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Monto</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  date: "01/11/2025",
                  desc: "Pago de matrícula",
                  type: "Pago",
                  amount: "-$49.99",
                  status: "Completado",
                },
                {
                  date: "01/11/2025",
                  desc: "Beca transferida",
                  type: "Ingreso",
                  amount: "+$500.00",
                  status: "Completado",
                },
                {
                  date: "30/10/2025",
                  desc: "Préstamo desembolsado",
                  type: "Préstamo",
                  amount: "+$1,000.00",
                  status: "Completado",
                },
                { date: "29/10/2025", desc: "Pago de seguro", type: "Pago", amount: "-$25.00", status: "Completado" },
              ].map((record, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-foreground">{record.date}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{record.desc}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">{record.type}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">{record.amount}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-600">{record.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
