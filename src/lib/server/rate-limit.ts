import { connectToDatabase } from "./mongodb";
import { RateLimitModel } from "./models";

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
  message?: string;
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  await connectToDatabase();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowSeconds * 1000);

  // Atomic upsert / increment
  const record = await RateLimitModel.findOneAndUpdate(
    { key },
    {
      $inc: { count: 1 },
      $setOnInsert: { key, expiresAt },
      $set: { lastRequestAt: now },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  if (record.count > limit) {
    const diffMs = record.expiresAt.getTime() - now.getTime();
    const retryAfter = Math.max(1, Math.ceil(diffMs / 1000));
    return {
      allowed: false,
      retryAfterSeconds: retryAfter,
      message: `Too many attempts. Please try again in ${retryAfter} seconds.`,
    };
  }

  return { allowed: true };
}

export async function checkCooldown(
  key: string,
  cooldownSeconds: number
): Promise<RateLimitResult> {
  await connectToDatabase();
  const now = new Date();
  const existing = await RateLimitModel.findOne({ key });

  if (existing && existing.lastRequestAt) {
    const elapsedSeconds = (now.getTime() - new Date(existing.lastRequestAt).getTime()) / 1000;
    if (elapsedSeconds < cooldownSeconds) {
      const waitTime = Math.ceil(cooldownSeconds - elapsedSeconds);
      return {
        allowed: false,
        retryAfterSeconds: waitTime,
        message: `Please wait ${waitTime} seconds before requesting another code.`,
      };
    }
  }

  return { allowed: true };
}
