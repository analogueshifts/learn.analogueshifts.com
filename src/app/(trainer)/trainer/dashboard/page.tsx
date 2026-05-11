"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Users, BookOpen, Star, CheckCircle2, Circle, TrendingUp, ArrowUpRight, ArrowRight, PlayCircle, Plus, BellRing, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";

const data = [
  { name: "1 Oct", revenue: 400 }, { name: "5 Oct", revenue: 520 }, 
  { name: "10 Oct", revenue: 680 }, { name: "15 Oct", revenue: 840 }, 
  { name: "20 Oct", revenue: 1120 }, { name: "25 Oct", revenue: 1450 },
  { name: "30 Oct", revenue: 2270 },
];

const onboardingSteps = [
  { title: "Complete your profile", description: "Add a bio and profile picture", completed: true },
  { title: "Set up payout method", description: "Connect your bank account or PayPal", completed: true },
  { title: "Create your first course", description: "Start building your curriculum", completed: false },
  { title: "Publish course", description: "Make it live for students", completed: false },
];

const recentActivity = [
  { type: "sale", text: "New enrollment in Fullstack Web Development", time: "10 minutes ago", amount: "$99.99" },
  { type: "review", text: "5-star review from Sarah Jenkins", time: "1 hour ago", amount: null },
  { type: "sale", text: "New enrollment in Advanced UI/UX", time: "3 hours ago", amount: "$79.99" },
  { type: "message", text: "Question from student in Q&A forum", time: "5 hours ago", amount: null },
  { type: "sale", text: "New enrollment in Fullstack Web Development", time: "Yesterday", amount: "$99.99" },
];

const recentStudents = [
  { id: 1, name: "Alice Johnson", email: "alice.j@example.com", course: "Fullstack Web Development", date: "Today, 10:42 AM", avatar: "AJ" },
  { id: 2, name: "Michael Chen", email: "m.chen@example.com", course: "Advanced UI/UX", date: "Today, 08:15 AM", avatar: "MC" },
  { id: 3, name: "Sarah Williams", email: "sarah.w@example.com", course: "Fullstack Web Development", date: "Yesterday", avatar: "SW" },
  { id: 4, name: "David Kim", email: "david.k@example.com", course: "Python Bootcamp", date: "Yesterday", avatar: "DK" },
];

