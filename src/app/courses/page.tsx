import { Suspense } from "react";
import CourseFilters from "@/components/application/courses/course-filters";
import coursesData from "@/resources/courses.json";
import GuestLayout from "@/components/application/layouts/guest";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SmartBackButton from "@/components/application/courses/smart-back-button";

const TRAINER_NAMES = ["Jane Doe", "John Smith", "Alice Wonderland"];

// Server Component for the listing page
export default function CoursesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const categoryFilter = typeof searchParams.category === "string" ? searchParams.category.split(",") : [];
  const levelFilter = typeof searchParams.level === "string" ? searchParams.level.split(",") : [];
  const priceFilter = typeof searchParams.price === "string" ? searchParams.price.split(",") : [];

  // Filter courses based on searchParams
  const filteredCourses = coursesData.filter((course) => {
    let match = true;
    if (categoryFilter.length > 0 && !categoryFilter.includes(course.courseName)) match = false;
    if (levelFilter.length > 0 && course.skillLevel && !levelFilter.includes(course.skillLevel)) match = false;
    
    // Naive price check: if "Free" is checked and price != "Free"
    if (priceFilter.length > 0) {
      const isFree = course.price === "Free" || course.price === "$0";
      if (priceFilter.includes("Free") && !isFree) match = false;
      if (priceFilter.includes("Paid") && isFree) match = false;
    }
    return match;
  });

  return (
    <GuestLayout>
      <div className="bg-background-whisperGray min-h-screen py-12 px-6 lg:px-24">
        <div className="max-w-[1800px] mx-auto">
          <div className="mb-10">
            <SmartBackButton fallbackHref="none" />
            <h1 className="text-4xl font-bold text-primary-tan mb-4">Explore Courses</h1>
            <p className="text-lg text-content-grayText max-w-3xl">
              Discover our comprehensive library of courses taught by industry experts. Use the filters to find exactly what you're looking for.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-1/4 xl:w-1/5 shrink-0">
              <Suspense fallback={<div className="w-full h-96 bg-gray-100 animate-pulse rounded-2xl" />}>
                <CourseFilters />
              </Suspense>
            </aside>

            {/* Course Grid */}
            <main className="w-full lg:w-3/4 xl:w-4/5">
              <div className="mb-6 flex justify-between items-center">
                <p className="text-primary-tan font-medium">
                  Showing <span className="font-bold">{filteredCourses.length}</span> results
                </p>
                {/* Could add Sort Dropdown here */}
              </div>

              {filteredCourses.length === 0 ? (
                <div className="w-full bg-white p-12 rounded-2xl border border-gray-100 text-center">
                  <h3 className="text-2xl font-bold text-primary-tan mb-2">No courses found</h3>
                  <p className="text-content-grayText">Try adjusting your filters to see more results.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCourses.map((course, index) => (
                    <Link href={`/courses/${course.slug}`} key={course.slug} className="flex-1 flex flex-col">
                      <Card className="flex-1 overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-100 group rounded-2xl flex flex-col">
                        <div className="relative h-40 lg:h-44 w-full overflow-hidden bg-gray-100 shrink-0">
                          <img 
                            src={course.thumbnail || "/courses/devops.svg"} 
                            alt={course.name} 
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold rounded text-primary-tan shadow-sm">
                            {course.skillLevel || "All Levels"}
                          </div>
                        </div>
                        <CardContent className="p-5 flex-grow flex flex-col">
                          <div className="flex items-center gap-1 text-xs mb-2 font-medium">
                            <span className="text-background-darkYellow font-bold">4.8</span>
                            <div className="flex text-background-darkYellow">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-current" />
                              ))}
                            </div>
                            <span className="text-content-subtle ml-1">({course.enrolledStudents || "1,200"})</span>
                          </div>
                          
                          <h3 className="font-bold text-lg text-primary-tan line-clamp-2 mb-1.5 group-hover:text-background-darkYellow transition-colors">
                            {course.headline || course.name}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-2 leading-snug mb-4">
                            {course.description}
                          </p>
                          
                          <div className="mt-auto">
                            <p className="text-xs text-content-grayText font-medium mb-3">
                              {course.instructor?.name || TRAINER_NAMES[index % TRAINER_NAMES.length]}
                            </p>
                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                              <span className="font-bold text-lg text-primary-tan">{course.price}</span>
                              <span className="text-xs font-medium bg-background-darkYellow/10 text-background-darkYellow px-2.5 py-1 rounded-md">
                                {course.duration || "Self Paced"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}
