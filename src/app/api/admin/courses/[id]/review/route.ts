import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { sendEmail } from "@/lib/email";

const reviewSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED", "CHANGES_REQUESTED"]),
  feedback: z.string().max(2000).optional(),
});

const STATUS_BY_DECISION = {
  APPROVED: "LIVE",
  REJECTED: "ARCHIVED",
  CHANGES_REQUESTED: "DRAFT",
} as const;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) return apiError("Course not found", 404);
  if (course.status !== "PENDING") return apiError("Only courses pending review can be reviewed", 400);

  const parsed = reviewSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const { decision, feedback } = parsed.data;

  const [review] = await prisma.$transaction([
    prisma.courseReview.create({ data: { courseId: id, adminId: admin.id, decision, feedback } }),
    prisma.course.update({ where: { id }, data: { status: STATUS_BY_DECISION[decision] } }),
  ]);

  const trainer = await prisma.user.findUnique({ where: { id: course.trainerId } });
  if (trainer) {
    const decisionText = {
      APPROVED: "approved and is now live",
      REJECTED: "rejected",
      CHANGES_REQUESTED: "sent back for changes",
    }[decision];

    await sendEmail({
      to: trainer.email,
      subject: `Your course "${course.title}" was ${decision === "APPROVED" ? "approved" : "reviewed"}`,
      html: `<p>Your course "${course.title}" has been ${decisionText}.</p>${feedback ? `<p>Feedback: ${feedback}</p>` : ""}`,
    });

    await prisma.notification.create({
      data: {
        userId: trainer.id,
        type: decision === "APPROVED" ? "SUCCESS" : decision === "REJECTED" ? "ALERT" : "INFO",
        title: `Course ${decisionText}`,
        message: `Your course "${course.title}" has been ${decisionText}.${feedback ? ` Feedback: ${feedback}` : ""}`,
        actionUrl: `/trainer/courses/new?id=${course.id}`,
      },
    });
  }

  return apiSuccess(review, 201);
}
