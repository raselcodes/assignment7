const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

/** 1850 -> "১,৮৫০" (replaces every Latin digit with a Bengali digit) */
export function toBn(value: number | string): string {
  return String(value).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

/** "১,৮৫০ টাকা" -> 1850. Used so sorting is numeric, never string-based (C1). */
export function fromBn(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value !== "string") return 0;
  const en = value
    .replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)))
    .replace(/[^\d.]/g, "");
  const n = Number(en);
  return Number.isFinite(n) ? n : 0;
}

/** Like fromBn but keeps the sign: "▼ ২.৯%" -> -2.9 */
export function signedFromBn(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value !== "string") return 0;
  const n = fromBn(value);
  return /[-−▼]/.test(value) ? -n : n;
}

/** 1850 -> "১,৮৫০" */
export function bnNumber(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return toBn(rounded.toLocaleString("en-IN"));
}

/** 1850 -> "১,৮৫০ টাকা" */
export function formatPrice(n: number | string): string {
  return `${bnNumber(fromBn(n))} টাকা`;
}

/** "কেজি" -> "প্রতি কেজি" */
export function perUnit(unit: string): string {
  return `প্রতি ${unit}`;
}

/** 2.1 -> "▲ ২.১%" | -2.9 -> "▼ ২.৯%" | 0 -> "— ০.০%" */
export function formatChange(pct: number) {
  const abs = toBn(Math.abs(pct).toFixed(1));
  if (pct > 0.0001) {
    return { text: `▲ ${abs}%`, cls: "text-green-700 bg-green-100", dir: "up" as const };
  }
  if (pct < -0.0001) {
    return { text: `▼ ${abs}%`, cls: "text-red-700 bg-red-100", dir: "down" as const };
  }
  return { text: `— ${toBn("0.0")}%`, cls: "text-gray-600 bg-gray-200", dir: "flat" as const };
}

/** "রবিবার, ১৫ নভেম্বর ২০২৬" */
export function banglaDate(date = new Date()): string {
  return date.toLocaleDateString("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
