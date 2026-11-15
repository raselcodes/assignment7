/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { requireSession } from "@/lib/session";

export const metadata = { title: "আমার প্রোফাইল | বাজার দর" };

export default async function ProfilePage() {
  const { user } = await requireSession("/profile");
  const initial = (user.name || user.email).trim().charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-2xl font-bold">আমার প্রোফাইল</h1>
      <p className="mt-1 text-sm text-base-content/60">আপনার অ্যাকাউন্টের তথ্য</p>

      <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-base-300 bg-base-100 p-5">
        {user.image ? (
          <img src={user.image} alt="" className="h-14 w-14 rounded-xl object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white">{initial}</span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{user.name}</p>
          <p className="truncate text-sm text-base-content/60">{user.email}</p>
        </div>
        <Link href="/profile/update" className="btn btn-outline btn-error btn-sm sm:btn-md">
          ✎ তথ্য আপডেট করুন
        </Link>
      </div>
    </div>
  );
}
