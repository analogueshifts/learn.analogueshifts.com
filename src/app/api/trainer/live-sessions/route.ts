import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/require-trainer";
import { getOwnedCourse } from "@/lib/trainer-course";

export async function GET() {
  const trainer = await requireTrainer();
  if (!trainer) return apiError("Forbidden", 403);

  const sessions = await prisma.liveSession.findMany({
    where: { trainerId: trainer.id },
    include: { course: { select: { id: true, title: true } } },
    orderBy: { scheduledAt: "desc" },
  });

  return apiSuccess(sessions);
}

const createSessionSchema = z.object({
  courseId: z.string(),
  title: z.string().min(1).max(200),
  scheduledAt: z.coerce.date(),
  duration: z.number().int().min(15).max(480),
  meetingLink: z.string().url(),
});

export async function POST(request: Request) {
  const trainer = await requireTrainer();
  if (!trainer) return apiError("Forbidden", 403);

  const parsed = createSessionSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const course = await getOwnedCourse(parsed.data.courseId, trainer.id, trainer.role === "ADMIN");
  if (!course) return apiError("Course not found", 404);

  const session = await prisma.liveSession.create({
    data: { ...parsed.data, trainerId: trainer.id },
  });

  // Resend 24h/1h reminder-email scheduling lands in Phase 7 (cron jobs).
  return apiSuccess(session, 201);
}
