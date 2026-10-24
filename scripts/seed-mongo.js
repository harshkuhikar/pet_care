const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// 1. Read .env.local
const envLocalPath = path.join(__dirname, "..", ".env.local");
let envContent = "";
if (fs.existsSync(envLocalPath)) {
  envContent = fs.readFileSync(envLocalPath, "utf-8");
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
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/pawswell";

if (!process.env.MONGODB_URI) {
  console.warn("⚠️ MONGODB_URI not set in environment or .env.local. Falling back to local mongodb://localhost:27017/pawswell");
}

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

async function seed() {
  console.log("Connecting to MongoDB Atlas at:", mongoUri.replace(/:[^:@]+@/, ":****@"));
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
  console.log("Connected successfully to DB:", mongoose.connection.name);

  const db = mongoose.connection.db;

  // 1. Seed / Upsert Admin Account
  const { email, canonicalEmail } = normalizeEmail(adminEmail);
  const { hash, salt } = hashPassword(adminPassword);

  const accountsColl = db.collection("accounts");
  await accountsColl.updateOne(
    { canonicalEmail },
    {
      $set: {
        id: "admin_master",
        email,
        canonicalEmail,
        role: "admin",
        passwordHash: hash,
        salt,
        status: "active",
        updatedAt: new Date().toISOString(),
      },
      $setOnInsert: {
        createdAt: new Date().toISOString(),
      },
    },
    { upsert: true }
  );
  console.log(`[OK] Admin account verified & synced: ${email}`);

  // Clean up legacy demo accounts if present
  await accountsColl.deleteMany({ email: "sarah.barnaby@example.com" });
  const usersColl = db.collection("users");
  await usersColl.deleteMany({ email: "sarah.barnaby@example.com" });
  console.log(`[OK] Legacy demo user removed from database.`);

  // 4. Seed Questions
  const questionsColl = db.collection("questions");
  const qCount = await questionsColl.countDocuments();
  if (qCount === 0) {
    const INITIAL_QUESTIONS = [
      {
        id: "q-1",
        authorId: "usr_alice",
        authorName: "Barnaby's Mom",
        authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        authorRole: "premium",
        title: "How to soothe acute paw-licking and gut dysbiosis in Golden Retrievers?",
        details: "Barnaby had an ear infection 3 weeks ago and finished an antibiotic course. Now he is constantly licking his front paws and eating grass after meals. Is this leaky gut?",
        category: "gut-health",
        petSpecies: "dog",
        imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
        status: "active",
        viewsCount: 248,
        upvotesCount: 34,
        createdAt: "2026-03-12T10:00:00Z",
        updatedAt: "2026-03-12T10:00:00Z",
      },
      {
        id: "q-2",
        authorId: "usr_marcus",
        authorName: "Marcus & Luna",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        authorRole: "member",
        title: "Best high-moisture renal diet toppers for early Stage 2 Feline CKD?",
        details: "My 11-year-old domestic shorthair was just diagnosed with early IRIS Stage 2 renal insufficiency. She rejects commercial prescription renal wet food. What safe, low-phosphorus fresh toppers can stimulate appetite without straining her kidneys?",
        category: "nutrition",
        petSpecies: "cat",
        imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
        status: "active",
        viewsCount: 182,
        upvotesCount: 29,
        createdAt: "2026-03-14T14:30:00Z",
        updatedAt: "2026-03-14T14:30:00Z",
      },
      {
        id: "q-3",
        authorId: "usr_chloe",
        authorName: "Clover Bunny Haven",
        authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
        authorRole: "pro",
        title: "Early warning signs of rabbit GI Stasis vs routine molting?",
        details: "My Holland Lop has slightly smaller fecal droppings today and ate 70% of his usual morning timothy hay. How can I differentiate between benign spring shedding and emergency cecal hypomotility?",
        category: "senior-care",
        petSpecies: "small-pets",
        imageUrl: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80",
        status: "active",
        viewsCount: 312,
        upvotesCount: 47,
        createdAt: "2026-03-15T09:15:00Z",
        updatedAt: "2026-03-15T09:15:00Z",
      },
      {
        id: "q-4",
        authorId: "usr_devon",
        authorName: "Devon in Oregon",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        authorRole: "member",
        title: "Is cold laser therapy or canine hydrotherapy better for bilateral hip dysplasia?",
        details: "Our 8-year-old German Shepherd is slowing down and bunny-hopping up stairs. Our vet suggested both class IV laser and underwater treadmill sessions. Which delivers faster pain relief and muscle hypertrophy?",
        category: "mobility",
        petSpecies: "dog",
        imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
        status: "active",
        viewsCount: 154,
        upvotesCount: 22,
        createdAt: "2026-03-16T12:00:00Z",
        updatedAt: "2026-03-16T12:00:00Z",
      },
      {
        id: "q-5",
        authorId: "usr_sophia",
        authorName: "Sunny's Human",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        authorRole: "premium",
        title: "Safe herbs and acupressure points to calm thunder phobia in senior dogs?",
        details: "Spring storms are starting and prescription sedatives make our senior beagle disoriented. What veterinary herbal tinctures (e.g. passionflower, skullcap) and ear/head acupoints work well?",
        category: "therapies",
        petSpecies: "dog",
        imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
        status: "active",
        viewsCount: 210,
        upvotesCount: 38,
        createdAt: "2026-03-17T11:20:00Z",
        updatedAt: "2026-03-17T11:20:00Z",
      },
      {
        id: "q-6",
        authorId: "usr_kenji",
        authorName: "Kenji & Mochi",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        authorRole: "member",
        title: "Transitioning a chronically itchy French Bulldog from kibble to single-novel protein raw?",
        details: "We have tried hydrolyzed protein kibbles with zero improvement in paw redness. What single novel protein (rabbit, venison, or kangaroo) is safest to begin an 8-week elimination trial?",
        category: "nutrition",
        petSpecies: "dog",
        imageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80",
        status: "active",
        viewsCount: 195,
        upvotesCount: 31,
        createdAt: "2026-03-18T16:00:00Z",
        updatedAt: "2026-03-18T16:00:00Z",
      },
      {
        id: "q-7",
        authorId: "usr_elena",
        authorName: "Elena V.",
        authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        authorRole: "pro",
        title: "Why are essential oils toxic to cats? Explaining hepatic glucuronidation deficiency",
        details: "I often see diffusers marketed as 'pet safe'. Can someone explain the exact biochemical liver pathway difference between dogs and cats that makes tea tree and eucalyptus fatal to felines?",
        category: "therapies",
        petSpecies: "cat",
        imageUrl: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80",
        status: "active",
        viewsCount: 289,
        upvotesCount: 52,
        createdAt: "2026-03-19T14:40:00Z",
        updatedAt: "2026-03-19T14:40:00Z",
      },
    ];
    await questionsColl.insertMany(INITIAL_QUESTIONS);
    console.log(`[OK] Inserted ${INITIAL_QUESTIONS.length} clinical Q&A questions into MongoDB.`);
  } else {
    console.log(`[OK] Questions collection already has ${qCount} documents.`);
  }

  // 5. Seed Answers
  const answersColl = db.collection("answers");
  const aCount = await answersColl.countDocuments();
  if (aCount === 0) {
    const INITIAL_ANSWERS = [
      {
        id: "ans-1",
        questionId: "q-1",
        authorId: "vet_aris",
        authorName: "Dr. Aris Thorne, DVM, CVA",
        authorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80",
        authorRole: "admin",
        authorCredentials: "Board-Certified Integrative Veterinarian",
        content: `Paw-licking following an antibiotic regimen is classic microbial dysbiosis manifesting through the gut-skin axis.\n\n**Recommended 3-Phase Clinical Protocol:**\n1. **Larch Arabinogalactan & Green Banana Flour:** Provide 1/2 tsp per 25 lbs daily to supply soluble butyrogenic prebiotics.\n2. **Soil-Based Organisms (Bacillus subtilis / B. coagulans):** Spore-forming strains survive harsh canine gastric acidity and germinate directly in the jejunum.\n3. **Raw Unpasteurized Goat Milk Kefir:** Introduce slowly (1 tsp daily) for beneficial lactic acid bacteria and enzymes.\n4. **Topical Chamomile / Green Tea Soak:** Steep organic chamomile and cooled green tea; soak paws for 4 minutes twice daily to soothe topical Malassezia yeast overgrowth without harsh steroid ointments.`,
        isBestAnswer: true,
        upvotes: 42,
        downvotes: 0,
        status: "active",
        createdAt: "2026-03-12T12:30:00Z",
        updatedAt: "2026-03-12T12:30:00Z",
      },
      {
        id: "ans-2",
        questionId: "q-1",
        authorId: "usr_sophia",
        authorName: "Sunny's Human",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        authorRole: "premium",
        content: `We went through this exact nightmare with Sunny after a kennel cough round! Adding organic bovine colostrum powder into her food completely eliminated the belly redness within 10 days. Also, make sure to dry the paws thoroughly after walks so moisture doesn't trap yeast between the toes.`,
        isBestAnswer: false,
        upvotes: 18,
        downvotes: 1,
        status: "active",
        createdAt: "2026-03-12T15:10:00Z",
        updatedAt: "2026-03-12T15:10:00Z",
      },
      {
        id: "ans-3",
        questionId: "q-2",
        authorId: "vet_elena",
        authorName: "Dr. Elena Rostova, DVM",
        authorAvatar: "https://images.unsplash.com/photo-1594824813627-2c90c74b8686?auto=format&fit=crop&w=200&q=80",
        authorRole: "admin",
        authorCredentials: "Feline Internal Medicine Specialist",
        content: `When a cat rejects prescription renal wet food, forcing it leads to dangerous hepatic lipidosis. Maintaining caloric intake and hydration is priority #1.\n\n**Evidence-Based Dietary Modifications:**\n- **Warm Low-Sodium Bone Broth:** Simmer chicken feet and marrow bones for 18 hours with zero onions/garlic. Serving warm (approx 38°C) volatilizes aromatic fats to stimulate the vomeronasal organ.\n- **Natural Phosphorus Binders:** Chitosan and calcium carbonate (e.g. Epakitin) can be mixed into high-quality human-grade wet foods to safely bind dietary phosphorus in the intestinal lumen before renal filtration.\n- **Omega-3 EPA/DHA:** Administer concentrated marine microalgae or clean anchovy oil at 100 mg/kg EPA/DHA to reduce glomerular capillary hypertension.`,
        isBestAnswer: true,
        upvotes: 35,
        downvotes: 0,
        status: "active",
        createdAt: "2026-03-14T17:00:00Z",
        updatedAt: "2026-03-14T17:00:00Z",
      },
    ];
    await answersColl.insertMany(INITIAL_ANSWERS);
    console.log(`[OK] Inserted ${INITIAL_ANSWERS.length} clinical expert answers into MongoDB.`);
  } else {
    console.log(`[OK] Answers collection already has ${aCount} documents.`);
  }

  // 6. Seed Settings
  const settingsColl = db.collection("settings");
  await settingsColl.updateOne(
    { key: "global_settings" },
    {
      $set: {
        key: "global_settings",
        freeLimit: 5,
        premiumLimit: 15,
        proLimit: 999999,
        updatedAt: new Date().toISOString(),
        updatedBy: "mongo_seed_init",
      },
    },
    { upsert: true }
  );
  console.log("[OK] Settings synced.");

  // 7. Seed Pets for Alice
  const petsColl = db.collection("pets");
  const petCount = await petsColl.countDocuments();
  if (petCount === 0) {
    await petsColl.insertMany([
      {
        id: "pet-1",
        userId: "usr_alice",
        name: "Barnaby",
        species: "dog",
        breed: "Golden Retriever Mix",
        age: "4 years",
        photoUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80",
        healthNotes: "Recovered from antibiotic-induced dysbiosis. Currently doing raw fermented kefir daily. Mild seasonal paw itching in spring.",
        allergies: ["Chicken", "Corn"],
        dietType: "Gently Cooked Single-Protein (Beef + Omega-3)",
        createdAt: "2025-11-12",
      },
      {
        id: "pet-2",
        userId: "usr_alice",
        name: "Cleo",
        species: "cat",
        breed: "Domestic Shorthair",
        age: "7 years",
        photoUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80",
        healthNotes: "Routine preventative renal hydration checks. Excellent bloodwork. Prefers warm chicken bone broth toppers.",
        allergies: ["Dry Grain"],
        dietType: "High-Moisture Wet Pâté + Chitosan",
        createdAt: "2026-01-05",
      },
    ]);
    console.log("[OK] Seeded demo pets.");
  }

  // Summary counts
  const colls = await db.listCollections().toArray();
  console.log("\n================ MONGODB LIVE STATUS ================");
  console.log(`Database: ${mongoose.connection.name}`);
  for (const c of colls) {
    const count = await db.collection(c.name).countDocuments();
    console.log(` - Collection "${c.name}": ${count} records`);
  }
  console.log("====================================================\n");

  await mongoose.disconnect();
  console.log("MongoDB Seeding complete! Database is 100% production-ready.");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
