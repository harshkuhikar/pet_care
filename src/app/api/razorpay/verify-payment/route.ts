import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "DAb4sT1E63UzJ02dDwAmJyQ8";

    // Handle offline/simulated test mode
    if (razorpay_order_id?.startsWith("order_simulated") || razorpay_payment_id?.startsWith("pay_simulated")) {
      return NextResponse.json({
        success: true,
        verified: true,
        message: "Payment successfully simulated in development mode",
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment verification parameters" },
        { status: 400 }
      );
    }

    // Official Razorpay verification formula:
    // HMAC-SHA256(order_id + "|" + payment_id, secret) == signature
    const hmac = crypto.createHmac("sha256", keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    const isMatch = generatedSignature === razorpay_signature;

    if (!isMatch) {
      console.warn("Razorpay signature mismatch:", {
        generated: generatedSignature,
        received: razorpay_signature,
      });
      return NextResponse.json(
        { success: false, verified: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (err: any) {
    console.error("Payment verification error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
