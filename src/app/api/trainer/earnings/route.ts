import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/require-trainer";

export async function GET() {
  const trainer = await requireTrainer();
  if (!trainer) return apiError("Forbidden", 403);

  const trainerProfile = await prisma.trainerProfile.findUnique({ where: { userId: trainer.id } });
  const commissionRate = trainerProfile?.commissionRate ?? 0.7;

  const [items, refundedItems, paidOut] = await Promise.all([
    prisma.orderItem.findMany({
      where: { course: { trainerId: trainer.id }, order: { status: "SUCCESS" } },
      include: { order: { select: { createdAt: true } }, course: { select: { id: true, title: true } } },
    }),
    prisma.orderItem.findMany({
      where: { course: { trainerId: trainer.id }, order: { status: "REFUNDED" } },
      select: { price: true },
    }),
    prisma.payout.aggregate({
      where: { trainerId: trainer.id, status: "PAID" },
      _sum: { amount: true },
    }),
  ]);

  const grouped = items.reduce<Record<string, { month: string; courseId: string; course: string; gross: number; earnings: number }>>(
    (acc, item) => {
      const month = item.order.createdAt.toISOString().slice(0, 7);
      const key = `${month}-${item.course.id}`;
      if (!acc[key]) {
        acc[key] = { month, courseId: item.course.id, course: item.course.title, gross: 0, earnings: 0 };
      }
      acc[key].gross += item.price;
      acc[key].earnings += Math.round(item.price * commissionRate);
      return acc;
    },
    {}
  );

  const breakdown = Object.values(grouped).sort((a, b) => b.month.localeCompare(a.month));
  const totalGross = breakdown.reduce((sum, row) => sum + row.gross, 0);
  const totalEarnings = breakdown.reduce((sum, row) => sum + row.earnings, 0);
  const refundedAmount = refundedItems.reduce((sum, item) => sum + item.price, 0);
  const totalOrders = items.length + refundedItems.length;
  const refundRate = totalOrders > 0 ? (refundedItems.length / totalOrders) * 100 : 0;
  const paidOutAmount = paidOut._sum.amount ?? 0;
  const pendingPayout = totalEarnings - paidOutAmount;

  return apiSuccess({
    commissionRate,
    totalGross,
    totalEarnings,
    refundedAmount,
    refundRate,
    pendingPayout,
    breakdown,
  });
}
