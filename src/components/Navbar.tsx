"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Category } from "@/lib/api";
import { signOut, useSession } from "@/lib/auth-client";
import { banglaDate } from "@/lib/bn";

export default function Navbar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [date, setDate] = useState("");

  useEffect(() => setDate(banglaDate()), []);

  const linkCls = (active: boolean) =>
    `flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition ${
      active ? "bg-primary text-white" : "text-base-content/80 hover:bg-base-200"
    }`;

  async function handleSignOut() {
    const { error } = await signOut();
    if (error) {
      toast.error(error.message || "সাইন আউট করা যায়নি");
      return;
    }
    toast.success("সফলভাবে সাইন আউট হয়েছে");
    router.push("/");
    router.refresh();
  }

  const user = session?.user;
  const initial = (user?.name || user?.email || "U").trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between gap-3 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-lg" aria-hidden="true">
              🛒
            </span>
            <span className="leading-tight">
              <span className="block font-bold">বাজার দর</span>
              <span className="block min-h-4 text-xs text-base-content/60">{date}</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {isPending ? (
              <div className="skeleton h-9 w-28" />
            ) : user ? (
              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-base-200" aria-label="প্রোফাইল মেনু">
                  {user.image ? (
                    <img src={user.image} alt="" className="h-8 w-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">{initial}</span>
                  )}
                  <span className="hidden max-w-28 truncate text-sm font-medium sm:block">{user.name}</span>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div tabIndex={0} className="dropdown-content z-50 mt-2 w-60 rounded-xl border border-base-300 bg-base-100 p-3 shadow-lg">
                  <p className="truncate font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-base-content/60">{user.email}</p>
                  <Link href="/profile" className="mt-3 block rounded-lg px-2 py-1.5 text-sm hover:bg-base-200">
                    আমার প্রোফাইল
                  </Link>
                  <button onClick={handleSignOut} className="block w-full rounded-lg px-2 py-1.5 text-left text-sm text-red-600 hover:bg-red-50">
                    সাইন আউট
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/signin" className="btn btn-ghost btn-sm sm:btn-md">
                  সাইন ইন
                </Link>
                <Link href="/signup" className="btn btn-primary btn-sm sm:btn-md">
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>

        <nav aria-label="পণ্যের ধরন" className="flex items-center gap-1 overflow-x-auto pb-3">
          <Link href="/" className={linkCls(pathname === "/")}>
            <span aria-hidden="true">🏠</span>হোম
          </Link>
          {categories.map((c) => {
            const href = `/category/${encodeURIComponent(c.slug)}`;
            const active = pathname === href || pathname === `/category/${c.slug}`;
            return (
              <Link key={c.slug} href={href} className={linkCls(active)} aria-current={active ? "page" : undefined}>
                <span aria-hidden="true">{c.icon}</span>
                {c.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
