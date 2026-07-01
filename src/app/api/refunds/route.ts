import { getServerSession } from "next-auth";
import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const refundSchema = z.object({
  orderId: z.string(),
  reason: z.string().min(10).max(1000),
  bankName: z.string().min(2).max(100),
  accountName: z.string().min(2).max(100),
  accountNumber: z.string().min(6).max(30),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const parsed = refundSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const order = await prisma.order.findUnique({ where: { id: parsed.data.orderId } });
  if (!order || order.userId !== session.user.id) return apiError("Order not found", 404);
  if (order.status !== "SUCCESS") return apiError("Only successful orders can be refunded", 400);

  const existing = await prisma.refund.findFirst({ where: { orderId: order.id, status: { not: "REJECTED" } } });
  if (existing) return apiError("A refund request for this order already exists", 409);

  const refund = await prisma.refund.create({
    data: {
      orderId: order.id,
      reason: parsed.data.reason,
      bankName: parsed.data.bankName,
      accountName: parsed.data.accountName,
      accountNumber: parsed.data.accountNumber,
    },
  });

  await prisma.adminNotification.create({
    data: {
      type: "WARNING",
      title: "Refund Request",
      message: `A student submitted a refund request for order ${order.id.slice(0, 8)}. Bank: ${parsed.data.bankName} · ${parsed.data.accountNumber}.`,
    },
  });

  return apiSuccess(refund, 201);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const refunds = await prisma.refund.findMany({
    where: { order: { userId: session.user.id } },
    include: { order: { include: { items: { include: { course: { select: { title: true } } } } } } },
    orderBy: { requestedAt: "desc" },
  });

  return apiSuccess(refunds);
}
