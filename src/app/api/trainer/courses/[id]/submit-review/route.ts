import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/require-trainer";
import { getOwnedCourse } from "@/lib/trainer-course";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const trainer = await requireTrainer();
  if (!trainer) return apiError("Forbidden", 403);

  const { id } = await params;
  const course = await getOwnedCourse(id, trainer.id, trainer.role === "ADMIN");
  if (!course) return apiError("Course not found", 404);
  if (course.status !== "DRAFT") return apiError("Only draft courses can be submitted for review", 400);

  const updated = await prisma.course.update({ where: { id }, data: { status: "PENDING" } });

  await prisma.adminNotification.create({
    data: {
      type: "INFO",
      title: "Course submitted for review",
      message: `"${updated.title}" was submitted by ${trainer.name} and is awaiting review.`,
      actionUrl: `/admin/courses/review`,
    },
  });

  return apiSuccess(updated);
}
