import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/pawswell";

const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "pawswell";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      dbName: MONGODB_DB_NAME,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log(`[MongoDB] Connected successfully to "${m.connection.name}" database.`);
        return m;
      })
      .catch((err) => {
        console.error("[MongoDB] Connection failure:", err.message);
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

export async function getDbConnectionStatus(): Promise<{
  connected: boolean;
  dbName: string;
  host: string;
  readyState: number;
  latencyMs?: number;
  error?: string;
}> {
  try {
    const start = Date.now();
    const conn = await connectToDatabase();
    // Run a quick ping
    if (conn.connection.db) {
      await conn.connection.db.admin().ping();
    }
    const latencyMs = Date.now() - start;

    return {
      connected: conn.connection.readyState === 1,
      dbName: conn.connection.name || MONGODB_DB_NAME,
      host: conn.connection.host || "pet-care.fk0hc3z.mongodb.net",
      readyState: conn.connection.readyState,
      latencyMs,
    };
  } catch (err: any) {
    return {
      connected: false,
      dbName: MONGODB_DB_NAME,
      host: "pet-care.fk0hc3z.mongodb.net",
      readyState: 0,
      error: err.message,
    };
  }
}
