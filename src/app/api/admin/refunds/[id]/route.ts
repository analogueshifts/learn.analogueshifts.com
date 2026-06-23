import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { sendEmail } from "@/lib/email";

const decisionSchema = z.object({ decision: z.enum(["APPROVED", "REJECTED"]) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const { id } = await params;
  const refund = await prisma.refund.findUnique({
    where: { id },
    include: { order: { include: { user: true } } },
  });
  if (!refund) return apiError("Refund not found", 404);
  if (refund.status !== "PENDING") return apiError("Refund has already been processed", 400);

  const parsed = decisionSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const updated = await prisma.refund.update({
    where: { id },
    data: { status: parsed.data.decision, processedAt: new Date() },
  });

  if (parsed.data.decision === "APPROVED") {
    await prisma.order.update({ where: { id: refund.orderId }, data: { status: "REFUNDED" } });
  }

  await sendEmail({
    to: refund.order.user.email,
    subject: parsed.data.decision === "APPROVED" ? "Your refund was approved" : "Your refund request was declined",
    html:
      parsed.data.decision === "APPROVED"
        ? `<p>Your refund for order ${refund.orderId} ($${refund.order.totalAmount}) has been approved.</p>`
        : `<p>Your refund request for order ${refund.orderId} was declined.</p>`,
  });

  // Deliberately not calling the gateway's actual refund API (Paystack/Flutterwave/Stripe) here --
  // that moves real money and needs explicit sign-off + sandbox testing before wiring it up.
  return apiSuccess(updated);
}
