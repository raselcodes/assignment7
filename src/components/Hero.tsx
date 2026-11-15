function Basket() {
  return (
    <svg viewBox="0 0 260 220" className="h-auto w-full max-w-64" role="img" aria-label="ফল ও সবজির ঝুড়ি">
      <ellipse cx="130" cy="205" rx="105" ry="9" fill="#e1eae2" />
      <path d="M118 52c-4-14 2-26 14-32 2 14-4 26-14 32z" fill="#0b8a43" />
      <circle cx="92" cy="92" r="40" fill="#e0443a" />
      <circle cx="158" cy="86" r="42" fill="#2f9e4f" />
      <circle cx="198" cy="112" r="24" fill="#f08a24" />
      <circle cx="62" cy="116" r="22" fill="#8e44ad" />
      <circle cx="122" cy="120" r="20" fill="#f08a24" />
      <path d="M40 120h180l-16 78a10 10 0 0 1-10 8H66a10 10 0 0 1-10-8z" fill="#9a4a14" />
      <path d="M48 144h164M52 168h156" stroke="#7a3a0e" strokeWidth="4" />
      <path d="M90 124l8 78M130 124v82M170 124l-8 78" stroke="#7a3a0e" strokeWidth="4" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-8">
      <div className="grid items-center gap-6 rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-primary">
            প্রতিদিনের বাজার দর
          </span>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">আজকের বাজারদর এক নজরে</h1>
          <p className="mt-3 max-w-prose text-base-content/70">
            চাল, ডাল, সবজি, মাছ ও মাংসের সর্বশেষ দাম এবং গতকালের তুলনায় কতটা বাড়ল বা কমল, সবই এক জায়গায়।
          </p>
          <a href="#সব-পণ্য" className="btn btn-primary btn-sm sm:btn-md mt-5">
            সব পণ্য দেখুন
          </a>
        </div>
        <div className="flex justify-center md:justify-end">
          <Basket />
        </div>
      </div>
    </section>
  );
}
