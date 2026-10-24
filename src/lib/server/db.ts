import fs from "fs";
import path from "path";
import { normalizeEmail, hashPassword, NormalizedAccount } from "../auth-exclusivity";
import { connectToDatabase } from "./mongodb";
import {
  AccountModel,
  UserModel,
  QuestionModel,
  AnswerModel,
  UnlockModel,
  SettingsModel,
  AuditLogModel,
  ContactMessageModel,
  NewsletterSubscriberModel,
  PetRecordModel,
  OrderModel,
} from "./models";

export interface QAQuestion {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: string;
  title: string;
  details: string;
  category: string;
  petSpecies: string;
  imageUrl?: string;
  status: "active" | "hidden" | "flagged";
  viewsCount: number;
  upvotesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface QAAnswer {
  id: string;
  questionId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: string;
  authorCredentials?: string;
  content: string;
  isBestAnswer: boolean;
  upvotes: number;
  downvotes: number;
  status: "active" | "hidden" | "flagged";
  reportCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface QAUnlock {
  id: string;
  userId: string;
  questionId: string;
  period: string; // e.g. "2026-10"
  unlockedAt: string;
}

export interface QASettings {
  freeLimit: number; // default: 5
  premiumLimit: number; // default: 15
  proLimit: number; // default: Infinity
  updatedAt: string;
  updatedBy: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: "user" | "qa_question" | "qa_answer" | "settings" | "system";
  targetId: string;
  details: string;
  timestamp: string;
}

export interface DBState {
  accounts: NormalizedAccount[];
  questions: QAQuestion[];
  answers: QAAnswer[];
  unlocks: QAUnlock[];
  settings: QASettings;
  auditLogs: AdminAuditLog[];
}

const DB_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DB_DIR, "pawswell-db.json");

// Helper to safely load local fallback db
function loadFallbackDB(): DBState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn("[DB Fallback] Read error:", err);
  }

  const defaultAdminPassword = hashPassword("AdminSecret2026!");
  return {
    accounts: [
      {
        id: "admin_master",
        email: "harshkuhikar68@gmail.com",
        canonicalEmail: "harshkuhikar68@gmail.com",
        role: "admin",
        passwordHash: defaultAdminPassword.hash,
        salt: defaultAdminPassword.salt,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    questions: [],
    answers: [],
    unlocks: [],
    settings: {
      freeLimit: 5,
      premiumLimit: 15,
      proLimit: 999999,
      updatedAt: new Date().toISOString(),
      updatedBy: "system_init",
    },
    auditLogs: [],
  };
}

function saveFallbackDB(state: DBState): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("[DB Fallback] Write error:", err);
  }
}

