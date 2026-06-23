"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, CreditCard, RefreshCw, Download, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CSVLink } from "react-csv"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import toast, { Toaster } from "react-hot-toast"

const COLORS = ["#0F2942", "#FFBB0A", "#7C3AED"]

interface Transaction {
  id: string
  user: string
  amount: number
  gateway: string
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED"
  date: string
}

interface PendingRefund {
  id: string
  orderId: string
  user: string
  amount: number
  reason: string
  date: string
}

interface FinanceData {
  totalRevenue: number
  totalTransactions: number
  refundRate: number
  gatewayBreakdown: Record<string, number>
  transactions: Transaction[]
  pendingRefunds: PendingRefund[]
}

export default function FinancePage() {
  const [finance, setFinance] = useState<FinanceData | null>(null)
  const [refunds, setRefunds] = useState<PendingRefund[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/finance")
      .then((res) => res.json())
      .then((body) => {
        if (body.success) {
          setFinance(body.data)
          setRefunds(body.data.pendingRefunds)
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleProcessRefund = async (id: string, approve: boolean) => {
    const response = await fetch(`/api/admin/refunds/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision: approve ? "APPROVED" : "REJECTED" }),
    })
    const body = await response.json()
    if (body.success) {
      setRefunds(refunds.filter(r => r.id !== id))
      toast[approve ? 'success' : 'error'](approve ? "Refund approved and processed!" : "Refund request declined.")
    } else {
      toast.error(body.error ?? "Failed to process refund")
    }
  }

  const gatewayData = useMemo(() => {
    if (!finance) return []
    return Object.entries(finance.gatewayBreakdown).map(([name, value]) => ({ name, value }))
  }, [finance])

  if (isLoading || !finance) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-6 w-6 mr-2 animate-spin" /> Loading finance data...
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] dark:text-white">Finance & Revenue</h1>
          <p className="text-muted-foreground mt-1">Monitor transactions, gateway distribution, and manage refunds.</p>
        </div>
        <div className="flex items-center gap-3">
          <CSVLink data={finance.transactions} filename={"transactions-export.csv"}>
            <Button variant="outline" className="shadow-sm border-[#0F2942]/20 text-[#0F2942] dark:border-border dark:text-foreground hover:bg-[#0F2942]/5">
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </CSVLink>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Card className="border-border/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign className="w-16 h-16" /></div>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Total Revenue (Successful Orders)</p>
            <h3 className="text-3xl font-bold tracking-tight mt-2 text-[#0F2942] dark:text-white">${finance.totalRevenue.toLocaleString()}</h3>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><CreditCard className="w-16 h-16" /></div>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
            <h3 className="text-3xl font-bold tracking-tight mt-2 text-[#0F2942] dark:text-white">{finance.totalTransactions.toLocaleString()}</h3>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><RefreshCw className="w-16 h-16" /></div>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Refund Rate</p>
            <h3 className="text-3xl font-bold tracking-tight mt-2 text-[#0F2942] dark:text-white">{finance.refundRate.toFixed(1)}%</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/50 shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="bg-muted/10 border-b border-border/50">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <CardDescription>Latest payments processed across all gateways.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold text-muted-foreground">User</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Gateway</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Amount</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finance.transactions.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No transactions yet.</TableCell></TableRow>
                  ) : finance.transactions.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="text-muted-foreground">{tx.user}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {tx.gateway}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold">${tx.amount}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`
                          ${tx.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200' : ''}
                          ${tx.status === 'FAILED' ? 'bg-destructive/10 text-destructive border-destructive/20' : ''}
                          ${tx.status === 'REFUNDED' ? 'bg-[#FFBB0A]/10 text-[#876307] border-[#FFBB0A]/30' : ''}
                          ${tx.status === 'PENDING' ? 'bg-slate-100 text-slate-600 border-slate-200' : ''}
                        `}>
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">{new Date(tx.date).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="bg-muted/10 border-b border-border/50 pb-4">
              <CardTitle className="text-lg">Gateway Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex justify-center items-center h-[250px]">
              {gatewayData.length === 0 ? (
                <p className="text-sm text-muted-foreground">No transactions yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gatewayData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {gatewayData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => `${value} transactions`} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm flex flex-col">
            <CardHeader className="bg-muted/10 border-b border-border/50 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Refund Requests</CardTitle>
                <Badge variant="secondary" className="bg-[#FFBB0A]/20 text-[#876307]">{refunds.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto max-h-[300px]">
              {refunds.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                  <CheckCircle className="h-10 w-10 text-emerald-500/50 mb-3" />
                  <p className="font-medium text-foreground">No pending refunds.</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {refunds.map((ref) => (
                    <div key={ref.id} className="p-5 relative overflow-hidden bg-white dark:bg-card border-b border-border/50 last:border-0 hover:bg-muted/30 transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3 items-center">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-border/50">
                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${ref.user}`} alt="avatar" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{ref.user}</p>
                            <div className="flex items-center text-[11px] font-medium text-muted-foreground mt-0.5 space-x-2">
                              <span>Order: <span className="text-foreground">{ref.orderId.slice(0, 8)}</span></span>
                              <span>•</span>
                              <span>{new Date(ref.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-red-50 dark:bg-red-950/30 text-red-600 border-red-200 dark:border-red-900 font-black px-2.5 py-1 shadow-sm">
                          -${ref.amount}
                        </Badge>
                      </div>

                      <div className="text-sm bg-muted/40 p-3.5 rounded-xl border border-border/50 relative overflow-hidden group-hover:bg-muted/60 transition-colors">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#FFBB0A]"></div>
                        <span className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Reason for refund</span>
                        <p className="text-foreground font-medium leading-relaxed">{ref.reason}</p>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button variant="outline" size="sm" className="flex-1 rounded-xl h-9 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 font-bold transition-colors" onClick={() => handleProcessRefund(ref.id, false)}>
                          <XCircle className="w-4 h-4 mr-1.5" /> Decline
                        </Button>
                        <Button size="sm" className="flex-1 rounded-xl h-9 bg-[#0F2942] hover:bg-[#0F2942]/90 text-white font-bold shadow-md transition-transform hover:-translate-y-0.5" onClick={() => handleProcessRefund(ref.id, true)}>
                          <CheckCircle className="w-4 h-4 mr-1.5 text-[#FFBB0A]" /> Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
