import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const courseId = request.nextUrl.searchParams.get("courseId");
  if (!courseId) return apiError("courseId is required", 422);

  const [courseProgress, completedLessons] = await Promise.all([
    prisma.courseProgress.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    }),
    prisma.lessonProgress.findMany({
      where: { userId: session.user.id, completed: true, lesson: { section: { courseId } } },
      select: { lessonId: true, watchTime: true },
    }),
  ]);

  return apiSuccess({
    progressPercent: courseProgress?.progressPercent ?? 0,
    currentLessonId: courseProgress?.currentLessonId ?? null,
    completedLessonIds: completedLessons.map((l) => l.lessonId),
  });
}
