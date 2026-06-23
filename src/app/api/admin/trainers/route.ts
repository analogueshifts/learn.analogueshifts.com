import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const trainers = await prisma.user.findMany({
    where: { role: "TRAINER" },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      createdAt: true,
      trainerProfile: true,
      _count: { select: { courses: true } },
      courses: { select: { reviews: { select: { rating: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(
    trainers.map(({ _count, courses, ...trainer }) => {
      const ratings = courses.flatMap((c) => c.reviews.map((r) => r.rating));
      return {
        ...trainer,
        courseCount: _count.courses,
        avgRating: ratings.length ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0,
      };
    })
  );
}
