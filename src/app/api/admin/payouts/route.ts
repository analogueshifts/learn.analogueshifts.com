import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const payouts = await prisma.payout.findMany({
    include: { trainer: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(payouts);
}

const createPayoutSchema = z.object({
  trainerId: z.string(),
  amount: z.number().int().min(1),
  method: z.enum(["BANK_TRANSFER", "PAYPAL"]),
  period: z.string(),
});

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const parsed = createPayoutSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const trainer = await prisma.user.findUnique({ where: { id: parsed.data.trainerId } });
  if (!trainer || trainer.role !== "TRAINER") return apiError("Trainer not found", 404);

  const payout = await prisma.payout.create({ data: parsed.data });
  return apiSuccess(payout, 201);
}
