import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/require-trainer";
import { getOwnedCourse } from "@/lib/trainer-course";

const updateLessonSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  videoUrl: z.string().url().optional(),
  duration: z.string().optional(),
  description: z.string().optional(),
  isFreePreview: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  const trainer = await requireTrainer();
  if (!trainer) return apiError("Forbidden", 403);

  const { id, lessonId } = await params;
  const course = await getOwnedCourse(id, trainer.id, trainer.role === "ADMIN");
  if (!course) return apiError("Course not found", 404);

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, include: { section: true } });
  if (!lesson || lesson.section.courseId !== id) return apiError("Lesson not found", 404);

  const parsed = updateLessonSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const updated = await prisma.lesson.update({ where: { id: lessonId }, data: parsed.data });
  return apiSuccess(updated);
}
