import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { CartPricingError, priceCart } from "@/lib/cart-pricing";

const validateSchema = z.object({
  code: z.string().min(1),
  courseIds: z.array(z.string()).min(1),
});

export async function POST(request: Request) {
  const parsed = validateSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  try {
    const { subtotal, discountAmount, coupon } = await priceCart(
      parsed.data.courseIds,
      parsed.data.code
    );

    return apiSuccess({
      valid: true,
      code: coupon!.code,
      discountType: coupon!.discountType,
      discountValue: coupon!.discountValue,
      discountAmount,
      subtotal,
    });
  } catch (error) {
    if (error instanceof CartPricingError) return apiError(error.message, 400);
    throw error;
  }
}
