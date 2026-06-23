import { getServerSession } from "next-auth";
import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { recomputeCourseProgress } from "@/lib/course-progress";
import { checkProgressAchievements } from "@/lib/achievements";

const watchtimeSchema = z.object({
  courseId: z.string(),
  lessonId: z.string(),
  watchTime: z.number().min(0),
  completed: z.boolean(),
});

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const parsed = watchtimeSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);
  const { courseId, lessonId, watchTime, completed } = parsed.data;

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
  });
  if (!enrollment) return apiError("Not enrolled in this course", 403);

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
    create: { userId: session.user.id, lessonId, watchTime, completed },
    update: { watchTime, completed },
  });

  await recomputeCourseProgress(session.user.id, courseId, lessonId);
  await checkProgressAchievements(session.user.id, courseId);

  return apiSuccess({ message: "Progress saved" });
}
