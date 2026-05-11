"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { PlayCircle, Clock, BookOpen, CheckCircle } from "lucide-react"

const enrolledCourses = [
  {
    id: "course-1",
    slug: "advanced-react-patterns",
    title: "Advanced React Patterns",
    instructor: "Sarah Drasner",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    progress: 45,
    lastLessonId: "lesson-4",
    lastLessonTitle: "Custom Hooks Deep Dive",
    totalLessons: 24,
    completedLessons: 11,
    timeSpent: "4h 20m",
  },
  {
    id: "course-2",
    slug: "ui-ux-design-masterclass",
    title: "UI/UX Design Masterclass",
    instructor: "Gary Simon",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    progress: 100,
    lastLessonId: "lesson-30",
    lastLessonTitle: "Course Wrap-up",
    totalLessons: 30,
    completedLessons: 30,
    timeSpent: "12h 45m",
  },
  {
    id: "course-3",
    slug: "fullstack-nextjs",
    title: "Fullstack Next.js & TypeScript",
    instructor: "Lee Robinson",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    progress: 12,
    lastLessonId: "lesson-2",
    lastLessonTitle: "App Router Basics",
    totalLessons: 42,
    completedLessons: 5,
    timeSpent: "1h 10m",
  },
  {
    id: "course-4",
    slug: "backend-architecture",
    title: "Backend System Architect",
    instructor: "Principal Backend Architect",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    progress: 0,
    lastLessonId: "lesson-0",
    lastLessonTitle: "Client-Server Architecture",
    totalLessons: 14,
    completedLessons: 0,
    timeSpent: "0m",
  }
]

export default function MyCoursesPage() {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2942] dark:text-white">My Courses</h1>
        <p className="text-muted-foreground mt-1">Pick up right where you left off and track your progress.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {enrolledCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden border-border/50 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="relative h-48 w-full overflow-hidden">
              <img 
                src={course.image} 
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
                  {course.timeSpent}
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
                    <PlayCircle className="w-3 h-3 text-[#FFBB0A]" /> Next: {course.lastLessonTitle}
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
    </div>
  )
}
