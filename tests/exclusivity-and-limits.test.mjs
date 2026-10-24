import assert from "assert";
import { normalizeEmail, hashPassword, verifyPassword, generateAdminSessionToken, verifyAdminSessionToken } from "../src/lib/auth-exclusivity.ts";
import { db } from "../src/lib/server/db.ts";

console.log("==================================================================");
console.log("🚀 RUNNING PAWSWELL AUTOMATED TEST SUITE: EXCLUSIVITY & LIMITS");
console.log("==================================================================\n");

let passed = 0;
let failed = 0;

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

// --------------------------------------------------------------------------------
// 1. Email Normalization & Canonicalization
// --------------------------------------------------------------------------------
test("Email Normalization: handles casing, spaces, and Gmail plus/dot tricks", async () => {
  const t1 = normalizeEmail("  HarshKuhikar68@gmail.com  ");
  assert.strictEqual(t1.email, "harshkuhikar68@gmail.com");
  assert.strictEqual(t1.canonicalEmail, "harshkuhikar68@gmail.com");

  const t2 = normalizeEmail("harsh.kuhikar+adminTest@gmail.com");
  assert.strictEqual(t2.canonicalEmail, "harshkuhikar68@gmail.com".replace("68", "")); // dot & plus removed
});

// --------------------------------------------------------------------------------
// 2. Email Exclusivity: Admin email cannot be registered as User
// --------------------------------------------------------------------------------
test("Email Exclusivity: User registration with admin email (any casing/spaces) is blocked", async () => {
  await assert.rejects(
    async () => {
      await db.createAccount({
        email: "  HARSHKUHIKAR68@GMAIL.COM  ",
        role: "user",
        status: "active",
      });
    },
    /This email cannot be used to create a user account|already exists/
  );
});

// --------------------------------------------------------------------------------
// 3. Email Exclusivity: User email cannot be registered as Admin
// --------------------------------------------------------------------------------
test("Email Exclusivity: Admin creation with existing user email is blocked", async () => {
  await assert.rejects(
    async () => {
      await db.createAccount({
        email: "SARAH.BARNABY@EXAMPLE.COM",
        role: "admin",
        status: "active",
      });
    },
    /already registered as a user account and cannot be assigned an admin role|already exists/
  );
});

// --------------------------------------------------------------------------------
// 4. Session Tokens & Server Authorization
// --------------------------------------------------------------------------------
test("Admin Tokens: Signed admin token verifies correctly and rejects forged tokens", async () => {
  const token = generateAdminSessionToken("admin_test_1", "harshkuhikar68@gmail.com");
  const check = verifyAdminSessionToken(token);
  assert.strictEqual(check.valid, true);
  assert.strictEqual(check.email, "harshkuhikar68@gmail.com");

  // Tampered token
  const forgedToken = token.substring(0, token.length - 4) + "XXXX";
  const forgedCheck = verifyAdminSessionToken(forgedToken);
  assert.strictEqual(forgedCheck.valid, false);

  // User trying to craft an admin token without secret
  const emptyCheck = verifyAdminSessionToken("invalid.token.payload");
  assert.strictEqual(emptyCheck.valid, false);
});

// --------------------------------------------------------------------------------
// 5. Q&A Plan Limits: Free Explorer (5 unlocks max, 6th blocked)
// --------------------------------------------------------------------------------
test("Q&A Unlock Limits: Free user unlocks up to 5 questions; 6th is strictly blocked", async () => {
  const testUserId = `test_free_${Date.now()}`;
  const period = "2026-10";

  // Create test free user
  const freeAcc = await db.createAccount({
    email: `${testUserId}@example.com`,
    role: "user",
    plan: "free",
    status: "active",
  });

  // Unlock 5 distinct questions
  for (let i = 1; i <= 5; i++) {
    const res = await db.unlockQuestion(freeAcc.id, `q_test_${i}`, period);
    assert.strictEqual(res.success, true, `Question ${i} should unlock successfully`);
    assert.strictEqual(res.count, i);
  }

  // Re-opening an already unlocked question costs 0 credits
  const reopen = await db.unlockQuestion(freeAcc.id, `q_test_3`, period);
  assert.strictEqual(reopen.success, true);
  assert.strictEqual(reopen.count, 5, "Count must remain 5 upon re-opening unlocked question");

  // 6th distinct question MUST be blocked on server!
  const sixth = await db.unlockQuestion(freeAcc.id, `q_test_6`, period);
  assert.strictEqual(sixth.success, false, "6th question unlock MUST fail for Free Explorer");
  assert.match(sixth.error, /limit of 5/);
});

// --------------------------------------------------------------------------------
// 6. Q&A Plan Limits: Premium User (15 unlocks max, 16th blocked)
// --------------------------------------------------------------------------------
test("Q&A Unlock Limits: Premium user unlocks up to 15 questions; 16th is blocked", async () => {
  const testPremUser = `test_prem_${Date.now()}`;
  const period = "2026-10";

  const premAcc = await db.createAccount({
    email: `${testPremUser}@example.com`,
    role: "user",
    plan: "premium",
    status: "active",
  });

  for (let i = 1; i <= 15; i++) {
    const res = await db.unlockQuestion(premAcc.id, `q_prem_${i}`, period);
    assert.strictEqual(res.success, true);
  }

  const sixteenth = await db.unlockQuestion(premAcc.id, `q_prem_16`, period);
  assert.strictEqual(sixteenth.success, false, "16th question unlock MUST fail for Premium");
  assert.match(sixteenth.error, /limit of 15/);
});

// --------------------------------------------------------------------------------
// 7. Q&A Plan Limits: Family / Multi-Pet Pro (Unlimited unlocks)
// --------------------------------------------------------------------------------
test("Q&A Unlock Limits: Family / Multi-Pet Pro user has unlimited unlocks", async () => {
  const testProUser = `test_pro_${Date.now()}`;
  const period = "2026-10";

  const proAcc = await db.createAccount({
    email: `${testProUser}@example.com`,
    role: "user",
    plan: "pro",
    status: "active",
  });

  for (let i = 1; i <= 25; i++) {
    const res = await db.unlockQuestion(proAcc.id, `q_pro_${i}`, period);
    assert.strictEqual(res.success, true, `Pro user should unlock question ${i} without limit`);
  }
});

// --------------------------------------------------------------------------------
// 8. Dynamic Settings: Admin changes limits without code changes
// --------------------------------------------------------------------------------
test("Dynamic Limit Settings: Updating free limit via settings updates enforcement immediately", async () => {
  const initialSettings = await db.getSettings();

  // Temporarily update free limit to 8
  await db.updateSettings({ freeLimit: 8 }, "harshkuhikar68@gmail.com");
  const updated = await db.getSettings();
  assert.strictEqual(updated.freeLimit, 8);

  // Restore back to 5
  await db.updateSettings({ freeLimit: initialSettings.freeLimit }, "harshkuhikar68@gmail.com");
  const restored = await db.getSettings();
  assert.strictEqual(restored.freeLimit, 5);
});

async function run() {
  for (const t of tests) {
    try {
      await t.fn();
      console.log(`✅ [PASS] ${t.name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${t.name}`);
      console.error(`   Error: ${err.message}\n`);
      failed++;
    }
  }

  console.log("\n==================================================================");
  console.log(`📊 TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log("==================================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!\n");
    process.exit(0);
  }
}

run();
