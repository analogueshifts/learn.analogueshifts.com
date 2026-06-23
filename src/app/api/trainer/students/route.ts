import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/require-trainer";

export async function GET(request: NextRequest) {
  const trainer = await requireTrainer();
  if (!trainer) return apiError("Forbidden", 403);

  const courseId = request.nextUrl.searchParams.get("courseId");

  const enrollments = await prisma.enrollment.findMany({
    where: { course: { trainerId: trainer.id, ...(courseId ? { id: courseId } : {}) } },
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true } },
      course: { select: { id: true, title: true } },
    },
    orderBy: { enrolledAt: "desc" },
  });

  const data = await Promise.all(
    enrollments.map(async (e) => {
      const [courseProgress, lastActivity] = await Promise.all([
        prisma.courseProgress.findUnique({
          where: { userId_courseId: { userId: e.user.id, courseId: e.course.id } },
        }),
        prisma.lessonProgress.findFirst({
          where: { userId: e.user.id, lesson: { section: { courseId: e.course.id } } },
          orderBy: { lastAccessedAt: "desc" },
          select: { lastAccessedAt: true },
        }),
      ]);

      return {
        studentId: e.user.id,
        name: e.user.name,
        email: e.user.email,
        avatar: e.user.avatar,
        courseId: e.course.id,
        course: e.course.title,
        enrolledAt: e.enrolledAt,
        progress: courseProgress?.progressPercent ?? 0,
        lastActive: lastActivity?.lastAccessedAt ?? null,
      };
    })
  );

  return apiSuccess(data);
}
