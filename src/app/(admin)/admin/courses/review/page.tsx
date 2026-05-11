"use client"

import React, { useState } from "react"
import { CourseReviewPanel, CourseData } from "@/components/admin/CourseReviewPanel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"

const pendingCourses: CourseData[] = [
  {
    id: "c2",
    title: "Advanced React Patterns",
    trainer: "Bob Jones",
    category: "Technology & Programming",
    price: 99.99,
    description: "Deep dive into advanced React patterns, performance optimization, and concurrent rendering features.",
    status: "Pending",
    submittedAt: "2023-11-05T14:30:00Z"
  },
  {
    id: "c5",
    title: "Figma for Beginners",
    trainer: "Eve Smith",
    category: "Design & Arts",
    price: 49.99,
    description: "Learn UI/UX design from scratch using Figma. Perfect for absolute beginners looking to build a portfolio.",
    status: "Pending",
    submittedAt: "2023-11-06T09:15:00Z"
  }
]

export default function CourseReviewPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [courses, setCourses] = useState(pendingCourses)

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || null

  const handleApprove = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id))
    setSelectedCourseId(null)
    toast.success("Course approved and published successfully!")
  }

  const handleReject = (id: string, reason: string) => {
    setCourses(courses.filter((c) => c.id !== id))
    setSelectedCourseId(null)
    toast.error("Course rejected. The trainer has been notified.")
  }

  const handleRequestEdit = (id: string, reason: string) => {
    setCourses(courses.filter((c) => c.id !== id))
    setSelectedCourseId(null)
    toast.success("Edit requested. Course reverted to Draft.")
  }

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.24))] animate-in fade-in duration-500">
      <Toaster position="top-right" />
      
      {/* Top Navigation Bar */}
      <div className="flex items-center gap-4 pb-4 border-b border-border/50 shrink-0">
        <Button variant="outline" size="sm" asChild className="hover:bg-muted/50 border-[#0F2942]/20 dark:border-border">
          <Link href="/admin/courses">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Course Management
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0F2942] dark:text-white">Review Queue</h1>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden mt-4 rounded-xl border border-border/50 shadow-sm bg-card">
        {/* Left List Pane */}
        <div className="w-1/3 flex flex-col min-w-[320px] border-r border-border/50 bg-muted/10">
          <div className="p-4 border-b border-border/50 bg-background/50">
            <h2 className="font-semibold text-foreground flex items-center justify-between">
              Pending Courses
              <Badge className="bg-[#FFBB0A] text-[#0F2942]">{courses.length}</Badge>
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-border/50">
              {courses.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                  <CheckCircle className="h-10 w-10 text-emerald-500 mb-3" />
                  <p className="font-medium text-foreground">Queue is empty!</p>
                  <p className="text-xs mt-1">You have reviewed all pending courses.</p>
                </div>
              ) : (
                courses.map((course) => (
                  <div
                    key={course.id}
                    className={`p-4 cursor-pointer transition-all border-l-4 ${
                      selectedCourseId === course.id 
                        ? "bg-white dark:bg-zinc-800 border-[#FFBB0A] shadow-sm" 
                        : "border-transparent hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedCourseId(course.id)}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <h3 className={`font-bold text-sm leading-tight ${selectedCourseId === course.id ? 'text-[#0F2942] dark:text-white' : 'text-foreground'}`}>
                        {course.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-2">
                      <span className="text-muted-foreground font-medium">{course.trainer}</span>
                      <span className="text-muted-foreground flex items-center bg-muted/50 px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3 mr-1" /> {new Date(course.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Details Pane */}
        <div className="flex-1 overflow-hidden bg-background">
          <CourseReviewPanel
            course={selectedCourse}
            onClose={() => setSelectedCourseId(null)}
            onApprove={handleApprove}
            onReject={handleReject}
            onRequestEdit={handleRequestEdit}
          />
        </div>
      </div>
    </div>
  )
}
