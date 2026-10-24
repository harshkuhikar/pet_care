import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/server/mongodb";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const collectionName = url.searchParams.get("collection") || "users";
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20", 10), 100);

    await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    const coll = db.collection(collectionName);
    const total = await coll.countDocuments();
    const docs = await coll.find().sort({ _id: -1 }).limit(limit).toArray();

    // Sanitize any raw password hashes before returning
    const sanitized = docs.map((doc) => {
      const copy = { ...doc };
      if (copy.passwordHash) copy.passwordHash = "[SECURED_HASH]";
      if (copy.salt) copy.salt = "[SECURED_SALT]";
      return copy;
    });

    return NextResponse.json({
      collection: collectionName,
      total,
      limit,
      documents: sanitized,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
