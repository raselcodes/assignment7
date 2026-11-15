import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "bazardor";

// Vercel-এ বিল্ড হওয়ার সময় ভ্যারিয়েবল না থাকলে যাতে ক্র্যাশ না করে,
// সেজন্য একটি ফলব্যাক (fallback) URI ব্যবহার করা হচ্ছে।
// অ্যাপ রান হওয়ার সময় Vercel আসল MONGODB_URI রিড করবে।
const client = new MongoClient(uri || "mongodb://localhost:27017/dummy");
const db = client.db(dbName);

/* eslint-disable @typescript-eslint/no-explicit-any */
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
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-for-build-only",
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders,
});