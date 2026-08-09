/**
 * Kuwait Timezone Utilities (Asia/Kuwait - AST GMT+3)
 * Enforces official Kuwait commercial time formatting across POS, receipts, and invoices.
 */

export const KUWAIT_TIMEZONE = "Asia/Kuwait";

export function formatKuwaitTime(
  date: Date = new Date(),
  locale: "en" | "ar" = "en"
): string {
  return date.toLocaleTimeString(locale === "ar" ? "ar-KW" : "en-US", {
    timeZone: KUWAIT_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function formatKuwaitDate(
  date: Date = new Date(),
  locale: "en" | "ar" = "en"
): string {
  return date.toLocaleDateString(locale === "ar" ? "ar-KW" : "en-US", {
    timeZone: KUWAIT_TIMEZONE,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatKuwaitDateTime(
  date: Date = new Date(),
  locale: "en" | "ar" = "en"
): string {
  return `${formatKuwaitDate(date, locale)} ${formatKuwaitTime(date, locale)}`;
}
