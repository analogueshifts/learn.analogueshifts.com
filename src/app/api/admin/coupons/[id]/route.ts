import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const updateCouponSchema = z.object({
  discountValue: z.number().int().min(1).optional(),
  expiresAt: z.coerce.date().nullable().optional(),
  maxUses: z.number().int().min(1).nullable().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const { id } = await params;
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) return apiError("Coupon not found", 404);

  const parsed = updateCouponSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const updated = await prisma.coupon.update({ where: { id }, data: parsed.data });
  return apiSuccess(updated);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const { id } = await params;
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) return apiError("Coupon not found", 404);

  await prisma.coupon.delete({ where: { id } });
  return apiSuccess({ deleted: true });
}
