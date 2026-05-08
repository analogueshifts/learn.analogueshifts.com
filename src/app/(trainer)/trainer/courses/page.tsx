"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, MoreVertical, Users, Star, DollarSign, Edit3, Eye, Video } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const courses = [
  { 
    id: 1,
    title: "Fullstack Web Development Masterclass", 
    status: "Published", 
    students: 1204, 
    rating: 4.8, 
    earnings: 14500, 
    price: "$99.99", 
    modules: 12,
    lastUpdated: "2 days ago",
    slug: "web-dev",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=200&auto=format&fit=crop" 
  },
  { 
    id: 2,
    title: "Advanced UI/UX Design Systems", 
    status: "Published", 
    students: 840, 
    rating: 4.6, 
    earnings: 8200, 
    price: "$79.99", 
    modules: 8,
    lastUpdated: "1 week ago",
    slug: "product-design",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=200&auto=format&fit=crop" 
  },
  { 
    id: 3,
    title: "React Native for Beginners", 
    status: "Draft", 
    students: 0, 
    rating: 0, 
    earnings: 0, 
    price: "$49.99", 
    modules: 5,
    lastUpdated: "4 hours ago",
    slug: "mobile-dev",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=200&auto=format&fit=crop" 
  },
  { 
    id: 4,
    title: "Python Data Science Bootcamp", 
    status: "Under Review", 
    students: 0, 
    rating: 0, 
    earnings: 0, 
    price: "$89.99", 
    modules: 24,
    lastUpdated: "Just now",
    slug: "data-science",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=200&auto=format&fit=crop" 
  },
];

export default function TrainerCoursesPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredCourses = courses.filter(course => {
    if (activeTab === "published") return course.status === "Published";
    if (activeTab === "drafts") return course.status === "Draft" || course.status === "Under Review";
    return true; // all
  });

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Course Management</h1>
          <p className="text-gray-500 mt-1">Create, edit, and monitor your course curriculum and sales.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-background-darkYellow hover:bg-yellow-600 text-white font-bold" asChild>
            <Link href="/trainer/courses/new">
              <Plus className="w-4 h-4 mr-2" />
              New Course
            </Link>
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="bg-gray-100/50 p-1">
            <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-bold">All Courses</TabsTrigger>
            <TabsTrigger value="published" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-bold">Published</TabsTrigger>
            <TabsTrigger value="drafts" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-bold">Drafts</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-background-darkYellow/20 focus:bg-white transition-all"
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0 rounded-xl border-gray-200">
            <Filter className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-4">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <p>No courses found for this filter.</p>
          </div>
        ) : (
          filteredCourses.map((course) => (
            <Card key={course.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden group bg-white">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row lg:items-center p-4 lg:p-6 gap-6">
                
                {/* 1. Thumbnail & Title */}
                <div className="flex items-start gap-5 flex-1 min-w-0">
                  <div className="w-32 h-24 rounded-xl overflow-hidden shrink-0 border border-gray-100 bg-gray-50 relative group-hover:border-background-darkYellow/30 transition-colors">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col justify-center py-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                        course.status === 'Published' ? 'bg-green-100 text-green-700' :
                        course.status === 'Under Review' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {course.status}
                      </span>
                      <span className="text-xs font-bold text-gray-400">•</span>
                      <span className="text-xs font-medium text-gray-500">Last updated {course.lastUpdated}</span>
                    </div>
                    <h3 className="font-extrabold text-lg text-gray-900 truncate pr-4" title={course.title}>
                      {course.title}
                    </h3>
                    <div className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-4">
                      <span className="flex items-center"><Video className="w-3.5 h-3.5 mr-1.5 text-gray-400" /> {course.modules} Modules</span>
                      <span className="font-bold text-gray-900">{course.price}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Metrics Grid (Only for Published/Active courses) */}
                <div className="flex gap-8 lg:px-8 lg:border-l border-gray-100 shrink-0">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Students</span>
                    <span className="text-lg font-extrabold text-gray-900 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      {course.students.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Revenue</span>
                    <span className="text-lg font-extrabold text-gray-900 flex items-center">
                      <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                      {course.earnings.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col hidden sm:flex">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Rating</span>
                    <span className="text-lg font-extrabold text-gray-900 flex items-center">
                      <Star className={`w-4 h-4 mr-1.5 ${course.rating > 0 ? "fill-background-darkYellow text-background-darkYellow" : "text-gray-300"}`} />
                      {course.rating > 0 ? course.rating : "—"}
                    </span>
                  </div>
                </div>

                {/* 3. Action Buttons */}
                <div className="flex items-center gap-2 lg:border-l border-gray-100 lg:pl-6 shrink-0 mt-4 lg:mt-0 justify-end">
                  {course.status === 'Draft' ? (
                    <Button variant="outline" className="bg-white border-2 border-gray-200 text-gray-900 font-bold hover:bg-gray-50" asChild>
                      <Link href="/trainer/courses/new">
                        Continue Editing
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" size="icon" className="bg-white text-gray-600 hover:text-gray-900 border-gray-200" asChild>
                        <Link href={`/courses/${course.slug}?mode=preview`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" className="bg-white text-gray-600 hover:text-blue-600 border-gray-200" asChild>
                        <Link href="/trainer/courses/new">
                          <Edit3 className="w-4 h-4" />
                        </Link>
                      </Button>
                    </>
                  )}
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-900">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-48 p-2 rounded-xl border border-gray-100 shadow-xl">
                      <div className="flex flex-col space-y-1">
                        <Button variant="ghost" className="justify-start w-full font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                          {course.status === 'Published' ? 'Unpublish' : 'View Settings'}
                        </Button>
                        <div className="h-px bg-gray-100 my-1 mx-2" />
                        <Button variant="ghost" className="justify-start w-full font-bold text-red-600 hover:bg-red-50 hover:text-red-700">
                          Delete Course
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

              </div>
            </CardContent>
          </Card>
        )))}
      </div>

    </div>
  );
}
