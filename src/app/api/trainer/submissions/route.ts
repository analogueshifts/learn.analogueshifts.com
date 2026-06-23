import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/require-trainer";

export async function GET() {
  const trainer = await requireTrainer();
  if (!trainer) return apiError("Forbidden", 403);

  const submissions = await prisma.assignmentSubmission.findMany({
    where: { assignment: { lesson: { section: { course: { trainerId: trainer.id } } } } },
    include: {
      student: { select: { id: true, name: true, email: true } },
      assignment: {
        select: {
          title: true,
          lesson: { select: { section: { select: { course: { select: { id: true, title: true } } } } } },
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  return apiSuccess(
    submissions.map(({ assignment, ...submission }) => ({
      ...submission,
      assignmentTitle: assignment.title,
      course: assignment.lesson.section.course,
    }))
  );
}
