"use client"

import React, { useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, Search, Star, Users, CheckCircle, Clock, Archive, PenTool } from "lucide-react"
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
  trainer: string
  price: number
  status: "Live" | "Pending" | "Draft" | "Archived"
  enrolled: number
  rating: number
  createdAt: string
}

const initialData: Course[] = [
  { id: "c1", title: "Advanced React Patterns", trainer: "Bob Jones", price: 99.99, status: "Live", enrolled: 1250, rating: 4.8, createdAt: "2023-11-01" },
  { id: "c2", title: "Figma to Webflow Masterclass", trainer: "Sarah Connor", price: 149.00, status: "Live", enrolled: 840, rating: 4.9, createdAt: "2023-12-15" },
  { id: "c3", title: "Machine Learning Basics", trainer: "Fiona Gallagher", price: 199.99, status: "Pending", enrolled: 0, rating: 0, createdAt: "2024-03-20" },
  { id: "c4", title: "Introduction to UI/UX", trainer: "Evan Wright", price: 49.99, status: "Draft", enrolled: 0, rating: 0, createdAt: "2024-04-01" },
  { id: "c5", title: "Legacy PHP Development", trainer: "Bob Jones", price: 29.99, status: "Archived", enrolled: 4500, rating: 4.2, createdAt: "2021-06-10" },
]

export default function CoursesPage() {
  const [data, setData] = useState<Course[]>(initialData)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const handleStatusChange = (id: string, newStatus: Course["status"]) => {
    setData(data.map(c => c.id === id ? { ...c, status: newStatus } : c))
    toast.success(`Course status updated to ${newStatus}`)
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
      accessorKey: "trainer",
      header: "Trainer",
      cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("trainer")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant="outline" className={`
            font-medium px-2.5 py-0.5 border
            ${status === 'Live' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-500/30' : ''}
            ${status === 'Pending' ? 'bg-[#FFBB0A]/10 text-[#876307] border-[#FFBB0A]/30 dark:text-[#FFBB0A] dark:border-[#FFBB0A]/20' : ''}
            ${status === 'Draft' ? 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' : ''}
            ${status === 'Archived' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50' : ''}
          `}>
            {status === 'Live' && <CheckCircle className="w-3 h-3 mr-1" />}
            {status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("price"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
        return <div className="font-medium text-muted-foreground">{formatted}</div>
      },
    },
    {
      accessorKey: "metrics",
      header: "Metrics",
      cell: ({ row }) => {
        const enrolled = row.original.enrolled
        const rating = row.original.rating
        return (
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" /> {enrolled.toLocaleString()} students
            </div>
            {rating > 0 && (
              <div className="flex items-center gap-1 text-[#FFBB0A]">
                <Star className="h-3 w-3 fill-current" /> {rating.toFixed(1)} rating
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
                
                <DropdownMenuItem asChild>
                  <Link href={`/admin/courses/${course.id}`} className="cursor-pointer">
                    <Search className="mr-2 h-4 w-4" /> View Details
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {course.status === "Pending" && (
                  <>
                    <DropdownMenuItem 
                      className="text-emerald-600 focus:bg-emerald-50"
                      onClick={() => handleStatusChange(course.id, "Live")}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Approve Course
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive focus:bg-destructive/10"
                      onClick={() => handleStatusChange(course.id, "Draft")}
                    >
                      <PenTool className="mr-2 h-4 w-4" /> Request Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}

                {course.status !== "Archived" ? (
                  <DropdownMenuItem 
                    className="text-muted-foreground focus:bg-muted"
                    onClick={() => handleStatusChange(course.id, "Archived")}
                  >
                    <Archive className="mr-2 h-4 w-4" /> Archive Course
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem 
                    className="text-[#FFBB0A] focus:bg-[#FFBB0A]/10"
                    onClick={() => handleStatusChange(course.id, "Draft")}
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
          <p className="text-muted-foreground mt-1">Monitor, approve, and manage the platform's curriculum.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="shadow-sm border-[#0F2942]/20 text-[#0F2942] hover:bg-[#0F2942]/5 dark:border-border dark:text-foreground dark:hover:bg-muted/50">
            <Link href="/admin/courses/review">Review Queue <Badge className="ml-2 bg-[#FFBB0A] text-[#0F2942]">1</Badge></Link>
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
        {/* Table Toolbar */}
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
                <SelectItem value="Live">Live</SelectItem>
                <SelectItem value="Pending">Pending Review</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <CSVLink data={data} filename={"platform-courses-export.csv"}>
              <Button variant="outline" className="shrink-0">Export</Button>
            </CSVLink>
          </div>
        </div>

        {/* Table */}
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
              {table.getRowModel().rows?.length ? (
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

        {/* Pagination */}
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
