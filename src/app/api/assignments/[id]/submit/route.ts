import { getServerSession } from "next-auth";
import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const submitSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("code"), gitUrl: z.string().url("Must be a valid git URL") }),
  z.object({ type: z.literal("text"), textContent: z.string().min(10, "Submission too short").max(10000) }),
  z.object({ type: z.literal("image"), imageUrl: z.string().url("Must be a valid Cloudinary URL") }),
]);

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

  let fileUrl: string;
  let fileName: string;

  if (parsed.data.type === "code") {
    fileUrl = parsed.data.gitUrl;
    fileName = "code";
  } else if (parsed.data.type === "text") {
    fileUrl = parsed.data.textContent;
    fileName = "text";
  } else {
    fileUrl = parsed.data.imageUrl;
    fileName = "image";
  }

  const submission = await prisma.assignmentSubmission.upsert({
    where: { assignmentId_studentId: { assignmentId: id, studentId: session.user.id } },
    create: { assignmentId: id, studentId: session.user.id, fileUrl, fileName },
    update: { fileUrl, fileName, grade: null, feedback: null, gradedAt: null, submittedAt: new Date() },
  });

  return apiSuccess(submission, 201);
}
