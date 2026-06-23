import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const updateSchema = z.object({ status: z.enum(["PENDING", "PROCESSING", "PAID", "FAILED"]) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const { id } = await params;
  const payout = await prisma.payout.findUnique({ where: { id } });
  if (!payout) return apiError("Payout not found", 404);

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const updated = await prisma.payout.update({
    where: { id },
    data: {
      status: parsed.data.status,
      processedAt: parsed.data.status === "PAID" ? new Date() : payout.processedAt,
    },
  });

  return apiSuccess(updated);
}
