import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const userId = session.user.id;
  const role = session.user.role;

  const visibilityFilters: Record<string, unknown>[] = [{ audience: "INDIVIDUAL", recipientId: userId }];
  if (role === "STUDENT") visibilityFilters.push({ audience: "ALL" }, { audience: "STUDENTS" });
  else if (role === "TRAINER") visibilityFilters.push({ audience: "ALL" }, { audience: "TRAINERS" });
  else if (role === "ADMIN") visibilityFilters.push({ audience: "ALL" }, { audience: "ADMIN" });

  const messages = await prisma.message.findMany({
    where: { OR: visibilityFilters },
    select: { id: true },
  });

  await prisma.$transaction(
    messages.map((m) =>
      prisma.messageRead.upsert({
        where: { messageId_userId: { messageId: m.id, userId } },
        create: { messageId: m.id, userId },
        update: {},
      })
    )
  );

  return apiSuccess({ ok: true });
}
