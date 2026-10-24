const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// 1. Load .env.local
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

const adminEmail = process.env.ADMIN_EMAIL || "harshkuhikar68@gmail.com";
const adminPassword = process.env.ADMIN_PASSWORD || "AdminPawsWell2026!";

// 2. Normalization logic matching src/lib/auth-exclusivity.ts
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

// 3. Database operations
const DB_DIR = path.join(__dirname, "..", ".data");
const DB_FILE = path.join(DB_DIR, "pawswell-db.json");

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const defaultUsers = [
  {
    id: "usr_alice",
    email: "sarah.barnaby@example.com",
    canonicalEmail: "sarah.barnaby@example.com",
    role: "user",
    plan: "premium",
    status: "active",
    createdAt: "2025-11-10T00:00:00Z",
    updatedAt: "2025-11-10T00:00:00Z",
  },
];

let db = { accounts: [], questions: [], answers: [], unlocks: [], settings: { freeLimit: 5, premiumLimit: 15, proLimit: 999999 }, auditLogs: [] };
if (fs.existsSync(DB_FILE)) {
  try {
    db = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch (e) {
    console.warn("Could not read existing db, initializing fresh:", e.message);
  }
}

// Ensure default users are registered in accounts
db.accounts = db.accounts || [];
defaultUsers.forEach((u) => {
  if (!db.accounts.some((a) => a.canonicalEmail === u.canonicalEmail)) {
    db.accounts.push(u);
  }
});

const { email, canonicalEmail } = normalizeEmail(adminEmail);

// Exclusivity Check: Cannot seed if already a user
const existingUser = (db.accounts || []).find(
  (a) => a.canonicalEmail === canonicalEmail && a.role === "user"
);

if (existingUser) {
  console.error(`\x1b[31m[ERROR] Email "${adminEmail}" is already registered as a USER account.\x1b[0m`);
  console.error(`[ERROR] One Email = One Role Violation. An existing user cannot become an admin without account migration.`);
  process.exit(1);
}

const existingAdminIndex = (db.accounts || []).findIndex(
  (a) => a.canonicalEmail === canonicalEmail && a.role === "admin"
);

const { hash, salt } = hashPassword(adminPassword);

if (existingAdminIndex !== -1) {
  // Update admin password
  db.accounts[existingAdminIndex].passwordHash = hash;
  db.accounts[existingAdminIndex].salt = salt;
  db.accounts[existingAdminIndex].updatedAt = new Date().toISOString();
  console.log(`\x1b[32m[SUCCESS] Admin "${adminEmail}" credentials updated successfully.\x1b[0m`);
} else {
  // Create admin
  const newAdmin = {
    id: `admin_${Date.now()}`,
    email,
    canonicalEmail,
    role: "admin",
    passwordHash: hash,
    salt,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.accounts.push(newAdmin);
  console.log(`\x1b[32m[SUCCESS] New Admin account created for "${adminEmail}".\x1b[0m`);
}

// Audit log
db.auditLogs = db.auditLogs || [];
db.auditLogs.push({
  id: `log_seed_${Date.now()}`,
  adminId: "admin_seed_cli",
  adminEmail,
  action: "ADMIN_SEEDED",
  targetType: "user",
  targetId: adminEmail,
  details: "Admin seeded via secure CLI script",
  timestamp: new Date().toISOString(),
});

fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
console.log(`[INFO] Admin Portal URL: /admin/login`);
console.log(`[INFO] Ready for independent admin login.\n`);
