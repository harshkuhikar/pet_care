import { Article, Partner, PetWallPhoto, ForumCategory, ForumThread, MembershipPlan, NewsletterIssue } from "@/types";

export const SEED_PLANS: MembershipPlan[] = [
  {
    id: "free",
    name: "Free Explorer",
    badge: "Always Free",
    priceMonthly: 0,
    priceYearly: 0,
    description: "Essential weekly pet longevity insights and full access to share your darling companions on the Pet Wall.",
    features: [
      "Weekly 'PawsWell Sunday Dispatch' newsletter",
      "Access to 35+ free foundational health guides",
      "Post photos on the public Pet Wall",
      "Read all Community Forum discussions",
      "Standard bookmarking (up to 5 articles)",
    ],
    popular: false,
    color: "bg-white",
    accentColor: "#00F5D4",
  },
  {
    id: "premium",
    name: "PawsWell Premium",
    badge: "Most Popular • Save 20%",
    priceMonthly: 12,
    priceYearly: 115,
    description: "Unlimited deep-dive integrative vet protocols, custom nutrition recipes, audio guides, and live monthly expert Q&As.",
    features: [
      "Everything in Free, plus:",
      "Full access to 350+ vet-reviewed protocols & recipes",
      "Downloadable Longevity & Elimination Diet PDFs",
      "Monthly Live Q&A with holistic vets & clinical nutritionists",
      "Active posting & replying in private Member Forum",
      "Exclusive 15% - 30% discounts across all Partner Brands",
      "Ad-light, distraction-free reading experience",
      "Unlimited article collections & health bookmarks",
    ],
    popular: true,
    color: "bg-[#FFF0F3]",
    accentColor: "#FF4D6D",
  },
  {
    id: "pro",
    name: "Family / Multi-Pet Pro",
    badge: "Best for Multi-Pet Homes",
    priceMonthly: 24,
    priceYearly: 230,
    description: "Holistic health management for households with multiple pets, personalized monthly checklists, and priority support.",
    features: [
      "Everything in Premium, plus:",
      "Unlimited pet health tracking profiles (dogs, cats, small pets)",
      "Personalized Monthly Seasonal Care Checklist for each pet",
      "Early beta access to new therapeutic research & case studies",
      "VIP 35% partner codes & exclusive quarterly sample boxes",
      "Priority forum highlight & fast-track vet Q&A submission",
      "Share membership with up to 4 family members",
    ],
    popular: false,
    color: "bg-[#F5EDFF]",
    accentColor: "#7928CA",
  },
];

export const SEED_PARTNERS: Partner[] = [
  {
    id: "p1",
    name: "RawBelly Fresh Organics",
    logo: "🥩",
    category: "Fresh Food",
    description: "Human-grade, pasture-raised raw & gently cooked meals formulated by board-certified veterinary nutritionists.",
    websiteUrl: "https://example.com/rawbelly",
    discountCode: "PAWSWELL20",
    discountPercent: "20% OFF",
    exclusivePerk: "Free bone broth pouch with your first trial box",
    isSponsored: true,
    isFeatured: true,
  },
  {
    id: "p2",
    name: "FungiTail Functional Mushrooms",
    logo: "🍄",
    category: "Supplements",
    description: "USDA Organic Lion's Mane, Turkey Tail, and Reishi liquid extracts designed for canine & feline immune support.",
    websiteUrl: "https://example.com/fungitail",
    discountCode: "WELLSHROOM",
    discountPercent: "25% OFF",
    exclusivePerk: "Complimentary dosage pipette & protocol guide",
    isSponsored: true,
    isFeatured: true,
  },
  {
    id: "p3",
    name: "K9 Zen Botanicals",
    logo: "🌿",
    category: "Aromatherapy",
    description: "Veterinarian-formulated calming mists, organic chamomile tinctures, and non-drowsy herbal recovery salves.",
    websiteUrl: "https://example.com/k9zen",
    discountCode: "PAWSZEN15",
    discountPercent: "15% OFF",
    exclusivePerk: "Free organic travel roller on orders $40+",
    isSponsored: false,
    isFeatured: false,
  },
  {
    id: "p4",
    name: "BiomePet Gut Diagnostics",
    logo: "🔬",
    category: "Testing & DNA",
    description: "Comprehensive home stool microbiome sequencing kit revealing hidden dysbiosis and food sensitivities.",
    websiteUrl: "https://example.com/biomepet",
    discountCode: "GUTCHECK30",
    discountPercent: "30% OFF",
    exclusivePerk: "Includes a 15-min clinical report consult",
    isSponsored: true,
    isFeatured: true,
  },
  {
    id: "p5",
    name: "Pawsitive Motion Mobility Harnesses",
    logo: "🦮",
    category: "Holistic Gear",
    description: "Ergonomic, physical-therapist approved support slings, non-slip booties, and hip support harnesses for senior companions.",
    websiteUrl: "https://example.com/pawsitivemotion",
    discountCode: "MOVEFREE",
    discountPercent: "15% OFF",
    exclusivePerk: "Lifetime guarantee on heavy-duty stitching",
    isSponsored: false,
    isFeatured: false,
  },
  {
    id: "p6",
    name: "MeadowHaven Small Animal Herbs",
    logo: "🌾",
    category: "Supplements",
    description: "Pesticide-free 3rd-cut timothy hay mixes, botanical forage rings, and digestive papaya enzymes for rabbits & guinea pigs.",
    websiteUrl: "https://example.com/meadowhaven",
    discountCode: "HOPPY15",
    discountPercent: "15% OFF",
    exclusivePerk: "Free botanical meadow sampler bag",
    isSponsored: false,
    isFeatured: false,
  },
];

