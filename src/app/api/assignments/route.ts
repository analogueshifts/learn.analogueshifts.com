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
  const courseIds = enrollments.map((e) => e.courseId);

  const assignments = await prisma.assignment.findMany({
    where: { lesson: { section: { courseId: { in: courseIds } } } },
    include: {
      lesson: { select: { id: true, title: true, section: { select: { course: { select: { id: true, title: true } } } } } },
      submissions: { where: { studentId: session.user.id } },
    },
  });

  return apiSuccess(
    assignments.map(({ lesson, submissions, ...assignment }) => ({
      ...assignment,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      course: lesson.section.course,
      submission: submissions[0] ?? null,
    }))
  );
}
