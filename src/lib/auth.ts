import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "bazardor";

if (!uri && process.env.NODE_ENV === "production") {
  console.error("MONGODB_URI is missing in production!");
}

// Vercel বিল্ডের সময় ক্র্যাশ এড়াতে ফলব্যাক
const client = new MongoClient(uri || "mongodb://localhost:27017/dummy", {
  serverSelectionTimeoutMS: 5000,
});
const db = client.db(dbName);

const socialProviders: Record<string, any> = {};
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-for-build-only",
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders,
});