import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const past = request.nextUrl.searchParams.get("past") === "true";

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    select: { courseId: true },
  });

  const sessions = await prisma.liveSession.findMany({
    where: {
      courseId: { in: enrollments.map((e) => e.courseId) },
      scheduledAt: past ? { lt: new Date() } : { gte: new Date() },
    },
    include: { course: { select: { title: true } }, trainer: { select: { name: true } } },
    orderBy: { scheduledAt: past ? "desc" : "asc" },
    take: 20,
  });

  return apiSuccess(sessions);
}
