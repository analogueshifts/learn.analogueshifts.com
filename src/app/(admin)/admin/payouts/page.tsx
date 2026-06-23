"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreditCard, DollarSign, CheckCircle2, AlertCircle, Calendar, Loader2, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast, { Toaster } from "react-hot-toast"

interface Payout {
  id: string
  amount: number
  method: "BANK_TRANSFER" | "PAYPAL"
  period: string
  status: "PENDING" | "PROCESSING" | "PAID" | "FAILED"
  createdAt: string
  trainer: { id: string; name: string; email: string }
}

interface TrainerBalance {
  id: string
  name: string
  email: string
  pendingBalance: number
}

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [trainerBalances, setTrainerBalances] = useState<TrainerBalance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState({ trainerId: "", method: "BANK_TRANSFER" as "BANK_TRANSFER" | "PAYPAL" })
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetch("/api/admin/payouts")
      .then((res) => res.json())
      .then((body) => {
        if (body.success) {
          setPayouts(body.data.payouts)
          setTrainerBalances(body.data.trainerBalances)
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  const pendingPayouts = payouts.filter(p => p.status === "PENDING" || p.status === "PROCESSING")
  const paidPayouts = payouts.filter(p => p.status === "PAID").slice(0, 5)

  const toggleSelectAll = () => {
    if (selectedIds.size === pendingPayouts.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(pendingPayouts.map(p => p.id)))
  }

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedIds(newSet)
  }

  const totalSelectedAmount = useMemo(() => {
    return pendingPayouts.filter(p => selectedIds.has(p.id)).reduce((acc, curr) => acc + curr.amount, 0)
  }, [selectedIds, pendingPayouts])

  const handleProcessPayouts = async () => {
    const results = await Promise.all(
      Array.from(selectedIds).map((id) =>
        fetch(`/api/admin/payouts/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "PAID" }),
        }).then((res) => res.json())
      )
    )
    const succeeded = results.filter((r) => r.success).map((r) => r.data.id as string)
    setPayouts(payouts.map(p => succeeded.includes(p.id) ? { ...p, status: "PAID" } : p))
    setSelectedIds(new Set())
    setIsConfirmOpen(false)
    toast.success(`Successfully processed ${succeeded.length} payouts!`, { icon: '💸' })
  }

  const handleCreatePayout = async () => {
    const trainer = trainerBalances.find(t => t.id === createForm.trainerId)
    if (!trainer) return
    setIsCreating(true)
    const response = await fetch("/api/admin/payouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trainerId: trainer.id,
        amount: trainer.pendingBalance,
        method: createForm.method,
        period: new Date().toISOString().slice(0, 7),
      }),
    })
    const body = await response.json()
    setIsCreating(false)
    if (body.success) {
      setPayouts([{ ...body.data, trainer }, ...payouts])
      setTrainerBalances(trainerBalances.filter(t => t.id !== trainer.id))
      setIsCreateOpen(false)
      toast.success("Payout created and queued for processing.")
    } else {
      toast.error(body.error ?? "Failed to create payout")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-6 w-6 mr-2 animate-spin" /> Loading payouts...
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] dark:text-white">Trainer Payouts</h1>
          <p className="text-muted-foreground mt-1">Review and process monthly revenue shares for instructors.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} disabled={trainerBalances.length === 0} className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white shadow-md">
          <Plus className="w-4 h-4 mr-2" /> New Payout
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/10">
              <CardTitle className="text-lg flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-[#0F2942] dark:text-white" /> Pending Disbursements
              </CardTitle>
              {selectedIds.size > 0 && (
                <Button onClick={() => setIsConfirmOpen(true)} className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white shadow-md">
                  Process Selected ({selectedIds.size})
                </Button>
              )}
            </div>
            <CardContent className="p-0">
              {pendingPayouts.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
                  <h3 className="font-semibold text-lg text-foreground">All caught up!</h3>
                  <p className="text-muted-foreground mt-1">There are no pending trainer payouts at this time.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[50px] text-center">
                        <Checkbox
                          checked={selectedIds.size === pendingPayouts.length && pendingPayouts.length > 0}
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Trainer</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Period</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Method</TableHead>
                      <TableHead className="text-right font-semibold text-muted-foreground">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPayouts.map((payout) => (
                      <TableRow key={payout.id} className="hover:bg-muted/20 transition-colors">
                        <TableCell className="text-center">
                          <Checkbox
                            checked={selectedIds.has(payout.id)}
                            onCheckedChange={() => toggleSelect(payout.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border shadow-sm">
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${payout.trainer.name}`} />
                              <AvatarFallback>{payout.trainer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold">{payout.trainer.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{payout.period}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {payout.method.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold text-lg">${payout.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            {pendingPayouts.length > 0 && (
              <CardFooter className="border-t border-border/50 bg-muted/10 p-4 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {selectedIds.size} of {pendingPayouts.length} selected
                </span>
                <span className="font-bold text-lg text-[#0F2942] dark:text-white">
                  Total: <span className="text-emerald-600">${totalSelectedAmount.toFixed(2)}</span>
                </span>
              </CardFooter>
            )}
          </Card>

          {trainerBalances.length > 0 && (
            <Card className="border-border/50 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border/50 bg-muted/10">
                <CardTitle className="text-lg">Trainers with Unpaid Earnings</CardTitle>
              </div>
              <CardContent className="p-0">
                <Table>
                  <TableBody>
                    {trainerBalances.map((t) => (
                      <TableRow key={t.id} className="hover:bg-muted/20 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border shadow-sm">
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${t.name}`} />
                              <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-semibold">{t.name}</span>
                              <span className="text-xs text-muted-foreground">{t.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold">${t.pendingBalance.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => { setCreateForm({ ...createForm, trainerId: t.id }); setIsCreateOpen(true) }}>
                            Create Payout
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm bg-[#0F2942] text-white">
            <CardContent className="p-6">
              <CardTitle className="text-lg text-white/90 mb-4">Pending Balance</CardTitle>
              <h3 className="text-4xl font-extrabold tracking-tight text-[#FFBB0A]">
                ${pendingPayouts.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
              </h3>
              <p className="text-sm text-white/60 mt-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" /> To be processed for {pendingPayouts.length} trainers
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm flex flex-col">
            <div className="bg-muted/10 border-b border-border/50 p-4">
              <CardTitle className="text-lg">Recent History</CardTitle>
            </div>
            <CardContent className="p-0 flex-1">
              {paidPayouts.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">No payouts processed yet.</p>
              ) : (
                <div className="divide-y divide-border/50">
                  {paidPayouts.map((p) => (
                    <div key={p.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{p.trainer.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center mt-0.5">
                            <Calendar className="w-3 h-3 mr-1" /> {p.period}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-sm text-emerald-600">-${p.amount.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-[#FFBB0A]" /> Confirm Payouts
            </DialogTitle>
            <DialogDescription>
              You are about to mark these payouts as paid.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Selected Trainers</span>
              <span className="font-bold text-lg">{selectedIds.size}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-muted-foreground font-medium text-lg">Total Amount</span>
              <span className="font-extrabold text-3xl text-[#0F2942] dark:text-white">${totalSelectedAmount.toFixed(2)}</span>
            </div>
            <div className="bg-[#FFBB0A]/10 border border-[#FFBB0A]/30 p-3 rounded-lg flex items-start gap-3 mt-4">
              <AlertCircle className="w-5 h-5 text-[#876307] shrink-0 mt-0.5" />
              <p className="text-sm text-[#876307] font-medium leading-snug">
                This marks the selected payouts as paid in our records. Actually transferring funds (bank/PayPal) still needs to be done manually outside this dashboard.
              </p>
            </div>
          </div>
          <DialogFooter className="border-t border-border/50 pt-4">
            <Button variant="ghost" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleProcessPayouts} className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white shadow-md">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">New Payout</DialogTitle>
            <DialogDescription>Create a payout for a trainer&apos;s unpaid earnings.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Select value={createForm.trainerId} onValueChange={(val) => setCreateForm({ ...createForm, trainerId: val })}>
              <SelectTrigger><SelectValue placeholder="Select a trainer" /></SelectTrigger>
              <SelectContent>
                {trainerBalances.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name} (${t.pendingBalance.toFixed(2)})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={createForm.method} onValueChange={(val: any) => setCreateForm({ ...createForm, method: val })}>
              <SelectTrigger><SelectValue placeholder="Payout method" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                <SelectItem value="PAYPAL">PayPal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreatePayout} disabled={!createForm.trainerId || isCreating} className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white">
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Payout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
