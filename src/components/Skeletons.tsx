export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-4">
      <div className="flex items-center gap-3">
        <div className="skeleton h-11 w-11 rounded-lg" />
        <div className="grow">
          <div className="skeleton h-4 w-2/3" />
          <div className="skeleton mt-2 h-3 w-1/3" />
        </div>
      </div>
      <div className="skeleton mt-4 h-3 w-1/4" />
      <div className="mt-2 flex items-center justify-between">
        <div className="skeleton h-6 w-1/3" />
        <div className="skeleton h-5 w-14" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TickerSkeleton() {
  return <div className="skeleton h-10 w-full rounded-none" />;
}
