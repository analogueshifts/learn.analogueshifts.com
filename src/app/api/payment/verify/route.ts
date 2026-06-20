import { getServerSession } from "next-auth";
import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { fulfillOrder } from "@/lib/order-fulfillment";

const verifySchema = z.object({ reference: z.string() });

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return apiError("Not authenticated", 401);

  const parsed = verifySchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const order = await prisma.order.findUnique({ where: { id: parsed.data.reference } });
  if (!order || order.userId !== session.user.id) return apiError("Order not found", 404);

  if (order.gateway === "PAYSTACK") {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${order.gatewayRef}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    const body = await response.json();

    if (!response.ok || body.data?.status !== "success") {
      return apiError("Payment could not be verified", 402);
    }
  } else if (order.gateway === "FLUTTERWAVE") {
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${order.gatewayRef}`,
      { headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` } }
    );
    const body = await response.json();

    if (!response.ok || body.data?.status !== "successful") {
      return apiError("Payment could not be verified", 402);
    }
  } else {
    return apiError(`Verification for ${order.gateway} is not implemented yet`, 501);
  }

  const fulfilled = await fulfillOrder(order.id);
  return apiSuccess({ status: fulfilled?.status ?? order.status });
}
