/**
 * PAWSWELL CONFIGURATION
 * Single central config file for easy rebranding and site-wide settings.
 */

export const siteConfig = {
  name: "PawsWell",
  shortName: "PawsWell",
  tagline: "Integrative Health & Joyful Longevity for Pets",
  description:
    "The award-winning integrative health platform for dogs, cats, rabbits & small animals. Vet-reviewed nutrition, therapeutic movement, holistic care, and a loving pet community.",
  url: "https://pawswell.pet",
  ogImage: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&h=630&q=80",
  contactEmail: "hello@pawswell.pet",
  sponsorEmail: "partners@pawswell.pet",
  author: "PawsWell Integrative Pet Health Collective",
  
  // Theme & Maximalist Aesthetics
  colors: {
    coral: "#FF4D6D",
    coralHover: "#E63956",
    teal: "#00F5D4",
    tealDark: "#00BB9C",
    yellow: "#FFE600",
    yellowLight: "#FFF385",
    purple: "#7928CA",
    purpleLight: "#9D4EDD",
    green: "#06D6A0",
    cream: "#FFFDF5",
    creamDark: "#F7F2E4",
    darkNavy: "#181126",
    darkCard: "#231B33",
  },

  // Stats Counters
  stats: {
    communityMembers: "48,250+",
    petsSupported: "62,900+",
    vetGuides: "350+",
    partnerDiscountsSaved: "$180,000+",
  },

  // Core Pillars
  pillars: [
    {
      id: "nutrition",
      title: "Integrative Nutrition",
      slug: "/nutrition",
      color: "coral",
      accent: "#FF4D6D",
      bgLight: "#FFF0F3",
      icon: "Bone",
      tagline: "Fresh, biologically appropriate & anti-inflammatory feeding",
      desc: "Raw, gently-cooked, prebiotic boosters, and personalized longevity meal plans reviewed by board-certified veterinary nutritionists.",
    },
    {
      id: "exercise",
      title: "Movement & Fitness",
      slug: "/exercise",
      color: "teal",
      accent: "#00BB9C",
      bgLight: "#E8FFF9",
      icon: "Activity",
      tagline: "Rehab, joint preservation & joyful play routines",
      desc: "Low-impact physical therapy, senior dog mobility routines, feline cognitive enrichment, and indoor conditioning.",
    },
    {
      id: "therapies",
      title: "Alternative Therapies",
      slug: "/therapies",
      color: "purple",
      accent: "#7928CA",
      bgLight: "#F5EDFF",
      icon: "Sparkles",
      tagline: "Acupuncture, herbal medicine, massage & laser care",
      desc: "Evidence-backed complementary modalities that alleviate pain, calm nervous systems, and boost immune resilience.",
    },
  ],

  // Navigation Links
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Learn Hub", href: "/blog" },
    { label: "Nutrition", href: "/nutrition" },
    { label: "Movement", href: "/exercise" },
    { label: "Therapies", href: "/therapies" },
    { label: "Pet Wall", href: "/pet-wall", badge: "Live" },
    { label: "Community", href: "/community" },
    { label: "Partners & Perks", href: "/partners" },
    { label: "Newsletter", href: "/newsletter" },
  ],

  // Footer Links
  footerNav: {
    topics: [
      { label: "Gut & Microbiome", href: "/nutrition#gut" },
      { label: "Senior Dog Arthritis", href: "/exercise#senior" },
      { label: "Feline Kidney Care", href: "/nutrition#feline-kidney" },
      { label: "Canine Acupuncture", href: "/therapies#acupuncture" },
      { label: "Herbal Calming Tinctures", href: "/therapies#herbal" },
      { label: "Rabbit GI Stasis Prevention", href: "/blog?petType=rabbit" },
    ],
    community: [
      { label: "Pet Wall Photo Gallery", href: "/pet-wall" },
      { label: "Community Forum", href: "/community" },
      { label: "Ask a Vet Q&A Archive", href: "/community?category=nutrition" },
      { label: "Community Guidelines", href: "/community-guidelines" },
      { label: "Member Perks Directory", href: "/partners" },
    ],
    membership: [
      { label: "Plans & Pricing", href: "/membership" },
      { label: "Why Go Premium?", href: "/membership#compare" },
      { label: "Gift a Membership", href: "/membership#gift" },
      { label: "Billing Management", href: "/profile?tab=billing" },
      { label: "Sponsor Media Kit", href: "/partners#media-kit" },
    ],
    company: [
      { label: "About PawsWell", href: "/about" },
      { label: "Veterinary Advisory Board", href: "/about#advisory" },
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Medical Disclaimer", href: "/disclaimer" },
    ],
  },

  // Social Links
  socials: {
    instagram: "https://instagram.com/pawswellpet",
    tiktok: "https://tiktok.com/@pawswellpet",
    youtube: "https://youtube.com/@pawswellpet",
    pinterest: "https://pinterest.com/pawswellpet",
  },
};

export type SiteConfig = typeof siteConfig;
