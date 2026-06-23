import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const [payouts, trainers, orderItems, paidPayouts] = await Promise.all([
    prisma.payout.findMany({
      include: { trainer: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { role: "TRAINER" },
      select: { id: true, name: true, email: true, trainerProfile: { select: { commissionRate: true } } },
    }),
    prisma.orderItem.findMany({
      where: { order: { status: "SUCCESS" } },
      select: { price: true, course: { select: { trainerId: true } } },
    }),
    prisma.payout.findMany({ where: { status: "PAID" }, select: { trainerId: true, amount: true } }),
  ]);

  const grossByTrainer = orderItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.course.trainerId] = (acc[item.course.trainerId] ?? 0) + item.price;
    return acc;
  }, {});
  const paidByTrainer = paidPayouts.reduce<Record<string, number>>((acc, p) => {
    acc[p.trainerId] = (acc[p.trainerId] ?? 0) + p.amount;
    return acc;
  }, {});

  const trainerBalances = trainers
    .map((trainer) => {
      const gross = grossByTrainer[trainer.id] ?? 0;
      const commissionRate = trainer.trainerProfile?.commissionRate ?? 0.7;
      const earned = Math.round(gross * commissionRate);
      const pendingBalance = earned - (paidByTrainer[trainer.id] ?? 0);
      return { id: trainer.id, name: trainer.name, email: trainer.email, pendingBalance };
    })
    .filter((t) => t.pendingBalance > 0);

  return apiSuccess({ payouts, trainerBalances });
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
