export type PetSpecies = "dog" | "cat" | "rabbit" | "bird" | "small-pet" | "reptile";

export type HealthTopic =
  | "nutrition"
  | "exercise"
  | "acupuncture"
  | "herbal"
  | "massage"
  | "mental-wellness"
  | "senior-care";

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    title: string;
    avatar: string;
  };
  topic: HealthTopic;
  petType: PetSpecies;
  isPremium: boolean;
  readingTime: string;
  vetReviewed: boolean;
  vetName?: string;
  publishedAt: string;
  tags: string[];
  tableOfContents?: { id: string; title: string }[];
  likesCount?: number;
  featured?: boolean;
}

export interface Pet {
  id: string;
  userId: string;
  name: string;
  species: PetSpecies;
  breed: string;
  age: string;
  photoUrl?: string;
  healthNotes: string; // Private, visible only to owner
  allergies?: string[];
  dietType?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  role: "member" | "premium" | "pro" | "admin";
  plan: "free" | "monthly" | "yearly" | "pro" | "premium" | "family";
  planRenewsAt?: string;
  joinedAt: string;
  bio?: string;
  newsletterSubscribed: boolean;
  newsletterFrequency: "weekly" | "biweekly" | "monthly";
  savedArticlesCount?: number;
  petsCount?: number;
}

export interface PetWallPhoto {
  id: string;
  userId: string;
  ownerDisplayName: string; // Per requirement: only owner display name is public, no pet name, no location, no email
  imageUrl: string;
  aspectRatio?: "square" | "portrait" | "landscape";
  status: "approved" | "pending" | "flagged";
  createdAt: string;
  likesCount: number;
  reportedCount: number;
  rotationDeg?: number; // Visual polaroid tilt
}

export interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  threadsCount: number;
  isPremiumOnly: boolean;
}

export interface ForumThread {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: "member" | "premium" | "pro" | "admin";
  createdAt: string;
  repliesCount: number;
  likesCount: number;
  isPinned?: boolean;
  tags?: string[];
}

export interface ForumReply {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: "member" | "premium" | "pro" | "admin";
  content: string;
  createdAt: string;
  likesCount: number;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  category: "Fresh Food" | "Supplements" | "Holistic Gear" | "Testing & DNA" | "Aromatherapy" | "Grooming";
  description: string;
  websiteUrl: string;
  discountCode: string;
  discountPercent: string;
  exclusivePerk: string;
  isSponsored: boolean;
  isFeatured?: boolean;
}

export interface NewsletterIssue {
  id: string;
  issueNumber: number;
  title: string;
  date: string;
  excerpt: string;
  readTime: string;
  isPremium: boolean;
  previewUrl?: string;
  tags: string[];
}

export interface MembershipPlan {
  id: "free" | "premium" | "pro";
  name: string;
  badge?: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
  accentColor: string;
}

export interface SavedCollection {
  id: string;
  name: string;
  articleIds: string[];
}
