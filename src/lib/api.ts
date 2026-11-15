import { fromBn, signedFromBn } from "./bn";

const MAIN =
  process.env.NEXT_PUBLIC_API_URL ?? "https://openapi.programming-hero.com/api/bazardor";
const ALT =
  process.env.NEXT_PUBLIC_API_FALLBACK ?? "https://api.api-store.workers.dev/api/bazardor";

export interface Market {
  name: string;
  area: string;
  min: number;
  max: number;
  price: number; // today / average price in this market
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  unit: string; // bare unit, e.g. "কেজি"
  category: string; // category slug
  categoryName: string;
  price: number;
  change: number; // percent, signed
  description: string;
  tags: string[];
  markets: Market[];
  min: number;
  max: number;
  avg: number;
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
}

// The API field names are not documented, so each field is read from several
// likely keys. If your real JSON uses another key, add it to the matching list.

/* eslint-disable @typescript-eslint/no-explicit-any */
type Raw = Record<string, any>;

function pick(o: Raw | null | undefined, keys: string[]): any {
  if (!o) return undefined;
  for (const k of keys) {
    const v = o[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
}

function unwrap(json: any): any {
  if (Array.isArray(json)) return json;
  if (json && typeof json === "object") {
    for (const k of ["data", "products", "categories", "items", "result", "results"]) {
      if (json[k] !== undefined) return unwrap(json[k]);
    }
  }
  return json;
}

const UNIT_MAP: Record<string, string> = {
  kg: "কেজি",
  kilogram: "কেজি",
  l: "লিটার",
  liter: "লিটার",
  litre: "লিটার",
  dozen: "ডজন",
  doz: "ডজন",
  piece: "পিস",
  pcs: "পিস",
  pc: "পিস",
  hali: "হালি",
};

function cleanUnit(raw: unknown): string {
  let u = String(raw ?? "").trim();
  u = u.replace(/^প্রতি\s*/, "").replace(/^per\s+/i, "").trim();
  return UNIT_MAP[u.toLowerCase()] ?? (u || "কেজি");
}

function normalizeMarkets(raw: any): Market[] {
  if (!raw) return [];
  const build = (name: unknown, m: Raw | number | string): Market | null => {
    const o: Raw = m && typeof m === "object" ? (m as Raw) : { price: m };
    const min = fromBn(pick(o, ["min", "minPrice", "min_price", "minimum"]));
    const max = fromBn(pick(o, ["max", "maxPrice", "max_price", "maximum"]));
    let price = fromBn(pick(o, ["price", "todayPrice", "avg", "avgPrice", "average", "value", "amount"]));
    if (!price && min && max) price = (min + max) / 2;
    if (!price) return null;
    return {
      name: String(name ?? pick(o, ["name", "market", "marketName", "bazar", "bazarName", "bazaar", "title"]) ?? "বাজার"),
      area: String(pick(o, ["area", "location", "region", "district", "address"]) ?? ""),
      min: min || price,
      max: max || price,
      price,
    };
  };
  if (Array.isArray(raw)) {
    return raw
      .map((m: any) =>
        m && typeof m === "object"
          ? build(pick(m, ["name", "market", "marketName", "bazar", "bazarName", "bazaar", "title", "location"]), m)
          : null
      )
      .filter((m): m is Market => m !== null);
  }
  if (typeof raw === "object") {
    return Object.entries(raw)
      .map(([name, v]) => build(name, v as any))
      .filter((m): m is Market => m !== null);
  }
  return [];
}

function normalizeCategorySlug(raw: any): { slug: string; name: string } {
  if (raw && typeof raw === "object") {
    const slug = String(pick(raw, ["slug", "id", "key", "name"]) ?? "");
    return { slug, name: String(pick(raw, ["name", "title", "nameBn", "label"]) ?? slug) };
  }
  return { slug: String(raw ?? ""), name: String(raw ?? "") };
}

const CHANGE_KEYS = ["change", "changePercent", "change_percent", "percentChange", "percent_change", "changePct", "priceChange", "percentage"];

export function normalizeProduct(r: Raw): Product {
  const markets = normalizeMarkets(
    pick(r, ["markets", "bazars", "bazar", "marketPrices", "market_prices", "bazarPrices", "prices", "marketWise"])
  );

  const cat = normalizeCategorySlug(pick(r, ["category", "categorySlug", "category_slug", "categoryId"]));
  const categoryName = String(pick(r, ["categoryName", "category_name"]) ?? cat.name);

  let price = fromBn(
    pick(r, ["price", "todayPrice", "today_price", "currentPrice", "current_price", "avgPrice", "averagePrice", "avg"])
  );
  if (!price && markets.length) price = markets.reduce((s, m) => s + m.price, 0) / markets.length;

  const rawChange = pick(r, CHANGE_KEYS);
  let change = signedFromBn(rawChange);
  const prev = fromBn(pick(r, ["previousPrice", "prevPrice", "previous_price", "yesterdayPrice", "yesterday_price"]));
  if (rawChange === undefined && prev > 0) change = ((price - prev) / prev) * 100;

  const prices = markets.map((m) => m.price);
  const min = fromBn(pick(r, ["minPrice", "min_price", "min", "minimum"])) || (prices.length ? Math.min(...prices) : price);
  const max = fromBn(pick(r, ["maxPrice", "max_price", "max", "maximum"])) || (prices.length ? Math.max(...prices) : price);
  const avg =
    fromBn(pick(r, ["avgPrice", "averagePrice", "avg_price", "average"])) ||
    (prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : price);

  const rawTags = pick(r, ["tags", "categories", "categoryTags"]);
  const tags: string[] = Array.isArray(rawTags)
    ? rawTags
        .map((t: any) => (t && typeof t === "object" ? String(pick(t, ["name", "title"]) ?? "") : String(t)))
        .filter(Boolean)
    : [categoryName].filter(Boolean);

  const id = String(pick(r, ["id", "_id", "productId"]) ?? pick(r, ["slug"]) ?? "");

  return {
    id,
    slug: String(pick(r, ["slug"]) ?? id),
    name: String(pick(r, ["name", "title", "nameBn", "name_bn"]) ?? "পণ্য"),
    emoji: String(pick(r, ["emoji", "icon", "image", "thumbnail"]) ?? "🛒"),
    unit: cleanUnit(pick(r, ["unit", "unitName", "unit_name"])),
    category: cat.slug,
    categoryName,
    price,
    change,
    description: String(pick(r, ["description", "summary", "subtitle", "desc", "note"]) ?? ""),
    tags,
    markets,
    min,
    max,
    avg,
  };
}

export function normalizeCategory(r: Raw): Category {
  const slug = String(pick(r, ["slug", "id", "key", "name"]) ?? "");
  return {
    slug,
    name: String(pick(r, ["name", "title", "nameBn", "label"]) ?? slug),
    icon: String(pick(r, ["icon", "emoji"]) ?? "🛒"),
  };
}

async function request(path: string): Promise<any> {
  for (const base of [MAIN, ALT]) {
    try {
      const res = await fetch(`${base}${path}`, { next: { revalidate: 300 } });
      if (!res.ok) continue;
      return unwrap(await res.json());
    } catch {
      /* try the alternative base URL */
    }
  }
  throw new Error(`Failed to fetch ${path}`);
}

export async function getProducts(): Promise<Product[]> {
  const data = await request("/products");
  return (Array.isArray(data) ? data : []).map(normalizeProduct);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const data = await request(`/products?category=${encodeURIComponent(category)}`);
  return (Array.isArray(data) ? data : []).map(normalizeProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const data = await request(`/products/${encodeURIComponent(slug)}`);
    const obj = Array.isArray(data) ? data[0] : data;
    if (obj && typeof obj === "object" && pick(obj, ["name", "title", "nameBn"])) {
      return normalizeProduct(obj);
    }
  } catch {
    /* fall through to list lookup */
  }
  try {
    const all = await getProducts();
    return all.find((p) => p.slug === slug || p.id === slug) ?? null;
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  const data = await request("/categories");
  return (Array.isArray(data) ? data : []).map(normalizeCategory);
}

export async function getCategory(slug: string): Promise<Category | null> {
  try {
    const data = await request(`/categories/${encodeURIComponent(slug)}`);
    const obj = Array.isArray(data) ? data[0] : data;
    return obj && typeof obj === "object" ? normalizeCategory(obj) : null;
  } catch {
    return null;
  }
}
