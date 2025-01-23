import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGO_URL;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGO_URI environment variable in .env.local");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
 // eslint-disable-next-line no-var
 var mongoose: MongooseCache | undefined;
}

//let mongoose: MongooseCache | undefined;

// Cache the MongoDB connection to avoid reconnecting repeatedly
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!cached.conn) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, options).then((conn) => conn);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}