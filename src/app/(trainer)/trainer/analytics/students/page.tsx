"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Student = {
  studentId: string;
  name: string;
  email: string;
  course: string;
  progress: number;
  lastActive: string | null;
};

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
    cell: info => <span className="text-gray-500 text-sm">{info.getValue() ? new Date(info.getValue()!).toLocaleDateString() : "Never"}</span>,
  }),
];

export default function StudentsProgressPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trainer/students")
      .then((res) => res.json())
      .then((body) => body.success && setStudents(body.data))
      .finally(() => setIsLoading(false));
  }, []);

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
      </div>

      <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-0 bg-white overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading students...
            </div>
          ) : students.length === 0 ? (
            <p className="p-6 text-sm text-gray-400">No students enrolled in any of your courses yet.</p>
          ) : (
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
          )}
        </CardContent>
      </Card>

    </div>
  );
}
