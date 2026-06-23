import { getServerSession } from "next-auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    select: { courseId: true },
  });

  const sessions = await prisma.liveSession.findMany({
    where: { courseId: { in: enrollments.map((e) => e.courseId) }, scheduledAt: { gte: new Date() } },
    include: { course: { select: { title: true } } },
    orderBy: { scheduledAt: "asc" },
    take: 5,
  });

  return apiSuccess(sessions);
}
