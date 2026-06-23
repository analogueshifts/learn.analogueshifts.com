import { getServerSession } from "next-auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

function computeStreak(activeDates: Set<string>) {
  let streak = 0;
  const cursor = new Date();
  // If nothing happened today yet, the streak can still count from yesterday backward.
  if (!activeDates.has(cursor.toISOString().slice(0, 10))) cursor.setDate(cursor.getDate() - 1);

  while (activeDates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const [courseProgress, lessonProgress] = await Promise.all([
    prisma.courseProgress.findMany({ where: { userId: session.user.id } }),
    prisma.lessonProgress.findMany({ where: { userId: session.user.id }, select: { watchTime: true, lastAccessedAt: true } }),
  ]);

  const coursesInProgress = courseProgress.filter((c) => c.progressPercent < 100).length;
  const completedCourses = courseProgress.filter((c) => c.progressPercent === 100).length;
  const totalWatchHours = Math.round((lessonProgress.reduce((sum, p) => sum + p.watchTime, 0) / 3600) * 10) / 10;

  const activeDates = new Set(lessonProgress.map((p) => p.lastAccessedAt.toISOString().slice(0, 10)));
  const currentStreakDays = computeStreak(activeDates);

  return apiSuccess({ coursesInProgress, completedCourses, totalWatchHours, currentStreakDays });
}
