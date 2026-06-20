import { prisma } from "@/lib/prisma";

export const VAT_RATE = 0.055;

export class CartPricingError extends Error {}

export async function priceCart(courseIds: string[], couponCode?: string) {
  if (courseIds.length === 0) throw new CartPricingError("Cart is empty");

  const courses = await prisma.course.findMany({
    where: { id: { in: courseIds }, status: "LIVE" },
  });
  if (courses.length !== courseIds.length) {
    throw new CartPricingError("One or more courses in your cart are no longer available");
  }

  const subtotal = courses.reduce((sum, c) => sum + c.price, 0);

  let coupon = null;
  let discountAmount = 0;

  if (couponCode) {
    coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
    if (!coupon) throw new CartPricingError("Invalid coupon code");
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new CartPricingError("This coupon has expired");
    }
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      throw new CartPricingError("This coupon has reached its usage limit");
    }
    if (coupon.courseId && !courseIds.includes(coupon.courseId)) {
      throw new CartPricingError("This coupon doesn't apply to the items in your cart");
    }

    discountAmount =
      coupon.discountType === "PERCENT"
        ? Math.round(subtotal * (coupon.discountValue / 100))
        : Math.min(coupon.discountValue, subtotal);
  }

  const afterDiscount = subtotal - discountAmount;
  const vatAmount = Math.round(afterDiscount * VAT_RATE);
  const total = afterDiscount + vatAmount;

  return { courses, subtotal, coupon, discountAmount, vatAmount, total };
}
