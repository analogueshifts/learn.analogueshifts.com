import { apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const courses = await prisma.course.findMany({
    where: { status: "LIVE" },
    include: {
      category: true,
      trainer: { select: { id: true, name: true, avatar: true } },
      reviews: { select: { rating: true } },
    },
    take: 8,
  });

  // No Enrollment model yet (that lands in Phase 3) -- rank by review volume/rating
  // as a stand-in for real enrollment velocity until then.
  const ranked = courses
    .map(({ reviews, ...course }) => ({
      ...course,
      avgRating: reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
      reviewCount: reviews.length,
    }))
    .sort((a, b) => b.reviewCount - a.reviewCount || b.avgRating - a.avgRating);

  return apiSuccess(ranked);
}