// Master DB operations connected directly to MongoDB Atlas
export const db = {
  // Accounts & Exclusivity
  async getAccountByEmail(email: string): Promise<NormalizedAccount | null> {
    const { canonicalEmail } = normalizeEmail(email);
    try {
      await connectToDatabase();
      const doc = await AccountModel.findOne({ canonicalEmail }).lean();
      if (doc) {
        return doc as unknown as NormalizedAccount;
      }
    } catch (err) {
      console.warn("[MongoDB] getAccountByEmail fallback:", err);
    }
    const state = loadFallbackDB();
    return state.accounts.find((a) => a.canonicalEmail === canonicalEmail) || null;
  },

  async getAllAccounts(): Promise<NormalizedAccount[]> {
    try {
      await connectToDatabase();
      const docs = await AccountModel.find().lean();
      if (docs && docs.length > 0) {
        return docs as unknown as NormalizedAccount[];
      }
    } catch (err) {
      console.warn("[MongoDB] getAllAccounts fallback:", err);
    }
    return loadFallbackDB().accounts;
  },

  async createAccount(
    account: Omit<NormalizedAccount, "id" | "canonicalEmail" | "createdAt" | "updatedAt">
  ): Promise<NormalizedAccount> {
    const { email, canonicalEmail } = normalizeEmail(account.email);

    try {
      await connectToDatabase();

      // Check exclusivity
      const existing = await AccountModel.findOne({ canonicalEmail }).lean();
      if (existing) {
        if (existing.role === "admin" && account.role === "user") {
          throw new Error("This email cannot be used to create a user account.");
        }
        if (existing.role === "user" && account.role === "admin") {
          throw new Error(
            "This email is already registered as a user account and cannot be assigned an admin role."
          );
        }
        throw new Error("An account with this email already exists.");
      }

      const newId = `${account.role}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();

      const newAcc: NormalizedAccount = {
        ...account,
        id: newId,
        email,
        canonicalEmail,
        createdAt: now,
        updatedAt: now,
      };

      await AccountModel.create(newAcc);

      // Create linked user profile if role is user
      if (account.role === "user") {
        await UserModel.findOneAndUpdate(
          { email },
          {
            $set: {
              id: newId,
              email,
              displayName: email.split("@")[0] || "Pet Guardian",
              avatarUrl:
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
              role: "member",
              plan: account.plan || "free",
              joinedAt: now.split("T")[0],
              newsletterSubscribed: true,
              newsletterFrequency: "weekly",
              savedArticlesCount: 0,
              petsCount: 0,
              updatedAt: now,
            },
            $setOnInsert: { createdAt: now },
          },
          { upsert: true, returnDocument: "after" }
        );
      }

      return newAcc;
    } catch (err: any) {
      if (
        err.message?.includes("already exists") ||
        err.message?.includes("cannot be used") ||
        err.message?.includes("already registered") ||
        err.message?.includes("cannot be assigned")
      ) {
        throw err;
      }
      console.warn("[MongoDB] createAccount fallback:", err);
    }

    // Local fallback
    const state = loadFallbackDB();
    const existingFallback = state.accounts.find((a) => a.canonicalEmail === canonicalEmail);
    if (existingFallback) {
      throw new Error("An account with this email already exists.");
    }
    const fallbackAcc: NormalizedAccount = {
      ...account,
      id: `${account.role}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email,
      canonicalEmail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.accounts.push(fallbackAcc);
    saveFallbackDB(state);
    return fallbackAcc;
  },

  async updateAccountStatus(id: string, status: "active" | "suspended"): Promise<NormalizedAccount | null> {
    try {
      await connectToDatabase();
      const updated = await AccountModel.findOneAndUpdate(
        { id },
        { status, updatedAt: new Date().toISOString() },
        { returnDocument: "after" }
      ).lean();
      if (updated) return updated as unknown as NormalizedAccount;
    } catch (err) {
      console.warn("[MongoDB] updateAccountStatus fallback:", err);
    }

    const state = loadFallbackDB();
    const idx = state.accounts.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    state.accounts[idx].status = status;
    state.accounts[idx].updatedAt = new Date().toISOString();
    saveFallbackDB(state);
    return state.accounts[idx];
  },

  async updateAccountPlan(
    id: string,
    plan: "free" | "monthly" | "yearly" | "pro" | "premium"
  ): Promise<NormalizedAccount | null> {
    try {
      await connectToDatabase();
      const updated = await AccountModel.findOneAndUpdate(
        { id },
        { plan, updatedAt: new Date().toISOString() },
        { returnDocument: "after" }
      ).lean();
      if (updated) {
        await UserModel.findOneAndUpdate({ id }, { plan, updatedAt: new Date().toISOString() });
        return updated as unknown as NormalizedAccount;
      }
    } catch (err) {
      console.warn("[MongoDB] updateAccountPlan fallback:", err);
    }

    const state = loadFallbackDB();
    const idx = state.accounts.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    state.accounts[idx].plan = plan;
    state.accounts[idx].updatedAt = new Date().toISOString();
    saveFallbackDB(state);
    return state.accounts[idx];
  },

  // User Profile
  async getUserProfile(emailOrId: string) {
    try {
      await connectToDatabase();
      const user = await UserModel.findOne({
        $or: [{ id: emailOrId }, { email: emailOrId.toLowerCase().trim() }],
      }).lean();
      return user;
    } catch (err) {
      console.warn("[MongoDB] getUserProfile error:", err);
      return null;
    }
  },

  // Questions
  async getQuestions(): Promise<QAQuestion[]> {
    try {
      await connectToDatabase();
      const docs = await QuestionModel.find({ status: { $ne: "hidden" } })
        .sort({ createdAt: -1 })
        .lean();
      if (docs && docs.length > 0) return docs as unknown as QAQuestion[];
    } catch (err) {
      console.warn("[MongoDB] getQuestions fallback:", err);
    }
    return loadFallbackDB().questions.filter((q) => q.status !== "hidden");
  },

  async getAllQuestionsAdmin(): Promise<QAQuestion[]> {
    try {
      await connectToDatabase();
      const docs = await QuestionModel.find().sort({ createdAt: -1 }).lean();
      if (docs) return docs as unknown as QAQuestion[];
    } catch (err) {
      console.warn("[MongoDB] getAllQuestionsAdmin fallback:", err);
    }
    return loadFallbackDB().questions;
  },

  async getQuestionById(id: string): Promise<QAQuestion | null> {
    try {
      await connectToDatabase();
      const doc = await QuestionModel.findOne({ id }).lean();
      if (doc) return doc as unknown as QAQuestion;
    } catch (err) {
      console.warn("[MongoDB] getQuestionById fallback:", err);
    }
    const state = loadFallbackDB();
    return state.questions.find((q) => q.id === id) || null;
  },

  async createQuestion(
    questionData: Omit<QAQuestion, "id" | "viewsCount" | "upvotesCount" | "createdAt" | "updatedAt">
  ): Promise<QAQuestion> {
    const newQ: QAQuestion = {
      ...questionData,
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      viewsCount: 1,
      upvotesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await connectToDatabase();
      await QuestionModel.create(newQ);
      return newQ;
    } catch (err) {
      console.warn("[MongoDB] createQuestion fallback:", err);
    }

    const state = loadFallbackDB();
    state.questions.unshift(newQ);
    saveFallbackDB(state);
    return newQ;
  },

  async updateQuestionStatus(id: string, status: "active" | "hidden" | "flagged"): Promise<boolean> {
    try {
      await connectToDatabase();
      const res = await QuestionModel.updateOne(
        { id },
        { status, updatedAt: new Date().toISOString() }
      );
      if (res.matchedCount > 0) return true;
    } catch (err) {
      console.warn("[MongoDB] updateQuestionStatus fallback:", err);
    }

    const state = loadFallbackDB();
    const q = state.questions.find((item) => item.id === id);
    if (!q) return false;
    q.status = status;
    q.updatedAt = new Date().toISOString();
    saveFallbackDB(state);
    return true;
  },

  async deleteQuestion(id: string): Promise<boolean> {
    try {
      await connectToDatabase();
      const res = await QuestionModel.deleteOne({ id });
      await AnswerModel.deleteMany({ questionId: id });
      if (res.deletedCount > 0) return true;
    } catch (err) {
      console.warn("[MongoDB] deleteQuestion fallback:", err);
    }

    const state = loadFallbackDB();
    const initialLen = state.questions.length;
    state.questions = state.questions.filter((q) => q.id !== id);
    state.answers = state.answers.filter((a) => a.questionId !== id);
    saveFallbackDB(state);
    return state.questions.length < initialLen;
  },

  // Answers
  async getAnswersForQuestion(questionId: string): Promise<QAAnswer[]> {
    try {
      await connectToDatabase();
      const docs = await AnswerModel.find({ questionId, status: { $ne: "hidden" } })
        .sort({ isBestAnswer: -1, upvotes: -1 })
        .lean();
      if (docs) return docs as unknown as QAAnswer[];
    } catch (err) {
      console.warn("[MongoDB] getAnswersForQuestion fallback:", err);
    }

    return loadFallbackDB().answers.filter(
      (a) => a.questionId === questionId && a.status !== "hidden"
    );
  },

  async getAllAnswersAdmin(): Promise<QAAnswer[]> {
    try {
      await connectToDatabase();
      const docs = await AnswerModel.find().sort({ createdAt: -1 }).lean();
      if (docs) return docs as unknown as QAAnswer[];
    } catch (err) {
      console.warn("[MongoDB] getAllAnswersAdmin fallback:", err);
    }
    return loadFallbackDB().answers;
  },

  async createAnswer(
    answerData: Omit<QAAnswer, "id" | "isBestAnswer" | "upvotes" | "downvotes" | "createdAt" | "updatedAt">
  ): Promise<QAAnswer> {
    const newA: QAAnswer = {
      ...answerData,
      id: `ans_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      isBestAnswer: false,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await connectToDatabase();
      await AnswerModel.create(newA);
      return newA;
    } catch (err) {
      console.warn("[MongoDB] createAnswer fallback:", err);
    }

    const state = loadFallbackDB();
    state.answers.push(newA);
    saveFallbackDB(state);
    return newA;
  },

  async updateAnswerStatus(id: string, status: "active" | "hidden" | "flagged"): Promise<boolean> {
    try {
      await connectToDatabase();
      const res = await AnswerModel.updateOne(
        { id },
        { status, updatedAt: new Date().toISOString() }
      );
      if (res.matchedCount > 0) return true;
    } catch (err) {
      console.warn("[MongoDB] updateAnswerStatus fallback:", err);
    }

    const state = loadFallbackDB();
    const a = state.answers.find((item) => item.id === id);
    if (!a) return false;
    a.status = status;
    a.updatedAt = new Date().toISOString();
    saveFallbackDB(state);
    return true;
  },

  async deleteAnswer(id: string): Promise<boolean> {
    try {
      await connectToDatabase();
      const res = await AnswerModel.deleteOne({ id });
      if (res.deletedCount > 0) return true;
    } catch (err) {
      console.warn("[MongoDB] deleteAnswer fallback:", err);
    }

    const state = loadFallbackDB();
    const initialLen = state.answers.length;
    state.answers = state.answers.filter((a) => a.id !== id);
    saveFallbackDB(state);
    return state.answers.length < initialLen;
  },

  async markBestAnswer(questionId: string, answerId: string): Promise<boolean> {
    try {
      await connectToDatabase();
      await AnswerModel.updateMany({ questionId }, { isBestAnswer: false });
      await AnswerModel.updateOne({ id: answerId }, { isBestAnswer: true });
      return true;
    } catch (err) {
      console.warn("[MongoDB] markBestAnswer fallback:", err);
    }

    const state = loadFallbackDB();
    const answers = state.answers.filter((a) => a.questionId === questionId);
    if (answers.length === 0) return false;
    answers.forEach((a) => {
      a.isBestAnswer = a.id === answerId;
      a.updatedAt = new Date().toISOString();
    });
    saveFallbackDB(state);
    return true;
  },

  async voteAnswer(answerId: string, direction: "up" | "down"): Promise<QAAnswer | null> {
    try {
      await connectToDatabase();
      const incField = direction === "up" ? { upvotes: 1 } : { downvotes: 1 };
      const updated = await AnswerModel.findOneAndUpdate(
        { id: answerId },
        { $inc: incField, updatedAt: new Date().toISOString() },
        { returnDocument: "after" }
      ).lean();
      if (updated) return updated as unknown as QAAnswer;
    } catch (err) {
      console.warn("[MongoDB] voteAnswer fallback:", err);
    }

    const state = loadFallbackDB();
    const a = state.answers.find((item) => item.id === answerId);
    if (!a) return null;
    if (direction === "up") a.upvotes += 1;
    if (direction === "down") a.downvotes += 1;
    a.updatedAt = new Date().toISOString();
    saveFallbackDB(state);
    return a;
  },

  // Settings & Limits
  async getSettings(): Promise<QASettings> {
    try {
      await connectToDatabase();
      const doc = await SettingsModel.findOne({ key: "global_settings" }).lean();
      if (doc) {
        return {
          freeLimit: doc.freeLimit,
          premiumLimit: doc.premiumLimit,
          proLimit: doc.proLimit,
          updatedAt: doc.updatedAt || new Date().toISOString(),
          updatedBy: doc.updatedBy || "system",
        };
      }
    } catch (err) {
      console.warn("[MongoDB] getSettings fallback:", err);
    }

    return loadFallbackDB().settings;
  },

  async updateSettings(settings: Partial<QASettings>, adminEmail: string): Promise<QASettings> {
    const now = new Date().toISOString();
    try {
      await connectToDatabase();
      const updated = await SettingsModel.findOneAndUpdate(
        { key: "global_settings" },
        {
          $set: {
            ...settings,
            updatedAt: now,
            updatedBy: adminEmail,
          },
        },
        { upsert: true, returnDocument: "after" }
      ).lean();

      return {
        freeLimit: updated.freeLimit,
        premiumLimit: updated.premiumLimit,
        proLimit: updated.proLimit,
        updatedAt: now,
        updatedBy: adminEmail,
      };
    } catch (err) {
      console.warn("[MongoDB] updateSettings fallback:", err);
    }

    const state = loadFallbackDB();
    state.settings = {
      ...state.settings,
      ...settings,
      updatedAt: now,
      updatedBy: adminEmail,
    };
    saveFallbackDB(state);
    return state.settings;
  },

  async getUnlocksForUser(userId: string, period?: string): Promise<QAUnlock[]> {
    const activePeriod = period || new Date().toISOString().substring(0, 7);
    try {
      await connectToDatabase();
      const docs = await UnlockModel.find({ userId, period: activePeriod }).lean();
      if (docs) return docs as unknown as QAUnlock[];
    } catch (err) {
      console.warn("[MongoDB] getUnlocksForUser fallback:", err);
    }

    const state = loadFallbackDB();
    return state.unlocks.filter((u) => u.userId === userId && u.period === activePeriod);
  },

  async isQuestionUnlocked(userId: string, questionId: string, period?: string): Promise<boolean> {
    const activePeriod = period || new Date().toISOString().substring(0, 7);
    try {
      await connectToDatabase();
      const exists = await UnlockModel.exists({ userId, questionId, period: activePeriod });
      if (exists) return true;
    } catch (err) {
      console.warn("[MongoDB] isQuestionUnlocked fallback:", err);
    }

    const state = loadFallbackDB();
    return state.unlocks.some(
      (u) => u.userId === userId && u.questionId === questionId && u.period === activePeriod
    );
  },

  async unlockQuestion(
    userId: string,
    questionId: string,
    period?: string,
    planOverride?: string
  ): Promise<{ success: boolean; count: number; limit: number; error?: string }> {
    const activePeriod = period || new Date().toISOString().substring(0, 7);

    try {
      await connectToDatabase();
      const userDoc = await AccountModel.findOne({ id: userId }).lean();
      const settingsDoc = (await this.getSettings()) || { freeLimit: 5, premiumLimit: 15, proLimit: 999999 };

      const plan = planOverride || userDoc?.plan || (userDoc?.role === "admin" ? "pro" : "free");

      let limit = settingsDoc.freeLimit;
      if (plan === "monthly" || plan === "premium") {
        limit = settingsDoc.premiumLimit;
      } else if (plan === "yearly" || plan === "pro" || plan === "admin") {
        limit = settingsDoc.proLimit;
      }

      // Already unlocked?
      const existingUnlock = await UnlockModel.findOne({ userId, questionId, period: activePeriod });
      if (existingUnlock) {
        const count = await UnlockModel.countDocuments({ userId, period: activePeriod });
        return { success: true, count, limit };
      }

      const currentCount = await UnlockModel.countDocuments({ userId, period: activePeriod });
      if (currentCount >= limit) {
        return {
          success: false,
          count: currentCount,
          limit,
          error: `Monthly limit of ${limit} question unlocks reached for ${
            plan === "free" ? "Free Explorer" : "PawsWell Premium"
          }. Please upgrade to view more answers.`,
        };
      }

      const newUnlock = {
        id: `unl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId,
        questionId,
        period: activePeriod,
        unlockedAt: new Date().toISOString(),
      };
      await UnlockModel.create(newUnlock);

      return {
        success: true,
        count: currentCount + 1,
        limit,
      };
    } catch (err) {
      console.warn("[MongoDB] unlockQuestion fallback:", err);
    }

    // Fallback logic
    const state = loadFallbackDB();
    const userAccount = state.accounts.find((a) => a.id === userId);
    const plan = planOverride || userAccount?.plan || "free";
    let limit = state.settings.freeLimit;
    if (plan === "monthly" || plan === "premium") limit = state.settings.premiumLimit;
    else if (plan === "yearly" || plan === "pro") limit = state.settings.proLimit;

    const currentUnlocks = state.unlocks.filter((u) => u.userId === userId && u.period === activePeriod);
    if (currentUnlocks.length >= limit) {
      return { success: false, count: currentUnlocks.length, limit, error: "Limit reached" };
    }

    const newUnlock: QAUnlock = {
      id: `unl_${Date.now()}`,
      userId,
      questionId,
      period: activePeriod,
      unlockedAt: new Date().toISOString(),
    };
    state.unlocks.push(newUnlock);
    saveFallbackDB(state);
    return { success: true, count: currentUnlocks.length + 1, limit };
  },

  // Audit Logs
  async getAuditLogs(): Promise<AdminAuditLog[]> {
    try {
      await connectToDatabase();
      const docs = await AuditLogModel.find().sort({ timestamp: -1 }).limit(100).lean();
      if (docs) return docs as unknown as AdminAuditLog[];
    } catch (err) {
      console.warn("[MongoDB] getAuditLogs fallback:", err);
    }
    return loadFallbackDB().auditLogs.slice(-100).reverse();
  },

  async logAdminAction(logData: Omit<AdminAuditLog, "id" | "timestamp">): Promise<void> {
    const entry: AdminAuditLog = {
      ...logData,
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    try {
      await connectToDatabase();
      await AuditLogModel.create(entry);
    } catch (err) {
      console.warn("[MongoDB] logAdminAction fallback:", err);
    }

    const state = loadFallbackDB();
    state.auditLogs.push(entry);
    saveFallbackDB(state);
  },

  // Contact Messages
  async saveContactMessage(data: { name: string; email: string; topic: string; message: string }) {
    await connectToDatabase();
    return await ContactMessageModel.create({
      id: `msg_${Date.now()}`,
      ...data,
      status: "unread",
      createdAt: new Date().toISOString(),
    });
  },

  // Newsletter Subscribers
  async saveNewsletterSubscriber(email: string, frequency = "weekly") {
    await connectToDatabase();
    return await NewsletterSubscriberModel.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      {
        email: email.toLowerCase().trim(),
        frequency,
        active: true,
        subscribedAt: new Date().toISOString(),
      },
      { upsert: true, returnDocument: "after" }
    );
  },

  // Orders / Payments
  async savePaymentOrder(data: {
    orderId: string;
    paymentId?: string;
    userId?: string;
    email?: string;
    amount: number;
    currency?: string;
    plan: string;
  }) {
    await connectToDatabase();
    return await OrderModel.create({
      ...data,
      currency: data.currency || "USD",
      status: "completed",
      createdAt: new Date().toISOString(),
    });
  },
};
