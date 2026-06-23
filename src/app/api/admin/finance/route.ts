import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const [orders, refunds] = await Promise.all([
    prisma.order.findMany({
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.refund.findMany({
      where: { status: "PENDING" },
      include: { order: { include: { user: { select: { email: true } } } } },
      orderBy: { requestedAt: "desc" },
    }),
  ]);

  const totalRevenue = orders.filter((o) => o.status === "SUCCESS").reduce((sum, o) => sum + o.totalAmount, 0);
  const refundedCount = orders.filter((o) => o.status === "REFUNDED").length;
  const refundRate = orders.length ? (refundedCount / orders.length) * 100 : 0;

  const gatewayBreakdown = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.gateway] = (acc[o.gateway] ?? 0) + 1;
    return acc;
  }, {});

  return apiSuccess({
    totalRevenue,
    totalTransactions: orders.length,
    refundRate,
    gatewayBreakdown,
    transactions: orders.map((o) => ({
      id: o.id,
      user: o.user.email,
      amount: o.totalAmount,
      gateway: o.gateway,
      status: o.status,
      date: o.createdAt,
    })),
    pendingRefunds: refunds.map((r) => ({
      id: r.id,
      orderId: r.orderId,
      user: r.order.user.email,
      amount: r.order.totalAmount,
      reason: r.reason,
      date: r.requestedAt,
    })),
  });
}
