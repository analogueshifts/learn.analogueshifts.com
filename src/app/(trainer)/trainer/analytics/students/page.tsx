"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, Download, Filter, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Student = {
  id: string;
  name: string;
  email: string;
  course: string;
  progress: number;
  lastActive: string;
  grade: string;
};

const students: Student[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", course: "Fullstack Web Dev", progress: 85, lastActive: "2 hours ago", grade: "A" },
  { id: "2", name: "Michael Chen", email: "michael@example.com", course: "Advanced UI/UX", progress: 42, lastActive: "Yesterday", grade: "B+" },
  { id: "3", name: "Sarah Williams", email: "sarah@example.com", course: "Python Bootcamp", progress: 100, lastActive: "3 days ago", grade: "A+" },
  { id: "4", name: "David Kim", email: "david@example.com", course: "Fullstack Web Dev", progress: 12, lastActive: "1 week ago", grade: "C" },
  { id: "5", name: "Emily Davis", email: "emily@example.com", course: "Python Bootcamp", progress: 65, lastActive: "5 hours ago", grade: "B" },
  { id: "6", name: "James Wilson", email: "j.wilson@example.com", course: "Advanced UI/UX", progress: 20, lastActive: "2 days ago", grade: "C+" },
  { id: "7", name: "Sophia Taylor", email: "sophia@example.com", course: "Fullstack Web Dev", progress: 95, lastActive: "1 hour ago", grade: "A" },
  { id: "8", name: "Daniel Martinez", email: "daniel.m@example.com", course: "Python Bootcamp", progress: 8, lastActive: "2 weeks ago", grade: "D" },
];

const columnHelper = createColumnHelper<Student>();

const columns = [
  columnHelper.accessor('name', {
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="font-bold px-0 hover:bg-transparent">
        Student <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: info => <div className="font-bold text-gray-900">{info.getValue()}</div>,
  }),
  columnHelper.accessor('email', {
    header: () => <span className="font-bold">Email</span>,
    cell: info => <span className="text-gray-500">{info.getValue()}</span>,
  }),
  columnHelper.accessor('course', {
    header: () => <span className="font-bold">Course</span>,
    cell: info => <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-bold">{info.getValue()}</span>,
  }),
  columnHelper.accessor('progress', {
    header: () => <span className="font-bold">Progress</span>,
    cell: info => (
      <div className="flex items-center gap-2 min-w-[120px]">
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-background-darkYellow rounded-full" style={{ width: `${info.getValue()}%` }} />
        </div>
        <span className="text-xs font-bold text-gray-500">{info.getValue()}%</span>
      </div>
    ),
  }),
  columnHelper.accessor('lastActive', {
    header: () => <span className="font-bold">Last Active</span>,
    cell: info => <span className="text-gray-500 text-sm">{info.getValue()}</span>,
  }),
  columnHelper.accessor('grade', {
    header: () => <span className="font-bold">Grade</span>,
    cell: info => <span className="font-extrabold text-gray-900">{info.getValue()}</span>,
  }),
];

export default function StudentsProgressPage() {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: students,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/trainer/analytics" className="text-gray-400 hover:text-gray-900 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Analytics</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Student Progress</h1>
          <p className="text-gray-500 mt-1 font-medium">Detailed progress reports for all enrolled students.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-gray-50 border-gray-200 font-bold h-12 px-6 rounded-xl">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button className="bg-gray-900 text-white font-bold hover:bg-gray-800 h-12 px-6 rounded-xl shadow-md shadow-gray-900/10">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Full Page Table */}
      <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-0 bg-white overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs">
              {table.getHeaderGroups().map((headerGroup: any) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header: any) => (
                    <th key={header.id} className="px-6 py-4 font-bold whitespace-nowrap">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.map((row: any) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  {row.getVisibleCells().map((cell: any) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

    </div>
  );
}
