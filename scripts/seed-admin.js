const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// 1. Load .env.local or .env
const envLocalPath = path.join(__dirname, "..", ".env.local");
const envPath = path.join(__dirname, "..", ".env");
let envContent = "";
if (fs.existsSync(envLocalPath)) {
  envContent = fs.readFileSync(envLocalPath, "utf-8");
} else if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, "utf-8");
}

envContent.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
    const idx = trimmed.indexOf("=");
    const key = trimmed.substring(0, idx).trim();
    const val = trimmed.substring(idx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
});

const mongoUri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/pawswell";
const adminEmail = process.env.ADMIN_EMAIL || "harshkuhikar68@gmail.com";
const adminPassword = process.env.ADMIN_PASSWORD || "Kuhikar@1122";

function normalizeEmail(email) {
  const trimmed = (email || "").trim().toLowerCase();
  const atIndex = trimmed.lastIndexOf("@");
  if (atIndex === -1) return { email: trimmed, canonicalEmail: trimmed };

  let local = trimmed.substring(0, atIndex);
  let domain = trimmed.substring(atIndex + 1);

  if (domain === "googlemail.com") domain = "gmail.com";

  if (domain === "gmail.com") {
    const plusIndex = local.indexOf("+");
    if (plusIndex !== -1) local = local.substring(0, plusIndex);
    local = local.replace(/\./g, "");
  } else {
    const plusIndex = local.indexOf("+");
    if (plusIndex !== -1) local = local.substring(0, plusIndex);
  }

  return { email: trimmed, canonicalEmail: `${local}@${domain}` };
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return { hash, salt };
}

async function runSeed() {
  console.log("[Seed] Connecting to MongoDB...");
  await mongoose.connect(mongoUri, { dbName: "pawswell" });
  console.log("[Seed] Connected successfully to pawswell database.");

  const db = mongoose.connection.db;
  const accountsColl = db.collection("accounts");
  const usersColl = db.collection("users");

  // Remove any legacy mock/demo users from DB
  await accountsColl.deleteMany({ email: "sarah.barnaby@example.com" });
  await usersColl.deleteMany({ email: "sarah.barnaby@example.com" });
  console.log("[Seed] Cleaned up legacy demo user accounts.");

  const { email, canonicalEmail } = normalizeEmail(adminEmail);
  const { hash, salt } = hashPassword(adminPassword);

  const existingAccount = await accountsColl.findOne({ canonicalEmail });

  if (existingAccount && existingAccount.role === "user") {
    console.error(`[ERROR] Email "${adminEmail}" is already registered as a USER account.`);
    console.error(`[ERROR] One Email = One Role Violation.`);
    process.exit(1);
  }

  await accountsColl.updateOne(
    { canonicalEmail },
    {
      $set: {
        id: existingAccount ? existingAccount.id : `admin_${Date.now()}`,
        email,
        canonicalEmail,
        role: "admin",
        passwordHash: hash,
        salt,
        status: "active",
        emailVerified: true,
        tokenVersion: existingAccount?.tokenVersion || 1,
        updatedAt: new Date().toISOString(),
      },
      $setOnInsert: {
        createdAt: new Date().toISOString(),
      },
    },
    { upsert: true }
  );

  console.log(`\x1b[32m[SUCCESS] Admin "${email}" credentials seeded into MongoDB successfully.\x1b[0m`);
  console.log(`[INFO] Admin Portal URL: /admin/login`);

  await mongoose.disconnect();
  process.exit(0);
}

runSeed().catch((err) => {
  console.error("Seed script failure:", err);
  process.exit(1);
});
