import { getServerSession } from "next-auth";
import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const submitSchema = z.object({
  fileUrl: z.string().url(),
  fileName: z.string().optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const { id } = await params;
  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: { lesson: { select: { section: { select: { courseId: true } } } } },
  });
  if (!assignment) return apiError("Assignment not found", 404);

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: assignment.lesson.section.courseId } },
  });
  if (!enrollment) return apiError("Not enrolled in this course", 403);

  const parsed = submitSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  // Resubmitting before grading just overwrites the file; once graded, grade/feedback reset
  // since a new file means the trainer needs to look at it again.
  const submission = await prisma.assignmentSubmission.upsert({
    where: { assignmentId_studentId: { assignmentId: id, studentId: session.user.id } },
    create: { assignmentId: id, studentId: session.user.id, ...parsed.data },
    update: { ...parsed.data, grade: null, feedback: null, gradedAt: null, submittedAt: new Date() },
  });

  return apiSuccess(submission, 201);
}
