"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, Expand, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
}

interface AnalyticsData {
  enrollmentsLast30Days: { date: string; count: number }[];
  totalEnrollments: number;
  avgRating: number;
  reviewCount: number;
  ratingBreakdown: { stars: number; count: number }[];
}

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
    cell: info => <span className="text-gray-500 text-sm">{info.getValue() ? new Date(info.getValue()!).toLocaleDateString() : "Never"}</span>,
  }),
];

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
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trainer/courses")
      .then((res) => res.json())
      .then((body) => {
        if (body.success && body.data.length > 0) {
          setCourses(body.data);
          setSelectedCourseId(body.data[0].id);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;
    setIsLoading(true);
    Promise.all([
      fetch(`/api/trainer/analytics/${selectedCourseId}`).then((res) => res.json()),
      fetch(`/api/trainer/students?courseId=${selectedCourseId}`).then((res) => res.json()),
    ])
      .then(([analyticsBody, studentsBody]) => {
        if (analyticsBody.success) setAnalytics(analyticsBody.data);
        if (studentsBody.success) setStudents(studentsBody.data);
      })
      .finally(() => setIsLoading(false));
  }, [selectedCourseId]);

  const table = useReactTable({
    data: students,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const totalReviews = analytics?.ratingBreakdown.reduce((sum, r) => sum + r.count, 0) ?? 0;

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8 pb-20">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Analytics & Reports</h1>
          <p className="text-gray-500 mt-1 font-medium">Track student engagement and overall course performance.</p>
        </div>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-background-darkYellow outline-none"
        >
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Loading analytics...
        </div>
      ) : !analytics ? (
        <p className="text-center text-gray-500 py-20">Create a course to see analytics.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="border-gray-200 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-gray-500 mb-1">Total Enrollments</p>
                <div className="text-3xl font-black text-gray-900">{analytics.totalEnrollments}</div>
              </CardContent>
            </Card>
            <Card className="border-gray-200 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-gray-500 mb-1">Average Rating</p>
                <div className="text-3xl font-black text-gray-900">{analytics.avgRating.toFixed(1)}</div>
              </CardContent>
            </Card>
            <Card className="border-gray-200 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-gray-500 mb-1">Reviews</p>
                <div className="text-3xl font-black text-gray-900">{analytics.reviewCount}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden lg:col-span-2">
              <CardHeader className="border-b border-gray-100 bg-white">
                <CardTitle className="text-xl font-extrabold text-gray-900">Enrollments (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <div className="h-[300px]">
                  {analytics.enrollmentsLast30Days.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">No enrollments in the last 30 days.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics.enrollmentsLast30Days}>
                        <defs>
                          <linearGradient id="colorEnrolls" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d2a341" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#d2a341" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dx={-10} allowDecimals={false} />
                        <Tooltip contentStyle={{ borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="count" stroke="#d2a341" strokeWidth={3} fill="url(#colorEnrolls)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden lg:col-span-2">
              <CardHeader className="border-b border-gray-100 bg-white">
                <CardTitle className="text-xl font-extrabold text-gray-900">Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white flex flex-col justify-center">
                <div className="space-y-6">
                  {analytics.ratingBreakdown.map((stat) => (
                    <div key={stat.stars} className="flex items-center gap-4">
                      <div className="w-16 shrink-0">
                        <span className="text-sm font-bold text-gray-700">{stat.stars} Star</span>
                      </div>
                      <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-background-darkYellow rounded-full transition-all duration-1000" style={{ width: `${totalReviews > 0 ? (stat.count / totalReviews) * 100 : 0}%` }} />
                      </div>
                      <div className="w-12 text-right shrink-0">
                        <span className="text-sm font-bold text-gray-500">{stat.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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
                {students.length === 0 ? (
                  <p className="p-6 text-sm text-gray-400">No students enrolled in this course yet.</p>
                ) : (
                  <StudentTableComponent table={table} />
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
