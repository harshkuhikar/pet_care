import { z } from "zod";

const EnvSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  MONGODB_DB_NAME: z.string().optional().default("pawswell"),
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters long"),
  EMAIL_FROM: z.string().optional().default("PawsWell <onboarding@resend.dev>"),
  NEXT_PUBLIC_SITE_URL: z.string().optional().default("http://localhost:3000"),
  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL must be a valid email"),
});

export interface EnvValidationResult {
  valid: boolean;
  missing: string[];
  errors: Record<string, string>;
}

export function validateEnvironment(): EnvValidationResult {
  const result = EnvSchema.safeParse(process.env);
  if (result.success) {
    return { valid: true, missing: [], errors: {} };
  }

  const missing: string[] = [];
  const errors: Record<string, string> = {};

  for (const issue of result.error.issues) {
    const key = issue.path[0] as string;
    missing.push(key);
    errors[key] = issue.message;
  }

  return { valid: false, missing, errors };
}

// Check at runtime without crashing non-auth flows, but log structured error
export function assertAuthConfigured(): void {
  const { valid, missing, errors } = validateEnvironment();
  if (!valid) {
    console.error("[AUTH_ENV_MISSING] Missing or invalid authentication environment variables:");
    for (const key of missing) {
      console.error(`  - ${key}: ${errors[key]}`);
    }
  }
}
