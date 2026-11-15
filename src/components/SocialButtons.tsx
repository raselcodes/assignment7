"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";

export default function SocialButtons({ callbackURL = "/" }: { callbackURL?: string }) {
  const [busy, setBusy] = useState<string | null>(null);

  async function go(provider: "google" | "github") {
    setBusy(provider);
    const { error } = await signIn.social({ provider, callbackURL });
    if (error) {
      toast.error(error.message || "সোশ্যাল লগইন করা যায়নি");
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-3">
      <button type="button" onClick={() => go("google")} disabled={busy !== null} className="btn btn-outline">
        {busy === "google" ? <span className="loading loading-spinner loading-sm" /> : <span className="font-bold">G</span>}
        Google দিয়ে চালিয়ে যান
      </button>
      <button type="button" onClick={() => go("github")} disabled={busy !== null} className="btn btn-outline">
        {busy === "github" ? <span className="loading loading-spinner loading-sm" /> : <span className="font-bold">GH</span>}
        GitHub দিয়ে চালিয়ে যান
      </button>
    </div>
  );
}
