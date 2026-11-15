import Link from "next/link";
import type { Product } from "@/lib/api";
import { formatChange, formatPrice, perUnit } from "@/lib/bn";
import Thumb from "./Thumb";

export default function ProductCard({ product }: { product: Product }) {
  const change = formatChange(product.change);
  return (
    <Link
      href={`/product/${encodeURIComponent(product.slug)}`}
      className="group block rounded-xl border border-base-300 bg-base-100 p-4 transition hover:border-primary hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-base-200 text-2xl">
          <Thumb emoji={product.emoji} className="h-8 w-8 text-center leading-8" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold group-hover:text-primary">{product.name}</h3>
          <p className="text-xs text-base-content/60">{perUnit(product.unit)}</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-base-content/60">আজকের দাম</p>
      <div className="flex items-center justify-between gap-2">
        <p className="text-lg font-bold">{formatPrice(product.price)}</p>
        <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${change.cls}`}>{change.text}</span>
      </div>
    </Link>
  );
}
