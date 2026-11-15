import Link from "next/link";
import { notFound } from "next/navigation";
import Thumb from "@/components/Thumb";
import { getProductBySlug } from "@/lib/api";
import { formatChange, formatPrice, perUnit } from "@/lib/bn";
import { requireSession } from "@/lib/session";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  // Protected route: redirects to /signin (which shows a toast) when logged out.
  await requireSession(`/product/${rawSlug}`);

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const change = formatChange(product.change);
  const stats = [
    { label: "সর্বনিম্ন দাম", value: product.min, tone: "text-green-700" },
    { label: "সর্বোচ্চ দাম", value: product.max, tone: "text-red-600" },
    { label: "গড় দাম", value: product.avg, tone: "text-green-700" },
  ];
  const hasArea = product.markets.some((m) => m.area);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav aria-label="breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-base-content/60">
        <Link href="/" className="hover:text-primary">হোম</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link href={`/category/${encodeURIComponent(product.category)}`} className="hover:text-primary">
              {product.categoryName}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-base-content">{product.name}</span>
      </nav>

      <section className="rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-base-200 text-4xl">
            <Thumb emoji={product.emoji} className="h-11 w-11 text-center leading-[2.75rem]" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            {product.description && <p className="mt-1 max-w-prose text-sm text-base-content/70">{product.description}</p>}
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
              {product.tags.map((t) => (
                <span key={t} className="rounded-md bg-base-200 px-2 py-0.5 font-medium">{t}</span>
              ))}
              <span className="rounded-md bg-green-100 px-2 py-0.5 font-medium text-primary">{perUnit(product.unit)}</span>
            </div>
          </div>
          <div className="rounded-xl bg-base-200 px-5 py-3 text-center">
            <p className="text-xs text-base-content/60">আজকের দাম</p>
            <p className="text-2xl font-bold">{formatPrice(product.price)}</p>
            <span className={`mt-1 inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${change.cls}`}>{change.text}</span>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6">
        <h2 className="text-lg font-bold">দামের সারসংক্ষেপ</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-base-300 p-4">
              <p className="text-xs text-base-content/60">{s.label}</p>
              <p className={`mt-1 text-xl font-bold ${s.tone}`}>{formatPrice(s.value)}</p>
              <p className="text-xs text-base-content/60">{perUnit(product.unit)}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-7 text-lg font-bold">বাজারভিত্তিক আজকের দাম</h2>
        {product.markets.length === 0 ? (
          <p className="mt-3 text-sm text-base-content/60">এই পণ্যের বাজারভিত্তিক তথ্য এখনো পাওয়া যায়নি।</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-xl border border-base-300">
            <table className="w-full min-w-[34rem] text-sm">
              <thead>
                <tr className="text-left text-xs text-base-content/60">
                  <th className="px-4 py-3 font-medium">বাজার</th>
                  {hasArea && <th className="px-4 py-3 font-medium">এলাকা</th>}
                  <th className="px-4 py-3 text-right font-medium">সর্বনিম্ন</th>
                  <th className="px-4 py-3 text-right font-medium">সর্বোচ্চ</th>
                  <th className="px-4 py-3 text-right font-medium">আজকের দাম</th>
                </tr>
              </thead>
              <tbody>
                {product.markets.map((m, i) => (
                  <tr key={`${m.name}-${i}`} className={i % 2 === 0 ? "bg-base-100" : "bg-base-200/60"}>
                    <td className="px-4 py-3 font-medium">{m.name}</td>
                    {hasArea && <td className="px-4 py-3 text-base-content/70">{m.area}</td>}
                    <td className="px-4 py-3 text-right">{formatPrice(m.min)}</td>
                    <td className="px-4 py-3 text-right">{formatPrice(m.max)}</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatPrice(m.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
