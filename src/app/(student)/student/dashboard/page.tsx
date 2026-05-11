"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, Calendar as CalendarIcon, Clock, PlayCircle, Trophy, BookOpen, Star, Video } from "lucide-react"

const recentActivity = [
  { id: 1, title: "Completed Lesson: Intro to React Hooks", course: "Advanced React", time: "2 hours ago", icon: PlayCircle },
  { id: 2, title: "Earned Badge: Fast Learner", course: "Platform Achievement", time: "1 day ago", icon: Trophy, color: "text-yellow-500" },
  { id: 3, title: "Submitted Assignment: Portfolio Build", course: "UI/UX Design Masterclass", time: "2 days ago", icon: BookOpen },
]

const achievementBadges = [
  { id: 1, name: "Fast Learner", description: "Completed 5 lessons in one day", icon: Trophy, color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-500" },
  { id: 2, name: "Early Bird", description: "Studied before 8 AM", icon: Star, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-500" },
  { id: 3, name: "7-Day Streak", description: "Studied for 7 consecutive days", icon: Award, color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500" },
  { id: 4, name: "First Completion", description: "Completed your first course", icon: Award, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-500" },
]

const upcomingLiveSessions = [
  { id: 1, title: "Q&A with Instructor Sarah", date: "Today, 4:00 PM", type: "Office Hours" },
  { id: 2, title: "Portfolio Review Workshop", date: "Tomorrow, 2:00 PM", type: "Workshop" },
]

export default function StudentDashboard() {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] dark:text-white">Welcome back, Student!</h1>
        <p className="text-muted-foreground mt-1">Here is an overview of your learning progress and achievements.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-[#0F2942] to-gray-900 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-bold text-gray-300 uppercase tracking-wider">Courses in Progress</CardTitle>
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <BookOpen className="h-5 w-5 text-[#FFBB0A]" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-extrabold text-white mt-2">3</div>
            <div className="flex items-center gap-2 mt-3">
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-[#FFBB0A] w-[65%] rounded-full shadow-[0_0_10px_rgba(255,187,10,0.5)]" />
              </div>
              <span className="text-xs font-bold text-[#FFBB0A]">65%</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Courses</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1</div>
            <p className="text-xs text-muted-foreground mt-1">Earned 1 certificate</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Learning Streak</CardTitle>
            <Trophy className="h-4 w-4 text-[#FFBB0A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">4 Days</div>
            <p className="text-xs text-muted-foreground mt-1">Your best is 7 days</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Watch Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12.5 hrs</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-border/50 shadow-sm flex flex-col">
          <CardHeader className="border-b border-border/50 bg-muted/10">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#FFBB0A]" /> Recent Activity
            </CardTitle>
            <CardDescription>Your latest actions on the platform</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="flex flex-col divide-y divide-border/50">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-5 flex gap-4 items-start hover:bg-muted/30 transition-colors">
                  <div className="mt-0.5 bg-muted rounded-full p-2">
                    <activity.icon className={`w-4 h-4 ${activity.color || 'text-foreground'}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{activity.course}</p>
                    <span className="text-[10px] font-medium text-muted-foreground/70 mt-2 block uppercase tracking-wider">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Sessions Calendar */}
        <Card className="border-border/50 shadow-sm flex flex-col">
          <CardHeader className="border-b border-border/50 bg-muted/10">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#FFBB0A]" /> Upcoming Live
            </CardTitle>
            <CardDescription>Scheduled sessions</CardDescription>
          </CardHeader>
          <CardContent className="p-5 flex-1">
            <div className="space-y-4">
              {upcomingLiveSessions.map((session) => (
                <div key={session.id} className="p-4 rounded-xl border border-border/50 hover:border-[#0F2942]/30 dark:hover:border-[#FFBB0A]/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-[10px] font-semibold uppercase">{session.type}</Badge>
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Video className="w-3 h-3" /> Live</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground mb-1">{session.title}</h4>
                  <p className="text-xs font-medium text-[#0F2942] dark:text-[#FFBB0A]">{session.date}</p>
                </div>
              ))}
              <button className="w-full text-center text-sm font-semibold text-muted-foreground hover:text-foreground mt-4 py-2 hover:bg-muted/50 rounded-lg transition-colors">
                View full calendar
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Badges */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 bg-muted/10">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Award className="w-5 h-5 text-[#FFBB0A]" /> Achievement Badges
          </CardTitle>
          <CardDescription>Badges you've earned across your learning journey</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievementBadges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center justify-center p-4 rounded-2xl border border-border/50 hover:shadow-md transition-shadow bg-card text-center gap-3">
                <div className={`p-4 rounded-full ${badge.color}`}>
                  <badge.icon className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{badge.name}</h4>
                  <p className="text-[11px] text-muted-foreground mt-1 max-w-[120px] mx-auto leading-tight">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
