"use client"

import React, { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, XCircle, Search, Mail, ExternalLink, Star, BookOpen, MoreHorizontal, Ban, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import toast, { Toaster } from 'react-hot-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CSVLink } from "react-csv"

interface TrainerProfile {
  bio: string | null
  expertise: string[]
  experience: string | null
  portfolio: string | null
  applicationStatus: "PENDING" | "APPROVED" | "REJECTED"
}

interface Trainer {
  id: string
  name: string
  email: string
  status: "ACTIVE" | "SUSPENDED" | "BANNED"
  createdAt: string
  courseCount: number
  avgRating: number
  trainerProfile: TrainerProfile | null
}

export default function InstructorDirectory() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetch("/api/admin/trainers")
      .then((res) => res.json())
      .then((body) => body.success && setTrainers(body.data))
      .finally(() => setIsLoading(false))
  }, [])

  const applications = trainers.filter((t) => t.trainerProfile?.applicationStatus === "PENDING")
  const activeTrainers = trainers.filter((t) => t.trainerProfile?.applicationStatus === "APPROVED")

  const handleApplicationDecision = async (id: string, applicationStatus: "APPROVED" | "REJECTED") => {
    const response = await fetch(`/api/admin/trainers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationStatus }),
    })
    const body = await response.json()
    if (body.success) {
      setTrainers(trainers.map((t) => t.id === id ? { ...t, trainerProfile: { ...(t.trainerProfile ?? { bio: null, expertise: [], experience: null, portfolio: null, applicationStatus }), applicationStatus } } : t))
      if (applicationStatus === "APPROVED") toast.success("Trainer application approved! Added to active roster.", { icon: '🎉' })
      else toast.error("Trainer application rejected.")
    } else {
      toast.error(body.error ?? "Failed to update application")
    }
  }

  const handleStatusChange = async (id: string, newStatus: Trainer["status"]) => {
    const response = await fetch(`/api/admin/trainers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    const body = await response.json()
    if (body.success) {
      setTrainers(trainers.map(t => t.id === id ? { ...t, status: newStatus } : t))
      if (newStatus === "SUSPENDED") toast.error("Trainer suspended. They can no longer upload courses.")
      else toast.success("Trainer account reactivated.")
    } else {
      toast.error(body.error ?? "Failed to update status")
    }
  }

  const filteredTrainers = activeTrainers.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] dark:text-white">Instructor Directory</h1>
          <p className="text-muted-foreground mt-1">Review incoming trainer applications and manage active instructors.</p>
        </div>
      </div>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="mb-6 bg-muted/50 p-1 rounded-xl w-full md:w-auto flex md:inline-flex h-auto">
          <TabsTrigger
            value="applications"
            className="flex-1 md:w-auto md:px-8 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#0F2942] data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white transition-all font-medium text-muted-foreground"
          >
            Applications <Badge className="ml-2 bg-[#FFBB0A] text-[#0F2942] border-none shadow-sm">{applications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="flex-1 md:w-auto md:px-8 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#0F2942] data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white transition-all font-medium text-muted-foreground"
          >
            Active Trainers <Badge variant="outline" className="ml-2 bg-background shadow-sm">{activeTrainers.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          <Card className="border-border/50 shadow-sm overflow-hidden flex flex-col">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold text-muted-foreground h-11">Applicant</TableHead>
                      <TableHead className="font-semibold text-muted-foreground h-11">Expertise</TableHead>
                      <TableHead className="font-semibold text-muted-foreground h-11">Experience</TableHead>
                      <TableHead className="font-semibold text-muted-foreground h-11">Applied Date</TableHead>
                      <TableHead className="font-semibold text-muted-foreground h-11 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow><TableCell colSpan={5} className="h-32 text-center"><Loader2 className="h-6 w-6 mx-auto animate-spin text-muted-foreground" /></TableCell></TableRow>
                    ) : applications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                          <div className="flex flex-col items-center justify-center">
                            <CheckCircle className="h-8 w-8 mb-2 text-emerald-500/50" />
                            <p>No pending applications!</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      applications.map((app) => (
                        <TableRow key={app.id} className="hover:bg-muted/20 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border border-border/50 shadow-sm">
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${app.name}`} />
                                <AvatarFallback>{app.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-semibold text-foreground">{app.name}</span>
                                <span className="text-xs text-muted-foreground flex items-center mt-0.5">
                                  <Mail className="h-3 w-3 mr-1" /> {app.email}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {app.trainerProfile?.expertise.length ? (
                              <div className="flex flex-wrap gap-1">
                                {app.trainerProfile.expertise.map((e) => (
                                  <Badge key={e} variant="outline" className="font-medium bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">{e}</Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">Not specified</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium">{app.trainerProfile?.experience ?? "—"}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{new Date(app.createdAt).toLocaleDateString()}</span>
                            {app.trainerProfile?.portfolio && (
                              <div className="mt-1">
                                <Button variant="link" asChild className="px-0 h-auto text-[10px] text-[#0F2942] dark:text-[#FFBB0A]">
                                  <a href={app.trainerProfile.portfolio} target="_blank" rel="noopener noreferrer">View Portfolio <ExternalLink className="ml-1 h-2 w-2" /></a>
                                </Button>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive h-8" onClick={() => handleApplicationDecision(app.id, "REJECTED")}>
                                <XCircle className="mr-1.5 h-3 w-3" /> Reject
                              </Button>
                              <Button size="sm" className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white shadow-md h-8" onClick={() => handleApplicationDecision(app.id, "APPROVED")}>
                                <CheckCircle className="mr-1.5 h-3 w-3 text-[#FFBB0A]" /> Approve
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card className="border-border/50 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trainers by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-background w-full"
                />
              </div>
              <CSVLink data={activeTrainers} filename="trainers-roster.csv">
                <Button variant="outline" className="shrink-0">Export Roster</Button>
              </CSVLink>
            </div>
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                 <Table>
                   <TableHeader className="bg-muted/30">
                     <TableRow className="hover:bg-transparent">
                       <TableHead className="font-semibold text-muted-foreground h-11">Instructor</TableHead>
                       <TableHead className="font-semibold text-muted-foreground h-11">Metrics</TableHead>
                       <TableHead className="font-semibold text-muted-foreground h-11">Status</TableHead>
                       <TableHead className="font-semibold text-muted-foreground h-11 text-right">Actions</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {isLoading ? (
                       <TableRow><TableCell colSpan={4} className="h-32 text-center"><Loader2 className="h-6 w-6 mx-auto animate-spin text-muted-foreground" /></TableCell></TableRow>
                     ) : filteredTrainers.length === 0 ? (
                       <TableRow>
                         <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                           <div className="flex flex-col items-center justify-center">
                             <Search className="h-8 w-8 mb-2 text-muted-foreground/50" />
                             <p>No trainers found matching &quot;{searchTerm}&quot;.</p>
                           </div>
                         </TableCell>
                       </TableRow>
                     ) : (
                       filteredTrainers.map((trainer) => (
                         <TableRow key={trainer.id} className="hover:bg-muted/20 transition-colors">
                           <TableCell>
                             <div className="flex items-center gap-3">
                               <Avatar className="h-9 w-9 border border-border/50 shadow-sm">
                                 <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${trainer.name}`} />
                                 <AvatarFallback>{trainer.name.charAt(0)}</AvatarFallback>
                               </Avatar>
                               <div className="flex flex-col">
                                 <span className="font-semibold text-foreground">{trainer.name}</span>
                                 <span className="text-xs text-muted-foreground">{trainer.email}</span>
                               </div>
                             </div>
                           </TableCell>
                           <TableCell>
                             <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                               <div className="flex items-center gap-1">
                                 <BookOpen className="h-3 w-3" /> {trainer.courseCount} active courses
                               </div>
                               {trainer.avgRating > 0 ? (
                                 <div className="flex items-center gap-1 text-[#FFBB0A]">
                                   <Star className="h-3 w-3 fill-current" /> {trainer.avgRating.toFixed(1)} avg rating
                                 </div>
                               ) : (
                                 <span className="text-muted-foreground">No ratings yet</span>
                               )}
                             </div>
                           </TableCell>
                           <TableCell>
                             <div className="flex items-center">
                               <span className={`h-2 w-2 rounded-full mr-2 ${
                                 trainer.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-destructive'
                               }`} />
                               <span className="text-sm font-medium text-muted-foreground">{trainer.status}</span>
                             </div>
                           </TableCell>
                           <TableCell className="text-right">
                             <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                 <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/50">
                                   <span className="sr-only">Open menu</span>
                                   <MoreHorizontal className="h-4 w-4" />
                                 </Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="end" className="w-48">
                                 <DropdownMenuLabel>Trainer Actions</DropdownMenuLabel>
                                 <DropdownMenuSeparator />
                                 {trainer.status === "ACTIVE" ? (
                                   <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => handleStatusChange(trainer.id, "SUSPENDED")}>
                                     <Ban className="mr-2 h-4 w-4" /> Suspend Account
                                   </DropdownMenuItem>
                                 ) : (
                                   <DropdownMenuItem className="text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700" onClick={() => handleStatusChange(trainer.id, "ACTIVE")}>
                                     <CheckCircle className="mr-2 h-4 w-4" /> Reactivate Account
                                   </DropdownMenuItem>
                                 )}
                               </DropdownMenuContent>
                             </DropdownMenu>
                           </TableCell>
                         </TableRow>
                       ))
                     )}
                   </TableBody>
                 </Table>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
