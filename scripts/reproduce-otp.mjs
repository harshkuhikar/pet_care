import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { Resend } from "resend";

// Helper: load .env.local if variables are not already in process.env
function loadEnvLocal() {
  try {
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const rawLine of content.split("\n")) {
        const line = rawLine.trim();
        if (!line || line.startsWith("#")) continue;
        const eqIdx = line.indexOf("=");
        if (eqIdx !== -1) {
          const key = line.slice(0, eqIdx).trim();
          let val = line.slice(eqIdx + 1).trim();
          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1);
          }
          if (process.env[key] === undefined) {
            process.env[key] = val;
          }
        }
      }
    }
  } catch {
    // Continue even if .env.local fails to read
  }
}

loadEnvLocal();

// Hard timeout helper function (max ms per step)
function runWithTimeout(promise, ms, stepLabel) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Timed out after ${ms / 1000} seconds during ${stepLabel}`));
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

async function main() {
  console.log("=================================================");
  console.log("REPRODUCE OTP DIAGNOSTIC SUITE (10s HARD TIMEOUT)");
  console.log("=================================================\n");

  let allPassed = true;
  const failedSteps = [];

  // =========================================================================
  // STEP 1: Check environment variable names (print ONLY 'present' or 'missing')
  // =========================================================================
  console.log("STEP 1: Environment Variables Check");
  const requiredEnvVars = [
    "MONGODB_URI",
    "MONGODB_DB_NAME",
    "RESEND_API_KEY",
    "SESSION_SECRET",
    "EMAIL_FROM",
  ];

  let step1Failed = false;
  for (const varName of requiredEnvVars) {
    const val = process.env[varName];
    if (val !== undefined && val !== null && String(val).trim().length > 0) {
      console.log(`  [PASS] ${varName}: present`);
    } else {
      console.log(`  [FAIL] ${varName}: missing`);
      step1Failed = true;
    }
  }

  if (step1Failed) {
    console.log("Result Step 1: FAIL (One or more required env variables are missing)");
    allPassed = false;
    failedSteps.push("Step 1 (Environment Variables)");
  } else {
    console.log("Result Step 1: PASS");
  }

  // =========================================================================
  // STEP 2: Connect to MongoDB with 8s timeouts, ping, and close connection
  // =========================================================================
  console.log("\nSTEP 2: MongoDB Connection and Ping Check");
  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "pawswell";

  if (!mongoUri) {
    console.log("  [FAIL] MongoDB connection skipped: MONGODB_URI is missing");
    allPassed = false;
    failedSteps.push("Step 2 (MongoDB Connection)");
  } else {
    try {
      await runWithTimeout(
        (async () => {
          const conn = await mongoose.connect(mongoUri, {
            dbName,
            serverSelectionTimeoutMS: 8000,
            connectTimeoutMS: 8000,
            bufferCommands: false,
          });

          if (conn.connection.db) {
            await conn.connection.db.admin().ping();
          }

          await mongoose.disconnect();
        })(),
        10000,
        "Step 2: MongoDB Connection and Ping"
      );
      console.log("  [PASS] MongoDB connected, ping succeeded, and connection closed cleanly");
      console.log("Result Step 2: PASS");
    } catch (err) {
      console.log(`  [FAIL] MongoDB error: ${err.message}`);
      allPassed = false;
      failedSteps.push("Step 2 (MongoDB Connection)");
      try {
        await mongoose.disconnect();
      } catch {}
    }
  }

  // =========================================================================
  // STEP 3: Check Resend API key (harmless endpoint: list domains, NO email)
  // =========================================================================
  console.log("\nSTEP 3: Resend API Key Harmless Check (List Domains - No Email Sent)");
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.log("  [FAIL] Resend check skipped: RESEND_API_KEY is missing");
    allPassed = false;
    failedSteps.push("Step 3 (Resend API Check)");
  } else {
    try {
      await runWithTimeout(
        (async () => {
          const resend = new Resend(resendApiKey);
          const response = await resend.domains.list();

          if (response.error) {
            throw new Error(`Resend API returned error: ${response.error.message}`);
          }
        })(),
        10000,
        "Step 3: Resend List Domains"
      );
      console.log("  [PASS] Resend API key valid and harmless domains.list() call succeeded");
      console.log("Result Step 3: PASS");
    } catch (err) {
      console.log(`  [FAIL] Resend check error: ${err.message}`);
      allPassed = false;
      failedSteps.push("Step 3 (Resend API Check)");
    }
  }

  // =========================================================================
  // STEP 4: Always close all connections and process.exit cleanly
  // =========================================================================
  console.log("\nSTEP 4: Clean Connection Teardown");
  try {
    await mongoose.disconnect();
    console.log("  [PASS] All database and network connections closed");
    console.log("Result Step 4: PASS");
  } catch (err) {
    console.log(`  [FAIL] Teardown warning: ${err.message}`);
  }

  console.log("\n=================================================");
  if (allPassed) {
    console.log("SUMMARY: ALL STEPS PASSED SUCCESSFULLY");
  } else {
    console.log(`SUMMARY: FAILURES DETECTED IN -> ${failedSteps.join(", ")}`);
  }
  console.log("=================================================\n");

  process.exit(allPassed ? 0 : 1);
}

// Emergency safety timeout to guarantee script termination
const emergencyTimeout = setTimeout(() => {
  console.error("\n[CRITICAL TIMEOUT] Emergency 35s hard limit reached. Forcing immediate exit.");
  process.exit(1);
}, 35000);
emergencyTimeout.unref();

main().catch(async (err) => {
  console.error(`\n[UNCAUGHT ERROR]: ${err.message}`);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
