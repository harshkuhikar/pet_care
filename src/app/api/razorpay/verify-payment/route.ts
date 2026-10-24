import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSessionUser } from "@/lib/server/session";
import { connectToDatabase } from "@/lib/server/mongodb";
import { AccountModel, SubscriptionModel, OrderModel } from "@/lib/server/models";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required. Please log in to complete checkout." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan = "premium", amount = 14 } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error("Missing RAZORPAY_KEY_SECRET environment variable.");
      return NextResponse.json({ error: "Payment configuration error." }, { status: 500 });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment verification parameters." },
        { status: 400 }
      );
    }

    // Official Razorpay verification formula:
    // HMAC-SHA256(order_id + "|" + payment_id, secret) == signature
    const hmac = crypto.createHmac("sha256", keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    let isMatch = false;
    try {
      isMatch = crypto.timingSafeEqual(
        Buffer.from(generatedSignature, "hex"),
        Buffer.from(razorpay_signature, "hex")
      );
    } catch {
      isMatch = false;
    }

    if (!isMatch) {
      return NextResponse.json(
        { success: false, verified: false, error: "Invalid payment signature." },
        { status: 400 }
      );
    }

    // Payment is authentic and verified!
    // Normalize target plan:
    const targetPlan = ["premium", "family", "pro"].includes(plan) ? plan : "premium";
    const now = new Date();
    // 365 days subscription duration
    const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();

    await connectToDatabase();

    // 1. Save subscription in Mongo
    await SubscriptionModel.create({
      accountId: user.id,
      plan: targetPlan,
      status: "active",
      startedAt: now.toISOString(),
      expiresAt,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });

    // 2. Update account plan in Mongo
    await AccountModel.updateOne(
      { id: user.id },
      {
        $set: {
          plan: targetPlan,
          planExpiresAt: expiresAt,
          updatedAt: now.toISOString(),
        },
      }
    );

    // 3. Log order in Mongo
    await OrderModel.create({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      userId: user.id,
      email: user.email,
      amount: typeof amount === "number" ? amount : 14,
      currency: process.env.NEXT_PUBLIC_CURRENCY || "USD",
      plan: targetPlan,
      status: "completed",
      createdAt: now.toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        verified: true,
        plan: targetPlan,
        expiresAt,
      },
      {
        headers: { "Cache-Control": "private, no-store" },
      }
    );
  } catch (err: any) {
    console.error("Payment verification error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
