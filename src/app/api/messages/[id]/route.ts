import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

function isVisibleTo(message: { audience: string; recipientId: string | null }, userId: string, role: string) {
  if (message.audience === "INDIVIDUAL") return message.recipientId === userId;
  if (message.audience === "ALL") return true;
  if (message.audience === "STUDENTS") return role === "STUDENT";
  if (message.audience === "TRAINERS") return role === "TRAINER";
  if (message.audience === "ADMIN") return role === "ADMIN";
  return false;
}

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const { id } = await params;
  const message = await prisma.message.findUnique({ where: { id } });
  if (!message || !isVisibleTo(message, session.user.id, session.user.role ?? "")) {
    return apiError("Message not found", 404);
  }

  await prisma.messageRead.upsert({
    where: { messageId_userId: { messageId: id, userId: session.user.id } },
    create: { messageId: id, userId: session.user.id },
    update: {},
  });

  return apiSuccess({ id });
}
