import type { Product } from "@/lib/api";
import { bnNumber, formatChange } from "@/lib/bn";
import Thumb from "./Thumb";

export default function Ticker({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  const base = products.length < 12 ? [...products, ...products, ...products] : products;

  const row = (suffix: string, hidden: boolean) =>
    base.map((p, i) => {
      const c = formatChange(p.change);
      const color = c.dir === "up" ? "text-red-600" : c.dir === "down" ? "text-green-700" : "text-gray-500";
      return (
        <span key={`${suffix}-${i}`} className="flex items-center gap-2 whitespace-nowrap px-5 text-sm" aria-hidden={hidden}>
          <Thumb emoji={p.emoji} className="h-5 w-5 text-center" />
          <span className="font-semibold">{p.name}</span>
          <span className="text-base-content/70">
            {bnNumber(p.price)} টাকা/{p.unit}
          </span>
          <span className={`font-semibold ${color}`}>{c.text}</span>
        </span>
      );
    });

  return (
    <div className="overflow-hidden border-b border-base-300 bg-base-100 py-2.5" role="region" aria-label="আজকের দামের তালিকা">
      <div className="animate-marquee flex">
        {row("a", false)}
        {row("b", true)}
      </div>
    </div>
  );
}
