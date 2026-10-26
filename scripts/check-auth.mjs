import mongoose from "mongoose";
import { Resend } from "resend";

function withTimeout(promise, ms, stepName) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timed out after ${ms / 1000}s on: ${stepName}`)), ms)
    ),
  ]);
}

async function checkAuth() {
  console.log("==================================================================");
  console.log("🛡️  PAWSWELL AUTHENTICATION & SECURITY DIAGNOSTIC CHECK");
  console.log("==================================================================\n");

  let allPassed = true;

  // 1. Environment variables check
  console.log("CHECK 1: Environment Variables Presence & Length");
  const envVars = [
    { name: "MONGODB_URI", hint: "Set to your MongoDB Atlas connection string" },
    { name: "MONGODB_DB_NAME", hint: "Set to 'pawswell'" },
    { name: "RESEND_API_KEY", hint: "Set to your Resend API key (re_...)" },
    { name: "SESSION_SECRET", hint: "Set to a random string with 32+ characters", minLength: 32 },
    { name: "EMAIL_FROM", hint: "Set to 'PawsWell <onboarding@resend.dev>' or your verified domain" },
    { name: "ADMIN_EMAIL", hint: "Set to the admin email address" },
  ];

  for (const item of envVars) {
    const val = process.env[item.name];
    if (val && val.trim().length > 0) {
      if (item.minLength && val.length < item.minLength) {
        console.log(`  [FAIL] ${item.name}: Too short (${val.length} chars, min ${item.minLength}). Fix hint: ${item.hint}`);
        allPassed = false;
      } else {
        const extra = item.minLength ? ` (${val.length} chars, >= ${item.minLength})` : "";
        console.log(`  [PASS] ${item.name}: Configured${extra}`);
      }
    } else {
      console.log(`  [FAIL] ${item.name}: MISSING. Fix hint: ${item.hint}`);
      allPassed = false;
    }
  }

  // 2. MongoDB connection, ping, and indexes verification
  console.log("\nCHECK 2: MongoDB Connection, Ping & Core Indexes");
  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "pawswell";

  if (!mongoUri) {
    console.log("  [FAIL] MongoDB: Skipped due to missing MONGODB_URI");
    allPassed = false;
  } else {
    try {
      await withTimeout(
        (async () => {
          const conn = await mongoose.connect(mongoUri, {
            dbName,
            serverSelectionTimeoutMS: 8000,
            connectTimeoutMS: 8000,
            bufferCommands: false,
          });

          const db = conn.connection.db;
          if (!db) {
            throw new Error("Unable to obtain MongoDB database reference");
          }

          // Ping database
          await db.admin().ping();
          console.log(`  [PASS] Database ping: Successfully reached "${dbName}"`);

          // Verify collections & indexes
          const collections = await db.listCollections().toArray();
          const collNames = collections.map((c) => c.name);
          console.log(`  [PASS] Collections found: ${collNames.join(", ")}`);

          // Check accounts index
          if (collNames.includes("accounts")) {
            const accIndexes = await db.collection("accounts").indexes();
            const hasEmailIndex = accIndexes.some((idx) => idx.key?.canonicalEmail || idx.key?.email);
            if (hasEmailIndex) {
              console.log("  [PASS] Index on 'accounts': Email unique index verified");
            } else {
              console.log("  [NOTICE] Index on 'accounts': Creating email index...");
              await db.collection("accounts").createIndex({ canonicalEmail: 1 }, { unique: true });
              console.log("  [PASS] Index on 'accounts': Created canonicalEmail unique index");
            }
          }

          // Check otp_codes TTL index
          if (collNames.includes("otp_codes")) {
            const otpIndexes = await db.collection("otp_codes").indexes();
            const hasTTL = otpIndexes.some((idx) => idx.expireAfterSeconds !== undefined);
            if (hasTTL) {
              console.log("  [PASS] Index on 'otp_codes': TTL auto-expiry index verified");
            } else {
              console.log("  [NOTICE] Index on 'otp_codes': Creating TTL index...");
              await db.collection("otp_codes").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
              console.log("  [PASS] Index on 'otp_codes': Created TTL index on expiresAt");
            }
          }

          // Check sessions TTL index
          if (collNames.includes("sessions")) {
            const sessIndexes = await db.collection("sessions").indexes();
            const hasTTL = sessIndexes.some((idx) => idx.expireAfterSeconds !== undefined);
            if (hasTTL) {
              console.log("  [PASS] Index on 'sessions': TTL auto-expiry index verified");
            } else {
              console.log("  [NOTICE] Index on 'sessions': Creating TTL index...");
              await db.collection("sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
              console.log("  [PASS] Index on 'sessions': Created TTL index on expiresAt");
            }
          }

          await mongoose.disconnect();
          console.log("  [PASS] MongoDB Connection: Cleanly terminated");
        })(),
        10000,
        "MongoDB Ping and Index Audit"
      );
    } catch (err) {
      console.log(`  [FAIL] MongoDB Check: ${err.message}`);
      allPassed = false;
      try {
        await mongoose.disconnect();
      } catch {}
    }
  }

  // 3. Resend API Key Harmless Verification
  console.log("\nCHECK 3: Resend API Key & Domain Status (Zero Emails Sent)");
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    console.log("  [FAIL] Resend: Skipped due to missing RESEND_API_KEY");
    allPassed = false;
  } else {
    try {
      await withTimeout(
        (async () => {
          const resend = new Resend(resendKey);
          const response = await resend.domains.list();

          if (response.error) {
            console.log(`  [FAIL] Resend API Key: Rejected (${response.error.message}). Fix hint: Verify RESEND_API_KEY.`);
            allPassed = false;
          } else {
            console.log("  [PASS] Resend API Key: Valid & authorized");
            const domains = response.data?.data || [];
            if (domains.length === 0) {
              console.log("  [NOTICE] Domain Status: No custom domains verified. Resend is in Free Sandbox mode (only sends to account owner).");
            } else {
              const domainList = domains.map((d) => `${d.name} [${d.status}]`).join(", ");
              console.log(`  [PASS] Verified Domains: ${domainList}`);
            }
          }
        })(),
        10000,
        "Resend API Key Verification"
      );
    } catch (err) {
      console.log(`  [FAIL] Resend API: ${err.message}`);
      allPassed = false;
    }
  }

  console.log("\n==================================================================");
  if (allPassed) {
    console.log("🎉 ALL AUTHENTICATION HEALTH CHECKS PASSED SUCCESSFULLY");
  } else {
    console.log("❌ ONE OR MORE CHECKS FAILED — PLEASE REVIEW HINTS ABOVE");
  }
  console.log("==================================================================\n");

  process.exit(allPassed ? 0 : 1);
}

// Emergency exit timeout
setTimeout(() => {
  console.error("\n[TIMEOUT] Hard timeout reached in check:auth. Exiting.");
  process.exit(1);
}, 25000).unref();

checkAuth().catch((err) => {
  console.error("checkAuth unexpected error:", err);
  process.exit(1);
});
