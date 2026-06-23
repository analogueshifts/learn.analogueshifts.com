import { getServerSession } from "next-auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const { id } = await params;
  const answer = await prisma.answer.findUnique({ where: { id } });
  if (!answer) return apiError("Answer not found", 404);

  const updated = await prisma.answer.update({
    where: { id },
    data: { upvotes: { increment: 1 } },
  });

  return apiSuccess(updated);
}
