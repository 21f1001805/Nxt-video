import mongoose from "mongoose";

const rawMongoUri = process.env.MONGODB_URI?.trim().replace(/^['"]|['"]$/g, "");
const MONGODB_URI = rawMongoUri ?? "";

if (!MONGODB_URI) {
  throw new Error("Please define mongodb in env variables");
}

if (!/^mongodb(\+srv)?:\/\//.test(MONGODB_URI)) {
  throw new Error(
    "Invalid MONGODB_URI format. It must start with mongodb:// or mongodb+srv://"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 4,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
