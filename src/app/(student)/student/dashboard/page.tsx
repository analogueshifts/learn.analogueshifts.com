"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Calendar as CalendarIcon, Clock, Trophy, BookOpen, Video, Loader2, Medal, Flame, Target, Zap, Crown, Star } from "lucide-react"

const ICON_BY_KEY: Record<string, React.ReactNode> = {
  FIRST_STEPS: <Star className="w-8 h-8" />,
  ON_FIRE: <Flame className="w-8 h-8" />,
  SHARPSHOOTER: <Target className="w-8 h-8" />,
  FAST_LEARNER: <Zap className="w-8 h-8" />,
  COURSE_CHAMPION: <Trophy className="w-8 h-8" />,
  TOP_1_PERCENT: <Crown className="w-8 h-8" />,
  HELPFUL_PEER: <Medal className="w-8 h-8" />,
  OVERACHIEVER: <Award className="w-8 h-8" />,
};

interface Stats {
  coursesInProgress: number
  completedCourses: number
  totalWatchHours: number
  currentStreakDays: number
}

interface EnrolledCourse {
  id: string
  slug: string
  title: string
  currentLessonTitle: string | null
  progress: number
}

interface Achievement {
  id: string
  key: string
  name: string
  description: string
  earned: boolean
}

interface LiveSession {
  id: string
  title: string
  scheduledAt: string
  course: { title: string }
}

export default function StudentDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats | null>(null)
  const [courses, setCourses] = useState<EnrolledCourse[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/learn/stats").then((res) => res.json()),
      fetch("/api/enrollments").then((res) => res.json()),
      fetch("/api/achievements").then((res) => res.json()),
      fetch("/api/live-sessions/upcoming").then((res) => res.json()),
    ])
      .then(([statsBody, coursesBody, achievementsBody, sessionsBody]) => {
        if (statsBody.success) setStats(statsBody.data)
        if (coursesBody.success) setCourses(coursesBody.data)
        if (achievementsBody.success) setAchievements(achievementsBody.data)
        if (sessionsBody.success) setLiveSessions(sessionsBody.data)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const earnedBadges = achievements.filter((a) => a.earned)
  const inProgressCourses = courses.filter((c) => c.progress < 100)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading your dashboard...
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] dark:text-white">Welcome back, {session?.user?.name?.split(" ")[0] ?? "Student"}!</h1>
        <p className="text-muted-foreground mt-1">Here is an overview of your learning progress and achievements.</p>
      </div>

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
            <div className="text-4xl font-extrabold text-white mt-2">{stats?.coursesInProgress ?? 0}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Courses</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.completedCourses ?? 0}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Learning Streak</CardTitle>
            <Trophy className="h-4 w-4 text-[#FFBB0A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.currentStreakDays ?? 0} Days</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Watch Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.totalWatchHours ?? 0} hrs</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/50 shadow-sm flex flex-col">
          <CardHeader className="border-b border-border/50 bg-muted/10">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#FFBB0A]" /> Continue Learning
            </CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            {inProgressCourses.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">No courses in progress. <Link href="/courses" className="font-bold text-[#0F2942]">Browse courses</Link></p>
            ) : (
              <div className="flex flex-col divide-y divide-border/50">
                {inProgressCourses.map((course) => (
                  <Link key={course.id} href={`/courses/${course.slug}/learn`} className="p-5 flex gap-4 items-start hover:bg-muted/30 transition-colors">
                    <div className="mt-0.5 bg-muted rounded-full p-2">
                      <BookOpen className="w-4 h-4 text-foreground" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{course.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">Next: {course.currentLessonTitle ?? "Get started"}</p>
                      <span className="text-[10px] font-medium text-muted-foreground/70 mt-2 block uppercase tracking-wider">{course.progress}% complete</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm flex flex-col">
          <CardHeader className="border-b border-border/50 bg-muted/10">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#FFBB0A]" /> Upcoming Live
            </CardTitle>
            <CardDescription>Scheduled sessions</CardDescription>
          </CardHeader>
          <CardContent className="p-5 flex-1">
            {liveSessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming live sessions.</p>
            ) : (
              <div className="space-y-4">
                {liveSessions.map((session) => (
                  <div key={session.id} className="p-4 rounded-xl border border-border/50 hover:border-[#0F2942]/30 dark:hover:border-[#FFBB0A]/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="text-[10px] font-semibold uppercase">{session.course.title}</Badge>
                      <span className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Video className="w-3 h-3" /> Live</span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground mb-1">{session.title}</h4>
                    <p className="text-xs font-medium text-[#0F2942] dark:text-[#FFBB0A]">{new Date(session.scheduledAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 bg-muted/10">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Award className="w-5 h-5 text-[#FFBB0A]" /> Achievement Badges
          </CardTitle>
          <CardDescription>Badges you&apos;ve earned across your learning journey</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {earnedBadges.length === 0 ? (
            <p className="text-sm text-muted-foreground">No badges earned yet. <Link href="/student/achievements" className="font-bold text-[#0F2942]">View all badges</Link></p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {earnedBadges.map((badge) => (
                <div key={badge.id} className="flex flex-col items-center justify-center p-4 rounded-2xl border border-border/50 hover:shadow-md transition-shadow bg-card text-center gap-3">
                  <div className="p-4 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-500">
                    {ICON_BY_KEY[badge.key] ?? <Award className="w-8 h-8" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{badge.name}</h4>
                    <p className="text-[11px] text-muted-foreground mt-1 max-w-[120px] mx-auto leading-tight">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
