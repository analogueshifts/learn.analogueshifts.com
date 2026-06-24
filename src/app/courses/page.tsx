export const dynamic = "force-dynamic";

import GuestLayout from "@/components/application/layouts/guest";
import CoursesBrowser from "@/components/application/courses/CoursesBrowser";
import { prisma } from "@/lib/prisma";
import { mapApiCourseToLegacy } from "@/lib/course-adapter";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { status: "LIVE" },
    include: { category: true, trainer: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <GuestLayout>
      <CoursesBrowser initialCourses={courses.map(mapApiCourseToLegacy)} />
    </GuestLayout>
  );
}
