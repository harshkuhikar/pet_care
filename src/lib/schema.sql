-- ==============================================================================
-- PAWSWELL PRODUCTION DATABASE SCHEMA & ROW-LEVEL SECURITY (RLS) POLICIES
-- PostgreSQL / Supabase Compatible
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / USERS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'premium', 'pro', 'admin')),
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'monthly', 'yearly', 'pro')),
  razorpay_customer_id TEXT,
  razorpay_subscription_id TEXT,
  razorpay_payment_id TEXT,
  plan_renews_at TIMESTAMPTZ,
  bio TEXT,
  newsletter_subscribed BOOLEAN NOT NULL DEFAULT true,
  newsletter_frequency TEXT NOT NULL DEFAULT 'weekly' CHECK (newsletter_frequency IN ('weekly', 'biweekly', 'monthly')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are readable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. PETS (Private Health Records)
CREATE TABLE IF NOT EXISTS public.pets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  species TEXT NOT NULL CHECK (species IN ('dog', 'cat', 'rabbit', 'bird', 'small-pet', 'reptile')),
  breed TEXT NOT NULL DEFAULT 'Mixed Breed',
  age TEXT NOT NULL,
  photo_url TEXT,
  health_notes TEXT, -- Strictly private
  allergies TEXT[],
  diet_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- CRITICAL PRIVACY: Only pet owner can select, insert, update, or delete their pets
CREATE POLICY "Owners can view and manage their own pets only."
  ON public.pets FOR ALL
  USING (auth.uid() = user_id);

-- 3. ARTICLES
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_title TEXT NOT NULL,
  author_avatar TEXT NOT NULL,
  topic TEXT NOT NULL CHECK (topic IN ('nutrition', 'exercise', 'acupuncture', 'herbal', 'massage', 'mental-wellness', 'senior-care')),
  pet_type TEXT NOT NULL CHECK (pet_type IN ('dog', 'cat', 'rabbit', 'bird', 'small-pet', 'reptile')),
  is_premium BOOLEAN NOT NULL DEFAULT false,
  reading_time TEXT NOT NULL DEFAULT '5 min read',
  vet_reviewed BOOLEAN NOT NULL DEFAULT true,
  vet_name TEXT,
  tags TEXT[] DEFAULT '{}',
  likes_count INT NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Articles are readable by all authenticated and anonymous users."
  ON public.articles FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert or update articles."
  ON public.articles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 4. BOOKMARKS
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  collection_name TEXT NOT NULL DEFAULT 'General',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, article_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own bookmarks."
  ON public.bookmarks FOR ALL
  USING (auth.uid() = user_id);

-- 5. PET WALL PHOTOS (Public with Strict Privacy)
CREATE TABLE IF NOT EXISTS public.pet_wall_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  aspect_ratio TEXT NOT NULL DEFAULT 'square',
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'flagged')),
  likes_count INT NOT NULL DEFAULT 0,
  reported_count INT NOT NULL DEFAULT 0,
  rotation_deg INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.pet_wall_photos ENABLE ROW LEVEL SECURITY;

-- Public View: Exposes ONLY the image_url and the owner's display name.
-- Strictly NO email, NO pet name, NO location, NO private notes.
CREATE OR REPLACE VIEW public.public_pet_wall AS
  SELECT 
    p.id,
    p.image_url,
    p.likes_count,
    p.rotation_deg,
    p.created_at,
    u.display_name AS owner_display_name
  FROM public.pet_wall_photos p
  JOIN public.profiles u ON p.user_id = u.id
  WHERE p.status = 'approved';

CREATE POLICY "Approved pet wall photos are readable by everyone."
  ON public.pet_wall_photos FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can upload photos."
  ON public.pet_wall_photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners or admins can delete their photos."
  ON public.pet_wall_photos FOR DELETE
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 6. FORUM THREADS & POSTS
CREATE TABLE IF NOT EXISTS public.forum_threads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id TEXT NOT NULL,
  category_name TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  replies_count INT NOT NULL DEFAULT 0,
  likes_count INT NOT NULL DEFAULT 0,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read forum threads."
  ON public.forum_threads FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can post threads."
  ON public.forum_threads FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- 7. PARTNERS, SPONSOR PLACEMENTS & COUPONS
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  website_url TEXT NOT NULL,
  discount_code TEXT NOT NULL,
  discount_percent TEXT NOT NULL,
  exclusive_perk TEXT NOT NULL,
  is_sponsored BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners are publicly viewable."
  ON public.partners FOR SELECT
  USING (true);

-- 8. NEWSLETTER SUBSCRIBERS
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  source TEXT NOT NULL DEFAULT 'website_footer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter."
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- 9. ACCOUNTS & ROLE EXCLUSIVITY (One Email = One Role)
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  canonical_email TEXT UNIQUE NOT NULL, -- Lowercased, trimmed, dot & plus alias stripped
  role TEXT NOT NULL CHECK (role IN ('user', 'admin')),
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'monthly', 'yearly', 'pro', 'premium')),
  password_hash TEXT,
  salt TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_accounts_canonical_email ON public.accounts(canonical_email);
CREATE INDEX IF NOT EXISTS idx_accounts_role ON public.accounts(role);

-- 10. ADMIN AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id UUID NOT NULL,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_audit_admin_id ON public.admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON public.admin_audit_logs(created_at);

-- 11. Q&A QUESTIONS & ANSWERS (Quora-Style Community Platform)
CREATE TABLE IF NOT EXISTS public.qa_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  author_role TEXT NOT NULL DEFAULT 'member',
  title TEXT NOT NULL,
  details TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('gut-health', 'nutrition', 'mobility', 'senior-care', 'therapies', 'behavior')),
  pet_species TEXT NOT NULL CHECK (pet_species IN ('dog', 'cat', 'small-pets', 'bird')),
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'flagged')),
  views_count INT NOT NULL DEFAULT 0,
  upvotes_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_qa_questions_author ON public.qa_questions(author_id);
CREATE INDEX IF NOT EXISTS idx_qa_questions_category ON public.qa_questions(category);

CREATE TABLE IF NOT EXISTS public.qa_answers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_id UUID REFERENCES public.qa_questions(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  author_role TEXT NOT NULL DEFAULT 'member',
  author_credentials TEXT,
  content TEXT NOT NULL,
  is_best_answer BOOLEAN NOT NULL DEFAULT false,
  upvotes INT NOT NULL DEFAULT 0,
  downvotes INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'flagged')),
  report_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_qa_answers_question ON public.qa_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_qa_answers_author ON public.qa_answers(author_id);

-- 12. Q&A MONTHLY UNLOCK TRACKING
CREATE TABLE IF NOT EXISTS public.qa_unlocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.qa_questions(id) ON DELETE CASCADE NOT NULL,
  period TEXT NOT NULL, -- e.g. '2026-10'
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, question_id, period)
);

CREATE INDEX IF NOT EXISTS idx_qa_unlocks_user_period ON public.qa_unlocks(user_id, period);

-- 13. Q&A DYNAMIC SETTINGS (Configurable without redeployment)
CREATE TABLE IF NOT EXISTS public.qa_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_by TEXT NOT NULL
);

