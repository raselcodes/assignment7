"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";
import AuthShell from "./AuthShell";
import SocialButtons from "./SocialButtons";

export default function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);

  const r = params.get("redirect");
  const dest = r && r.startsWith("/") && !r.startsWith("//") ? r : "/";

  useEffect(() => {
    if (params.get("reason") === "protected") {
      toast.error("এই পেজ দেখতে আগে সাইন ইন করুন", { id: "protected" });
    }
  }, [params]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!email || !password) {
      toast.error("ইমেইল ও পাসওয়ার্ড দিন");
      return;
    }

    setLoading(true);
    const { error } = await signIn.email({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message || "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে");
      return;
    }
    toast.success("সফলভাবে সাইন ইন হয়েছে");
    router.push(dest);
    router.refresh();
  }

  return (
    <AuthShell title="সাইন ইন" subtitle="আপনার অ্যাকাউন্টে প্রবেশ করুন">
      <form onSubmit={onSubmit} className="grid gap-4" noValidate>
        <label className="grid gap-1 text-sm font-medium">
          ইমেইল
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" className="input input-bordered w-full" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          পাসওয়ার্ড
          <input name="password" type="password" autoComplete="current-password" placeholder="••••••••" className="input input-bordered w-full" />
        </label>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading && <span className="loading loading-spinner loading-sm" />}
          সাইন ইন
        </button>
      </form>

      <div className="divider my-6 text-xs">অথবা</div>
      <SocialButtons callbackURL={dest} />

      <p className="mt-6 text-center text-sm">
        অ্যাকাউন্ট নেই?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          সাইন আপ করুন
        </Link>
      </p>
    </AuthShell>
  );
}
