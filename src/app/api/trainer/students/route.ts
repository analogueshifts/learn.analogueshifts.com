import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/require-trainer";

export async function GET() {
  const trainer = await requireTrainer();
  if (!trainer) return apiError("Forbidden", 403);

  const enrollments = await prisma.enrollment.findMany({
    where: { course: { trainerId: trainer.id } },
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true } },
      course: { select: { id: true, title: true } },
    },
    orderBy: { enrolledAt: "desc" },
  });

  // Per-lesson progress/grade lands in Phase 6 (LessonProgress/CourseProgress models)
  // -- this returns enrollment-level data only for now.
  return apiSuccess(
    enrollments.map((e) => ({
      studentId: e.user.id,
      name: e.user.name,
      email: e.user.email,
      avatar: e.user.avatar,
      courseId: e.course.id,
      course: e.course.title,
      enrolledAt: e.enrolledAt,
    }))
  );
}
