"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { signUp } from "@/lib/auth-client";
import AuthShell from "./AuthShell";
import SocialButtons from "./SocialButtons";

export default function SignUpForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const image = String(form.get("image") ?? "").trim();

    if (name.length < 2) return void toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে");
    if (!/^\S+@\S+\.\S+$/.test(email)) return void toast.error("সঠিক ইমেইল দিন");
    if (image && !/^https?:\/\//.test(image)) return void toast.error("ছবির লিংক http:// বা https:// দিয়ে শুরু হতে হবে");
    if (password.length < 8) return void toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");

    setLoading(true);
    const { error } = await signUp.email({ name, email, password, ...(image ? { image } : {}) });
    setLoading(false);

    if (error) {
      toast.error(error.message || "রেজিস্ট্রেশন করা যায়নি");
      return;
    }
    toast.success("রেজিস্ট্রেশন সফল হয়েছে, এখন সাইন ইন করুন");
    router.push("/signin");
  }

  return (
    <AuthShell title="সাইন আপ" subtitle="নতুন অ্যাকাউন্ট খুলুন">
      <form onSubmit={onSubmit} className="grid gap-4" noValidate>
        <label className="grid gap-1 text-sm font-medium">
          নাম
          <input name="name" type="text" autoComplete="name" placeholder="আপনার নাম" className="input input-bordered w-full" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          ইমেইল
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" className="input input-bordered w-full" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          ছবির লিংক (ঐচ্ছিক)
          <input name="image" type="url" autoComplete="off" placeholder="https://..." className="input input-bordered w-full" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          পাসওয়ার্ড
          <input name="password" type="password" autoComplete="new-password" placeholder="কমপক্ষে ৮ অক্ষর" className="input input-bordered w-full" />
        </label>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading && <span className="loading loading-spinner loading-sm" />}
          রেজিস্টার করুন
        </button>
      </form>

      <div className="divider my-6 text-xs">অথবা</div>
      <SocialButtons />

      <p className="mt-6 text-center text-sm">
        আগে থেকেই অ্যাকাউন্ট আছে?{" "}
        <Link href="/signin" className="font-semibold text-primary hover:underline">
          সাইন ইন করুন
        </Link>
      </p>
    </AuthShell>
  );
}
