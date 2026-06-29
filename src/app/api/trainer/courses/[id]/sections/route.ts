import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/require-trainer";
import { getOwnedCourse } from "@/lib/trainer-course";

const createSectionSchema = z.object({
  title: z.string().min(1).max(200),
  order: z.number().int().min(0).optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const trainer = await requireTrainer();
  if (!trainer) return apiError("Forbidden", 403);

  const { id } = await params;
  const course = await getOwnedCourse(id, trainer.id, trainer.role === "ADMIN");
  if (!course) return apiError("Course not found", 404);

  const parsed = createSectionSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const sectionCount = await prisma.section.count({ where: { courseId: id } });

  const section = await prisma.section.create({
    data: { title: parsed.data.title, order: parsed.data.order ?? sectionCount, courseId: id },
  });

  return apiSuccess(section, 201);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const trainer = await requireTrainer();
  if (!trainer) return apiError("Forbidden", 403);

  const { id } = await params;
  const course = await getOwnedCourse(id, trainer.id, trainer.role === "ADMIN");
  if (!course) return apiError("Course not found", 404);

  await prisma.section.deleteMany({ where: { courseId: id } });
  return apiSuccess({ id });
}
