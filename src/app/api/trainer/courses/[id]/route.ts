import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/require-trainer";
import { getOwnedCourse } from "@/lib/trainer-course";

const updateCourseSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  subtitle: z.string().max(300).optional(),
  description: z.string().min(10).optional(),
  categoryId: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]).optional(),
  price: z.number().int().min(0).optional(),
  thumbnailUrl: z.string().url().optional(),
  previewUrl: z.string().url().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const trainer = await requireTrainer();
  if (!trainer) return apiError("Forbidden", 403);

  const { id } = await params;
  const course = await getOwnedCourse(id, trainer.id, trainer.role === "ADMIN");
  if (!course) return apiError("Course not found", 404);

  const parsed = updateCourseSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const updated = await prisma.course.update({ where: { id }, data: parsed.data });
  return apiSuccess(updated);
}
