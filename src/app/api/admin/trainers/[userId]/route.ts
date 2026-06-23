import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const updateTrainerSchema = z.object({
  applicationStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  status: z.enum(["ACTIVE", "SUSPENDED", "BANNED"]).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const { userId } = await params;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "TRAINER") return apiError("Trainer not found", 404);

  const parsed = updateTrainerSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);
  const { applicationStatus, status } = parsed.data;

  if (status) {
    await prisma.user.update({ where: { id: userId }, data: { status } });
  }

  const profile = await prisma.trainerProfile.upsert({
    where: { userId },
    create: {
      userId,
      applicationStatus: applicationStatus ?? "PENDING",
      verifiedAt: applicationStatus === "APPROVED" ? new Date() : null,
    },
    update: {
      ...(applicationStatus ? { applicationStatus } : {}),
      ...(applicationStatus === "APPROVED" ? { verifiedAt: new Date() } : {}),
    },
  });

  return apiSuccess(profile);
}
