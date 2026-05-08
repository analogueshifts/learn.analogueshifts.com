"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, Download, Filter, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const enrollmentData = [
  { month: "Jan", enrollments: 120 }, { month: "Feb", enrollments: 180 },
  { month: "Mar", enrollments: 150 }, { month: "Apr", enrollments: 220 },
  { month: "May", enrollments: 280 }, { month: "Jun", enrollments: 310 },
];

const dropOffData = [
  { module: "Module 1", students: 300, dropoff: 5 },
  { module: "Module 2", students: 285, dropoff: 10 },
  { module: "Module 3", students: 256, dropoff: 15 },
  { module: "Module 4", students: 217, dropoff: 30 },
  { module: "Module 5", students: 151, dropoff: 12 },
];

const ratingData = [
  { name: "5 Star", count: 85 },
  { name: "4 Star", count: 24 },
  { name: "3 Star", count: 8 },
  { name: "2 Star", count: 2 },
  { name: "1 Star", count: 1 },
];

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
  columnHelper.accessor('course', {
    header: () => <span className="font-bold">Course</span>,
    cell: info => <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-bold">{info.getValue()}</span>,
  }),
  columnHelper.accessor('progress', {
    header: () => <span className="font-bold">Progress</span>,
    cell: info => (
      <div className="flex items-center gap-2">
        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
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

// Reusable Table Component to avoid duplication
const StudentTableComponent = ({ table }: { table: any }) => (
  <div className="overflow-x-auto w-full">
    <table className="w-full text-sm text-left">
      <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs">
        {table.getHeaderGroups().map((headerGroup: any) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header: any) => (
              <th key={header.id} className="px-6 py-4 font-bold">
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
  </div>
);

export default function TrainerAnalyticsPage() {
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
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Analytics & Reports</h1>
          <p className="text-gray-500 mt-1 font-medium">Track student engagement and overall course performance.</p>
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

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total Students", value: "3,244", change: "+12%", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Avg. Completion Rate", value: "68%", change: "+4.2%", color: "text-green-600", bg: "bg-green-50" },
          { label: "Course Views (30d)", value: "14.5K", change: "+24%", color: "text-background-darkYellow", bg: "bg-yellow-50" },
        ].map((kpi, i) => (
          <Card key={i} className="border-gray-200 shadow-sm rounded-2xl">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{kpi.label}</p>
                <div className="text-3xl font-black text-gray-900">{kpi.value}</div>
              </div>
              <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${kpi.bg} ${kpi.color}`}>
                {kpi.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enrollment Trend - Full Width */}
        <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden lg:col-span-2">
          <CardHeader className="border-b border-gray-100 bg-white">
            <CardTitle className="text-xl font-extrabold text-gray-900">Enrollment Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enrollmentData}>
                  <defs>
                    <linearGradient id="colorEnrolls" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d2a341" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#d2a341" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dx={-10} />
                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="enrollments" stroke="#d2a341" strokeWidth={3} fill="url(#colorEnrolls)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Drop-off Chart */}
        <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-white">
            <CardTitle className="text-xl font-extrabold text-gray-900">Student Drop-off Rate</CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dropOffData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="module" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dx={-10} />
                  <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px' }} />
                  <Bar dataKey="dropoff" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Ratings Chart */}
        <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-white">
            <CardTitle className="text-xl font-extrabold text-gray-900">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white flex flex-col justify-center">
            <div className="space-y-6 h-[300px] flex flex-col justify-center">
              {[
                { name: "5 Star", count: 85, pct: 71 },
                { name: "4 Star", count: 24, pct: 20 },
                { name: "3 Star", count: 8, pct: 7 },
                { name: "2 Star", count: 2, pct: 1.5 },
                { name: "1 Star", count: 1, pct: 0.5 },
              ].map((stat) => (
                <div key={stat.name} className="flex items-center gap-4">
                  <div className="w-16 shrink-0">
                    <span className="text-sm font-bold text-gray-700">{stat.name}</span>
                  </div>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-background-darkYellow rounded-full transition-all duration-1000" style={{ width: `${stat.pct}%` }} />
                  </div>
                  <div className="w-12 text-right shrink-0">
                    <span className="text-sm font-bold text-gray-500">{stat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Student Table with Tanstack Table */}
        <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden lg:col-span-2">
          <CardHeader className="border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-extrabold text-gray-900">Student Progress Table</CardTitle>
                <CardDescription>View detailed metrics and progress for all enrolled students.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="font-bold border-gray-200 hidden sm:flex" asChild>
                <Link href="/trainer/analytics/students">
                  <Expand className="w-4 h-4 mr-2" /> View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 bg-white">
            <StudentTableComponent table={table} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
