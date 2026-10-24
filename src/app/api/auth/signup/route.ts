import { NextResponse } from "next/server";
import { normalizeEmail, hashPassword } from "@/lib/auth-exclusivity";
import { db } from "@/lib/server/db";
import { connectToDatabase } from "@/lib/server/mongodb";
import { UserModel, PetRecordModel } from "@/lib/server/models";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      password,
      petName,
      petSpecies,
      agreeTerms,
      newsletterOptIn,
    } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const { email: rawEmail, canonicalEmail } = normalizeEmail(email);

    // Check exclusivity
    const existing = await db.getAccountByEmail(canonicalEmail);
    if (existing) {
      if (existing.role === "admin") {
        return NextResponse.json(
          { error: "This email cannot be used to create a member account." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "An account with this email already exists. Please log in instead." },
        { status: 400 }
      );
    }

    // Hash password securely with PBKDF2/SHA-512 + salt
    const { hash, salt } = hashPassword(password);

    // Create Account in MongoDB
    const account = await db.createAccount({
      email: rawEmail,
      role: "user",
      plan: "free",
      passwordHash: hash,
      salt,
      status: "active",
    });

    await connectToDatabase();

    // Create User Profile in MongoDB
    const displayName = (fullName || rawEmail.split("@")[0] || "Pet Guardian").trim();
    const now = new Date().toISOString();

    const userProfile = {
      id: account.id,
      email: rawEmail,
      displayName,
      avatarUrl: `https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80`,
      role: "member",
      plan: "free",
      joinedAt: now.split("T")[0],
      bio: "Dedicated pet guardian learning holistic nutrition and veterinary wellness.",
      newsletterSubscribed: !!newsletterOptIn,
      newsletterFrequency: "weekly",
      savedArticlesCount: 0,
      petsCount: petName ? 1 : 0,
      createdAt: now,
      updatedAt: now,
    };

    await UserModel.findOneAndUpdate(
      { email: rawEmail },
      { $set: userProfile },
      { upsert: true, returnDocument: "after" }
    );

    // If pet details provided, seed the pet record in MongoDB
    if (petName && petName.trim()) {
      await PetRecordModel.create({
        id: `pet_${Date.now()}`,
        userId: account.id,
        name: petName.trim(),
        species: petSpecies || "dog",
        breed: "Family Companion",
        age: "1-3 years",
        photoUrl:
          petSpecies === "cat"
            ? "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80"
            : "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80",
        healthNotes: "Registered during account creation.",
        allergies: [],
        dietType: "Standard Fresh Diet",
        createdAt: now.split("T")[0],
      });
    }

    // If newsletter opt-in, save to newsletter collection
    if (newsletterOptIn) {
      await db.saveNewsletterSubscriber(rawEmail, "weekly");
    }

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully in MongoDB!",
      user: userProfile,
    });

    // Set user session cookie
    response.cookies.set("pawswell_user_session", account.id, {
      httpOnly: false, // accessible to client sync
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Sign up error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create account in database." },
      { status: 500 }
    );
  }
}
