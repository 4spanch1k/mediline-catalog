import { useParams } from "react-router-dom";
import { translate } from "../i18n/translations";
import type { Locale } from "../types";

export function PageSkeleton() {
  const { locale: localeParam } = useParams();
  const locale: Locale =
    localeParam === "kz" || localeParam === "en" ? localeParam : "ru";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={translate(locale, "loading")}
      className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-2 gap-3 p-3 md:grid-cols-3 md:gap-4 md:p-6 xl:grid-cols-4 2xl:grid-cols-5"
    >
      {Array.from({ length: 10 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]"
        >
          <div className="aspect-[4/3] animate-pulse bg-[var(--background)]" />
          <div className="space-y-3 p-3">
            <div className="h-4 animate-pulse rounded bg-[var(--background)]" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--background)]" />
            <div className="h-8 animate-pulse rounded bg-[var(--background)]" />
          </div>
        </div>
      ))}
    </div>
  );
}
