import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/require-trainer";
import { getOwnedCourse } from "@/lib/trainer-course";

export async function GET(_request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  const trainer = await requireTrainer();
  if (!trainer) return apiError("Forbidden", 403);

  const { courseId } = await params;
  const course = await getOwnedCourse(courseId, trainer.id, trainer.role === "ADMIN");
  if (!course) return apiError("Course not found", 404);

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [enrollments, reviews] = await Promise.all([
    prisma.enrollment.findMany({
      where: { courseId, enrolledAt: { gte: thirtyDaysAgo } },
      select: { enrolledAt: true },
    }),
    prisma.review.findMany({ where: { courseId }, select: { rating: true } }),
  ]);

  const enrollmentsByDay = enrollments.reduce<Record<string, number>>((acc, e) => {
    const day = e.enrolledAt.toISOString().slice(0, 10);
    acc[day] = (acc[day] ?? 0) + 1;
    return acc;
  }, {});

  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }));

  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  // Per-lesson completion/drop-off rates land in Phase 6 (LessonProgress model).
  return apiSuccess({
    enrollmentsLast30Days: Object.entries(enrollmentsByDay).map(([date, count]) => ({ date, count })),
    totalEnrollments: enrollments.length,
    avgRating,
    reviewCount: reviews.length,
    ratingBreakdown,
  });
}
