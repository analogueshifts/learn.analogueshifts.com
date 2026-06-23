"use client"

import React, { useState, useEffect } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, UserPlus, Search, Shield, Ban, CheckCircle, Mail, GraduationCap, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast, { Toaster } from 'react-hot-toast'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CSVLink } from "react-csv"

export type User = {
  id: string
  name: string
  email: string
  role: "ADMIN" | "TRAINER" | "STUDENT"
  status: "ACTIVE" | "SUSPENDED" | "BANNED"
  createdAt: string
}

export default function UsersPage() {
  const [data, setData] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((body) => body.success && setData(body.data))
      .finally(() => setIsLoading(false))
  }, [])

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "STUDENT" })
  const [isCreating, setIsCreating] = useState(false)

  const handleAddUser = async () => {
    setIsCreating(true)
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
    const body = await response.json()
    setIsCreating(false)
    if (body.success) {
      setData([body.data, ...data])
      setIsAddOpen(false)
      setNewUser({ name: "", email: "", password: "", role: "STUDENT" })
      toast.success("User added successfully!")
    } else {
      toast.error(body.error ?? "Failed to create user")
    }
  }

  const handleStatusChange = async (id: string, newStatus: User["status"]) => {
    const response = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    const body = await response.json()
    if (body.success) {
      setData(data.map(u => u.id === id ? body.data : u))
      toast.success(`User status changed to ${newStatus}`)
    } else {
      toast.error(body.error ?? "Failed to update status")
    }
  }

  const handleRoleChange = async (id: string, newRole: User["role"]) => {
    const response = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    })
    const body = await response.json()
    if (body.success) {
      setData(data.map(u => u.id === id ? body.data : u))
      toast.success(`User promoted to ${newRole}`)
    } else {
      toast.error(body.error ?? "Failed to update role")
    }
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border/50 shadow-sm">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="text-muted-foreground hidden">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        return (
          <Badge variant="outline" className={`
            font-medium px-2.5 py-0.5 border
            ${role === 'ADMIN' ? 'bg-[#0F2942]/10 text-[#0F2942] border-[#0F2942]/20 dark:bg-[#FFBB0A]/10 dark:text-[#FFBB0A] dark:border-[#FFBB0A]/20' : ''}
            ${role === 'TRAINER' ? 'bg-purple-500/10 text-purple-700 border-purple-200 dark:text-purple-400 dark:border-purple-500/30' : ''}
            ${role === 'STUDENT' ? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' : ''}
          `}>
            {role === 'ADMIN' && <Shield className="w-3 h-3 mr-1" />}
            {role}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <div className="flex items-center">
            <span className={`h-2 w-2 rounded-full mr-2 ${
              status === 'ACTIVE' ? 'bg-emerald-500' :
              status === 'SUSPENDED' ? 'bg-[#FFBB0A]' : 'bg-destructive'
            }`} />
            <span className="text-sm font-medium text-muted-foreground">{status}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 hover:bg-muted/50"
          >
            Joined Date
            <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.getValue("createdAt")).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      )
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/50">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => {
                  navigator.clipboard.writeText(user.email)
                  toast.success("Email copied to clipboard")
                }}>
                  <Mail className="mr-2 h-4 w-4" /> Copy Email
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                {user.role !== "ADMIN" && (
                  <>
                    <DropdownMenuItem onClick={() => handleRoleChange(user.id, "TRAINER")}>
                      <GraduationCap className="mr-2 h-4 w-4" /> Promote to Trainer
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange(user.id, "ADMIN")}>
                      <Shield className="mr-2 h-4 w-4" /> Make Admin
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}

                {user.status === "ACTIVE" ? (
                  <>
                    <DropdownMenuItem className="text-amber-600 focus:bg-amber-50 focus:text-amber-700 dark:focus:bg-amber-950/50 dark:focus:text-amber-500" onClick={() => handleStatusChange(user.id, "SUSPENDED")}>
                      Suspend User
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => handleStatusChange(user.id, "BANNED")}>
                      <Ban className="mr-2 h-4 w-4" /> Ban User
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem className="text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700 dark:focus:bg-emerald-950/50 dark:focus:text-emerald-500" onClick={() => handleStatusChange(user.id, "ACTIVE")}>
                    <CheckCircle className="mr-2 h-4 w-4" /> Reactivate User
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
    initialState: {
      columnVisibility: { email: false }
    }
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] dark:text-white">User Management</h1>
          <p className="text-muted-foreground mt-1">View and manage all members across your platform.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-[#0F2942] hover:bg-[#0F2942]/90 text-white shadow-md">
          <UserPlus className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="pl-9 bg-background w-full"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select onValueChange={(val) => table.getColumn("role")?.setFilterValue(val === "all" ? "" : val)}>
              <SelectTrigger className="w-[140px] bg-background">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="TRAINER">Trainer</SelectItem>
                <SelectItem value="STUDENT">Student</SelectItem>
              </SelectContent>
            </Select>
            <CSVLink data={data} filename={"platform-users-export.csv"}>
              <Button variant="outline" className="shrink-0">Export CSV</Button>
            </CSVLink>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="h-11 font-semibold text-muted-foreground">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={columns.length} className="h-32 text-center"><Loader2 className="h-6 w-6 mx-auto animate-spin text-muted-foreground" /></TableCell></TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="h-8 w-8 mb-2 text-muted-foreground/50" />
                      <p>No users found matching your filters.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 border-t border-border/50 flex items-center justify-between bg-muted/10">
          <div className="text-sm text-muted-foreground">
            Showing {table.getRowModel().rows.length} of {data.length} users
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New User</DialogTitle>
            <DialogDescription>
              Create a new account manually. The user can log in immediately using the credentials you provide below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="e.g. John Doe"
                className="h-10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="john@example.com"
                className="h-10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Temporary Password</Label>
              <Input
                id="password"
                type="text"
                value={newUser.password || ""}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="e.g. TempPass123!"
                className="h-10"
              />
              <p className="text-[10px] text-muted-foreground">Provide this password to the user securely. They can change it later in their profile. Minimum 8 characters.</p>
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">User Role</Label>
              <Select value={newUser.role} onValueChange={(val) => setNewUser({ ...newUser, role: val })}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">Student (Default)</SelectItem>
                  <SelectItem value="TRAINER">Trainer</SelectItem>
                  <SelectItem value="ADMIN">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="border-t border-border/50 pt-4 mt-2">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser} disabled={!newUser.name || !newUser.email || newUser.password.length < 8 || isCreating} className="bg-[#FFBB0A] hover:bg-[#EAB308] text-[#0F2942] font-bold">
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
