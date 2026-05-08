import coursesData from "@/resources/courses.json";
import GuestLayout from "@/components/application/layouts/guest";
import CoursesBrowser from "@/components/application/courses/CoursesBrowser";

// Server Component for the listing page
export default function CoursesPage() {
  return (
    <GuestLayout>
      <CoursesBrowser initialCourses={coursesData} />
    </GuestLayout>
  );
}
