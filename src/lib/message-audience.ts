import { prisma } from "@/lib/prisma";

export type MessageAudience = "ALL" | "STUDENTS" | "TRAINERS" | "ADMIN" | "INDIVIDUAL";

export async function resolveAudienceUserIds(audience: MessageAudience, recipientId?: string | null) {
  if (audience === "INDIVIDUAL") return recipientId ? [recipientId] : [];

  const roleFilter =
    audience === "STUDENTS" ? ["STUDENT"] : audience === "TRAINERS" ? ["TRAINER"] : audience === "ADMIN" ? ["ADMIN"] : null;

  const users = await prisma.user.findMany({
    where: roleFilter ? { role: { in: roleFilter as ("STUDENT" | "TRAINER" | "ADMIN")[] } } : {},
    select: { id: true },
  });
  return users.map((u) => u.id);
}
