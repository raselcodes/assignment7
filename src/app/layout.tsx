import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { TickerSkeleton } from "@/components/Skeletons";
import Ticker from "@/components/Ticker";
import { getCategories, getProducts } from "@/lib/api";
import "./globals.css";

const hind = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
});

export const metadata: Metadata = {
  title: "বাজার দর | BazarDor",
  description: "প্রয়োজনীয় পণ্যের দাম এক নজরে।",
};

async function NavWithData() {
  const categories = await getCategories().catch(() => []);
  return <Navbar categories={categories} />;
}

async function TickerWithData() {
  const products = await getProducts().catch(() => []);
  return <Ticker products={products} />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body className={`${hind.variable} flex min-h-screen flex-col bg-base-200 font-sans text-base-content antialiased`}>
        <Suspense fallback={<Navbar categories={[]} />}>
          <NavWithData />
        </Suspense>
        <Suspense fallback={<TickerSkeleton />}>
          <TickerWithData />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
