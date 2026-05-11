"use client"

import React from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, BookOpen, Users, Star, Clock, Video, FileText, CheckCircle, Shield } from "lucide-react"
import Link from "next/link"

export default function CourseDetailsPage() {
  const params = useParams()
  const courseId = params.courseId as string

  // Mock data for the specific course based on ID
  const course = {
    id: courseId,
    title: courseId === "c2" ? "Advanced React Patterns" : "Figma to Webflow Masterclass",
    trainer: "Bob Jones",
    price: 99.99,
    status: "Live",
    enrolled: 1250,
    rating: 4.8,
    createdAt: "2023-11-01",
    description: "This comprehensive course takes you from fundamental concepts to advanced architectural patterns. You will learn how to build scalable, highly performant applications using the latest industry standards.",
    modules: [
      { id: 1, title: "Introduction & Setup", lessons: 4, duration: "45 mins" },
      { id: 2, title: "Core Architecture Patterns", lessons: 6, duration: "1h 20m" },
      { id: 3, title: "State Management at Scale", lessons: 8, duration: "2h 15m" },
      { id: 4, title: "Performance Optimization", lessons: 5, duration: "1h 10m" },
    ]
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Top Navigation Bar */}
      <div className="flex items-center gap-4 pb-4 border-b border-border/50 shrink-0">
        <Button variant="outline" size="sm" asChild className="hover:bg-muted/50 border-[#0F2942]/20 dark:border-border">
          <Link href="/admin/courses">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <div className="bg-[#0F2942] h-32 p-6 flex items-end">
               <Badge className="bg-[#FFBB0A] text-[#0F2942] hover:bg-[#FFBB0A] font-bold">
                 {course.status}
               </Badge>
            </div>
            <CardHeader className="pt-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-2xl font-extrabold">{course.title}</CardTitle>
                  <CardDescription className="text-base mt-2">by {course.trainer}</CardDescription>
                </div>
                <div className="text-right">
                  <h3 className="text-3xl font-bold text-emerald-600">${course.price}</h3>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{course.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-4 flex items-center"><BookOpen className="w-4 h-4 mr-2 text-[#FFBB0A]" /> Curriculum Modules</h3>
                <div className="space-y-3">
                  {course.modules.map((mod) => (
                    <div key={mod.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                          {mod.id}
                        </div>
                        <span className="font-medium text-sm">{mod.title}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center"><Video className="w-3 h-3 mr-1" /> {mod.lessons} lessons</span>
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {mod.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="bg-muted/10 border-b border-border/50 pb-4">
              <CardTitle className="text-lg">Course Analytics</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center text-muted-foreground"><Users className="w-4 h-4 mr-2" /> Enrolled Students</div>
                  <span className="font-bold">{course.enrolled.toLocaleString()}</span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center text-muted-foreground"><Star className="w-4 h-4 mr-2 text-[#FFBB0A]" /> Average Rating</div>
                  <span className="font-bold">{course.rating.toFixed(1)} / 5.0</span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center text-muted-foreground"><FileText className="w-4 h-4 mr-2" /> Total Revenue</div>
                  <span className="font-bold text-emerald-600">${(course.enrolled * course.price).toLocaleString()}</span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center text-muted-foreground"><Clock className="w-4 h-4 mr-2" /> Published Date</div>
                  <span className="font-medium text-sm">{new Date(course.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="bg-muted/10 border-b border-border/50 pb-4">
              <CardTitle className="text-lg">Administrative Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <Button variant="outline" className="w-full justify-start text-[#0F2942] dark:text-white border-[#0F2942]/20 dark:border-border">
                <CheckCircle className="w-4 h-4 mr-2" /> Mark as Featured
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive">
                <Shield className="w-4 h-4 mr-2" /> Suspend Course
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
