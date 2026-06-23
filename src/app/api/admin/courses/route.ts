import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const status = request.nextUrl.searchParams.get("status");
  const where: Record<string, unknown> = {};
  if (status) where.status = status.toUpperCase();

  const courses = await prisma.course.findMany({
    where,
    include: {
      trainer: { select: { id: true, name: true, email: true } },
      reviews: { select: { rating: true } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(
    courses.map(({ reviews, _count, ...course }) => ({
      ...course,
      enrolledCount: _count.enrollments,
      avgRating: reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
    }))
  );
}
