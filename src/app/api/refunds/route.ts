import { getServerSession } from "next-auth";
import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const refundSchema = z.object({
  orderId: z.string(),
  reason: z.string().min(10).max(1000),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const parsed = refundSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const order = await prisma.order.findUnique({ where: { id: parsed.data.orderId } });
  if (!order || order.userId !== session.user.id) return apiError("Order not found", 404);
  if (order.status !== "SUCCESS") return apiError("Only successful orders can be refunded", 400);

  const refund = await prisma.refund.create({
    data: { orderId: order.id, reason: parsed.data.reason },
  });

  // Admin notification email lands in Phase 5 (AdminNotification model + Resend wiring).
  return apiSuccess(refund, 201);
}
