import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/require-trainer";
import { getOwnedCourse } from "@/lib/trainer-course";

export async function GET() {
  const trainer = await requireTrainer();
  if (!trainer) return apiError("Forbidden", 403);

  const announcements = await prisma.announcement.findMany({
    where: { trainerId: trainer.id },
    include: { course: { select: { id: true, title: true, _count: { select: { enrollments: true } } } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return apiSuccess(
    announcements.map(({ course, ...a }) => ({ ...a, course: course.title, audienceSize: course._count.enrollments }))
  );
}

const createAnnouncementSchema = z.object({
  courseId: z.string(),
  title: z.string().min(1).max(200),
  body: z.string().min(1),
});

export async function POST(request: Request) {
  const trainer = await requireTrainer();
  if (!trainer) return apiError("Forbidden", 403);

  const parsed = createAnnouncementSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const { courseId, title, body } = parsed.data;
  const course = await getOwnedCourse(courseId, trainer.id, trainer.role === "ADMIN");
  if (!course) return apiError("Course not found", 404);

  const announcement = await prisma.announcement.create({
    data: { courseId, title, body, trainerId: trainer.id },
  });

  const enrollments = await prisma.enrollment.findMany({
    where: { courseId },
    include: { user: { select: { email: true } } },
  });
  const recipients = enrollments.map((e) => e.user.email);

  if (recipients.length > 0 && process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.batch.send(
      recipients.map((to) => ({
        from: "AnalogueShifts LMS <no-reply@analogueshifts.com>",
        to,
        subject: title,
        html: `<p>${body}</p>`,
      }))
    );
  } else if (recipients.length > 0) {
    console.log(`[dev] Announcement "${title}" would be emailed to: ${recipients.join(", ")}`);
  }

  return apiSuccess(announcement, 201);
}
