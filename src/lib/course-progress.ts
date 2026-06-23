import { prisma } from "@/lib/prisma";

export async function recomputeCourseProgress(userId: string, courseId: string, currentLessonId?: string) {
  const totalLessons = await prisma.lesson.count({ where: { section: { courseId } } });

  const completedLessons = await prisma.lessonProgress.count({
    where: { userId, completed: true, lesson: { section: { courseId } } },
  });

  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return prisma.courseProgress.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: {
      userId,
      courseId,
      progressPercent,
      currentLessonId,
      completedAt: progressPercent === 100 ? new Date() : null,
    },
    update: {
      progressPercent,
      ...(currentLessonId ? { currentLessonId } : {}),
      completedAt: progressPercent === 100 ? new Date() : null,
    },
  });
}
