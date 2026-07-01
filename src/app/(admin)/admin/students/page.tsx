"use client"

import React, { useState, useEffect } from "react"
import { Search, Mail, Ban, CheckCircle, Loader2, GraduationCap, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import toast, { Toaster } from "react-hot-toast"

interface Student {
  id: string
  name: string
  email: string
  role: string
  status: "ACTIVE" | "SUSPENDED" | "BANNED"
  createdAt: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/admin/users?role=STUDENT")
      .then((res) => res.json())
      .then((body) => body.success && setStudents(body.data))
      .finally(() => setIsLoading(false))
  }, [])

  const handleStatusChange = async (id: string, newStatus: Student["status"]) => {
    const response = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    const body = await response.json()
    if (body.success) {
      setStudents(students.map((s) => (s.id === id ? { ...s, status: newStatus } : s)))
      toast.success(`Student ${newStatus === "ACTIVE" ? "reactivated" : "status updated"}`)
    } else {
      toast.error(body.error ?? "Failed to update status")
    }
  }

  const handlePromoteToTrainer = async (id: string) => {
    const response = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "TRAINER" }),
    })
    const body = await response.json()
    if (body.success) {
      setStudents(students.filter((s) => s.id !== id))
      toast.success("Student promoted to Trainer")
    } else {
      toast.error(body.error ?? "Failed to promote")
    }
  }

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] dark:text-white">Students</h1>
        <p className="text-muted-foreground mt-1">All registered students on the platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#0F2942]">{students.length}</p>
              <p className="text-xs text-muted-foreground font-medium">Total Students</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#0F2942]">{students.filter((s) => s.status === "ACTIVE").length}</p>
              <p className="text-xs text-muted-foreground font-medium">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Ban className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#0F2942]">{students.filter((s) => s.status !== "ACTIVE").length}</p>
              <p className="text-xs text-muted-foreground font-medium">Suspended / Banned</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border/50 bg-muted/10 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
          <span className="text-sm text-muted-foreground ml-auto">{filtered.length} of {students.length}</span>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-muted-foreground h-11">Student</TableHead>
                  <TableHead className="font-semibold text-muted-foreground h-11">Status</TableHead>
                  <TableHead className="font-semibold text-muted-foreground h-11">Joined</TableHead>
                  <TableHead className="font-semibold text-muted-foreground h-11 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                      <Loader2 className="h-6 w-6 mx-auto animate-spin text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                      No students found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-border/50 shadow-sm">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name)}`} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${student.status === "ACTIVE" ? "bg-emerald-500" : "bg-destructive"}`} />
                          <Badge variant="outline" className={student.status === "ACTIVE" ? "text-emerald-700 border-emerald-200 bg-emerald-50" : "text-red-700 border-red-200 bg-red-50"}>
                            {student.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(student.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/50">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Student Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(student.email); toast.success("Email copied") }}>
                              <Mail className="mr-2 h-4 w-4" /> Copy Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handlePromoteToTrainer(student.id)}>
                              <GraduationCap className="mr-2 h-4 w-4" /> Promote to Trainer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {student.status === "ACTIVE" ? (
                              <>
                                <DropdownMenuItem className="text-amber-600 focus:bg-amber-50" onClick={() => handleStatusChange(student.id, "SUSPENDED")}>
                                  Suspend Student
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => handleStatusChange(student.id, "BANNED")}>
                                  <Ban className="mr-2 h-4 w-4" /> Ban Student
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <DropdownMenuItem className="text-emerald-600 focus:bg-emerald-50" onClick={() => handleStatusChange(student.id, "ACTIVE")}>
                                <CheckCircle className="mr-2 h-4 w-4" /> Reactivate
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
    </div>
  )
}
