import { Suspense } from "react";
import CategoryProducts from "@/components/CategoryProducts";
import NotFoundView from "@/components/NotFoundView";
import { GridSkeleton } from "@/components/Skeletons";
import { getCategory, getProductsByCategory } from "@/lib/api";

async function CategoryContent({ slug }: { slug: string }) {
  const [products, category] = await Promise.all([
    getProductsByCategory(slug).catch(() => []),
    getCategory(slug),
  ]);

  if (products.length === 0) {
    return (
      <NotFoundView
        title="এই ক্যাটাগরিতে কোনো পণ্য নেই"
        message="ক্যাটাগরিটি হয়তো নেই, অথবা এখনো কোনো পণ্য যোগ করা হয়নি।"
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <CategoryProducts
        products={products}
        title={category?.name ?? products[0].categoryName ?? slug}
        icon={category?.icon ?? products[0].emoji}
      />
    </div>
  );
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="skeleton mb-6 h-9 w-48" />
          <GridSkeleton count={8} />
        </div>
      }
    >
      <CategoryContent slug={decodeURIComponent(slug)} />
    </Suspense>
  );
}
