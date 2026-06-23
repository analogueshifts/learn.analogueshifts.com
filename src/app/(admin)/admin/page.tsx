"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { RevenueChart } from "@/components/admin/RevenueChart"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, BookOpen, DollarSign, Activity, AlertCircle, CheckCircle2, ChevronRight, Clock, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import toast, { Toaster } from 'react-hot-toast'
import { CSVLink } from "react-csv"
import { useRouter } from "next/navigation"

interface Stats {
  totalUsers: number
  activeCourses: number
  todayRevenue: number
  monthRevenue: number
}

interface Notification {
  id: string
  type: "INFO" | "WARNING" | "ERROR" | "SUCCESS"
  title: string
  message: string
  actionUrl: string | null
  read: boolean
  createdAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats | null>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAllNotificationsOpen, setIsAllNotificationsOpen] = useState(false)
  const [greeting, setGreeting] = useState("Good afternoon")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")

    Promise.all([
      fetch("/api/admin/stats").then((res) => res.json()),
      fetch("/api/admin/finance").then((res) => res.json()),
      fetch("/api/admin/notifications").then((res) => res.json()),
    ])
      .then(([statsBody, financeBody, notificationsBody]) => {
        if (statsBody.success) setStats(statsBody.data)
        if (financeBody.success) setTransactions(financeBody.data.transactions)
        if (notificationsBody.success) setNotifications(notificationsBody.data)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const unreadAlerts = notifications.filter((n) => !n.read)

  const handleAction = async (notif: Notification) => {
    await fetch(`/api/admin/notifications/${notif.id}`, { method: "PATCH" })
    setNotifications(notifications.map((n) => n.id === notif.id ? { ...n, read: true } : n))
    if (notif.actionUrl) {
      router.push(notif.actionUrl)
    } else {
      toast.success("Alert dismissed")
    }
  }

  const adminName = session?.user?.name?.split(" ")[0] ?? "Admin"

  const kpiData = stats ? [
    { title: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Active Courses", value: stats.activeCourses.toLocaleString(), icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Today's Revenue", value: `$${stats.todayRevenue.toLocaleString()}`, icon: DollarSign, color: "text-[#FFBB0A]", bg: "bg-[#FFBB0A]/10" },
    { title: "Monthly Revenue", value: `$${stats.monthRevenue.toLocaleString()}`, icon: Activity, color: "text-[#0F2942]", bg: "bg-[#0F2942]/10" },
  ] : []

  const csvExportData = stats ? [
    { metric: "Total Users", value: stats.totalUsers },
    { metric: "Active Courses", value: stats.activeCourses },
    { metric: "Today Revenue", value: stats.todayRevenue },
    { metric: "Monthly Revenue", value: stats.monthRevenue },
  ] : []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-6 w-6 mr-2 animate-spin" /> Loading dashboard...
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <Toaster position="top-right" />

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F2942] via-[#123250] to-[#0A1A2A] text-white shadow-2xl border border-white/10 p-8 lg:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFBB0A] rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-start sm:items-center gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-background shadow-2xl overflow-hidden shrink-0 bg-white">
              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${adminName}`} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-widest text-[#FFBB0A] mb-3 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFBB0A] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFBB0A]"></span>
                </span>
                Super Admin Access
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">{greeting},<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFBB0A] to-amber-200">{adminName}!</span></h1>
            </div>
          </div>

          <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
            <CSVLink data={csvExportData} filename={"kpi-overview-export.csv"} className="w-full md:w-auto">
              <Button variant="outline" className="w-full h-12 rounded-xl border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold transition-transform hover:-translate-y-0.5">
                <Download className="mr-2 h-5 w-5" /> Download Report
              </Button>
            </CSVLink>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold tracking-tight text-foreground">{kpi.value}</h3>
                  </div>
                </div>
                <div className={`p-3 rounded-2xl ${kpi.bg}`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-xl border border-border/50 shadow-sm bg-card overflow-hidden">
          <RevenueChart transactions={transactions} />
        </div>

        <Card className="col-span-1 border-border/50 shadow-sm flex flex-col">
          <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Action Center</CardTitle>
                <CardDescription>Recent alerts & notifications</CardDescription>
              </div>
              <Badge variant="secondary" className="font-bold bg-[#FFBB0A]/20 text-[#876307]">{unreadAlerts.length} New</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto max-h-[400px]">
            {unreadAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="font-medium text-foreground">You&apos;re all caught up!</h3>
                <p className="text-sm mt-1">No pending actions required.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {unreadAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 hover:bg-muted/30 transition-colors flex gap-4 group">
                    <div className="shrink-0 mt-0.5">
                      {alert.type === 'ERROR' && <AlertCircle className="h-5 w-5 text-destructive" />}
                      {alert.type === 'WARNING' && <AlertCircle className="h-5 w-5 text-[#FFBB0A]" />}
                      {alert.type === 'INFO' && <Clock className="h-5 w-5 text-blue-500" />}
                      {alert.type === 'SUCCESS' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-snug">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAction(alert)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 text-xs font-semibold bg-[#0F2942]/5 text-[#0F2942] dark:text-[#FFBB0A]"
                    >
                      {alert.actionUrl ? "View" : "Dismiss"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <div className="p-3 border-t border-border/50 bg-muted/10">
            <Button
              variant="ghost"
              className="w-full text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setIsAllNotificationsOpen(true)}
            >
              View all notification history <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </Card>
      </div>

      <Dialog open={isAllNotificationsOpen} onOpenChange={setIsAllNotificationsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Notification History</DialogTitle>
            <DialogDescription>Past alerts and system notifications.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4 max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notifications yet.</p>
            ) : notifications.map((notif) => (
              <div key={notif.id} className={`flex gap-3 items-start ${notif.read ? 'opacity-70' : ''}`}>
                {notif.type === 'ERROR' && <AlertCircle className="h-5 w-5 text-destructive shrink-0" />}
                {notif.type === 'WARNING' && <AlertCircle className="h-5 w-5 text-[#FFBB0A] shrink-0" />}
                {notif.type === 'INFO' && <Clock className="h-5 w-5 text-blue-500 shrink-0" />}
                {notif.type === 'SUCCESS' && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                <div>
                  <p className="text-sm font-medium text-foreground">{notif.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(notif.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="border-t border-border/50 pt-4 mt-2">
            <Button variant="outline" onClick={() => setIsAllNotificationsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
