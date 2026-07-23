"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";
import { Clock } from "lucide-react";

export function ComingSoonPage({
  titleEn,
  titleAr,
}: {
  titleEn: string;
  titleAr: string;
}) {
  const { locale, t } = useLocale();
  const title = locale === "ar" ? titleAr : titleEn;

  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/15">
        <Clock className="h-6 w-6 text-ink/60" />
      </div>
      <h1 className="text-xl font-semibold text-ink">{title}</h1>
      <p className="mt-1 text-sm font-medium text-gold-dark">
        {t.common.comingSoonTitle}
      </p>
      <p className="mt-2 max-w-sm text-sm text-ink/60">
        {t.common.comingSoonBody}
      </p>
    </div>
  );
}