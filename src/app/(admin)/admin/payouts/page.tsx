"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreditCard, DollarSign, CheckCircle2, AlertCircle, Calendar, ArrowUpRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import toast, { Toaster } from "react-hot-toast"

type PayoutItem = {
  id: string
  trainer: string
  amount: number
  method: string
  period: string
  status: "Pending" | "Processing"
}

const initialPayouts: PayoutItem[] = [
  { id: "PO-101", trainer: "Bob Jones", amount: 1250.00, method: "Bank Transfer", period: "Oct 2023", status: "Pending" },
  { id: "PO-102", trainer: "Sarah Connor", amount: 3400.50, method: "PayPal", period: "Oct 2023", status: "Pending" },
  { id: "PO-103", trainer: "Fiona Gallagher", amount: 890.25, method: "Bank Transfer", period: "Oct 2023", status: "Pending" },
]

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState(initialPayouts)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const toggleSelectAll = () => {
    if (selectedIds.size === payouts.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(payouts.map(p => p.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedIds(newSet)
  }

  const totalSelectedAmount = useMemo(() => {
    return payouts
      .filter(p => selectedIds.has(p.id))
      .reduce((acc, curr) => acc + curr.amount, 0)
  }, [selectedIds, payouts])

  const handleProcessPayouts = () => {
    // Mock processing logic
    setPayouts(payouts.filter(p => !selectedIds.has(p.id)))
    setSelectedIds(new Set())
    setIsConfirmOpen(false)
    toast.success(`Successfully processed ${selectedIds.size} payouts!`, { icon: '💸' })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] dark:text-white">Trainer Payouts</h1>
          <p className="text-muted-foreground mt-1">Review and process monthly revenue shares for instructors.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/10">
              <CardTitle className="text-lg flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-[#0F2942] dark:text-white" /> Pending Disbursments
              </CardTitle>
              {selectedIds.size > 0 && (
                <Button onClick={() => setIsConfirmOpen(true)} className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white shadow-md">
                  Process Selected ({selectedIds.size})
                </Button>
              )}
            </div>
            <CardContent className="p-0">
              {payouts.length === 0 ? (
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
                          checked={selectedIds.size === payouts.length && payouts.length > 0}
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
                    {payouts.map((payout) => (
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
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${payout.trainer}`} />
                              <AvatarFallback>{payout.trainer.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold">{payout.trainer}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{payout.period}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {payout.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold text-lg">${payout.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            {payouts.length > 0 && (
              <CardFooter className="border-t border-border/50 bg-muted/10 p-4 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {selectedIds.size} of {payouts.length} selected
                </span>
                <span className="font-bold text-lg text-[#0F2942] dark:text-white">
                  Total: <span className="text-emerald-600">${totalSelectedAmount.toFixed(2)}</span>
                </span>
              </CardFooter>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm bg-[#0F2942] text-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-white/90">Pending Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-4xl font-extrabold tracking-tight text-[#FFBB0A]">
                ${payouts.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
              </h3>
              <p className="text-sm text-white/60 mt-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" /> To be processed for {payouts.length} trainers
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm flex flex-col">
            <CardHeader className="bg-muted/10 border-b border-border/50 pb-4">
              <CardTitle className="text-lg">Recent History</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="divide-y divide-border/50">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Batch Payout #{890 + i}</p>
                        <p className="text-xs text-muted-foreground flex items-center mt-0.5">
                          <Calendar className="w-3 h-3 mr-1" /> {i} months ago
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-emerald-600">-$4,250.00</p>
                      <Button variant="link" className="px-0 h-auto text-xs text-[#0F2942] dark:text-[#FFBB0A]">Receipt <ArrowUpRight className="w-3 h-3 ml-0.5"/></Button>
                    </div>
                  </div>
                ))}
              </div>
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
              You are about to initiate actual fund transfers.
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
                This action is irreversible. Funds will be deducted from your gateway balances and routed to trainer accounts immediately.
              </p>
            </div>
          </div>
          <DialogFooter className="border-t border-border/50 pt-4">
            <Button variant="ghost" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleProcessPayouts} className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white shadow-md">
              Confirm & Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
