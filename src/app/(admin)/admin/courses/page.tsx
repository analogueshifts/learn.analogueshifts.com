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
import { MoreHorizontal, Search, Star, Users, CheckCircle, Clock, Archive, PenTool, Loader2 } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast, { Toaster } from 'react-hot-toast'
import Link from "next/link"
import { CSVLink } from "react-csv"

export type Course = {
  id: string
  title: string
  trainer: { name: string }
  price: number
  status: "LIVE" | "PENDING" | "DRAFT" | "ARCHIVED"
  enrolledCount: number
  avgRating: number
  createdAt: string
}

export default function CoursesPage() {
  const [data, setData] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  useEffect(() => {
    fetch("/api/admin/courses")
      .then((res) => res.json())
      .then((body) => body.success && setData(body.data))
      .finally(() => setIsLoading(false))
  }, [])

  const pendingCount = data.filter((c) => c.status === "PENDING").length

  const handleStatusChange = async (id: string, newStatus: Course["status"]) => {
    const response = await fetch(`/api/admin/courses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    const body = await response.json()
    if (body.success) {
      setData(data.map(c => c.id === id ? { ...c, status: body.data.status } : c))
      toast.success(`Course status updated to ${newStatus}`)
    } else {
      toast.error(body.error ?? "Failed to update status")
    }
  }

  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "title",
      header: "Course Name",
      cell: ({ row }) => (
        <div className="font-semibold text-foreground max-w-[250px] truncate" title={row.getValue("title")}>
          {row.getValue("title")}
        </div>
      ),
    },
    {
      id: "trainer",
      accessorFn: (row) => row.trainer.name,
      header: "Trainer",
      cell: ({ row }) => <div className="text-muted-foreground">{row.original.trainer.name}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant="outline" className={`
            font-medium px-2.5 py-0.5 border
            ${status === 'LIVE' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-500/30' : ''}
            ${status === 'PENDING' ? 'bg-[#FFBB0A]/10 text-[#876307] border-[#FFBB0A]/30 dark:text-[#FFBB0A] dark:border-[#FFBB0A]/20' : ''}
            ${status === 'DRAFT' ? 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' : ''}
            ${status === 'ARCHIVED' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50' : ''}
          `}>
            {status === 'LIVE' && <CheckCircle className="w-3 h-3 mr-1" />}
            {status === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const amount = row.getValue("price") as number
        const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
        return <div className="font-medium text-muted-foreground">{formatted}</div>
      },
    },
    {
      id: "metrics",
      header: "Metrics",
      cell: ({ row }) => {
        const { enrolledCount, avgRating } = row.original
        return (
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" /> {enrolledCount.toLocaleString()} students
            </div>
            {avgRating > 0 && (
              <div className="flex items-center gap-1 text-[#FFBB0A]">
                <Star className="h-3 w-3 fill-current" /> {avgRating.toFixed(1)} rating
              </div>
            )}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const course = row.original
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
                <DropdownMenuLabel>Course Actions</DropdownMenuLabel>

                {course.status === "PENDING" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/courses/review" className="cursor-pointer text-[#0F2942]">
                      <Clock className="mr-2 h-4 w-4" /> Open in Review Queue
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                {course.status !== "ARCHIVED" ? (
                  <DropdownMenuItem
                    className="text-muted-foreground focus:bg-muted"
                    onClick={() => handleStatusChange(course.id, "ARCHIVED")}
                  >
                    <Archive className="mr-2 h-4 w-4" /> Archive Course
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="text-[#FFBB0A] focus:bg-[#FFBB0A]/10"
                    onClick={() => handleStatusChange(course.id, "DRAFT")}
                  >
                    <PenTool className="mr-2 h-4 w-4" /> Restore to Draft
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
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] dark:text-white">Course Management</h1>
          <p className="text-muted-foreground mt-1">Monitor, approve, and manage the platform&apos;s curriculum.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="shadow-sm border-[#0F2942]/20 text-[#0F2942] hover:bg-[#0F2942]/5 dark:border-border dark:text-foreground dark:hover:bg-muted/50">
            <Link href="/admin/courses/review">Review Queue <Badge className="ml-2 bg-[#FFBB0A] text-[#0F2942]">{pendingCount}</Badge></Link>
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses by title..."
              value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="pl-9 bg-background w-full"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select onValueChange={(val) => table.getColumn("status")?.setFilterValue(val === "all" ? "" : val)}>
              <SelectTrigger className="w-[140px] bg-background">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="LIVE">Live</SelectItem>
                <SelectItem value="PENDING">Pending Review</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
            <CSVLink data={data.map(c => ({ ...c, trainer: c.trainer.name }))} filename={"platform-courses-export.csv"}>
              <Button variant="outline" className="shrink-0">Export</Button>
            </CSVLink>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="h-11 font-semibold text-muted-foreground">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={columns.length} className="h-32 text-center"><Loader2 className="h-6 w-6 mx-auto animate-spin text-muted-foreground" /></TableCell></TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/20 transition-colors">
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
                    No courses found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 border-t border-border/50 flex items-center justify-between bg-muted/10">
          <div className="text-sm text-muted-foreground">
            Showing {table.getRowModel().rows.length} of {data.length} courses
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="h-8">
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="h-8">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
