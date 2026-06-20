import { NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

const querySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  level: z.string().optional(),
  price: z.enum(["free", "paid"]).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  language: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const { q, category, level, price, minRating, language, page, limit } = parsed.data;

  const where: Record<string, unknown> = { status: "LIVE" };
  if (q) where.title = { contains: q, mode: "insensitive" };
  if (category) where.category = { slug: category };
  if (level) where.level = level.toUpperCase();
  if (price === "free") where.price = 0;
  if (price === "paid") where.price = { gt: 0 };
  if (language) where.language = language;

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      include: {
        category: true,
        trainer: { select: { id: true, name: true, avatar: true } },
        reviews: { select: { rating: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.count({ where }),
  ]);

  let results = courses.map(({ reviews, ...course }) => ({
    ...course,
    avgRating: reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
    reviewCount: reviews.length,
  }));

  if (minRating) results = results.filter((c) => c.avgRating >= minRating);

  return apiSuccess({ courses: results, total, page, limit, totalPages: Math.ceil(total / limit) });
}
