import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/require-trainer";
import { getOwnedCourse } from "@/lib/trainer-course";

const updateSectionSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  order: z.number().int().min(0).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  const trainer = await requireTrainer();
  if (!trainer) return apiError("Forbidden", 403);

  const { id, sectionId } = await params;
  const course = await getOwnedCourse(id, trainer.id, trainer.role === "ADMIN");
  if (!course) return apiError("Course not found", 404);

  const section = await prisma.section.findUnique({ where: { id: sectionId } });
  if (!section || section.courseId !== id) return apiError("Section not found", 404);

  const parsed = updateSectionSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const updated = await prisma.section.update({ where: { id: sectionId }, data: parsed.data });
  return apiSuccess(updated);
}
