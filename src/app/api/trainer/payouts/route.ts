import { z } from "zod";
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

const requestPayoutSchema = z.object({
  amount: z.number().int().min(1),
  bankName: z.string().min(2).max(100),
  accountName: z.string().min(2).max(100),
  accountNumber: z.string().min(6).max(30),
});

export async function POST(request: Request) {
  const trainer = await requireTrainer();
  if (!trainer) return apiError("Forbidden", 403);

  const parsed = requestPayoutSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const earnings = await prisma.orderItem.aggregate({
    where: { course: { trainerId: trainer.id }, order: { status: "SUCCESS" } },
    _sum: { price: true },
  });

  const trainerProfile = await prisma.trainerProfile.findUnique({
    where: { userId: trainer.id },
    select: { commissionRate: true },
  });

  const commissionRate = trainerProfile?.commissionRate ?? 0.7;
  const totalEarned = Math.round((earnings._sum.price ?? 0) * commissionRate);

  const previousPayouts = await prisma.payout.aggregate({
    where: { trainerId: trainer.id, status: { in: ["PENDING", "PROCESSING", "PAID"] } },
    _sum: { amount: true },
  });

  const alreadyPaidOut = previousPayouts._sum.amount ?? 0;
  const available = Math.max(0, totalEarned - alreadyPaidOut);

  if (parsed.data.amount > available) {
    return apiError(`Insufficient balance. Available: ₦${available}`, 400);
  }

  const month = new Date().toLocaleString("default", { month: "long", year: "numeric" });

  const payout = await prisma.payout.create({
    data: {
      trainerId: trainer.id,
      amount: parsed.data.amount,
      method: "BANK_TRANSFER",
      period: month,
      bankName: parsed.data.bankName,
      accountName: parsed.data.accountName,
      accountNumber: parsed.data.accountNumber,
    },
  });

  await prisma.adminNotification.create({
    data: {
      type: "INFO",
      title: "Withdrawal Request",
      message: `${trainer.name} requested a withdrawal of ₦${parsed.data.amount.toLocaleString()} to ${parsed.data.bankName} (${parsed.data.accountNumber}).`,
    },
  });

  return apiSuccess(payout, 201);
}
