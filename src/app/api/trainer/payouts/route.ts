import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/require-trainer";

export async function GET() {
  const trainer = await requireTrainer();
  if (!trainer) return apiError("Forbidden", 403);

  const payouts = await prisma.payout.findMany({
    where: { trainerId: trainer.id },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(payouts);
}
