import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/require-trainer";

export async function GET() {
  const trainer = await requireTrainer();
  if (!trainer) return apiError("Forbidden", 403);

  const reviews = await prisma.review.findMany({
    where: { course: { trainerId: trainer.id } },
    include: {
      student: { select: { name: true } },
      course: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return apiSuccess(reviews);
}
