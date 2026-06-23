import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const coupons = await prisma.coupon.findMany({
    include: { course: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(coupons);
}

const createCouponSchema = z.object({
  code: z.string().min(3).max(40),
  discountType: z.enum(["PERCENT", "FIXED"]),
  discountValue: z.number().int().min(1),
  expiresAt: z.coerce.date().optional(),
  maxUses: z.number().int().min(1).optional(),
  courseId: z.string().optional(),
});

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const parsed = createCouponSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  const code = parsed.data.code.toUpperCase();
  const existing = await prisma.coupon.findUnique({ where: { code } });
  if (existing) return apiError("A coupon with this code already exists", 409);

  const coupon = await prisma.coupon.create({ data: { ...parsed.data, code } });
  return apiSuccess(coupon, 201);
}
