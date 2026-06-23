import { getServerSession } from "next-auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const [achievements, earned] = await Promise.all([
    prisma.achievement.findMany({ orderBy: { name: "asc" } }),
    prisma.userAchievement.findMany({
      where: { userId: session.user.id },
      select: { achievementId: true, earnedAt: true },
    }),
  ]);

  const earnedMap = new Map(earned.map((e) => [e.achievementId, e.earnedAt]));

  return apiSuccess(
    achievements.map((a) => ({
      ...a,
      earned: earnedMap.has(a.id),
      earnedAt: earnedMap.get(a.id) ?? null,
    }))
  );
}
