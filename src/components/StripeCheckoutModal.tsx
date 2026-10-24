"use client";

import { RazorpayCheckoutModal } from "./RazorpayCheckoutModal";

// Backwards-compatible export mapping Stripe checkout to Razorpay
export { RazorpayCheckoutModal as StripeCheckoutModal };
export default RazorpayCheckoutModal;
