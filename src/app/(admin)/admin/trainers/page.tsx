"use client"

import React, { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, XCircle, Search, Mail, ExternalLink, GraduationCap, Users, MoreHorizontal, Ban, MessageSquare, Star, BookOpen } from "lucide-react"
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

type Application = {
  id: string
  name: string
  email: string
  expertise: string
  experience: string
  status: "Pending" | "Approved" | "Rejected"
  appliedDate: string
}

type ActiveTrainer = {
  id: string
  name: string
  email: string
  specialty: string
  courses: number
  rating: number
  status: "Active" | "Suspended"
  joinedDate: string
}

const initialApplications: Application[] = [
  { id: "app1", name: "Dr. Alan Turing", email: "alan@example.com", expertise: "Computer Science", experience: "15 years", status: "Pending", appliedDate: "2024-05-10" },
  { id: "app2", name: "Marie Curie", email: "marie@example.com", expertise: "Physics & Chemistry", experience: "20 years", status: "Pending", appliedDate: "2024-05-11" },
  { id: "app3", name: "Grace Hopper", email: "grace@example.com", expertise: "Software Engineering", experience: "10 years", status: "Pending", appliedDate: "2024-05-11" },
]

const initialActiveTrainers: ActiveTrainer[] = [
  { id: "t1", name: "Bob Jones", email: "bob@example.com", specialty: "Web Development", courses: 5, rating: 4.8, status: "Active", joinedDate: "2023-11-02" },
  { id: "t2", name: "Sarah Connor", email: "sarah@example.com", specialty: "UI/UX Design", courses: 2, rating: 4.9, status: "Active", joinedDate: "2023-12-15" },
  { id: "t3", name: "Fiona Gallagher", email: "fiona@example.com", specialty: "Data Science", courses: 3, rating: 4.5, status: "Suspended", joinedDate: "2023-08-14" },
  { id: "t4", name: "Eve Smith", email: "eve@example.com", specialty: "Digital Marketing", courses: 1, rating: 4.2, status: "Active", joinedDate: "2024-01-20" },
]

export default function InstructorDirectory() {
  const [applications, setApplications] = useState<Application[]>(initialApplications)
  const [activeTrainers, setActiveTrainers] = useState<ActiveTrainer[]>(initialActiveTrainers)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Load dynamically created applications from localStorage (from Registration flow)
    const storedAppsStr = localStorage.getItem("mockTrainerApplications")
    if (storedAppsStr) {
      const storedApps = JSON.parse(storedAppsStr)
      // Only add them if they aren't already in the initial array (based on ID)
      setApplications(prev => {
        const newApps = storedApps.filter((sa: Application) => !prev.some(p => p.id === sa.id))
        return [...newApps, ...prev]
      })
    }
  }, [])

  const handleApprove = (id: string) => {
    const app = applications.find(a => a.id === id)
    if (app) {
      // Move from applications to active trainers
      const newTrainer: ActiveTrainer = {
        id: `t_${Date.now()}`,
        name: app.name,
        email: app.email,
        specialty: app.expertise,
        courses: 0,
        rating: 0,
        status: "Active",
        joinedDate: new Date().toISOString().split('T')[0]
      }
      setActiveTrainers([newTrainer, ...activeTrainers])
      setApplications(applications.filter(a => a.id !== id))
      toast.success("Trainer application approved! Added to active roster.", { icon: '🎉' })
    }
  }

  const handleReject = (id: string) => {
    setApplications(applications.filter(app => app.id !== id))
    toast.error("Trainer application rejected.")
  }

  const handleStatusChange = (id: string, newStatus: ActiveTrainer["status"]) => {
    setActiveTrainers(activeTrainers.map(t => t.id === id ? { ...t, status: newStatus } : t))
    if (newStatus === "Suspended") {
      toast.error("Trainer suspended. They can no longer upload courses.")
    } else {
      toast.success("Trainer account reactivated.")
    }
  }

  const filteredTrainers = activeTrainers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.specialty.toLowerCase().includes(searchTerm.toLowerCase())
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
                    {applications.length === 0 ? (
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
                            <Badge variant="outline" className="font-medium bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {app.expertise}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium">{app.experience}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{app.appliedDate}</span>
                            <div className="mt-1">
                              <Button variant="link" className="px-0 h-auto text-[10px] text-[#0F2942] dark:text-[#FFBB0A]">
                                View Portfolio <ExternalLink className="ml-1 h-2 w-2" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive h-8" onClick={() => handleReject(app.id)}>
                                <XCircle className="mr-1.5 h-3 w-3" /> Reject
                              </Button>
                              <Button size="sm" className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white shadow-md h-8" onClick={() => handleApprove(app.id)}>
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
                  placeholder="Search trainers by name or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-background w-full"
                />
              </div>
              <CSVLink data={activeTrainers} filename="trainers-roster.csv">
                <Button variant="outline" className="shrink-0" onClick={() => toast.success("Trainer roster export started!")}>
                  Export Roster
                </Button>
              </CSVLink>
            </div>
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                 <Table>
                   <TableHeader className="bg-muted/30">
                     <TableRow className="hover:bg-transparent">
                       <TableHead className="font-semibold text-muted-foreground h-11">Instructor</TableHead>
                       <TableHead className="font-semibold text-muted-foreground h-11">Specialty</TableHead>
                       <TableHead className="font-semibold text-muted-foreground h-11">Metrics</TableHead>
                       <TableHead className="font-semibold text-muted-foreground h-11">Status</TableHead>
                       <TableHead className="font-semibold text-muted-foreground h-11 text-right">Actions</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {filteredTrainers.length === 0 ? (
                       <TableRow>
                         <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                           <div className="flex flex-col items-center justify-center">
                             <Search className="h-8 w-8 mb-2 text-muted-foreground/50" />
                             <p>No trainers found matching "{searchTerm}".</p>
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
                             <Badge variant="secondary" className="font-medium bg-muted text-foreground">
                               {trainer.specialty}
                             </Badge>
                           </TableCell>
                           <TableCell>
                             <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                               <div className="flex items-center gap-1">
                                 <BookOpen className="h-3 w-3" /> {trainer.courses} active courses
                               </div>
                               {trainer.rating > 0 ? (
                                 <div className="flex items-center gap-1 text-[#FFBB0A]">
                                   <Star className="h-3 w-3 fill-current" /> {trainer.rating.toFixed(1)} avg rating
                                 </div>
                               ) : (
                                 <span className="text-muted-foreground">No ratings yet</span>
                               )}
                             </div>
                           </TableCell>
                           <TableCell>
                             <div className="flex items-center">
                               <span className={`h-2 w-2 rounded-full mr-2 ${
                                 trainer.status === 'Active' ? 'bg-emerald-500' : 'bg-destructive'
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
                                 <DropdownMenuItem onClick={() => toast("Opening messenger...", { icon: '💬' })}>
                                   <MessageSquare className="mr-2 h-4 w-4" /> Message Trainer
                                 </DropdownMenuItem>
                                 <DropdownMenuSeparator />
                                 {trainer.status === "Active" ? (
                                   <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => handleStatusChange(trainer.id, "Suspended")}>
                                     <Ban className="mr-2 h-4 w-4" /> Suspend Account
                                   </DropdownMenuItem>
                                 ) : (
                                   <DropdownMenuItem className="text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700" onClick={() => handleStatusChange(trainer.id, "Active")}>
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
