import { getServerSession } from "next-auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          trainer: { select: { name: true } },
          sections: { include: { lessons: { orderBy: { order: "asc" } } }, orderBy: { order: "asc" } },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  const data = await Promise.all(
    enrollments.map(async ({ course, ...enrollment }) => {
      const lessons = course.sections.flatMap((s) => s.lessons);
      const lessonIds = lessons.map((l) => l.id);

      const [progressRows, courseProgress] = await Promise.all([
        prisma.lessonProgress.findMany({
          where: { userId: session.user.id, lessonId: { in: lessonIds } },
        }),
        prisma.courseProgress.findUnique({
          where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
        }),
      ]);

      const completedLessons = progressRows.filter((p) => p.completed).length;
      const totalWatchSeconds = progressRows.reduce((sum, p) => sum + p.watchTime, 0);
      const currentLesson = courseProgress?.currentLessonId
        ? lessons.find((l) => l.id === courseProgress.currentLessonId)
        : lessons[0];

      return {
        id: course.id,
        slug: course.slug,
        title: course.title,
        instructor: course.trainer.name,
        image: course.thumbnailUrl,
        progress: courseProgress?.progressPercent ?? 0,
        currentLessonId: currentLesson?.id ?? null,
        currentLessonTitle: currentLesson?.title ?? null,
        totalLessons: lessons.length,
        completedLessons,
        timeSpentSeconds: totalWatchSeconds,
        enrolledAt: enrollment.enrolledAt,
      };
    })
  );

  return apiSuccess(data);
}
