"use client"

import React, { useState, useEffect } from "react"
import { RevenueChart } from "@/components/admin/RevenueChart"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, BookOpen, DollarSign, Activity, AlertCircle, CheckCircle2, ChevronRight, Clock, Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import toast, { Toaster } from 'react-hot-toast'
import { CSVLink } from "react-csv"
import Link from "next/link"
import { useRouter } from "next/navigation"

const kpiData = [
  { title: "Total Users", value: "12,345", icon: Users, trend: "+12.5%", color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "Active Courses", value: "842", icon: BookOpen, trend: "+5.2%", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { title: "Today's Revenue", value: "$4,230", icon: DollarSign, trend: "+18.1%", color: "text-[#FFBB0A]", bg: "bg-[#FFBB0A]/10" },
  { title: "Monthly Revenue", value: "$124,500", icon: Activity, trend: "+8.4%", color: "text-[#0F2942]", bg: "bg-[#0F2942]/10" },
]

const csvExportData = [
  { metric: "Total Users", value: 12345, trend: "12.5%" },
  { metric: "Active Courses", value: 842, trend: "5.2%" },
  { metric: "Today Revenue", value: 4230, trend: "18.1%" },
  { metric: "Monthly Revenue", value: 124500, trend: "8.4%" },
]

const initialAlerts = [
  { id: 1, type: "warning", message: "5 new courses pending review", time: "2h ago", action: "Review", route: "/admin/courses/review" },
  { id: 2, type: "info", message: "Trainer application from Sarah Connor", time: "5h ago", action: "View", route: "/admin/trainers" },
  { id: 3, type: "error", message: "Stripe payout batch #492 failed", time: "1d ago", action: "Retry", route: "/admin/payouts" },
  { id: 4, type: "success", message: "System backup completed successfully", time: "1d ago", action: "Dismiss", route: null },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [alerts, setAlerts] = useState(initialAlerts)
  
  // Modals state
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false)
  const [isAllNotificationsOpen, setIsAllNotificationsOpen] = useState(false)
  
  const [campaignData, setCampaignData] = useState({ name: "", audience: "All Users" })
  
  const [adminName, setAdminName] = useState("Admin")
  const [greeting, setGreeting] = useState("Good afternoon")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")

    const data = localStorage.getItem("pendingUserRegistration")
    if (data) {
      try {
        const parsed = JSON.parse(data)
        if (parsed.firstName) setAdminName(parsed.firstName)
      } catch (e) {}
    }
  }, [])

  const handleAction = (id: number, actionName: string, route: string | null) => {
    if (actionName === "Dismiss") {
      setAlerts(alerts.filter(a => a.id !== id))
      toast.success("Alert dismissed")
    } else {
      toast.success(`Redirecting to ${actionName}...`)
      if (route) {
        router.push(route)
      }
      setAlerts(alerts.filter(a => a.id !== id))
    }
  }

  const handleCreateCampaign = () => {
    if (!campaignData.name) {
      toast.error("Please enter a campaign name.")
      return
    }

    let mockReach = 15420;
    if (campaignData.audience === "Active Students") mockReach = 12045;
    if (campaignData.audience === "Cart Abandoners") mockReach = 840;
    if (campaignData.audience === "Newsletter Subscribers") mockReach = 5600;

    const newCampaign = {
      id: Date.now().toString(),
      name: campaignData.name,
      audience: campaignData.audience,
      reach: mockReach,
      opens: 0,
      clicks: 0,
      conversions: 0,
      status: "Active",
      createdAt: new Date().toISOString().split('T')[0]
    }

    const stored = localStorage.getItem("platformCampaigns")
    const existingCampaigns = stored ? JSON.parse(stored) : []
    localStorage.setItem("platformCampaigns", JSON.stringify([newCampaign, ...existingCampaigns]))

    toast.success(`Campaign "${campaignData.name}" launched to ${campaignData.audience}! 🚀`)
    setIsCampaignModalOpen(false)
    setCampaignData({ name: "", audience: "All Users" })
    router.push("/admin/marketing")
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <Toaster position="top-right" />
      
      {/* Premium Admin Welcome Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F2942] via-[#123250] to-[#0A1A2A] text-white shadow-2xl border border-white/10 p-8 lg:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFBB0A] rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-20"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        
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
              <p className="text-white/70 text-lg mt-2 max-w-xl font-medium leading-relaxed">
                Platform metrics look great today. System is running smoothly with <strong className="text-emerald-400">zero active outages</strong>.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
            <Button 
              onClick={() => setIsCampaignModalOpen(true)}
              className="bg-[#FFBB0A] hover:bg-[#EAB308] text-[#0F2942] font-extrabold h-12 px-8 rounded-xl shadow-[0_0_20px_rgba(255,187,10,0.3)] transition-transform hover:-translate-y-0.5 w-full md:w-auto"
            >
              <Plus className="mr-2 h-5 w-5" /> New Campaign
            </Button>
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
              <div className="mt-4 flex items-center text-sm">
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200/50 hover:bg-emerald-500/20 font-semibold px-2 py-0.5">
                  {kpi.trend}
                </Badge>
                <span className="text-muted-foreground ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-xl border border-border/50 shadow-sm bg-card overflow-hidden">
          <RevenueChart />
        </div>

        <Card className="col-span-1 border-border/50 shadow-sm flex flex-col">
          <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Action Center</CardTitle>
                <CardDescription>Recent alerts & notifications</CardDescription>
              </div>
              <Badge variant="secondary" className="font-bold bg-[#FFBB0A]/20 text-[#876307]">{alerts.length} New</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto max-h-[400px]">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="font-medium text-foreground">You're all caught up!</h3>
                <p className="text-sm mt-1">No pending actions required.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-4 hover:bg-muted/30 transition-colors flex gap-4 group">
                    <div className="shrink-0 mt-0.5">
                      {alert.type === 'error' && <AlertCircle className="h-5 w-5 text-destructive" />}
                      {alert.type === 'warning' && <AlertCircle className="h-5 w-5 text-[#FFBB0A]" />}
                      {alert.type === 'info' && <Clock className="h-5 w-5 text-blue-500" />}
                      {alert.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-snug">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleAction(alert.id, alert.action, alert.route)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 text-xs font-semibold bg-[#0F2942]/5 text-[#0F2942] dark:text-[#FFBB0A]"
                    >
                      {alert.action}
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

      {/* New Campaign Modal */}
      <Dialog open={isCampaignModalOpen} onOpenChange={setIsCampaignModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#FFBB0A]" /> Create Campaign
            </DialogTitle>
            <DialogDescription>
              Launch a new internal email or push notification promotional campaign.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Campaign Name</Label>
              <Input
                value={campaignData.name}
                onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                placeholder="e.g. Summer Sale 2024"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Audience</Label>
              <select
                value={campaignData.audience}
                onChange={(e) => setCampaignData({ ...campaignData, audience: e.target.value })}
                className="w-full h-12 rounded-xl border border-border/50 bg-white dark:bg-card px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A] transition-all"
              >
                <option value="All Users">All Registered Users</option>
                <option value="Active Students">Active Students</option>
                <option value="Inactive Users">Inactive Users (Win-back)</option>
                <option value="Cart Abandoners">Cart Abandoners</option>
                <option value="Newsletter Subscribers">Newsletter Subscribers</option>
              </select>
            </div>
          </div>
          <DialogFooter className="border-t border-border/50 pt-4 mt-2">
            <Button variant="ghost" onClick={() => setIsCampaignModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateCampaign} 
              disabled={!campaignData.name} 
              className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-[#FFBB0A] font-bold"
            >
              Launch Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification History Modal */}
      <Dialog open={isAllNotificationsOpen} onOpenChange={setIsAllNotificationsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Notification History</DialogTitle>
            <DialogDescription>
              Past alerts and system notifications.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4 max-h-[300px] overflow-y-auto">
             <div className="flex gap-3 items-start opacity-70">
               <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
               <div>
                 <p className="text-sm font-medium text-foreground">Course "Introduction to UI/UX" Approved</p>
                 <p className="text-xs text-muted-foreground">Oct 24, 2023 - System</p>
               </div>
             </div>
             <div className="flex gap-3 items-start opacity-70">
               <AlertCircle className="h-5 w-5 text-[#FFBB0A] shrink-0" />
               <div>
                 <p className="text-sm font-medium text-foreground">High server load detected</p>
                 <p className="text-xs text-muted-foreground">Oct 22, 2023 - Infrastructure</p>
               </div>
             </div>
             <div className="flex gap-3 items-start opacity-70">
               <Clock className="h-5 w-5 text-blue-500 shrink-0" />
               <div>
                 <p className="text-sm font-medium text-foreground">Monthly batch payouts completed</p>
                 <p className="text-xs text-muted-foreground">Oct 01, 2023 - Finance</p>
               </div>
             </div>
          </div>
          <DialogFooter className="border-t border-border/50 pt-4 mt-2">
            <Button variant="outline" onClick={() => setIsAllNotificationsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
