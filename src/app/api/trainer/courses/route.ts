import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/require-trainer";

export async function GET() {
  const trainer = await requireTrainer();
  if (!trainer) return apiError("Forbidden", 403);

  const [courses, orderItems] = await Promise.all([
    prisma.course.findMany({
      where: { trainerId: trainer.id },
      include: {
        category: true,
        reviews: { select: { rating: true } },
        _count: { select: { enrollments: true, sections: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.orderItem.findMany({
      where: { course: { trainerId: trainer.id }, order: { status: "SUCCESS" } },
      select: { courseId: true, price: true },
    }),
  ]);

  const earningsByCourse = orderItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.courseId] = (acc[item.courseId] ?? 0) + item.price;
    return acc;
  }, {});

  return apiSuccess(
    courses.map(({ reviews, _count, ...course }) => ({
      ...course,
      studentCount: _count.enrollments,
      sectionCount: _count.sections,
      avgRating: reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
      earnings: earningsByCourse[course.id] ?? 0,
    }))
  );
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const createCourseSchema = z.object({
  title: z.string().min(3).max(200),
  subtitle: z.string().max(300).optional(),
  description: z.string().min(10),
  categoryId: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]).optional(),
  price: z.number().int().min(0).optional(),
  // Admin-only: attribute the course to a different trainer instead of the caller.
  trainerId: z.string().optional(),
});

export async function POST(request: Request) {
  const trainer = await requireTrainer();
  if (!trainer) return apiError("Forbidden", 403);

  const parsed = createCourseSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const { title, subtitle, description, categoryId, level, price, trainerId } = parsed.data;

  let resolvedTrainerId = trainer.id;
  if (trainer.role === "ADMIN" && trainerId) {
    const targetTrainer = await prisma.user.findUnique({ where: { id: trainerId }, select: { id: true, role: true } });
    if (!targetTrainer || targetTrainer.role !== "TRAINER") {
      return apiError("Selected trainer not found", 400);
    }
    resolvedTrainerId = targetTrainer.id;
  }

  let slug = slugify(title);
  const existing = await prisma.course.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const course = await prisma.course.create({
    data: {
      slug,
      title,
      subtitle,
      description,
      categoryId,
      level,
      price: price ?? 0,
      trainerId: resolvedTrainerId,
    },
  });

  return apiSuccess(course, 201);
}
