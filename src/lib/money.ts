import type { Currency } from "@/domain/types";

const FORMATTERS: Record<Currency, Intl.NumberFormat> = {
  TWD: new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  }),
  USD: new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }),
};

const COMPACT_FORMATTERS: Record<Currency, Intl.NumberFormat> = {
  TWD: new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    notation: "compact",
    maximumFractionDigits: 1,
  }),
  USD: new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }),
};

export function formatMoney(amount: number, currency: Currency): string {
  if (!Number.isFinite(amount)) return FORMATTERS[currency].format(0);
  return FORMATTERS[currency].format(Math.round(amount));
}

export function formatMoneyCompact(amount: number, currency: Currency): string {
  if (!Number.isFinite(amount)) return COMPACT_FORMATTERS[currency].format(0);
  return COMPACT_FORMATTERS[currency].format(amount);
}

export function formatPercent(
  ratio: number,
  fractionDigits: number = 1,
): string {
  if (!Number.isFinite(ratio)) return "–";
  return `${(ratio * 100).toFixed(fractionDigits)}%`;
}

export function formatScore(score: number): string {
  if (!Number.isFinite(score)) return "–";
  return score.toFixed(0);
}
