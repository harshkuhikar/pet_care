import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { planId, planName, isYearly, amount, currency = "USD" } = body;

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TqWODGGxf4PqSm";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "DAb4sT1E63UzJ02dDwAmJyQ8";

    // Amount in subunits (cents or paise, integer)
    const amountInSubunits = Math.round(Number(amount) * 100);

    const receiptId = `rcpt_${planId}_${Date.now().toString().slice(-6)}`;

    // Call official Razorpay Orders API
    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountInSubunits,
        currency: currency.toUpperCase(),
        receipt: receiptId,
        notes: {
          planId: planId || "plan",
          planName: planName || "PawsWell Membership",
          billingInterval: isYearly ? "yearly" : "monthly",
          source: "PawsWell Integrative Pet Health",
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Razorpay order creation error:", errorData);
      // If currency mismatch (e.g. account only supports INR), retry with INR
      if (currency.toUpperCase() !== "INR" && errorData?.error?.description?.includes("currency")) {
        // Fallback retry with INR
        const inrAmount = Math.round(amount * 85 * 100);
        const inrResponse = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            Authorization: `Basic ${authHeader}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: inrAmount,
            currency: "INR",
            receipt: receiptId,
            notes: {
              planName: planName || "PawsWell Membership",
              billingInterval: isYearly ? "yearly" : "monthly",
            },
          }),
        });

        if (inrResponse.ok) {
          const inrData = await inrResponse.json();
          return NextResponse.json({ order: inrData, keyId });
        }
      }

      return NextResponse.json(
        { error: errorData?.error?.description || "Failed to create Razorpay order" },
        { status: response.status }
      );
    }

    const orderData = await response.json();

    return NextResponse.json({
      order: orderData,
      keyId,
    });
  } catch (err: any) {
    console.error("Razorpay API route exception:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
