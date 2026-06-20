import crypto from "crypto";
import { NextResponse } from "next/server";
import { fulfillOrder } from "@/lib/order-fulfillment";

export async function POST(request: Request) {
  const rawBody = await request.text();

  const signature = request.headers.get("x-paystack-signature");
  const expected = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest("hex");

  if (signature !== expected) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    await fulfillOrder(event.data.reference);
  }

  return NextResponse.json({ received: true });
}
