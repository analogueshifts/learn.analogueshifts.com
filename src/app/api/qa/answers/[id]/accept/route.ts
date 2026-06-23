import { getServerSession } from "next-auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const { id } = await params;
  const answer = await prisma.answer.findUnique({
    where: { id },
    include: { question: { include: { lesson: { include: { section: { include: { course: true } } } } } } },
  });
  if (!answer) return apiError("Answer not found", 404);

  const isQuestionAuthor = answer.question.authorId === session.user.id;
  const isCourseTrainer = answer.question.lesson.section.course.trainerId === session.user.id;
  if (!isQuestionAuthor && !isCourseTrainer && session.user.role !== "ADMIN") {
    return apiError("Forbidden", 403);
  }

  const [updated] = await prisma.$transaction([
    prisma.answer.update({ where: { id }, data: { isAccepted: true } }),
    prisma.answer.updateMany({
      where: { questionId: answer.questionId, id: { not: id } },
      data: { isAccepted: false },
    }),
  ]);

  return apiSuccess(updated);
}
