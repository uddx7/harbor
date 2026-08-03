import { t } from "@/lib/i18n";

export function formatAirDate(value: string | null | undefined): string {
  if (!value) return "";
  const trimmed = value.length === 10 ? `${value}T00:00:00Z` : value;
  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatAirDateShort(value: string | null | undefined): string {
  if (!value) return "";
  const trimmed = value.length === 10 ? `${value}T00:00:00Z` : value;
  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function relativeTime(ts: number | null | undefined): string {
  if (!ts) return "";
  const sec = Math.round((Date.now() - ts) / 1000);
  if (sec < 45) return t("just now");
  const min = Math.round(sec / 60);
  if (min < 60) return t("{n}m ago", { n: min });
  const hr = Math.round(min / 60);
  if (hr < 24) return t("{n}h ago", { n: hr });
  const day = Math.round(hr / 24);
  if (day < 7) return t("{n}d ago", { n: day });
  const wk = Math.round(day / 7);
  if (wk < 5) return t("{n}w ago", { n: wk });
  const mo = Math.round(day / 30);
  if (mo < 12) return t("{n}mo ago", { n: mo });
  return t("{n}y ago", { n: Math.round(day / 365) });
}

const DAY_MS = 86400000;

export function daysFromTodayLocal(value: string | null | undefined): number | null {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!m) return null;
  const air = new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
  if (Number.isNaN(air.getTime())) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((air.getTime() - today.getTime()) / DAY_MS);
}
