import { Resend } from "resend";

export async function sendOtpEmail(
  toEmail: string,
  code: string,
  purpose: "signup" | "login" = "login"
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.EMAIL_FROM || "PawsWell <onboarding@resend.dev>";
  const isProduction = process.env.NODE_ENV === "production";

  // Development Fallback: Only active if RESEND_API_KEY is missing and NOT in production
  if (!apiKey) {
    if (!isProduction) {
      console.log("\n=======================================================");
      console.log(`[DEV OTP CONSOLE OUTPUT]`);
      console.log(`Recipient: ${toEmail}`);
      console.log(`6-Digit Verification Code: >>> ${code} <<<`);
      console.log(`Expires in: 10 minutes`);
      console.log("=======================================================\n");
      return { success: true };
    }
    console.error("[Email Error] RESEND_API_KEY is not configured in production.");
    return { success: false, error: "Email service is temporarily unavailable." };
  }

  const resend = new Resend(apiKey);
  const subject = purpose === "signup" ? "Welcome to PawsWell — Your Verification Code" : "Your PawsWell Verification Code";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FFFDF5; margin: 0; padding: 40px 20px; color: #181126;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #ffffff; border: 3px solid #181126; border-radius: 24px; box-shadow: 6px 6px 0px #181126; padding: 36px 32px; text-align: center;">
          <tr>
            <td align="center">
              <div style="display: inline-block; background-color: #FF4D6D; color: #ffffff; width: 56px; height: 56px; line-height: 56px; font-size: 28px; border-radius: 16px; border: 2px solid #181126; margin-bottom: 16px;">
                🐾
              </div>
              <h1 style="font-size: 24px; font-weight: 900; margin: 0 0 8px 0; color: #181126;">
                PawsWell
              </h1>
              <p style="font-size: 14px; font-weight: 600; color: #64748b; margin: 0 0 24px 0;">
                Integrative Pet Health & Longevity
              </p>
              <div style="background-color: #FFF0F3; border: 2px dashed #FF4D6D; border-radius: 18px; padding: 24px; margin-bottom: 24px;">
                <p style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #FF4D6D; margin: 0 0 8px 0;">
                  Your Verification Code
                </p>
                <div style="font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #181126; font-family: monospace; margin: 12px 0;">
                  ${code}
                </div>
                <p style="font-size: 12px; font-weight: 600; color: #94a3b8; margin: 0;">
                  Valid for 10 minutes. Single-use only.
                </p>
              </div>
              <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0 0 16px 0;">
                Enter this code in your browser to sign in to your PawsWell account. Never share this code with anyone.
              </p>
              <p style="font-size: 11px; color: #94a3b8; line-height: 1.4; margin: 0;">
                If you did not request this verification code, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const textContent = `
Your PawsWell Verification Code: ${code}

This code is valid for 10 minutes.
Enter this code in your browser to sign in to your PawsWell account.

If you did not request this code, please ignore this email.
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [toEmail],
      subject,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error("[Resend Error]:", error);
      const isDomainRestriction =
        error.message?.includes("domain") ||
        error.message?.includes("verify") ||
        error.message?.includes("testing") ||
        error.message?.includes("only send testing emails");

      if (isDomainRestriction) {
        console.warn(
          `[Resend Notice] Verification emails with onboarding@resend.dev can only be sent to the registered Resend account owner (${process.env.ADMIN_EMAIL || "harshkuhikar68@gmail.com"}). To send to other emails, please verify your domain at resend.com/domains.`
        );
      }

      // If in dev and email send failed, print code to console and allow dev to proceed
      if (!isProduction) {
        console.log(`\n=======================================================`);
        console.log(`[DEV OTP CONSOLE OUTPUT] Recipient: ${toEmail}`);
        console.log(`[DEV OTP CONSOLE OUTPUT] Code: >>> ${code} <<<`);
        console.log(`[DEV OTP CONSOLE OUTPUT] Dev note: Resend restricted external email delivery, code logged to console for testing.`);
        console.log(`=======================================================\n`);
        return { success: true };
      }

      return {
        success: false,
        error: isDomainRestriction
          ? `During testing mode with onboarding@resend.dev, emails can only be sent to the registered Resend account owner (${process.env.ADMIN_EMAIL || "harshkuhikar68@gmail.com"}). Please sign up with that email, or verify a custom domain in Resend.`
          : "We couldn't send the email right now. Please try again in a minute.",
      };
    }

    return { success: true };
  } catch (err: any) {
    console.error("[Email Exception]:", err);
    if (!isProduction) {
      console.log(`\n=======================================================`);
      console.log(`[DEV OTP CONSOLE OUTPUT] Recipient: ${toEmail}`);
      console.log(`[DEV OTP CONSOLE OUTPUT] Code: >>> ${code} <<<`);
      console.log(`=======================================================\n`);
      return { success: true };
    }
    return {
      success: false,
      error: "We couldn't send the email right now. Please try again in a minute.",
    };
  }
}
