import { Suspense } from "react";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import { GridSkeleton } from "@/components/Skeletons";
import { getProducts } from "@/lib/api";

function Section({
  id,
  title,
  subtitle,
  dot,
  children,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  dot?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 pt-12">
      <h2 className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
        {dot && <span className={`h-2.5 w-2.5 rounded-full ${dot}`} aria-hidden="true" />}
        {title}
      </h2>
      {subtitle && <p className="mt-1 text-base-content/70">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

async function HomeSections() {
  let products;
  try {
    products = await getProducts();
  } catch {
    return (
      <div className="mx-auto max-w-6xl px-4 pt-12">
        <div role="alert" className="alert alert-error alert-soft">
          পণ্যের তথ্য লোড করা যায়নি। কিছুক্ষণ পরে আবার চেষ্টা করুন।
        </div>
      </div>
    );
  }

  const risers = products.filter((p) => p.change > 0).sort((a, b) => b.change - a.change).slice(0, 6);
  const fallers = products.filter((p) => p.change < 0).sort((a, b) => a.change - b.change).slice(0, 6);

  return (
    <>
      <Section dot="bg-red-500" title="আজ দাম বেড়েছে ▲" subtitle="গতকালের তুলনায় সবচেয়ে বেশি বেড়েছে এমন ৬টি পণ্য।">
        {risers.length ? <ProductGrid products={risers} /> : <p className="text-base-content/60">আজ কোনো পণ্যের দাম বাড়েনি।</p>}
      </Section>
      <Section dot="bg-green-600" title="আজ দাম কমেছে ▼" subtitle="গতকালের তুলনায় সবচেয়ে বেশি কমেছে এমন ৬টি পণ্য।">
        {fallers.length ? <ProductGrid products={fallers} /> : <p className="text-base-content/60">আজ কোনো পণ্যের দাম কমেনি।</p>}
      </Section>
      <Section id="সব-পণ্য" title="সব পণ্য" subtitle="সব পণ্যের আজকের দাম এবং গতকালের তুলনায় পরিবর্তন।">
        <ProductGrid products={products} />
      </Section>
    </>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Suspense
        fallback={
          <div className="mx-auto max-w-6xl px-4 pt-12">
            <div className="skeleton mb-5 h-8 w-56" />
            <GridSkeleton count={8} />
          </div>
        }
      >
        <HomeSections />
      </Suspense>
    </>
  );
}