export const SEED_PET_WALL: PetWallPhoto[] = [
  {
    id: "pw1",
    userId: "usr_alice",
    ownerDisplayName: "Barnaby's Mom",
    imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
    aspectRatio: "portrait",
    status: "approved",
    createdAt: "2026-03-12T10:30:00Z",
    likesCount: 142,
    reportedCount: 0,
    rotationDeg: -2,
  },
  {
    id: "pw2",
    userId: "usr_marcus",
    ownerDisplayName: "Marcus & Luna",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    aspectRatio: "square",
    status: "approved",
    createdAt: "2026-03-13T14:15:00Z",
    likesCount: 98,
    reportedCount: 0,
    rotationDeg: 3,
  },
  {
    id: "pw3",
    userId: "usr_chloe",
    ownerDisplayName: "Clover Bunny Haven",
    imageUrl: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80",
    aspectRatio: "portrait",
    status: "approved",
    createdAt: "2026-03-14T09:00:00Z",
    likesCount: 175,
    reportedCount: 0,
    rotationDeg: -1,
  },
  {
    id: "pw4",
    userId: "usr_devon",
    ownerDisplayName: "Devon in Oregon",
    imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
    aspectRatio: "landscape",
    status: "approved",
    createdAt: "2026-03-14T16:20:00Z",
    likesCount: 84,
    reportedCount: 0,
    rotationDeg: 2,
  },
  {
    id: "pw5",
    userId: "usr_sophia",
    ownerDisplayName: "Sunny's Human",
    imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
    aspectRatio: "portrait",
    status: "approved",
    createdAt: "2026-03-15T11:45:00Z",
    likesCount: 211,
    reportedCount: 0,
    rotationDeg: -3,
  },
  {
    id: "pw6",
    userId: "usr_kenji",
    ownerDisplayName: "Kenji & Mochi",
    imageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80",
    aspectRatio: "square",
    status: "approved",
    createdAt: "2026-03-16T08:30:00Z",
    likesCount: 164,
    reportedCount: 0,
    rotationDeg: 1,
  },
  {
    id: "pw7",
    userId: "usr_elena",
    ownerDisplayName: "Elena V.",
    imageUrl: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80",
    aspectRatio: "portrait",
    status: "approved",
    createdAt: "2026-03-16T18:00:00Z",
    likesCount: 129,
    reportedCount: 0,
    rotationDeg: -2,
  },
  {
    id: "pw8",
    userId: "usr_tariq",
    ownerDisplayName: "Tariq P.",
    imageUrl: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80",
    aspectRatio: "landscape",
    status: "approved",
    createdAt: "2026-03-17T13:10:00Z",
    likesCount: 92,
    reportedCount: 0,
    rotationDeg: 3,
  },
  {
    id: "pw9",
    userId: "usr_rachel",
    ownerDisplayName: "Birdie Whispers",
    imageUrl: "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=800&q=80",
    aspectRatio: "portrait",
    status: "approved",
    createdAt: "2026-03-17T17:40:00Z",
    likesCount: 153,
    reportedCount: 0,
    rotationDeg: -1,
  },
  {
    id: "pw10",
    userId: "usr_liam",
    ownerDisplayName: "Liam & Copper",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
    aspectRatio: "square",
    status: "approved",
    createdAt: "2026-03-18T10:05:00Z",
    likesCount: 187,
    reportedCount: 0,
    rotationDeg: 2,
  },
  {
    id: "pw11",
    userId: "usr_amara",
    ownerDisplayName: "Amara G.",
    imageUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80",
    aspectRatio: "portrait",
    status: "approved",
    createdAt: "2026-03-18T15:20:00Z",
    likesCount: 230,
    reportedCount: 0,
    rotationDeg: -3,
  },
  {
    id: "pw12",
    userId: "usr_zane",
    ownerDisplayName: "Zane the Rescue Dad",
    imageUrl: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80",
    aspectRatio: "landscape",
    status: "approved",
    createdAt: "2026-03-19T07:50:00Z",
    likesCount: 110,
    reportedCount: 0,
    rotationDeg: 1,
  },
  {
    id: "pw13",
    userId: "usr_jenna",
    ownerDisplayName: "Jenna & Pip",
    imageUrl: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=800&q=80",
    aspectRatio: "portrait",
    status: "approved",
    createdAt: "2026-03-19T12:00:00Z",
    likesCount: 145,
    reportedCount: 0,
    rotationDeg: -2,
  },
  {
    id: "pw14",
    userId: "usr_oscar",
    ownerDisplayName: "Oscar & Buster",
    imageUrl: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80",
    aspectRatio: "square",
    status: "approved",
    createdAt: "2026-03-19T19:40:00Z",
    likesCount: 99,
    reportedCount: 0,
    rotationDeg: 2,
  },
  {
    id: "pw15",
    userId: "usr_maya",
    ownerDisplayName: "Maya's Gentle Pack",
    imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
    aspectRatio: "portrait",
    status: "approved",
    createdAt: "2026-03-20T08:15:00Z",
    likesCount: 204,
    reportedCount: 0,
    rotationDeg: -1,
  },
  {
    id: "pw16",
    userId: "usr_felix",
    ownerDisplayName: "Felix & Whiskers",
    imageUrl: "https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=800&q=80",
    aspectRatio: "landscape",
    status: "approved",
    createdAt: "2026-03-20T11:22:00Z",
    likesCount: 88,
    reportedCount: 0,
    rotationDeg: 3,
  },
  {
    id: "pw17",
    userId: "usr_priya",
    ownerDisplayName: "Priya P.",
    imageUrl: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=800&q=80",
    aspectRatio: "portrait",
    status: "approved",
    createdAt: "2026-03-20T16:50:00Z",
    likesCount: 167,
    reportedCount: 0,
    rotationDeg: -2,
  },
  {
    id: "pw18",
    userId: "usr_greg",
    ownerDisplayName: "Captain Greg",
    imageUrl: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=800&q=80",
    aspectRatio: "square",
    status: "approved",
    createdAt: "2026-03-21T09:12:00Z",
    likesCount: 121,
    reportedCount: 0,
    rotationDeg: 1,
  },
  {
    id: "pw19",
    userId: "usr_clara",
    ownerDisplayName: "Clara's Sanctuary",
    imageUrl: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80",
    aspectRatio: "portrait",
    status: "approved",
    createdAt: "2026-03-21T14:30:00Z",
    likesCount: 312,
    reportedCount: 0,
    rotationDeg: -3,
  },
  {
    id: "pw20",
    userId: "usr_dante",
    ownerDisplayName: "Dante & Ziggy",
    imageUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80",
    aspectRatio: "landscape",
    status: "approved",
    createdAt: "2026-03-21T18:10:00Z",
    likesCount: 140,
    reportedCount: 0,
    rotationDeg: 2,
  },
];

