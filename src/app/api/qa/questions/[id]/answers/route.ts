import { getServerSession } from "next-auth";
import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { checkQaAchievements } from "@/lib/achievements";

const createAnswerSchema = z.object({ body: z.string().min(1).max(5000) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const { id } = await params;
  const question = await prisma.question.findUnique({ where: { id } });
  if (!question) return apiError("Question not found", 404);

  const parsed = createAnswerSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const answer = await prisma.answer.create({
    data: { questionId: id, body: parsed.data.body, authorId: session.user.id },
  });

  await checkQaAchievements(session.user.id);

  return apiSuccess(answer, 201);
}
