import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/require-trainer";

const gradeSchema = z.object({
  grade: z.string().min(1).max(20),
  feedback: z.string().max(2000).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const trainer = await requireTrainer();
  if (!trainer) return apiError("Forbidden", 403);

  const { id } = await params;
  const submission = await prisma.assignmentSubmission.findUnique({
    where: { id },
    include: { assignment: { include: { lesson: { include: { section: { include: { course: true } } } } } } },
  });
  if (!submission) return apiError("Submission not found", 404);
  if (submission.assignment.lesson.section.course.trainerId !== trainer.id && trainer.role !== "ADMIN") {
    return apiError("Forbidden", 403);
  }

  const parsed = gradeSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const updated = await prisma.assignmentSubmission.update({
    where: { id },
    data: { ...parsed.data, gradedAt: new Date() },
  });

  const student = await prisma.user.findUnique({ where: { id: submission.studentId } });
  if (student) {
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "AnalogueShifts LMS <no-reply@analogueshifts.com>",
        to: student.email,
        subject: `Your assignment "${submission.assignment.title}" has been graded`,
        html: `<p>You scored <strong>${parsed.data.grade}</strong> on "${submission.assignment.title}".</p>${parsed.data.feedback ? `<p>Feedback: ${parsed.data.feedback}</p>` : ""}`,
      });
    } else {
      console.log(`[dev] Grade email would be sent to ${student.email}: ${parsed.data.grade}`);
    }
  }

  return apiSuccess(updated);
}
