import { prisma } from "@/lib/prisma";

// Idempotent: safe to call from both the client-side verify endpoint and the
// gateway webhook, whichever fires first. Only the first call has any effect.
export async function fulfillOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || order.status !== "PENDING") return order;

  await prisma.$transaction([
    prisma.order.update({ where: { id: order.id }, data: { status: "SUCCESS" } }),
    ...order.items.map((item) =>
      prisma.enrollment.upsert({
        where: { userId_courseId: { userId: order.userId, courseId: item.courseId } },
        create: { userId: order.userId, courseId: item.courseId, orderId: order.id },
        update: {},
      })
    ),
    ...(order.couponId
      ? [prisma.coupon.update({ where: { id: order.couponId }, data: { usedCount: { increment: 1 } } })]
      : []),
  ]);

  return order;
}
