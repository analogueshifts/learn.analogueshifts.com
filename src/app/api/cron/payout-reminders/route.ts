import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCron } from "@/lib/require-cron";

const PAYOUT_THRESHOLD = 50;

// Runs weekly via Vercel Cron. Flags trainers whose unpaid earnings exceed PAYOUT_THRESHOLD
// so an admin remembers to process a payout, deduped per trainer per week.
export async function GET(request: Request) {
  if (!requireCron(request)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const [orderItems, payouts] = await Promise.all([
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
  const paidByTrainer = payouts.reduce<Record<string, number>>((acc, p) => {
    acc[p.trainerId] = (acc[p.trainerId] ?? 0) + p.amount;
    return acc;
  }, {});

  let flagged = 0;

  for (const [trainerId, gross] of Object.entries(grossByTrainer)) {
    const trainer = await prisma.trainerProfile.findUnique({ where: { userId: trainerId } });
    const commissionRate = trainer?.commissionRate ?? 0.7;
    const earned = Math.round(gross * commissionRate);
    const owed = earned - (paidByTrainer[trainerId] ?? 0);
    if (owed < PAYOUT_THRESHOLD) continue;

    const alreadyFlagged = await prisma.adminNotification.findFirst({
      where: {
        title: "Payout due",
        message: { contains: trainerId },
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    });
    if (alreadyFlagged) continue;

    const user = await prisma.user.findUnique({ where: { id: trainerId } });
    await prisma.adminNotification.create({
      data: {
        type: "INFO",
        title: "Payout due",
        message: `${user?.name} (${trainerId}) has $${owed} in unpaid earnings.`,
        actionUrl: "/admin/payouts",
      },
    });
    flagged += 1;
  }

  return NextResponse.json({ flagged });
}
