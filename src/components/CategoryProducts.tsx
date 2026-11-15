"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/api";
import ProductGrid from "./ProductGrid";

type Sort = "default" | "asc" | "desc";

export default function CategoryProducts({
  products,
  title,
  icon,
}: {
  products: Product[];
  title: string;
  icon: string;
}) {
  const [sort, setSort] = useState<Sort>("default");

  // price is already a number (Bengali digits are converted in lib/api via fromBn),
  // so this compares numeric values, never strings.
  const sorted = useMemo(() => {
    const list = [...products];
    if (sort === "asc") list.sort((a, b) => a.price - b.price);
    if (sort === "desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, sort]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-base-200 text-2xl" aria-hidden="true">
            {icon}
          </span>
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-base-content/60">মোট {products.length}টি পণ্য</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium">
            সাজান:
          </label>
          <div className="relative">
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="select select-bordered select-sm sm:select-md appearance-none pr-9"
            >
              <option value="default">ডিফল্ট</option>
              <option value="asc">দাম: কম থেকে বেশি</option>
              <option value="desc">দাম: বেশি থেকে কম</option>
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>
      <ProductGrid products={sorted} />
    </>
  );
}
