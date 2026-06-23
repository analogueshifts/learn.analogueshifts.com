import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/require-trainer";
import { getOwnedCourse } from "@/lib/trainer-course";

const createLessonSchema = z.object({
  sectionId: z.string(),
  title: z.string().min(1).max(200),
  type: z.enum(["VIDEO", "ARTICLE", "QUIZ", "ASSIGNMENT"]).default("VIDEO"),
  videoUrl: z.string().url().optional(),
  duration: z.string().optional(),
  description: z.string().optional(),
  isFreePreview: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  quiz: z
    .object({
      passScore: z.number().int().min(0).max(100).default(80),
      questions: z.array(
        z.object({
          question: z.string(),
          options: z.array(z.string()).min(2),
          correctIndex: z.number().int().min(0),
        })
      ),
    })
    .optional(),
  assignment: z
    .object({
      title: z.string(),
      description: z.string().optional(),
      fileUrl: z.string().url().optional(),
    })
    .optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const trainer = await requireTrainer();
  if (!trainer) return apiError("Forbidden", 403);

  const { id } = await params;
  const course = await getOwnedCourse(id, trainer.id, trainer.role === "ADMIN");
  if (!course) return apiError("Course not found", 404);

  const parsed = createLessonSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);
  const data = parsed.data;

  const section = await prisma.section.findUnique({ where: { id: data.sectionId } });
  if (!section || section.courseId !== id) return apiError("Section not found", 404);

  const lessonCount = await prisma.lesson.count({ where: { sectionId: data.sectionId } });

  const lesson = await prisma.lesson.create({
    data: {
      title: data.title,
      type: data.type,
      videoUrl: data.videoUrl,
      duration: data.duration,
      description: data.description,
      isFreePreview: data.isFreePreview ?? false,
      order: data.order ?? lessonCount,
      sectionId: data.sectionId,
      ...(data.quiz
        ? {
            quiz: {
              create: {
                passScore: data.quiz.passScore,
                questions: {
                  create: data.quiz.questions.map((q, index) => ({
                    question: q.question,
                    options: q.options,
                    correctIndex: q.correctIndex,
                    order: index,
                  })),
                },
              },
            },
          }
        : {}),
      ...(data.assignment
        ? {
            assignment: {
              create: {
                title: data.assignment.title,
                description: data.assignment.description,
                fileUrl: data.assignment.fileUrl,
              },
            },
          }
        : {}),
    },
    include: { quiz: { include: { questions: true } }, assignment: true },
  });

  return apiSuccess(lesson, 201);
}
