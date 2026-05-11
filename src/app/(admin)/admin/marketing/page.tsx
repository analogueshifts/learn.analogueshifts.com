"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Target, TrendingUp, Users, DollarSign, Plus, ArrowUpRight, Activity } from "lucide-react"
import toast, { Toaster } from 'react-hot-toast'

interface Campaign {
  id: string
  name: string
  audience: string
  reach: number
  opens: number
  clicks: number
  conversions: number
  status: "Active" | "Paused" | "Completed"
  createdAt: string
}

const mockPastCampaigns: Campaign[] = [
  { id: "1", name: "Spring Enrollment Drive", audience: "Newsletter Subscribers", reach: 4500, opens: 3200, clicks: 850, conversions: 145, status: "Completed", createdAt: "2023-03-01" },
  { id: "2", name: "Retargeting Cart Abandoners", audience: "Cart Abandoners", reach: 1200, opens: 890, clicks: 430, conversions: 62, status: "Active", createdAt: "2023-10-15" },
]

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false)
  const [campaignData, setCampaignData] = useState({ name: "", audience: "All Users" })

  useEffect(() => {
    const stored = localStorage.getItem("platformCampaigns")
    if (stored) {
      setCampaigns([...JSON.parse(stored), ...mockPastCampaigns])
    } else {
      setCampaigns(mockPastCampaigns)
    }
  }, [])

  const handleCreateCampaign = () => {
    if (!campaignData.name) {
      toast.error("Please enter a campaign name.")
      return
    }

    // Mock reach calculation based on audience
    let mockReach = 15420;
    if (campaignData.audience === "Active Students") mockReach = 12045;
    if (campaignData.audience === "Cart Abandoners") mockReach = 840;
    if (campaignData.audience === "Newsletter Subscribers") mockReach = 5600;

    const newCampaign: Campaign = {
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

    const updatedCampaigns = [newCampaign, ...campaigns]
    setCampaigns(updatedCampaigns)
    
    const customCampaigns = updatedCampaigns.filter(c => !mockPastCampaigns.find(m => m.id === c.id))
    localStorage.setItem("platformCampaigns", JSON.stringify(customCampaigns))

    toast.success(`Campaign "${newCampaign.name}" launched to ${newCampaign.audience}! 🚀`)
    setIsCampaignModalOpen(false)
    setCampaignData({ name: "", audience: "All Users" })
  }

  const totalReach = campaigns.reduce((acc, curr) => acc + (curr.reach || 0), 0)
  const totalOpens = campaigns.reduce((acc, curr) => acc + (curr.opens || 0), 0)
  const totalConversions = campaigns.reduce((acc, curr) => acc + (curr.conversions || 0), 0)
  const avgOpenRate = totalReach > 0 ? ((totalOpens / totalReach) * 100).toFixed(1) : "0.0"

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] dark:text-white flex items-center gap-3">
            <Target className="w-8 h-8 text-[#FFBB0A]" /> Platform Campaigns
          </h1>
          <p className="text-muted-foreground mt-1">Manage internal promotions, track user engagement, and monitor conversion metrics.</p>
        </div>
        <Button 
          onClick={() => setIsCampaignModalOpen(true)}
          className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white font-bold shadow-md h-12 px-6 rounded-xl transition-transform hover:-translate-y-0.5"
        >
          <Plus className="mr-2 h-5 w-5 text-[#FFBB0A]" /> Create Campaign
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users Reached</p>
                <h3 className="text-3xl font-bold mt-1 text-foreground">{totalReach.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm font-semibold text-muted-foreground">
              Across all historical campaigns
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Open Rate</p>
                <h3 className="text-3xl font-bold mt-1 text-foreground">{avgOpenRate}%</h3>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
                <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm font-semibold text-emerald-600">
              <TrendingUp className="w-4 h-4 mr-1" /> +2.4% vs last month
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Conversions</p>
                <h3 className="text-3xl font-bold mt-1 text-foreground">{totalConversions.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl">
                <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm font-semibold text-emerald-600">
              <TrendingUp className="w-4 h-4 mr-1" /> +12% vs last month
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm rounded-2xl bg-[#0F2942] text-white">
          <CardContent className="p-6 relative overflow-hidden h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFBB0A]/20 blur-[30px] rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-white/70">Overall Effectiveness</p>
              <h3 className="text-3xl font-black mt-1 text-[#FFBB0A]">High</h3>
            </div>
            <div className="mt-4 flex items-center text-sm font-semibold text-white/90">
              <ArrowUpRight className="w-4 h-4 mr-1" /> Excellent performance
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="bg-muted/10 border-b border-border/50 p-6 lg:p-8">
          <CardTitle className="text-xl font-extrabold flex items-center gap-2">
            Active & Past Campaigns
          </CardTitle>
          <CardDescription>Track engagement and performance metrics for all internal promotional initiatives.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border/50 font-bold">
                <tr>
                  <th className="px-6 py-4">Campaign Name & Audience</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Reach</th>
                  <th className="px-6 py-4">Opens / Clicks</th>
                  <th className="px-6 py-4">Conversions</th>
                  <th className="px-6 py-4">Conv. Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No campaigns found. Launch your first campaign!
                    </td>
                  </tr>
                ) : (
                  campaigns.map((camp) => {
                    const reach = camp.reach || 0
                    const opens = camp.opens || 0
                    const clicks = camp.clicks || 0
                    const conversions = camp.conversions || 0
                    
                    const convRate = reach > 0 ? ((conversions / reach) * 100).toFixed(1) : "0.0"
                    return (
                      <tr key={camp.id} className="bg-white dark:bg-card hover:bg-muted/10 transition-colors group">
                        <td className="px-6 py-4 font-bold text-foreground">
                          {camp.name}
                          <div className="text-[10px] text-muted-foreground font-medium mt-1">Target: {camp.audience || 'All Users'} • Launched: {camp.createdAt}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            camp.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                            camp.status === 'Paused' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {camp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">{reach.toLocaleString()} users</td>
                        <td className="px-6 py-4 font-medium">
                          {opens.toLocaleString()} <span className="text-muted-foreground text-xs">/ {clicks.toLocaleString()}</span>
                          <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                            <div className="bg-[#0F2942] dark:bg-[#FFBB0A] h-1.5 rounded-full" style={{ width: `${Math.min((opens / (reach || 1)) * 100, 100)}%` }}></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">{conversions.toLocaleString()}</td>
                        <td className="px-6 py-4 font-bold">{convRate}%</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCampaignModalOpen} onOpenChange={setIsCampaignModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 font-extrabold">
              <Plus className="h-5 w-5 text-[#FFBB0A]" /> Create Campaign
            </DialogTitle>
            <DialogDescription>
              Launch a new internal email or push notification promotional campaign.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Campaign Name</Label>
              <Input
                value={campaignData.name}
                onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                placeholder="e.g. Summer Sale 2024"
                className="h-12 rounded-xl focus-visible:ring-[#0F2942] dark:focus-visible:ring-[#FFBB0A]"
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
            <Button variant="ghost" onClick={() => setIsCampaignModalOpen(false)} className="rounded-xl font-bold">Cancel</Button>
            <Button 
              onClick={handleCreateCampaign} 
              disabled={!campaignData.name} 
              className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-[#FFBB0A] font-bold rounded-xl h-10 px-6"
            >
              Launch Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
