import { getServerSession } from "next-auth";
import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { CartPricingError, priceCart } from "@/lib/cart-pricing";

const initiateSchema = z.object({
  courseIds: z.array(z.string()).min(1),
  couponCode: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) return apiError("Not authenticated", 401);

  const parsed = initiateSchema.safeParse(await request.json());
  if (!parsed.success) return apiError(parsed.error.message, 422);

  let priced;
  try {
    priced = await priceCart(parsed.data.courseIds, parsed.data.couponCode);
  } catch (error) {
    if (error instanceof CartPricingError) return apiError(error.message, 400);
    throw error;
  }

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      gateway: "FLUTTERWAVE",
      totalAmount: priced.total,
      currency: "USD",
      couponId: priced.coupon?.id,
      items: {
        create: priced.courses.map((course) => ({ courseId: course.id, price: course.price })),
      },
    },
  });

  await prisma.order.update({ where: { id: order.id }, data: { gatewayRef: order.id } });

  return apiSuccess({
    txRef: order.id,
    publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY,
    amount: priced.total,
    email: session.user.email,
    name: session.user.name,
  });
}
