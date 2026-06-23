"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Users, BookOpen, Star, CheckCircle2, TrendingUp, PlayCircle, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Course {
  id: string;
  title: string;
  studentCount: number;
  avgRating: number;
  status: string;
}

interface EarningsData {
  totalGross: number;
  breakdown: { month: string; gross: number }[];
}

interface Student {
  studentId: string;
  name: string;
  email: string;
  course: string;
  progress: number;
  enrolledAt: string;
}

interface Review {
  id: string;
  rating: number;
  body: string | null;
  createdAt: string;
  student: { name: string };
  course: { title: string };
}

export default function TrainerDashboardPage() {
  const { data: session } = useSession();
  const [greeting, setGreeting] = useState("Welcome back");
  const [courses, setCourses] = useState<Course[]>([]);
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bio, setBio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    Promise.all([
      fetch("/api/trainer/courses").then((res) => res.json()),
      fetch("/api/trainer/earnings").then((res) => res.json()),
      fetch("/api/trainer/students").then((res) => res.json()),
      fetch("/api/trainer/reviews").then((res) => res.json()),
      fetch("/api/user/me").then((res) => res.json()),
    ])
      .then(([coursesBody, earningsBody, studentsBody, reviewsBody, meBody]) => {
        if (coursesBody.success) setCourses(coursesBody.data);
        if (earningsBody.success) setEarnings(earningsBody.data);
        if (studentsBody.success) setStudents(studentsBody.data);
        if (reviewsBody.success) setReviews(reviewsBody.data);
        if (meBody.success) setBio(meBody.data.bio);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const trainerName = session?.user?.name?.split(" ")[0] ?? "there";
  const totalStudents = courses.reduce((sum, c) => sum + c.studentCount, 0);
  const ratedCourses = courses.filter((c) => c.avgRating > 0);
  const avgRating = ratedCourses.length ? ratedCourses.reduce((sum, c) => sum + c.avgRating, 0) / ratedCourses.length : 0;
  const avgCompletion = students.length ? students.reduce((sum, s) => sum + s.progress, 0) / students.length : 0;
  const hasLiveCourse = courses.some((c) => c.status === "LIVE");

  const onboardingSteps = [
    { title: "Complete your profile", description: "Add a bio to your trainer profile", completed: !!bio },
    { title: "Create your first course", description: "Start building your curriculum", completed: courses.length > 0 },
    { title: "Publish a course", description: "Submit for review and go live", completed: hasLiveCourse },
  ];
  const completedSteps = onboardingSteps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedSteps / onboardingSteps.length) * 100);

  const recentStudents = [...students].sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()).slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8 pb-20">

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F2942] via-[#123250] to-[#0A1A2A] text-white shadow-2xl border border-white/10 p-8 lg:p-12 flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFBB0A] rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-20"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-background shadow-2xl overflow-hidden shrink-0 bg-white">
            <img src={session?.user?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${trainerName}`} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">{greeting},<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFBB0A] to-amber-200">{trainerName}!</span></h1>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/70 text-lg max-w-xl font-medium leading-relaxed mb-8">
            You&apos;ve reached <strong className="text-white">{totalStudents.toLocaleString()} students</strong> across {courses.length} course{courses.length === 1 ? "" : "s"}.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/trainer/courses/new">
              <Button className="bg-[#FFBB0A] hover:bg-[#FFBB0A]/90 text-[#0F2942] font-extrabold px-8 h-12 rounded-xl shadow-[0_0_20px_rgba(255,187,10,0.3)] transition-all hover:scale-105">
                <Plus className="mr-2 h-5 w-5" /> Launch New Course
              </Button>
            </Link>
            <Link href="/trainer/live-sessions">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold px-6 h-12 rounded-xl bg-white/5 backdrop-blur-sm transition-all hover:border-white/40">
                <PlayCircle className="mr-2 h-5 w-5" /> Schedule Live Session
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: `$${(earnings?.totalGross ?? 0).toLocaleString()}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
          { label: "Active Enrollments", value: totalStudents.toLocaleString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Course Rating", value: avgRating.toFixed(1), icon: Star, color: "text-background-darkYellow", bg: "bg-yellow-50" },
          { label: "Avg. Completion", value: `${Math.round(avgCompletion)}%`, icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((kpi, i) => (
          <Card key={i} className="border-gray-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-gray-900 mb-1">{kpi.value}</div>
                <div className="text-sm font-medium text-gray-500">{kpi.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        <div className="xl:col-span-2 space-y-8">

          <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden">
            <div className="border-b border-gray-100 p-6 bg-white">
              <CardTitle className="text-xl font-extrabold text-gray-900">Revenue Overview</CardTitle>
              <CardDescription className="text-sm mt-1">Gross earnings by month</CardDescription>
            </div>
            <CardContent className="p-6 bg-white">
              <div className="h-[320px] w-full">
                {!earnings || earnings.breakdown.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">No revenue yet.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={earnings.breakdown} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d2a341" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#d2a341" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} dx={-10} tickFormatter={(v) => `$${v}`} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }} itemStyle={{ color: '#111827', fontWeight: 'bold' }} />
                      <Area type="monotone" dataKey="gross" stroke="#d2a341" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="border-b border-gray-100 p-6">
              <CardTitle className="text-xl font-extrabold text-gray-900">Recent Enrollments</CardTitle>
              <CardDescription className="text-sm mt-1">Students who recently joined your courses</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {recentStudents.length === 0 ? (
                <p className="p-6 text-sm text-gray-400">No enrollments yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 font-bold">Student</th>
                        <th className="px-6 py-4 font-bold">Course</th>
                        <th className="px-6 py-4 font-bold text-right">Enrolled</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentStudents.map((student) => (
                        <tr key={student.studentId} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-background-darkYellow/10 text-background-darkYellow flex items-center justify-center font-bold shrink-0">
                                {student.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 text-[15px]">{student.name}</div>
                                <div className="text-gray-500 text-xs mt-0.5">{student.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-block px-2.5 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded-md">{student.course}</span>
                          </td>
                          <td className="px-6 py-4 text-right text-gray-500 font-medium">{new Date(student.enrolledAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden bg-white mt-8">
            <CardHeader className="border-b border-gray-100 p-6">
              <CardTitle className="text-xl font-extrabold text-gray-900">Recent Reviews</CardTitle>
              <CardDescription className="text-sm mt-1">What students are saying about your courses</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {reviews.length === 0 ? (
                <p className="p-6 text-sm text-gray-400">No reviews yet.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold text-gray-900 text-[15px]">{review.student.name}</div>
                          <div className="text-xs font-medium text-gray-500">{review.course.title}</div>
                        </div>
                        <div className="text-xs text-gray-400 font-medium">{new Date(review.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-background-darkYellow fill-background-darkYellow' : 'text-gray-200 fill-gray-200'}`} />
                        ))}
                      </div>
                      {review.body && <p className="text-sm text-gray-700 italic">&quot;{review.body}&quot;</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        <div className="space-y-8">
          <Card className="border-background-darkYellow/20 shadow-md bg-gradient-to-b from-[#FFFBEC] to-white rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-background-darkYellow/10 rounded-bl-full pointer-events-none" />
            <CardContent className="p-8">
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">Instructor Setup</h3>
              <p className="text-sm text-gray-600 mb-6 font-medium">Complete your profile to start selling.</p>

              <div className="mb-8">
                <div className="flex justify-between text-sm font-extrabold text-gray-900 mb-3">
                  <span>Your Progress</span>
                  <span className="text-background-darkYellow">{progressPercent}%</span>
                </div>
                <div className="h-3 w-full bg-gray-200/50 rounded-full overflow-hidden">
                  <div className="h-full bg-background-darkYellow rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              <div className="space-y-5">
                {onboardingSteps.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="mt-0.5 shrink-0">
                      {step.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-background-darkYellow transition-colors" />
                      )}
                    </div>
                    <div>
                      <h4 className={`text-[15px] font-bold ${step.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{step.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 font-medium">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
