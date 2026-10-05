import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { useLocale } from "../components/SiteLayout";
import { localizedPath } from "../lib/routes";
import { siteConfig } from "../config/site";
import { translate } from "../i18n/translations";

export function AboutPage() {
  const locale = useLocale();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <>
      <Seo title={`${t("about")} — Mediline`} description={t("aboutText")} />
      <h1 className="text-title md:text-2xl font-bold">{t("about")}</h1>
      <p className="mt-4 max-w-2xl text-muted">{t("aboutText")}</p>
      <p className="mt-3 text-body md:text-sm text-muted">{t("priceNotice")}</p>
      <Link
        to={localizedPath(locale, "/catalog")}
        className="mt-5 inline-block font-semibold text-accent"
      >
        {t("browseCatalog")}
      </Link>
    </>
  );
}

export function NotFoundPage() {
  const locale = useLocale();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <>
      <Seo
        title={`${t("pageNotFound")} — Mediline`}
        description={t("pageNotFound")}
      />
      <section className="py-16 text-center">
        <h1 className="text-title md:text-2xl font-bold">
          {t("pageNotFound")}
        </h1>
        <Link
          to={localizedPath(locale, "/")}
          className="mt-4 inline-block font-semibold text-accent"
        >
          {t("backHome")}
        </Link>
      </section>
    </>
  );
}

export function ContactsPage() {
  const locale = useLocale();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const formattedPhone = siteConfig.displayPhone || t("contactPhone");
  const address = siteConfig.address || t("contactAddress");
  const email = siteConfig.email || t("contactEmail");

  return (
    <>
      <Seo
        title={`${t("contacts")} — Mediline`}
        description={t("contactPhone")}
      />
      <h1 className="text-title md:text-2xl font-bold">{t("contacts")}</h1>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-body md:text-sm font-semibold">{address}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-body md:text-sm font-semibold">{email}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-body md:text-sm font-semibold">{formattedPhone}</p>
          {siteConfig.displayPhone && (
            <a
              href={`tel:+${siteConfig.whatsAppNumber}`}
              className="mt-2 inline-block text-body md:text-sm font-semibold text-accent"
            >
              {t("contactPhone")}
            </a>
          )}
          {siteConfig.whatsAppNumber && (
            <a
              href={`https://wa.me/${siteConfig.whatsAppNumber}`}
              className="mt-2 inline-block text-body md:text-sm font-semibold text-accent"
            >
              {t("contactPhone")}
            </a>
          )}
        </div>
      </div>
      <div className="mt-5 flex min-h-48 items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] text-body md:text-sm text-muted">
        {address}
      </div>
    </>
  );
}
