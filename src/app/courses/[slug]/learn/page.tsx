import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import LearnPageClient from "./LearnPageClient";

export default async function CourseLearningPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect(`/login?from=/courses/${params.slug}/learn`);

  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: {
              quiz: { include: { questions: { orderBy: { order: "asc" } } } },
              assignment: true,
            },
          },
        },
      },
    },
  });
  if (!course) redirect("/courses");

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });
  if (!enrollment) redirect(`/courses/${params.slug}`);

  const [completedLessons, courseProgress] = await Promise.all([
    prisma.lessonProgress.findMany({
      where: { userId: session.user.id, completed: true, lesson: { section: { courseId: course.id } } },
      select: { lessonId: true },
    }),
    prisma.courseProgress.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
    }),
  ]);

  return (
    <LearnPageClient
      course={course}
      completedLessonIds={completedLessons.map((l) => l.lessonId)}
      currentLessonId={courseProgress?.currentLessonId ?? null}
    />
  );
}