export const SEED_ARTICLES: Article[] = [
  // 1. NUTRITION (Free)
  {
    id: "art-nutr-1",
    slug: "healing-canine-gut-dysbiosis-microbiome-guide",
    title: "Healing the Canine Gut: How to Rebalance the Microbiome After Antibiotics",
    excerpt: "Discover the 4-step holistic gut reset protocol combining fermented kefir, soil-based organisms, and medicinal mushroom beta-glucans to restore digestion.",
    coverImage: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=900&q=80",
    author: {
      name: "Dr. Aris Thorne, DVM, CVA",
      title: "Integrative Veterinarian & Microbiome Specialist",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80",
    },
    topic: "nutrition",
    petType: "dog",
    isPremium: false,
    readingTime: "7 min read",
    vetReviewed: true,
    vetName: "Dr. Aris Thorne, DVM",
    publishedAt: "2026-03-10",
    tags: ["Gut Health", "Microbiome", "Probiotics", "Antibiotic Recovery"],
    featured: true,
    likesCount: 342,
    tableOfContents: [
      { id: "what-is-dysbiosis", title: "What Happens in the Canine Gut Post-Antibiotics?" },
      { id: "symptoms", title: "Subtle Signs Your Dog's Microbiome is Out of Balance" },
      { id: "step-1-prebiotics", title: "Step 1: Feeding the Good Microbes with Inulin & Acacia" },
      { id: "step-2-probiotics", title: "Step 2: Soil-Based Organisms vs. Dairy Kefir" },
      { id: "step-3-mucosal-lining", title: "Step 3: Sealing the Gut Lining with L-Glutamine & Bone Broth" },
      { id: "meal-recipe", title: "Simple 3-Ingredient Soothing Gut Slurry Recipe" },
    ],
    content: `
## What Happens in the Canine Gut Post-Antibiotics?
Broad-spectrum antibiotics are life-saving tools when fighting acute bacterial infections. However, their mechanism does not discriminate between pathogenic bacteria and the commensal colonies that regulate over 70% of your dog's immune response. Studies demonstrate that a single 10-day course of cephalexin or amoxicillin can reduce gut microbial diversity by up to 45% for up to six months if not actively repopulated.

## Subtle Signs Your Dog's Microbiome is Out of Balance
- Soft, unformed stools or episodic mucus coating
- Intermittent paw-licking and belly itchiness (often mistaken for environmental allergies)
- Acid reflux, lip-smacking after meals, or grass consumption
- Behavioral shifts, including increased reactivity or mild lethargy

## Step 1: Feeding the Good Microbes with Inulin & Acacia
Before dumping billions of CFU probiotics into an inflamed digestive tract, we must provide soluble fiber substrates. Prebiotics like larch arabinogalactan, organic green banana flour, and dandelion greens nourish beneficial Bifidobacteria and generate short-chain fatty acids (SCFAs) like butyrate, which fuel colonocytes.

## Step 2: Soil-Based Organisms vs. Dairy Kefir
Traditional Lactobacillus acidophilus strains struggle to survive high stomach acid environments in dogs (pH 1.5 - 2.0). Spore-forming Bacillus subtilis and Bacillus coagulans naturally encapsulate themselves until reaching the alkaline small intestine. Adding 1 teaspoon of raw goat milk kefir per 20 lbs provides natural lactic enzymes without lactose sensitivity.

## Step 3: Sealing the Gut Lining with L-Glutamine & Bone Broth
To prevent systemic endotoxemia (leaky gut), incorporate grass-fed bovine colostrum and slow-simmered knuckle bone broth rich in glycine and proline. This rebuilds the glycosaminoglycan (GAG) protective layer within 3 to 4 weeks.
    `,
  },

  // 2. NUTRITION (Premium)
  {
    id: "art-nutr-2",
    slug: "feline-chronic-kidney-disease-anti-inflammatory-diet",
    title: "The Integrative Renal Protocol: Slowing Feline CKD Progression Naturally",
    excerpt: "Evidence-based moisture balance, phosphorus binding without pharmaceutical taste aversion, and omega-3 EPA/DHA dosing tailored for aging cats.",
    coverImage: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80",
    author: {
      name: "Dr. Elena Rostova, DVM",
      title: "Board Certified Feline Specialist & Holistic Practitioner",
      avatar: "https://images.unsplash.com/photo-1594824813627-2c90c74b8686?auto=format&fit=crop&w=200&q=80",
    },
    topic: "nutrition",
    petType: "cat",
    isPremium: true,
    readingTime: "11 min read",
    vetReviewed: true,
    vetName: "Dr. Elena Rostova, DVM",
    publishedAt: "2026-03-08",
    tags: ["Kidney Health", "Feline Wellness", "Renal Diet", "Longevity"],
    likesCount: 520,
    tableOfContents: [
      { id: "ckd-misconceptions", title: "The Myth of Ultra-Low Protein in Stage 1 & 2 CKD" },
      { id: "phosphorus-balance", title: "Targeting Phosphorus: The Real Culprit" },
      { id: "natural-binders", title: "Natural Phosphorus Binders: Chitosan & Calcium Carbonate" },
      { id: "hydration-tricks", title: "Creative Hydration Strategies for Stubborn Felines" },
      { id: "downloadable-meal-plan", title: "Printable Renal Wet Food Transition Formula" },
    ],
    content: `
## The Myth of Ultra-Low Protein in Stage 1 & 2 CKD
For decades, conventional veterinary advice defaulted to severely restricting protein at the first elevation of SDMA or creatinine. Modern feline nephrology reveals this frequently induces sarcopenia (muscle wasting) before renal compromise becomes life-threatening. What aging felines truly require is high-biological-value protein accompanied by strict phosphorus moderation.

## Targeting Phosphorus: The Real Culprit
Elevated serum phosphorus accelerates nephron destruction through renal secondary hyperparathyroidism. Selecting cuts of egg whites, turkey breast, and bone-free poached proteins maintains amino acid density while keeping phosphorus levels below 0.5% dry matter.

## Natural Phosphorus Binders: Chitosan & Calcium Carbonate
When whole foods cannot bring phosphorus into safe ranges, gentle marine-derived chitosan binds dietary phosphates in the intestinal lumen, safely excreting them before systemic absorption.

## Creative Hydration Strategies for Stubborn Felines
Cats evolved in arid climates with minimal innate thirst drive; their kidneys depend on moisture from food (70-80% hydration). Try warming unsalted chicken foot broth to 101°F to mimic fresh body temperature prey!
    `,
  },

  // 3. NUTRITION (Free)
  {
    id: "art-nutr-3",
    slug: "safe-superfoods-dogs-can-eat-daily",
    title: "10 Vibrant Superfoods You Can Safely Add to Your Dog's Bowl Today",
    excerpt: "From wild blueberries and lightly steamed broccoli sprouts to sardines and medicinal bone broth, supercharge dry kibble or fresh food in seconds.",
    coverImage: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80",
    author: {
      name: "Camille Beauchamp, MS",
      title: "Animal Nutrition Scientist & Canine Herbalist",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    },
    topic: "nutrition",
    petType: "dog",
    isPremium: false,
    readingTime: "5 min read",
    vetReviewed: true,
    vetName: "Dr. Marcus Vance, DVM",
    publishedAt: "2026-03-05",
    tags: ["Superfoods", "Longevity", "Bowl Boosters", "Antioxidants"],
    likesCount: 289,
    tableOfContents: [
      { id: "why-bowl-boosters", title: "Why Even Kibble Needs Living Phytonutrients" },
      { id: "top-5-fruits-veggies", title: "Top 5 Antioxidant Powerhouses" },
      { id: "healthy-fats", title: "Sardines & Omega-3s for Brain Health" },
      { id: "daily-dosage-chart", title: "Serving Size Guide by Dog Weight" },
    ],
    content: `
## Why Even Kibble Needs Living Phytonutrients
Extrusion cooking exposes dry pet foods to temperatures upwards of 280°F, depleting heat-sensitive enzymes, carotenoids, and delicate antioxidants. Adding just 15-20% fresh whole foods has been shown in Purdue University studies to dramatically reduce chronic inflammatory markers.

## Top 5 Antioxidant Powerhouses
1. **Wild Blueberries**: Loaded with anthocyanins that cross the blood-brain barrier to protect cognitive function in senior dogs.
2. **Steamed Broccoli Sprouts**: Containing up to 50 times more sulforaphane than mature broccoli, activating the cellular Nrf2 detox pathway.
3. **Shiitake & Maitake Mushrooms**: Simmered gently to break down chitin and deliver immune-priming beta-glucans.
4. **Pure Pumpkin Purée**: Loaded with soluble prebiotic fiber to normalize both diarrhea and constipation.
5. **Fresh Parsley & Mint**: Natural breath freshers packed with chlorophyll and lutein.
    `,
  },

  // 4. NUTRITION (Premium)
  {
    id: "art-nutr-4",
    slug: "rabbit-gi-stasis-botanical-forage-prevention",
    title: "Preventing Rabbit GI Stasis: The Botanical Forage & Fiber Protocol",
    excerpt: "A deep clinical dive into lagomorph cecotrophy, micro-motility herbs, and the dangerous triggers hiding in commercial pellets.",
    coverImage: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=900&q=80",
    author: {
      name: "Dr. Lilian Ward, MRCVS",
      title: "Exotic & Lagomorph Specialist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    },
    topic: "nutrition",
    petType: "rabbit",
    isPremium: true,
    readingTime: "9 min read",
    vetReviewed: true,
    vetName: "Dr. Lilian Ward, MRCVS",
    publishedAt: "2026-03-02",
    tags: ["Rabbit Health", "GI Stasis", "Herbal Foraging", "Exotics"],
    likesCount: 198,
    tableOfContents: [
      { id: "the-fragile-lagomorph-gut", title: "The Unique Anatomy of Hindgut Fermenters" },
      { id: "early-warning-signs", title: "Recognizing Stasis 12 Hours Before Refusal to Eat" },
      { id: "motility-herbs", title: "Herbal Motility Boosters: Fennel, Mint, Dandelion" },
      { id: "emergency-kit", title: "Building an At-Home Rabbit Emergency Recovery Kit" },
    ],
    content: `
## The Unique Anatomy of Hindgut Fermenters
Rabbits are obligate herbivores with a colossal cecum containing specialized anaerobic microbes that ferment indigestible plant fiber. If peristalsis slows for even 6-12 hours, opportunistic bacteria proliferate, producing gas, excruciating pain, and dangerous shock.

## Recognizing Stasis 12 Hours Before Refusal to Eat
- Teeny, dark, misshapen, or strung-together fecal pellets
- Sitting in a hunched "meatloaf" position with teeth grinding (bruxism)
- Cool ears indicating peripheral vasoconstriction due to systemic stress
- Hesitation during morning greens time

## Herbal Motility Boosters
Feeding diverse wild plants such as ribwort plantain, fresh dill, raspberry leaf, and marigold encourages voluntary foraging while reducing intestinal gas spasms naturally.
    `,
  },

  // 5. EXERCISE (Free)
  {
    id: "art-ex-1",
    slug: "senior-dog-mobility-low-impact-conditioning",
    title: "5 Gentle Exercises That Protect Senior Dog Joints & Rebuild Muscle",
    excerpt: "Help your aging pup stand up effortlessly without high-impact stress. Physical therapist-approved balance cushions, cavaletti poles, and weight shifting.",
    coverImage: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80",
    author: {
      name: "Travis Sterling, CCRP",
      title: "Certified Canine Rehabilitation Practitioner",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
    topic: "exercise",
    petType: "dog",
    isPremium: false,
    readingTime: "6 min read",
    vetReviewed: true,
    vetName: "Dr. Aris Thorne, DVM",
    publishedAt: "2026-03-01",
    tags: ["Senior Dogs", "Mobility", "Rehab", "Joint Care"],
    featured: true,
    likesCount: 461,
    tableOfContents: [
      { id: "loss-of-hind-end", title: "Why Senior Dogs Lose Hind Limb Power First" },
      { id: "exercise-1", title: "1. The Kitchen Counter Weight Shift" },
      { id: "exercise-2", title: "2. Low-Elevation Cavaletti Stepping" },
      { id: "exercise-3", title: "3. Sit-to-Stand 'Puppy Squats'" },
      { id: "equipment", title: "Non-Slip Flooring: The Most Overlooked Mobility Aid" },
    ],
    content: `
## Why Senior Dogs Lose Hind Limb Power First
Canine proprioception (the nervous system's spatial awareness of limb positioning) degrades with spinal spondylosis and hip osteoarthritis. Dogs naturally compensate by shifting 70% of their mass forward onto their shoulders, causing atrophy in the hamstrings and gluteals.

## 1. The Kitchen Counter Weight Shift
Stand your dog square on a textured yoga mat. Gently place one hand on their right hip and apply light 5-second lateral pressure, encouraging them to contract the opposing gluteal muscles to stay balanced. Repeat 5 times each side.

## 2. Low-Elevation Cavaletti Stepping
Lay 4 broomsticks across yoga blocks raised just 2 inches from the floor, spaced one dog-stride apart. Walking over poles forces conscious flexion of the hocks and stifle joints, improving range of motion without concussive impact.

## 3. Sit-to-Stand 'Puppy Squats'
Using a healthy treat, ask for a sit, then immediately step forward to invite a standing posture before the dog settles back on their haunches. Aim for 3-5 reps twice daily.
    `,
  },

  // 6. EXERCISE (Premium)
  {
    id: "art-ex-2",
    slug: "canine-hydrotherapy-underwater-treadmill-recovery",
    title: "Hydrotherapy Mastery: When Warm Water Heals Spinal & Orthopedic Injuries",
    excerpt: "Buoyancy physics, water temperature guidelines (88-92°F), and tailored protocols for IVDD, cruciate tears, and hip dysplasia.",
    coverImage: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=900&q=80",
    author: {
      name: "Travis Sterling, CCRP",
      title: "Certified Canine Rehabilitation Practitioner",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
    topic: "exercise",
    petType: "dog",
    isPremium: true,
    readingTime: "10 min read",
    vetReviewed: true,
    vetName: "Dr. Marcus Vance, DVM",
    publishedAt: "2026-02-26",
    tags: ["Hydrotherapy", "IVDD", "Orthopedics", "Rehab"],
    likesCount: 380,
    tableOfContents: [
      { id: "hydro-physics", title: "Hydrostatic Pressure & Buoyancy Explained" },
      { id: "water-level-matrix", title: "Determining Optimal Water Depth for Specific Conditions" },
      { id: "contraindications", title: "When Hydrotherapy is Strictly Dangerous" },
      { id: "home-bathtub-hacks", title: "Safe Warm-Water Exercises You Can Do in Your Home Tub" },
    ],
    content: `
## Hydrostatic Pressure & Buoyancy Explained
When immersed in water up to the greater trochanter, a dog experiences an 62% reduction in weight-bearing load. This allows arthritic joints to move through therapeutic ranges without painful friction. Simultaneously, hydrostatic pressure provides mild circumferential compression that reduces peripheral edema in post-operative limbs.

## Determining Optimal Water Depth for Specific Conditions
- **Elbow Dysplasia**: Water at mid-chest level encourages maximum extension while keeping foot strike light.
- **IVDD (Intervertebral Disc Disease)**: High water level (shoulder height) unweights the axial spine, enabling neuro-reeducation without compression.
    `,
  },

  // 7. EXERCISE (Free)
  {
    id: "art-ex-3",
    slug: "feline-agility-enrichment-preventing-indoor-depression",
    title: "Indoor Cat Enrichment: Vertical Superhighways & Predatory Play Routines",
    excerpt: "Turn your living room into an instinctual wonderland. Reduce feline behavioral aggression, obesity, and midnight zoomies with 15 minutes of structured play.",
    coverImage: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=80",
    author: {
      name: "Samantha Yue, KPA-CTP",
      title: "Feline Behavior Consultant & Animal Enrichment Designer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    topic: "exercise",
    petType: "cat",
    isPremium: false,
    readingTime: "6 min read",
    vetReviewed: true,
    vetName: "Dr. Elena Rostova, DVM",
    publishedAt: "2026-02-22",
    tags: ["Cat Behavior", "Enrichment", "Mental Fitness", "Play Therapy"],
    likesCount: 310,
    tableOfContents: [
      { id: "the-indoor-predator", title: "The Biological Cost of an Under-Stimulated Cat" },
      { id: "predatory-cycle", title: "Mastering the Stalk-Pounce-Kill-Eat Sequence" },
      { id: "vertical-territory", title: "Creating Continuous Cat Superhighways" },
      { id: "scent-puzzles", title: "Olfactory Enrichment Beyond Simple Catnip" },
    ],
    content: `
## The Biological Cost of an Under-Stimulated Cat
A house cat retains virtually unchanged genetic blueprints from their African wildcat ancestor (Felis lybica). Deprived of hunting opportunities, bored felines channel pent-up neurotransmitters into over-grooming, nocturnal screaming, or territorial aggression toward other household pets.

## Mastering the Stalk-Pounce-Kill-Eat Sequence
Laser pointers often trigger frustration because the cat never makes tactile contact with the "prey". Instead, finish any wand toy session with a physical kicker toy, followed immediately by a small, protein-rich treat to trigger dopamine satiety.
    `,
  },

  // 8. EXERCISE (Premium)
  {
    id: "art-ex-4",
    slug: "canine-fitness-balance-proprioception-drills",
    title: "Canine Core Stability: Balance Disc & Incline Training for Agility & Longevity",
    excerpt: "Advanced neuromuscular training using peanut balls, wobble boards, and core tilts to bulletproof your active dog against soft-tissue sports injuries.",
    coverImage: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80",
    author: {
      name: "Travis Sterling, CCRP",
      title: "Certified Canine Rehabilitation Practitioner",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
    topic: "exercise",
    petType: "dog",
    isPremium: true,
    readingTime: "8 min read",
    vetReviewed: true,
    vetName: "Dr. Marcus Vance, DVM",
    publishedAt: "2026-02-18",
    tags: ["Conditioning", "Proprioception", "Injury Prevention", "Agility"],
    likesCount: 275,
    tableOfContents: [
      { id: "core-anatomy", title: "The Canine Core: Iliopsoas, Epaxials, and Abdominals" },
      { id: "warmup-protocol", title: "5-Minute Dynamic Warmup Before Running or Ball Throwing" },
      { id: "balance-disc-drills", title: "Step-by-Step Balance Disc Progressions" },
      { id: "cooldown-stretches", title: "Safe Cool-Down Stretches for Hip Flexors" },
    ],
    content: `
## The Canine Core: Iliopsoas, Epaxials, and Abdominals
A dog's spine is suspended horizontally between four pillars. The deep stabilizer muscles surrounding the vertebrae prevent micro-subluxations during sudden sprint stops and turns. Conditioning these stabilizers on unstable foam surfaces quadruples their firing rate.
    `,
  },

  // 9. THERAPIES (Free)
  {
    id: "art-ther-1",
    slug: "veterinary-acupuncture-how-it-works-science",
    title: "Veterinary Acupuncture Explained: The Neurobiology Behind the Needles",
    excerpt: "Demystifying TCVM (Traditional Chinese Veterinary Medicine). How micro-currents stimulate endorphins, modulate the vagus nerve, and reduce chronic arthritis pain.",
    coverImage: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=900&q=80",
    author: {
      name: "Dr. Aris Thorne, DVM, CVA",
      title: "Integrative Veterinarian & Microbiome Specialist",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80",
    },
    topic: "acupuncture",
    petType: "dog",
    isPremium: false,
    readingTime: "7 min read",
    vetReviewed: true,
    vetName: "Dr. Aris Thorne, DVM, CVA",
    publishedAt: "2026-02-15",
    tags: ["Acupuncture", "TCVM", "Pain Management", "Alternative Medicine"],
    featured: true,
    likesCount: 512,
    tableOfContents: [
      { id: "what-is-vet-acupuncture", title: "Beyond Mysticism: The Western Neurobiological Mechanism" },
      { id: "common-points", title: "Key Acupoints: Bai Hui, ST-36, and BL-23" },
      { id: "what-to-expect", title: "What a Typical Treatment Session Looks Like" },
      { id: "do-pets-tolerate-it", title: "Do Dogs and Cats Really Tolerate Needles?" },
      { id: "laser-acupuncture", title: "Needleless Laser Acupuncture for Sensitive Pets" },
    ],
    content: `
## Beyond Mysticism: The Western Neurobiological Mechanism
While classical acupuncture describes the flow of 'Qi' along meridians, modern neuroimaging demonstrates that inserting fine filiform needles triggers local axonal reflexes. This stimulates the release of beta-endorphins, serotonin, and substance P within the dorsal horn of the spinal cord, effectively dampening chronic pain signals.

## Common Key Acupoints
- **Bai Hui ('Hundred Meetings')**: Located at the lumbosacral junction; potent for hind end weakness and calming anxiety.
- **ST-36 (Zusanli)**: Below the stifle joint; renowned for boosting immune resilience and stimulating appetite.
- **BL-23 (Shenshu)**: Flanking the lumbar spine; tonifies kidney energetics and alleviates lower back stiffness.

## Do Dogs and Cats Really Tolerate Needles?
Surprising to first-time guardians, over 85% of animals deeply relax within 10 minutes of needle placement. Many will sink onto plush bedding and drift into REM sleep as natural endorphins circulate.
    `,
  },

  // 10. THERAPIES (Premium)
  {
    id: "art-ther-2",
    slug: "canine-herbal-materia-medica-anti-inflammatory-tinctures",
    title: "The Holistic Pet Herbal Materia Medica: Safe Tinctures for Pain & Vitality",
    excerpt: "Boswellia serrata, Devil's Claw, Turmeric phytosome, and Hawthorn berry. Detailed dosages, contraindications, and drug-herb interaction checks.",
    coverImage: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=900&q=80",
    author: {
      name: "Dr. Lilian Ward, MRCVS",
      title: "Exotic & Lagomorph Specialist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    },
    topic: "herbal",
    petType: "dog",
    isPremium: true,
    readingTime: "12 min read",
    vetReviewed: true,
    vetName: "Dr. Aris Thorne, DVM, CVA",
    publishedAt: "2026-02-10",
    tags: ["Herbal Medicine", "Natural Pain Relief", "Tinctures", "Botanicals"],
    likesCount: 420,
    tableOfContents: [
      { id: "herbal-safety-first", title: "Golden Rules: Cats Are Not Small Dogs (Liver Glucuronidation)" },
      { id: "boswellia-vs-nsaids", title: "Boswellia Serrata: The 5-LOX Inhibitor That Protects the Stomach" },
      { id: "mushrooms", title: "Reishi & Turkey Tail: Dual Extraction Potency" },
      { id: "dosage-calculator", title: "Veterinary Fluid Extract (1:1) Weight Chart" },
    ],
    content: `
## Golden Rules: Cats Are Not Small Dogs (Liver Glucuronidation)
Feline livers are deficient in glucuronyl transferase, meaning they cannot safely metabolize essential oils, phenols, or certain salicin-containing herbs. Never administer canine herbal formulas to a feline without explicit board-certified veterinary guidance!

## Boswellia Serrata: The 5-LOX Inhibitor That Protects the Stomach
Unlike pharmaceutical NSAIDs that block COX-1 enzymes and irritate gastric mucosa, standardized AKBA (acetyl-11-keto-beta-boswellic acid) selectively inhibits 5-lipoxygenase, stopping leukotriene-mediated joint degradation without ulcer risk.
    `,
  },

  // 11. THERAPIES (Free)
  {
    id: "art-ther-3",
    slug: "canine-massage-lymphatic-drainage-calming-touch",
    title: "Calming Touch: 4 Canine Massage Strokes to Ease Anxiety & Pain",
    excerpt: "Learn therapeutic effleurage, passive range of motion, and acupressure points to lower your dog's heart rate during thunderstorms or post-surgery recovery.",
    coverImage: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=900&q=80",
    author: {
      name: "Camille Beauchamp, MS",
      title: "Animal Nutrition Scientist & Canine Herbalist",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    },
    topic: "massage",
    petType: "dog",
    isPremium: false,
    readingTime: "5 min read",
    vetReviewed: true,
    vetName: "Dr. Marcus Vance, DVM",
    publishedAt: "2026-02-05",
    tags: ["Massage", "Anxiety", "TTouch", "Bonding"],
    likesCount: 395,
    tableOfContents: [
      { id: "the-nervous-system", title: "Activating the Parasympathetic Nervous System" },
      { id: "stroke-1", title: "1. Head-to-Tail Effleurage" },
      { id: "stroke-2", title: "2. Ear-Tip Pinch for Vasovagal Calming" },
      { id: "stroke-3", title: "3. Gentle Scapular Skin Rolling" },
      { id: "contraindications", title: "When NOT to Massage Your Pet" },
    ],
    content: `
## Activating the Parasympathetic Nervous System
Rhythmic touch applied at a pace of 1-2 inches per second stimulates C-tactile afferent nerve fibers, promoting oxytocin release while lowering serum cortisol levels.

## 2. Ear-Tip Pinch for Vasovagal Calming
The tip of the canine pinna contains the 'Er Jian' acupressure point. Holding the ear leather gently between your thumb and forefinger with tiny circular rotations can reduce panic breathing in under three minutes during firework seasons.
    `,
  },

  // 12. THERAPIES (Premium)
  {
    id: "art-ther-4",
    slug: "photobiomodulation-class-4-laser-therapy-pets",
    title: "Class IV Cold Laser Therapy: Mitochondrial Healing for Disc Disease & Arthritis",
    excerpt: "How 810nm and 980nm wavelengths stimulate ATP synthesis in compromised tissue cells, accelerating surgical incision healing and disc recovery.",
    coverImage: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80",
    author: {
      name: "Dr. Elena Rostova, DVM",
      title: "Board Certified Feline Specialist & Holistic Practitioner",
      avatar: "https://images.unsplash.com/photo-1594824813627-2c90c74b8686?auto=format&fit=crop&w=200&q=80",
    },
    topic: "acupuncture",
    petType: "cat",
    isPremium: true,
    readingTime: "9 min read",
    vetReviewed: true,
    vetName: "Dr. Elena Rostova, DVM",
    publishedAt: "2026-02-01",
    tags: ["Laser Therapy", "Photobiomodulation", "Cellular Repair", "Arthritis"],
    likesCount: 340,
    tableOfContents: [
      { id: "photobiology", title: "Cytochrome C Oxidase & Cellular Energy" },
      { id: "laser-vs-led", title: "Why Class IV Lasers Penetrate Where LED Pads Cannot" },
      { id: "clinical-cases", title: "Case Studies: Chronic Feline Gingivostomatitis & Disc Bulges" },
      { id: "cost-and-safety", title: "Session Frequency, Costs, and Protective Eyewear" },
    ],
    content: `
## Cytochrome C Oxidase & Cellular Energy
Photobiomodulation uses coherent near-infrared photons to target the terminal enzyme in the cellular mitochondrial respiratory chain: cytochrome c oxidase. Displacing inhibitory nitric oxide allows oxygen to bind, accelerating ATP cellular production and stimulating angiogenesis.

## Why Class IV Lasers Penetrate Where LED Pads Cannot
Low-level consumer LED pads scatter rapidly within the epidermis and subcutaneous adipose layer. In contrast, Class IV medical lasers (810nm and 980nm wavelengths) penetrate up to 6 centimeters into deep periarticular joint capsules and the paraspinal musculature.

## Clinical Cases: Chronic Feline Gingivostomatitis & Disc Bulges
- **Feline Gingivostomatitis**: 4-6 J/cm2 applied submandibularly twice weekly yields dramatic reductions in oral mucosal erythema and pain score.
- **Canine Lumbar IVDD (Stage 1-2)**: 8-10 J/cm2 applied along the dorsal spine promotes axonal regeneration and resolves local muscle spasms.

| Condition | Recommended Energy Dose | Frequency | Average Course |
| --- | --- | --- | --- |
| Acute Post-Surgical Incision | 4-6 J/cm² | Every 48 hours | 3-4 sessions |
| Chronic Canine Hip Osteoarthritis | 8-10 J/cm² | 3x week 1, 2x week 2, weekly maintenance | Ongoing |
| Feline Stomatitis / Gingivitis | 3-5 J/cm² | Twice weekly | 6-8 weeks |
| Acute Intervertebral Disc Sprain | 8-12 J/cm² | Daily for 3 days, then 2x/week | 2-3 weeks |

> Important Safety Mandate: Both practitioner and patient must wear certified protective eye goggles tailored to the exact 810nm/980nm wavelength to prevent permanent retinal burn injury.
    `,
  },

  // 13. NUTRITION (Free)
  {
    id: "art-nutr-5",
    slug: "canine-acute-pancreatitis-emergency-recovery-protocol",
    title: "Canine Acute Pancreatitis: Emergency Recovery & Ultra-Low-Fat Nutrition Protocol",
    excerpt: "A board-certified clinical protocol for surviving acute pancreatitis flares, avoiding premature zymogen activation, and managing the critical post-hospitalization recovery diet.",
    coverImage: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80",
    author: {
      name: "Dr. Aris Thorne, DVM, CVA",
      title: "Integrative Veterinarian & Microbiome Specialist",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80",
    },
    topic: "nutrition",
    petType: "dog",
    isPremium: false,
    readingTime: "8 min read",
    vetReviewed: true,
    vetName: "Dr. Aris Thorne, DVM",
    publishedAt: "2026-03-22",
    tags: ["Pancreatitis", "Low-Fat Diet", "Digestive Health", "Emergency Recovery"],
    featured: true,
    likesCount: 684,
    tableOfContents: [
      { id: "zymogen-activation", title: "Pathophysiology: Premature Zymogen Activation" },
      { id: "symptoms-emergency", title: "Emergency Red Flags: The Prayer Position" },
      { id: "dietary-fat-limits", title: "The 10-12% Dry Matter Fat Rule" },
      { id: "post-flare-recipe", title: "Veterinary Post-Flare Recovery Bowl Recipe" },
      { id: "enzyme-supplementation", title: "Digestive Enzyme Supplementation Guidelines" },
    ],
    content: `
## Pathophysiology: Premature Zymogen Activation
Under healthy physiology, the canine pancreas synthesizes digestive enzymes in inactive precursor states called zymogens (e.g., trypsinogen). In acute pancreatitis, intracellular protective mechanisms fail, causing trypsinogen to convert prematurely into trypsin inside the acinar cells. The organ literally begins autodigesting, initiating severe local necrosis and systemic cytokine storms.

## Emergency Red Flags: The Prayer Position
Recognizing acute pancreatitis early saves canine lives. Key clinical signs include:
- The classic "prayer" or "downward dog" posture (forelegs flat on the floor with rear haunches elevated to relieve cranial abdominal pressure)
- Acute protracted vomiting and retching
- Tense, painful abdomen (vocalization upon handling the epigastrium)
- Profound dehydration, tacky pale gums, and hypothermia or spiking fever

> Clinical Emergency Alert: If your dog exhibits persistent vomiting alongside the prayer position, seek immediate veterinary emergency hospitalization for IV fluid support and multimodal analgesia.

## The 10-12% Dry Matter Fat Rule
Pancreatic stimulation is heavily mediated by cholecystokinin (CCK) release, which is triggered primarily by dietary triglycerides. During recovery, the diet must strictly not exceed 10% to 12% crude fat on a dry matter (DM) basis (equivalent to under 2.5g fat per 100 kcal).

| Recovery Phase | Target Dietary Fat (DM) | Primary Protein Source | Carbohydrate Vehicle |
| --- | --- | --- | --- |
| Days 1 - 3 (Post-IV) | < 8% Fat | Poached skinless white meat turkey or cod | Overcooked white Jasmine rice slurry |
| Days 4 - 10 | 9% - 10% Fat | 99% lean ground turkey breast | Boiled pumpkin purée + sweet potato |
| Weeks 2 - 8 | 10% - 12% Fat | Lean venison or skinless chicken breast | Steamed squash, oats, and psyllium |
| Long-Term Maintenance | 10% - 14% Fat | Balanced lean novel protein | High-soluble fiber formulation |

## Veterinary Post-Flare Recovery Bowl Recipe
- 60% Boiled skinless turkey breast (fat skimmed completely from water)
- 30% Steamed mashed white sweet potato
- 10% Pure canned pumpkin (not pie mix)
- Pinch of digestive enzymes (pancreatin powder) mixed right before serving
    `,
  },

  // 14. SENIOR CARE / THERAPIES (Premium)
  {
    id: "art-ther-5",
    slug: "feline-hyperthyroidism-iodine-restriction-cardiac-protection",
    title: "Feline Hyperthyroidism & Cardiac Remodeling: Methimazole vs. Ultra-Low Iodine & CoQ10 Support",
    excerpt: "Evidence-based protocols to manage thyrotoxicosis in senior cats, protect the myocardium from secondary hypertrophic cardiomyopathy, and monitor renal GFR.",
    coverImage: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80",
    author: {
      name: "Dr. Elena Rostova, DVM",
      title: "Board Certified Feline Specialist & Holistic Practitioner",
      avatar: "https://images.unsplash.com/photo-1594824813627-2c90c74b8686?auto=format&fit=crop&w=200&q=80",
    },
    topic: "senior-care",
    petType: "cat",
    isPremium: true,
    readingTime: "11 min read",
    vetReviewed: true,
    vetName: "Dr. Elena Rostova, DVM",
    publishedAt: "2026-03-20",
    tags: ["Feline Thyroid", "Senior Cats", "Cardiac Health", "Integrative Protocols"],
    likesCount: 512,
    tableOfContents: [
      { id: "thyrotoxicosis-basics", title: "Understanding Benign Adenoma & Elevated Total T4" },
      { id: "secondary-hcm", title: "Secondary Hypertrophic Cardiomyopathy Risks" },
      { id: "treatment-options", title: "Methimazole vs. Radioiodine (I-131) vs. Iodine Restriction" },
      { id: "cardioprotection", title: "Cardioprotective Nutraceuticals: CoQ10, Taurine & Hawthorn" },
      { id: "unmasking-ckd", title: "The Critical 'Unmasking CKD' Warning" },
    ],
    content: `
## Understanding Benign Adenoma & Elevated Total T4
Over 98% of feline hyperthyroidism stems from benign functional adenomatous hyperplasia of one or both thyroid lobes. Circulating excessive free thyroid hormones accelerate the feline metabolic furnace: ravenous polyphagia paired with paradoxically precipitous muscle wasting, tachycardia (> 220 bpm), and vocal restlessness.

## Secondary Hypertrophic Cardiomyopathy Risks
Prolonged thyroid storm drives systemic hypertension and left ventricular concentric hypertrophy. Elevated afterload forces cardiomyocytes to thicken, compromising diastolic filling volume and predisposing cats to congestive heart failure and arterial thromboembolism (saddle thrombus).

## Treatment Options Comparison

| Modality | Advantages | Key Drawbacks | Ideal Candidate |
| --- | --- | --- | --- |
| Radioiodine (I-131) | 95%+ permanent curative rate, no daily pills | Requires 3-7 day radiation hospitalization, costly | Cats under 14 with good renal reserve |
| Methimazole / Felimazole | Readily reversible, inexpensive | Daily lifelong dosing; GI upset; facial pruritus in 10% | Cats with borderline renal insufficiency |
| Prescription Iodine Restriction | Non-pharmaceutical | Must be 100% exclusive; zero treats allowed ever | Indoor single-cat homes unable to medicate |

## Cardioprotective Nutraceuticals: CoQ10, Taurine & Hawthorn
- **Ubiquinol (Active CoQ10)**: 10mg daily improves myocardial bioenergetics under hypertensive stress.
- **Taurine**: 250mg twice daily safeguards cardiomyocyte membrane calcium homeostasis.
- **Crataegus oxyacantha (Hawthorn)**: Mild coronary vasodilator and inotropic balancer.

> Critical Clinical Caveat: High thyroid hormone levels artificially elevate Glomerular Filtration Rate (GFR). Lowering T4 to normal can 'unmask' hidden chronic kidney disease. Always check creatinine and SDMA 3 weeks after starting any therapy!
    `,
  },

  // 15. NUTRITION & SAFETY (Free)
  {
    id: "art-nutr-6",
    slug: "emergency-pet-toxin-guide-first-aid-steps",
    title: "The Master Household Pet Toxin Index: Xylitol, Lilies, Chocolate, Grapes & Emergency First Aid",
    excerpt: "Veterinary toxicological thresholds, immediate action protocols, and why hydrogen peroxide is strictly dangerous for cats. Keep this bookmark ready for emergencies.",
    coverImage: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=900&q=80",
    author: {
      name: "Dr. Marcus Vance, DVM",
      title: "Emergency & Critical Care Veterinary Specialist",
      avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80",
    },
    topic: "nutrition",
    petType: "dog",
    isPremium: false,
    readingTime: "7 min read",
    vetReviewed: true,
    vetName: "Dr. Marcus Vance, DVM",
    publishedAt: "2026-03-18",
    tags: ["Toxicology", "Emergency", "Pet Safety", "First Aid"],
    featured: true,
    likesCount: 890,
    tableOfContents: [
      { id: "lethal-toxins", title: "Top 4 High-Lethality Household Hazards" },
      { id: "dosage-thresholds", title: "Toxicology Dosage Reference Table" },
      { id: "feline-peroxide-warning", title: "Why You Must NEVER Give Hydrogen Peroxide to a Cat" },
      { id: "immediate-first-aid", title: "Step-by-Step Immediate Guardian Protocol" },
    ],
    content: `
## Top 4 High-Lethality Household Hazards
1. **Xylitol (Birch Bark Extract / Wood Sugar)**: Found in sugar-free gum, peanut butters, and dental rinses. In dogs, it triggers an instant 6x insulin surge causing profound hypoglycemic coma and acute hepatic necrosis within 30 minutes.
2. **True Lilies (Lilium & Hemerocallis genera)**: Easter, Tiger, Stargazer, and Daylilies. In cats, eating even 1-2 pollen grains or drinking water from the vase causes irreversible acute renal tubular necrosis within 48 hours.
3. **Theobromine & Caffeine (Dark Chocolate & Cocoa)**: Methylxanthines that inhibit cellular phosphodiesterase, inducing life-threatening cardiac arrhythmias and seizures.
4. **Grapes & Raisins (Tartaric Acid)**: Highly idiosyncratic acute kidney injury in canines; even 2-3 raisins can be fatal to susceptible dogs.

## Toxicology Dosage Reference Table

| Substance | Toxic Species | Toxic Threshold Dose | Primary Target Organ |
| --- | --- | --- | --- |
| Xylitol | Dogs only | > 0.1 g/kg (hypoglycemia), > 0.5 g/kg (hepatic failure) | Liver & Blood Glucose |
| Dark Chocolate (70%) | Dogs & Cats | > 15 mg/kg theobromine (mild), > 40 mg/kg (cardiac crisis) | Heart & Central Nervous System |
| True Lilies | Cats strictly | Any micro-exposure (leaves, petals, pollen, water) | Kidneys (Renal Tubules) |
| Acetaminophen (Tylenol) | Cats strictly | Any amount (> 10 mg/kg) | Methemoglobinemia (Cyanosis & Death) |
| Grapes & Raisins | Dogs strictly | Idiosyncratic (as low as 1 raisin per 10 lbs) | Kidneys (Tubular Necrosis) |

## Why You Must NEVER Give Hydrogen Peroxide to a Cat
While 3% hydrogen peroxide is frequently utilized as a home emetic for dogs under veterinary direction, in cats it causes hemorrhagic gastritis, severe mucosal ulceration, and fatal pulmonary gas emboli. Never induce vomiting in felines with hydrogen peroxide!

## Step-by-Step Immediate Guardian Protocol
- **Step 1**: Immediately remove remaining toxin from pet's mouth and secure package for ingredient identification.
- **Step 2**: Check time of ingestion. Decontamination via apomorphine is most effective within 60 to 90 minutes.
- **Step 3**: Contact ASPCA Animal Poison Control (888-426-4435) or your nearest 24/7 veterinary emergency hospital.
    `,
  },

  // 16. AVIAN NUTRITION & EXOTICS (Premium)
  {
    id: "art-nutr-7",
    slug: "avian-psittacine-dietary-conversion-feather-care",
    title: "Avian Nutrition Revolution: Transitioning Parrots from All-Seed Diets to Cold-Pressed Pellets",
    excerpt: "Conquer the fatal all-seed deficiency syndrome. Step-by-step conversion techniques, organic sprouted seeds, and soothing botanical mists for feather plucking.",
    coverImage: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=900&q=80",
    author: {
      name: "Dr. Lilian Ward, MRCVS",
      title: "Exotic & Lagomorph Specialist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    },
    topic: "nutrition",
    petType: "bird",
    isPremium: true,
    readingTime: "9 min read",
    vetReviewed: true,
    vetName: "Dr. Lilian Ward, MRCVS",
    publishedAt: "2026-03-15",
    tags: ["Bird Health", "Parrots", "Avian Nutrition", "Feather Plucking"],
    likesCount: 320,
    tableOfContents: [
      { id: "all-seed-syndrome", title: "The Silent Tragedy of All-Seed Diets" },
      { id: "hypovitaminosis-a", title: "Hypovitaminosis A & Respiratory Choanal Papillae" },
      { id: "conversion-protocol", title: "The 30-Day Gradual Pellet Conversion Protocol" },
      { id: "sprouting-superfoods", title: "Soaked & Sprouted Organic Seeds" },
      { id: "botanical-feather-care", title: "Herbal Hydrosols for Destructive Feather Plucking" },
    ],
    content: `
## The Silent Tragedy of All-Seed Diets
In the wild, parrots fly dozens of miles daily to forage on living buds, nectar, tree bark, legumes, and fresh seeds. Commercial seed bags, by contrast, are dry, dormant, and stripped of vital micronutrients. An all-seed diet is overwhelmingly high in saturated fats while almost entirely devoid of Vitamin A, bioavailable calcium, and trace minerals.

## Hypovitaminosis A & Respiratory Choanal Papillae
Chronic Vitamin A deficiency causes squamous metaplasia of avian mucous membranes. The delicate respiratory epithelium keratanizes, blunting the oral choanal papillae and inviting chronic secondary Aspergillus fungal infections and sinus abscesses.

## The 30-Day Gradual Pellet Conversion Protocol

| Week | Pellet % | Seed % | Fresh Organic Chop % | Weigh Frequency |
| --- | --- | --- | --- | --- |
| Week 1 | 20% | 70% | 10% (crushed sweet potato, kale) | Daily (gram scale) |
| Week 2 | 40% | 40% | 20% (steamed squash, broccoli florets) | Daily |
| Week 3 | 60% | 20% | 20% (sprouted mung beans, peppers) | Daily |
| Week 4+ | 70% | 10% (treat only) | 20% fresh seasonal botanical chop | Weekly |

> Critical Rule: Always monitor bird body weight on a gram scale every morning before breakfast. If your bird drops more than 8% to 10% of baseline body weight, halt the conversion immediately to prevent starvation!

## Herbal Hydrosols for Destructive Feather Plucking
Feather destructive behavior (FDB) often manifests from dry, pruritic skin coupled with nutritional deficiency. Mist twice daily with organic German Chamomile and Calendula flower hydrosols to soothe follicular inflammation.
    `,
  },

  // 17. SENIOR CARE & ORTHOPEDICS (Premium)
  {
    id: "art-ther-6",
    slug: "canine-osteoarthritis-multimodal-pain-management",
    title: "Multi-Modal Canine Osteoarthritis: Combining Librela (Bedinvetmab), Omega-3s & Class IV Lasers",
    excerpt: "How modern anti-NGF monoclonal antibodies pair with clinical-dose marine lipids and laser photobiomodulation to restore effortless pain-free mobility in senior dogs.",
    coverImage: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80",
    author: {
      name: "Travis Sterling, CCRP",
      title: "Certified Canine Rehabilitation Practitioner",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
    topic: "senior-care",
    petType: "dog",
    isPremium: true,
    readingTime: "10 min read",
    vetReviewed: true,
    vetName: "Dr. Marcus Vance, DVM",
    publishedAt: "2026-03-12",
    tags: ["Osteoarthritis", "Senior Dogs", "Librela", "Joint Health", "Rehabilitation"],
    likesCount: 640,
    tableOfContents: [
      { id: "ngf-cascade", title: "Nerve Growth Factor (NGF) in Joint Pain" },
      { id: "librela-mechanics", title: "Bedinvetmab (Librela): How Monoclonal Antibodies Work" },
      { id: "marine-lipid-dosing", title: "Therapeutic EPA/DHA Dosing (100mg/kg Rule)" },
      { id: "environmental-hacks", title: "Crucial Home Setup Modifications for Aging Hips" },
    ],
    content: `
## Nerve Growth Factor (NGF) in Joint Pain
Osteoarthritis is not merely cartilage wear-and-tear; it is a chronic neuro-inflammatory state. In damaged joints, synovial cells overproduce Nerve Growth Factor (NGF). NGF binds to TrkA receptors on sensory nociceptive neurons, triggering peripheral sensitization and hyperalgesia (pain from non-noxious stimuli).

## Bedinvetmab (Librela): How Monoclonal Antibodies Work
Unlike traditional NSAIDs (Carprofen, Meloxicam) that filter through renal and hepatic pathways, Bedinvetmab is a fully caninized monoclonal antibody. It binds specifically to circulating NGF, preventing it from activating nociceptive pain cascades. It is metabolized through normal cellular protein catabolism without stressing kidneys or liver.

## Therapeutic EPA/DHA Dosing (100mg/kg Rule)
Most commercial pet fish oils provide sub-therapeutic doses. Clinical studies from the University of Montreal confirm that canine joint anti-inflammatory effects require 100mg of combined EPA + DHA per kilogram of body weight daily.

| Dog Body Weight | Daily EPA Requirement | Daily DHA Requirement | Marine Oil Pump Equiv |
| --- | --- | --- | --- |
| 10 - 20 lbs (5 - 9 kg) | 400 - 600 mg | 250 - 350 mg | 1 standard pump |
| 21 - 50 lbs (10 - 22 kg) | 1,000 - 1,500 mg | 600 - 900 mg | 2 - 3 pumps |
| 51 - 80 lbs (23 - 36 kg) | 2,000 - 2,500 mg | 1,200 - 1,500 mg | 4 - 5 pumps |
| 81+ lbs (37+ kg) | 3,000+ mg | 1,800+ mg | 6 pumps |

## Crucial Home Setup Modifications for Aging Hips
- Lay non-slip rubber-backed runner rugs along all hardwood and tile hallways
- Raise food and water bowls 6 inches to reduce cervical strain during eating
- Provide memory-foam orthopedic bedding with heated therapeutic pads
    `,
  },

  // 18. FELINE URINARY & BEHAVIOR (Free)
  {
    id: "art-ther-7",
    slug: "feline-idiopathic-cystitis-stress-urinary-care",
    title: "Feline Idiopathic Cystitis (FIC): Pandora Syndrome, Neuro-Endocrine Triggers & Bladder GAG Protocols",
    excerpt: "A groundbreaking integrative protocol for sterile bladder inflammation in cats. Repairing the glycosaminoglycan lining, calming sympathetic overdrive, and optimal hydration.",
    coverImage: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=80",
    author: {
      name: "Dr. Elena Rostova, DVM",
      title: "Board Certified Feline Specialist & Holistic Practitioner",
      avatar: "https://images.unsplash.com/photo-1594824813627-2c90c74b8686?auto=format&fit=crop&w=200&q=80",
    },
    topic: "mental-wellness",
    petType: "cat",
    isPremium: false,
    readingTime: "8 min read",
    vetReviewed: true,
    vetName: "Dr. Elena Rostova, DVM",
    publishedAt: "2026-03-08",
    tags: ["Feline Cystitis", "FIC", "Cat Stress", "Urinary Health"],
    featured: true,
    likesCount: 570,
    tableOfContents: [
      { id: "pandora-syndrome", title: "Pandora Syndrome: The Bladder is the Victim, Not the Cause" },
      { id: "gag-lining-repair", title: "Repairing the Urothelial Glycosaminoglycan (GAG) Layer" },
      { id: "hydration-gravity", title: "Targeting Urine Specific Gravity Under 1.030" },
      { id: "environmental-rules", title: "The N+1 Litter Box & Vertical Space Mandate" },
    ],
    content: `
## Pandora Syndrome: The Bladder is the Victim, Not the Cause
Over 65% of feline lower urinary tract disease (FLUTD) cases presenting with bloody urine, straining, and painful urination possess no bacteria whatsoever. Culture tests return sterile. Dr. C.A. Tony Buffington's landmark research identified this as Pandora Syndrome: a systemic failure of the central stress response system where hyper-reactive sympathetic nervous tone induces sterile neurogenic bladder inflammation.

## Repairing the Urothelial Glycosaminoglycan (GAG) Layer
The bladder mucosa is shielded by a mucopolysaccharide GAG layer that prevents concentrated acidic urine and solute ions from touching sensory subepithelial nerve fibers. In FIC, this layer degrades.
- **N-Acetyl Glucosamine (NAG)**: 125mg - 250mg daily provides the biochemical building blocks to repave damaged urothelial lining.
- **Hyaluronic Acid**: Enhances tissue moisture retention and dampens histamine release from bladder mast cells.

## Targeting Urine Specific Gravity Under 1.030
Dense urine (USG > 1.045) concentrates irritants. Transitioning completely away from dry extruded kibble to moisture-rich wet or rehydrated freeze-dried foods (80%+ hydration) dilutes urinary solutes and cuts cystitis recurrence rates by 75%.

## The N+1 Litter Box & Vertical Space Mandate
- Always provide **Number of Cats + 1** litter boxes distributed across different rooms
- Uncovered, large storage totes with low cut-outs prevent feeling trapped by other cats
- Diffuse synthetic feline facial pheromones (Feliway Classic) near resting perches
    `,
  },
];

export const SEED_FORUM_CATEGORIES: ForumCategory[] = [
  {
    id: "cat-nutr",
    name: "Integrative Nutrition Q&A",
    slug: "nutrition",
    description: "Raw feeding, gently cooked diets, elimination testing, and kidney/liver support discussions.",
    icon: "Utensils",
    color: "#FF4D6D",
    threadsCount: 428,
    isPremiumOnly: false,
  },
  {
    id: "cat-rescue",
    name: "Rescue & Trauma Healing",
    slug: "rescue-pets",
    description: "Nervous system resets, decompression periods, building trust, and multi-pet harmony.",
    icon: "HeartHandshake",
    color: "#00F5D4",
    threadsCount: 312,
    isPremiumOnly: false,
  },
  {
    id: "cat-senior",
    name: "Golden Oldies (Senior Care)",
    slug: "senior-pets",
    description: "Mobility aids, cognitive decline (CCD), comfort protocols, and celebrating long lives.",
    icon: "Sparkles",
    color: "#FFE600",
    threadsCount: 519,
    isPremiumOnly: false,
  },
  {
    id: "cat-movement",
    name: "Training & Movement Rehab",
    slug: "movement-rehab",
    description: "Physical therapy drills, hydrotherapy tips, safe enrichment, and conditioning.",
    icon: "Activity",
    color: "#06D6A0",
    threadsCount: 245,
    isPremiumOnly: false,
  },
  {
    id: "cat-therapies",
    name: "Alternative Care Experiences",
    slug: "alternative-care",
    description: "Guardian stories with acupuncture, laser therapy, homeopathy, and herbal care.",
    icon: "Flame",
    color: "#7928CA",
    threadsCount: 384,
    isPremiumOnly: false,
  },
];

export const SEED_FORUM_THREADS: ForumThread[] = [
  {
    id: "th-1",
    categoryId: "cat-nutr",
    categoryName: "Integrative Nutrition Q&A",
    title: "Elimination diet success: How we identified our rescue Lab's poultry allergy!",
    content: "After 8 months of constant ear infections and paw chewing, our integrative vet had us switch to a novel single-protein diet with novel carbohydrates. Within 4 weeks, the redness cleared! Happy to share our daily journal and food brands that worked.",
    authorId: "usr_alice",
    authorName: "Sarah & Barnaby",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    authorRole: "premium",
    createdAt: "2026-03-18T10:30:00Z",
    repliesCount: 24,
    likesCount: 67,
    isPinned: true,
    tags: ["Allergies", "Elimination Diet", "Labrador"],
  },
  {
    id: "th-2",
    categoryId: "cat-senior",
    categoryName: "Golden Oldies (Senior Care)",
    title: "Non-slip runners on hardwood floors transformed our 13-year-old Shepherd's confidence",
    content: "If your senior dog is hesitating before walking down the hallway, please try yoga mats or rubber-backed washable runners! Buster went from trembling on his rear hocks to trotting happily into the kitchen again.",
    authorId: "usr_marcus",
    authorName: "Marcus Vance",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    authorRole: "pro",
    createdAt: "2026-03-19T14:15:00Z",
    repliesCount: 18,
    likesCount: 89,
    isPinned: false,
    tags: ["Mobility", "Senior Dog", "Home Setup"],
  },
  {
    id: "th-3",
    categoryId: "cat-therapies",
    categoryName: "Alternative Care Experiences",
    title: "First acupuncture session report for our 15yo cat with lumbar arthritis",
    content: "I was terrified Luna would panic with needles, but Dr. Thorne was so gentle! She actually fell asleep on the heated mat during treatment. She hopped onto her favorite armchair tonight for the first time in 4 months.",
    authorId: "usr_marcus",
    authorName: "Marcus & Luna",
    authorAvatar: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=150&q=80",
    authorRole: "premium",
    createdAt: "2026-03-20T08:00:00Z",
    repliesCount: 31,
    likesCount: 112,
    isPinned: false,
    tags: ["Cat Health", "Acupuncture", "Arthritis"],
  },
];

export const SEED_NEWSLETTERS: NewsletterIssue[] = [
  {
    id: "nl-1",
    issueNumber: 84,
    title: "Issue #84: The Spring Detox Myth & Real Canine Liver Support",
    date: "March 15, 2026",
    excerpt: "Why commercial 'cleanse' powders can be risky for pets, and the 3 veterinarian-approved herbs (Milk Thistle, Dandelion Root, NAC) that actually assist hepatic phase II conjugation.",
    readTime: "6 min read",
    isPremium: false,
    tags: ["Liver Health", "Spring Care", "Detox Truths"],
  },
  {
    id: "nl-2",
    issueNumber: 83,
    title: "Issue #83: [Premium Protocol] The Feline Hydration Matrix & Raw Broth Guides",
    date: "March 8, 2026",
    excerpt: "Exclusive printable broth ratios, mineral balance charts, and our review of 6 popular ceramic cat water fountains with clean biological filters.",
    readTime: "9 min read",
    isPremium: true,
    tags: ["Cat Hydration", "Kidney Prevention", "Exclusive"],
  },
  {
    id: "nl-3",
    issueNumber: 82,
    title: "Issue #82: Tick Season Integrative Defense: Cedarwood, Neem & EM Collars",
    date: "March 1, 2026",
    excerpt: "Building an effective multi-layered natural repellent barrier for dogs walking in high-brush woodlands without toxic systemic pesticides.",
    readTime: "7 min read",
    isPremium: false,
    tags: ["Pest Defense", "Holistic Repellent", "Spring Wellness"],
  },
  {
    id: "nl-4",
    issueNumber: 81,
    title: "Issue #81: [Premium Protocol] The Longevity Golden Years Masterclass Recording",
    date: "February 22, 2026",
    excerpt: "Full 75-minute video and transcript with Dr. Aris Thorne covering cognitive supplements, sleep regulation, and anti-inflammatory diets for dogs 10+.",
    readTime: "14 min read",
    isPremium: true,
    tags: ["Masterclass", "Longevity", "Senior Health"],
  },
];
