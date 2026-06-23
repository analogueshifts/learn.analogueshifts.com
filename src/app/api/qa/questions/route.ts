import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const lessonId = request.nextUrl.searchParams.get("lessonId");
  if (!lessonId) return apiError("lessonId is required", 422);

  const questions = await prisma.question.findMany({
    where: { lessonId },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
      answers: {
        include: { author: { select: { id: true, name: true, avatar: true } } },
        orderBy: [{ isAccepted: "desc" }, { upvotes: "desc" }],
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(questions);
}

const createQuestionSchema = z.object({
  lessonId: z.string(),
  title: z.string().min(3).max(200),
  body: z.string().min(1).max(5000),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const parsed = createQuestionSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const question = await prisma.question.create({
    data: { ...parsed.data, authorId: session.user.id },
  });

  return apiSuccess(question, 201);
}