export default function TrainerDashboardPage() {
  const [greeting, setGreeting] = useState("Welcome back");
  const [trainerName, setTrainerName] = useState("Alex");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Read dynamic user from localStorage (mock login/registration)
    const storedUser = localStorage.getItem('pendingUserRegistration');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) {
          setTrainerName(parsed.name.split(' ')[0]);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const completedSteps = onboardingSteps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedSteps / onboardingSteps.length) * 100);

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8 pb-20">
      
      {/* Premium Bento-Style Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Welcome Card */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F2942] via-[#123250] to-[#0A1A2A] text-white shadow-2xl border border-white/10 p-8 lg:p-12 flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFBB0A] rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-20"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-background shadow-2xl overflow-hidden shrink-0 bg-white">
              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${trainerName}`} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-widest text-[#FFBB0A] mb-3 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFBB0A] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFBB0A]"></span>
                </span>
                Trainer Dashboard Active
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">{greeting},<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFBB0A] to-amber-200">{trainerName}!</span></h1>
            </div>
          </div>
          
          <div className="relative z-10">
            <p className="text-white/70 text-lg max-w-xl font-medium leading-relaxed mb-8">
              Your ecosystem is thriving. You've reached <strong className="text-white">1,204 students</strong> this month and generated <strong className="text-emerald-400">15% more revenue</strong> than last month.
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

        {/* Gamified Level & Next Milestone Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-muted/10 border border-border/50 shadow-xl p-8 flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 dark:bg-amber-500/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110 duration-500"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Current Status</p>
              <h3 className="text-2xl font-black text-foreground">Top Educator</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shadow-inner">
              <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center py-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* SVG Progress Ring */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="283" strokeDashoffset="56" className="text-[#0F2942] dark:text-[#FFBB0A] drop-shadow-md" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-foreground mt-1">Level 8</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Expert</span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-muted-foreground">Next Milestone: Master</span>
              <span className="text-[#0F2942] dark:text-[#FFBB0A]">80%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden shadow-inner">
              <div className="bg-[#0F2942] dark:bg-[#FFBB0A] h-full rounded-full w-[80%] relative">
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <p className="text-xs font-medium text-muted-foreground text-center mt-2 pt-2 border-t border-border/50">
              Just <strong className="text-foreground">24 more enrollments</strong> to unlock Master Tier.
            </p>
          </div>
        </div>

      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue (30d)", value: "$22,700", trend: "+12.5%", isPositive: true, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
          { label: "Active Enrollments", value: "2,044", trend: "+184", isPositive: true, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Course Rating", value: "4.8", trend: "+0.2", isPositive: true, icon: Star, color: "text-background-darkYellow", bg: "bg-yellow-50" },
          { label: "Completion Rate", value: "68%", trend: "-2.1%", isPositive: false, icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((kpi, i) => (
          <Card key={i} className="border-gray-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-md ${kpi.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {kpi.isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1 rotate-180" />}
                  {kpi.trend}
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
        
        {/* Main Left Column (Charts & Courses) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Revenue Chart */}
          <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden">
            <div className="border-b border-gray-100 p-6 flex items-center justify-between bg-white">
              <div>
                <CardTitle className="text-xl font-extrabold text-gray-900">Revenue Overview</CardTitle>
                <CardDescription className="text-sm mt-1">Earnings over the last 30 days</CardDescription>
              </div>
              <select className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-background-darkYellow focus:border-background-darkYellow block p-2.5 font-medium">
                <option>Last 30 days</option>
                <option>This Year</option>
                <option>All Time</option>
              </select>
            </div>
            <CardContent className="p-6 bg-white">
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d2a341" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#d2a341" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} dx={-10} tickFormatter={(v) => `$${v}`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '12px' }}
                      itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#d2a341" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Enrollments Table */}
          <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="border-b border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-extrabold text-gray-900">Recent Enrollments</CardTitle>
                  <CardDescription className="text-sm mt-1">Students who recently joined your courses</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="font-bold border-gray-200">View All</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
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
                      <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-background-darkYellow/10 text-background-darkYellow flex items-center justify-center font-bold shrink-0">
                              {student.avatar}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-[15px]">{student.name}</div>
                              <div className="text-gray-500 text-xs mt-0.5">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-2.5 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded-md">
                            {student.course}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-500 font-medium">
                          {student.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden bg-white mt-8">
            <CardHeader className="border-b border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-extrabold text-gray-900">Recent Reviews</CardTitle>
                  <CardDescription className="text-sm mt-1">What students are saying about your courses</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="font-bold border-gray-200">View All</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {[
                  { student: "Sarah Jenkins", course: "Fullstack Web Development", rating: 5, date: "1 hour ago", comment: "Absolutely incredible course. The instructor explains everything so clearly and the pacing is perfect!" },
                  { student: "Marcus T.", course: "Advanced UI/UX", rating: 5, date: "Yesterday", comment: "The module on Figma prototyping blew my mind. Worth every penny." },
                  { student: "Elena R.", course: "Python Bootcamp", rating: 4, date: "2 days ago", comment: "Great content overall, but the final project was a bit too challenging." }
                ].map((review, i) => (
                  <div key={i} className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-gray-900 text-[15px]">{review.student}</div>
                        <div className="text-xs font-medium text-gray-500">{review.course}</div>
                      </div>
                      <div className="text-xs text-gray-400 font-medium">{review.date}</div>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-background-darkYellow fill-background-darkYellow' : 'text-gray-200 fill-gray-200'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Sidebar (Activity & Setup) */}
        <div className="space-y-8">
          
          {/* Progress Tracker Widget */}
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
                  <div 
                    className="h-full bg-background-darkYellow rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                    style={{ width: `${progressPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
                  </div>
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

          {/* Activity Feed */}
          <Card className="border-gray-200 shadow-sm rounded-3xl">
            <CardHeader className="border-b border-gray-100 p-6">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center justify-between">
                Recent Activity
                <BellRing className="w-5 h-5 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="p-5 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      activity.type === 'sale' ? 'bg-green-50' : 
                      activity.type === 'review' ? 'bg-yellow-50' : 'bg-blue-50'
                    }`}>
                      {activity.type === 'sale' ? <DollarSign className="w-5 h-5 text-green-600" /> :
                       activity.type === 'review' ? <Star className="w-5 h-5 text-background-darkYellow" /> :
                       <MessageSquare className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 leading-snug">{activity.text}</p>
                      <p className="text-xs text-gray-500 font-medium mt-1">{activity.time}</p>
                    </div>
                    {activity.amount && (
                      <div className="shrink-0 text-sm font-extrabold text-green-600">
                        +{activity.amount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Link href="/trainer/analytics" className="block w-full text-center py-4 text-sm font-bold text-background-darkYellow hover:bg-yellow-50 transition-colors">
                View All Activity
              </Link>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
