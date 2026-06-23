"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { PlayCircle, Clock, BookOpen, CheckCircle, Loader2 } from "lucide-react"

interface EnrolledCourse {
  id: string
  slug: string
  title: string
  instructor: string
  image: string | null
  progress: number
  currentLessonTitle: string | null
  totalLessons: number
  completedLessons: number
  timeSpentSeconds: number
}

function formatTimeSpent(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours === 0 && minutes === 0) return "0m"
  return [hours ? `${hours}h` : null, minutes ? `${minutes}m` : null].filter(Boolean).join(" ")
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/enrollments")
      .then((res) => res.json())
      .then((body) => body.success && setCourses(body.data))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] dark:text-white">My Courses</h1>
        <p className="text-muted-foreground mt-1">Pick up right where you left off and track your progress.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading your courses...
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="mb-4">You haven&apos;t enrolled in any courses yet.</p>
          <Button asChild className="font-bold">
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden border-border/50 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={course.image || "/courses/placeholder.jpg"}
                  alt={course.title}
                  className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20" />
                {course.progress === 100 && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center shadow-lg">
                    <CheckCircle className="w-3 h-3 mr-1" /> Completed
                  </div>
                )}
              </div>

              <CardHeader className="p-5 pb-0">
                <h3 className="font-bold text-lg text-foreground line-clamp-1" title={course.title}>
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground">by {course.instructor}</p>
              </CardHeader>

              <CardContent className="p-5 flex-1 flex flex-col justify-end space-y-4">
                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    {course.completedLessons} / {course.totalLessons} lessons
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {formatTimeSpent(course.timeSpentSeconds)}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className={course.progress === 100 ? "text-emerald-500" : "text-[#0F2942] dark:text-[#FFBB0A]"}>
                      {course.progress}% Complete
                    </span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              </CardContent>

              <CardFooter className="p-5 pt-0">
                {course.progress === 100 ? (
                  <Button asChild variant="outline" className="w-full font-bold h-11 border-border/50 hover:bg-muted/50 text-foreground">
                    <Link href={`/student/certificates`}>
                      View Certificate
                    </Link>
                  </Button>
                ) : (
                  <div className="w-full space-y-2">
                    <p className="text-[11px] font-medium text-muted-foreground truncate flex items-center gap-1">
                      <PlayCircle className="w-3 h-3 text-[#FFBB0A]" /> Next: {course.currentLessonTitle ?? "Get started"}
                    </p>
                    <Button asChild className="w-full font-bold h-11 bg-[#0F2942] hover:bg-[#0F2942]/90 text-white shadow-md">
                      <Link href={`/courses/${course.slug}/learn`}>
                        Continue Learning
                      </Link>
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
