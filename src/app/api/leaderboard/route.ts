export const dynamic = "force-dynamic";

import { unstable_cache } from "next/cache";
import { apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

const getLeaderboard = unstable_cache(
  async () => {
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: {
        id: true,
        name: true,
        avatar: true,
        _count: {
          select: {
            lessonProgress: { where: { completed: true } },
            achievements: true,
            certificates: true,
          },
        },
      },
    });

    return students
      .map(({ _count, ...student }) => ({
        ...student,
        points: _count.lessonProgress * 10 + _count.achievements * 50 + _count.certificates * 200,
      }))
      .filter((s) => s.points > 0)
      .sort((a, b) => b.points - a.points)
      .slice(0, 20)
      .map((student, index) => ({ ...student, rank: index + 1 }));
  },
  ["leaderboard"],
  { revalidate: 300 }
);

export async function GET() {
  const leaderboard = await getLeaderboard();
  return apiSuccess(leaderboard);
}
