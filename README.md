# 🐾 PawsWell — Integrative Health & Joyful Longevity for Pets

> **An award-winning maximalist newsletter + membership web platform for companion pet parents.**
> Covering fresh bio-appropriate nutrition, joint-preservation movement, and evidence-backed alternative therapies, powered by an affectionate community.

---

## 🌟 Vision & Revenue Engine

PawsWell generates revenue through two synergistic monetization engines:
1. **Premium & Family Subscriptions ($12/mo, $115/yr, $230/yr Pro)**: Unlocking 350+ clinical protocols, formulation calculators, live monthly vet Q&As, and member-only discussions.
2. **Vetted Brand Partnerships & Sponsorships**: Curated placements for ethical pet brands with exclusive coupon codes, newsletter sponsorship slots, and transparent affiliate disclosures.

---

## 🎨 Maximalist Design System

PawsWell rejects empty, sterile minimalism in favor of vibrant, abundant, and joyous pet-centric energy:
- **Palette**: Hot Coral (`#FF4D6D`), Electric Teal (`#00F5D4`), Sunshine Yellow (`#FFE600`), Grape Purple (`#7928CA`), Leaf Green (`#06D6A0`), and Cream (`#FFFDF5`).
- **Typography**: 
  - Chunky Headings: **Fredoka** (`next/font/google`)
  - Clean Readable Body: **DM Sans**
  - Handwritten Sticker Notes: **Caveat**
- **Decor & Neo-Brutalism**: Hard drop shadows (`pop-shadow`, `shadow-[6px_6px_0px_#000]`), tilted sticker badges (`rotate-[-2deg]`, `rotate-[3deg]`), washi tape polaroid frames, and infinite scrolling topic marquees.
- **Micro-Interactions & Motion**:
  - Interactive Desktop Paw Cursor Trail (follows mouse with alternating paw prints)
  - Hero Animated Pets (Tail-wagging dog, blinking tuxedo cat, hopping bunny) with interactive speech bubbles
  - Real-time celebratory confetti bursts on bookmark, signup, photo upload, and upgrade
  - Prefers-reduced-motion full compliance
  - Full Twilight Dark Mode that preserves neon accents

---

## 🚀 Pages & Features

| Route | Page | Description |
|---|---|---|
| `/` | **Home** | Animated hero pets, conversion funnel, 3 pillar cards, featured carousel, live Pet Wall preview, testimonials, FAQ. |
| `/blog` | **Learn Hub** | Multi-dimensional filter (species, topic, free vs premium), keyword search bar, bookmarking. |
| `/blog/[slug]` | **Article Detail** | TOC scroll, author credentials, vet-reviewed badge, member comments, share buttons, blurred paywall preview. |
| `/nutrition` | **Topic: Nutrition** | Portion calculator (by weight & activity level), raw vs gently-cooked guides, downloadable 7-day elimination PDF. |
| `/exercise` | **Topic: Movement** | Joint unweighting principles, proprioception drills, feline predatory sequence, downloadable senior mobility log. |
| `/therapies` | **Topic: Therapies** | Acupuncture points breakdown, feline hepatic glucuronidation safety warning, downloadable herbal compendium. |
| `/membership` | **Membership** | Monthly/Yearly toggle with "Save 20%" sticker, 3-tier matrix, 30-day wag guarantee, Razorpay checkout gateway. |
| `/checkout/success`| **Success** | Confetti celebration, receipt details, direct path to pet onboarding. |
| `/signup` | **Sign Up** | Password strength meter (Weak/Fair/Strong), social logins, companion species, newsletter opt-in. |
| `/login` | **Sign In** | Password login, magic link toggle, remember me, forgot password flow. |
| `/welcome` | **Onboarding Wizard**| 4-step wizard: 1. Interests, 2. First pet profile, 3. Email cadence, 4. Tailored recommendations. |
| `/profile` | **Dashboard** | 8 tabs: Overview, My Pets (CRUD), Saved Guides, Saved Items/Perks, My Photos, Razorpay Billing, Notifications, Account Export/Delete. |
| `/pet-wall` | **Public Pet Wall** | Polaroid masonry gallery, upload modal with EXIF & GPS metadata stripping, display name only, lightbox viewer. |
| `/community` | **Community Forum** | Category filtering, pinned posts, new thread modal, like counters, persistent medical advice reminder. |
| `/partners` | **Partners & Perks**| Vetted brand directory, copyable discount codes, affiliate disclosures, "Become a Partner" media kit form. |
| `/newsletter` | **Newsletter** | Sunday Dispatch subscription form, issue archive, interactive issue reader modal. |
| `/about` | **About** | Story, mission bento cards, veterinary advisory board member spotlights. |
| `/contact` | **Contact** | Inquiries form, emergency vet notice, response time estimate. |
| `/admin` | **Operations Console**| Role-protected console: MRR/Churn metrics, article publishing, Pet Wall photo moderation queue, dispatch broadcast. |
| `/disclaimer` | **Disclaimers** | Complete veterinary medical legal safety notice and FTC affiliate disclosures. |
| `/privacy` | **Privacy Policy** | Details automatic EXIF stripping, data minimization, and GDPR/CCPA export/deletion rights. |
| `/terms` | **Terms of Service**| Subscription renewal rules, wag-guaranteed refund policy, and content rights. |
| `/community-guidelines` | **Guidelines** | Pet wall rules (strictly zero human faces), respectful communication standards. |

---

## 🛠️ Quickstart & Local Setup

### 1. Prerequisites
- Node.js 18.18+ or 20+
- npm or pnpm

### 2. Installation
```bash
npm install
```

### 3. Run Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Zero-Config Local Mode**: The application is equipped with client-side reactive state persistence (`src/lib/storage.ts`) and pre-seeded data (`src/lib/seedData.ts`). You can test sign up, pet creation, bookmarking, Razorpay checkout gateway, and Pet Wall photo uploads immediately without setting up external APIs!

---

## ⚙️ Production Configuration (Razorpay & Supabase)

To link live database and payment processing:
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. **Supabase**:
   - Create a project on [Supabase](https://supabase.com).
   - In the SQL Editor, execute `src/lib/schema.sql` to instantiate all tables, RLS policies, and the public view.
   - Fill `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. **Razorpay**:
   - Add your Razorpay API Key ID and Key Secret to `.env.local`:
     ```env
     NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_TqWODGGxf4PqSm
     RAZORPAY_KEY_SECRET=DAb4sT1E63UzJ02dDwAmJyQ8
     ```
   - Supports cards, UPI (GPay, PhonePe, Paytm), Net Banking, and multi-currency (USD/INR).

---

## 🐶 Changing the Site Name or Branding

Need to rebrand from "PawsWell"?
Simply edit **`src/config/site.ts`**. Change `siteConfig.name`, `tagline`, and `colors`, and the entire site updates instantly!
