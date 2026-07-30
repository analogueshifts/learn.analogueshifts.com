import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { validateCurriculumContent } from "@/lib/course-validation";

const updateSchema = z.object({
  status: z.enum(["DRAFT", "PENDING", "LIVE", "ARCHIVED"]).optional(),
  isFeatured: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) return apiError("Course not found", 404);

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  if (parsed.data.status === "LIVE") {
    const sections = await prisma.section.findMany({
      where: { courseId: id },
      include: { lessons: { include: { quiz: { include: { questions: true } }, assignment: true } } },
    });
    const validationError = validateCurriculumContent(
      sections.map((section) => ({
        lessons: section.lessons.map((lesson) => ({
          title: lesson.title,
          type: lesson.type,
          videoUrl: lesson.videoUrl,
          description: lesson.description,
          quiz: lesson.quiz
            ? { questions: lesson.quiz.questions.map((q) => ({ question: q.question, options: q.options })) }
            : null,
          assignment: lesson.assignment
            ? { description: lesson.assignment.description, fileUrl: lesson.assignment.fileUrl }
            : null,
        })),
      }))
    );
    if (validationError) return apiError(validationError, 400);
  }

  const updated = await prisma.course.update({ where: { id }, data: parsed.data });
  return apiSuccess(updated);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) return apiError("Course not found", 404);

  const enrollmentCount = await prisma.enrollment.count({ where: { courseId: id } });
  if (enrollmentCount > 0) {
    return apiError("This course has enrolled students and can't be deleted. Archive it instead.", 409);
  }

  try {
    await prisma.course.delete({ where: { id } });
  } catch {
    return apiError("This course has order history and can't be deleted. Archive it instead.", 409);
  }
  return apiSuccess({ id });
}
