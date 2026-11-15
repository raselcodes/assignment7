"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { updateUser } from "@/lib/auth-client";

export default function UpdateProfileForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে");
      return;
    }
    setLoading(true);
    const { error } = await updateUser({ name: name.trim() });
    setLoading(false);
    if (error) {
      toast.error(error.message || "তথ্য আপডেট করা যায়নি");
      return;
    }
    toast.success("তথ্য সফলভাবে আপডেট হয়েছে");
    router.push("/profile");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <Link href="/profile" className="text-sm text-primary hover:underline">
        ← প্রোফাইলে ফিরে যান
      </Link>
      <h1 className="mt-3 text-2xl font-bold">তথ্য আপডেট করুন</h1>
      <p className="mt-1 text-sm text-base-content/60">আপনার নাম পরিবর্তন করুন</p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4 rounded-2xl border border-base-300 bg-base-100 p-5">
        <label className="grid gap-1 text-sm font-medium">
          নাম
          <input value={name} onChange={(e) => setName(e.target.value)} className="input input-bordered w-full" placeholder="আপনার নাম" />
        </label>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading && <span className="loading loading-spinner loading-sm" />}
          তথ্য আপডেট করুন
        </button>
      </form>
    </div>
  );
}
