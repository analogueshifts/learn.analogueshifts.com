import { NextResponse } from "next/server";
import { fulfillOrder } from "@/lib/order-fulfillment";

export async function POST(request: Request) {
  const signature = request.headers.get("verif-hash");

  if (!signature || signature !== process.env.FLUTTERWAVE_SECRET_HASH) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const event = await request.json();

  if (event.event === "charge.completed" && event.data?.status === "successful") {
    await fulfillOrder(event.data.tx_ref);
  }

  return NextResponse.json({ received: true });
}
