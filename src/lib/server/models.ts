import mongoose, { Schema, Model } from "mongoose";

// 1. Account Schema (Auth & Exclusivity)
const AccountSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    canonicalEmail: { type: String, required: true, unique: true, index: true },
    role: { type: String, enum: ["user", "admin"], required: true },
    plan: { type: String, default: "free" },
    passwordHash: { type: String },
    salt: { type: String },
    status: { type: String, enum: ["active", "suspended"], default: "active" },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  { collection: "accounts" }
);

// 2. User Profile Schema
const UserProfileSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, index: true },
    displayName: { type: String, required: true },
    avatarUrl: { type: String },
    role: { type: String, default: "member" },
    plan: { type: String, default: "free" },
    planRenewsAt: { type: String },
    joinedAt: { type: String },
    bio: { type: String },
    newsletterSubscribed: { type: Boolean, default: true },
    newsletterFrequency: { type: String, default: "weekly" },
    savedArticlesCount: { type: Number, default: 0 },
    petsCount: { type: Number, default: 0 },
    createdAt: { type: String },
    updatedAt: { type: String },
  },
  { collection: "users" }
);

// 3. Q&A Question Schema
const QuestionSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    authorAvatar: { type: String },
    authorRole: { type: String, default: "member" },
    title: { type: String, required: true },
    details: { type: String, required: true },
    category: { type: String, required: true, index: true },
    petSpecies: { type: String, required: true, index: true },
    imageUrl: { type: String },
    status: { type: String, enum: ["active", "hidden", "flagged"], default: "active", index: true },
    viewsCount: { type: Number, default: 0 },
    upvotesCount: { type: Number, default: 0 },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  { collection: "questions" }
);

// 4. Q&A Answer Schema
const AnswerSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    questionId: { type: String, required: true, index: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    authorAvatar: { type: String },
    authorRole: { type: String, default: "member" },
    authorCredentials: { type: String },
    content: { type: String, required: true },
    isBestAnswer: { type: Boolean, default: false },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "hidden", "flagged"], default: "active", index: true },
    reportCount: { type: Number, default: 0 },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  { collection: "answers" }
);

// 5. Q&A Unlock Schema
const UnlockSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    questionId: { type: String, required: true, index: true },
    period: { type: String, required: true, index: true },
    unlockedAt: { type: String, required: true },
  },
  { collection: "unlocks" }
);

// 6. Settings Schema
const SettingsSchema = new Schema(
  {
    key: { type: String, default: "global_settings", unique: true },
    freeLimit: { type: Number, default: 5 },
    premiumLimit: { type: Number, default: 15 },
    proLimit: { type: Number, default: 999999 },
    updatedAt: { type: String },
    updatedBy: { type: String },
  },
  { collection: "settings" }
);

// 7. Audit Log Schema
const AuditLogSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    adminId: { type: String, required: true },
    adminEmail: { type: String, required: true },
    action: { type: String, required: true },
    targetType: { type: String, required: true },
    targetId: { type: String, required: true },
    details: { type: String, required: true },
    timestamp: { type: String, required: true },
  },
  { collection: "audit_logs" }
);

// 8. Contact Message Schema
const ContactMessageSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    topic: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["unread", "read", "resolved"], default: "unread" },
    createdAt: { type: String, required: true },
  },
  { collection: "contact_messages" }
);

// 9. Newsletter Subscriber Schema
const NewsletterSubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    frequency: { type: String, default: "weekly" },
    active: { type: Boolean, default: true },
    subscribedAt: { type: String, required: true },
  },
  { collection: "newsletter_subscribers" }
);

// 10. Pet Record Schema
const PetRecordSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: { type: String },
    age: { type: String },
    photoUrl: { type: String },
    healthNotes: { type: String },
    allergies: [{ type: String }],
    dietType: { type: String },
    createdAt: { type: String, required: true },
  },
  { collection: "pets" }
);

// 11. Payment / Order Schema
const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    paymentId: { type: String },
    userId: { type: String },
    email: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    plan: { type: String, required: true },
    status: { type: String, default: "completed" },
    createdAt: { type: String, required: true },
  },
  { collection: "orders" }
);

// Export models safely avoiding overwrite errors in Next.js Turbopack HMR
export const AccountModel =
  mongoose.models.Account || mongoose.model("Account", AccountSchema);
export const UserModel =
  mongoose.models.User || mongoose.model("User", UserProfileSchema);
export const QuestionModel =
  mongoose.models.Question || mongoose.model("Question", QuestionSchema);
export const AnswerModel =
  mongoose.models.Answer || mongoose.model("Answer", AnswerSchema);
export const UnlockModel =
  mongoose.models.Unlock || mongoose.model("Unlock", UnlockSchema);
export const SettingsModel =
  mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
export const AuditLogModel =
  mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
export const ContactMessageModel =
  mongoose.models.ContactMessage ||
  mongoose.model("ContactMessage", ContactMessageSchema);
export const NewsletterSubscriberModel =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model("NewsletterSubscriber", NewsletterSubscriberSchema);
export const PetRecordModel =
  mongoose.models.PetRecord || mongoose.model("PetRecord", PetRecordSchema);
export const OrderModel =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);
