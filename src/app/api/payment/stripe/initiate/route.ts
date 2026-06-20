import { getServerSession } from "next-auth";
import Stripe from "stripe";
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
      gateway: "STRIPE",
      totalAmount: priced.total,
      currency: "USD",
      couponId: priced.coupon?.id,
      items: {
        create: priced.courses.map((course) => ({ courseId: course.id, price: course.price })),
      },
    },
  });

  await prisma.order.update({ where: { id: order.id }, data: { gatewayRef: order.id } });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session.user.email,
    client_reference_id: order.id,
    line_items: priced.courses.map((course) => ({
      price_data: {
        currency: "usd",
        product_data: { name: course.title },
        unit_amount: course.price * 100,
      },
      quantity: 1,
    })),
    success_url: `${process.env.NEXTAUTH_URL}/checkout/success?ref=${order.id}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/checkout/failed?reason=cancelled`,
  });

  await prisma.order.update({ where: { id: order.id }, data: { gatewayRef: checkoutSession.id } });

  return apiSuccess({ url: checkoutSession.url });
}
