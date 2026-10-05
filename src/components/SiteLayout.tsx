import { useEffect } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { categories } from "../data/products";
import { siteConfig } from "../config/site";
import { localizedPath } from "../lib/routes";
import { translate } from "../i18n/translations";
import type { Locale } from "../types";
import { Header } from "./Header";
import logo from "../assets/logo.svg";
import { useShop } from "../hooks/useShop";
import { initializeAnalytics } from "../lib/analytics";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNav } from "./MobileBottomNav";
import { FlaticonIcon } from "./FlaticonIcon";

const locales: Locale[] = ["ru", "kz", "en"];

export function SiteLayout() {
  const { locale: localeParam } = useParams();
  const location = useLocation();
  const shop = useShop();
  const locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : "ru";
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const pathWithoutLocale =
    location.pathname.replace(/^\/(ru|kz|en)/, "") || "/";
  const showMobileWhatsApp = ["/", "/about", "/contacts"].includes(
    pathWithoutLocale,
  );
  const hideMobileWhatsApp = !showMobileWhatsApp;
  const isMobileProductPage = /\/product\/[^/]+$/.test(location.pathname);

  useEffect(() => {
    document.documentElement.lang = locale === "kz" ? "kk" : locale;
    initializeAnalytics();
  }, [locale]);

  useEffect(() => {
    const storageKey = `mediline-scroll-${location.key}`;
    const savedPosition = Number(sessionStorage.getItem(storageKey)) || 0;
    const restore = window.requestAnimationFrame(() =>
      window.scrollTo(0, savedPosition),
    );
    const savePosition = () =>
      sessionStorage.setItem(storageKey, String(window.scrollY));
    window.addEventListener("scroll", savePosition, { passive: true });
    return () => {
      window.cancelAnimationFrame(restore);
      savePosition();
      window.removeEventListener("scroll", savePosition);
    };
  }, [location.key]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-ink">
      <MobileHeader locale={locale} />
      <div className="hidden md:block">
        <Header locale={locale} />
      </div>
      <main className="mx-auto min-h-[60vh] max-w-[1600px] px-3 py-4 pb-24 md:px-6 md:py-8 md:pb-8">
        <Outlet context={{ locale }} />
      </main>
      <footer className="hidden border-t border-[var(--border)] bg-[var(--surface)] md:block">
        <div className="mx-auto grid max-w-[1600px] gap-8 px-3 py-9 text-body md:grid-cols-[1fr_1.15fr_0.9fr] md:px-6 md:text-sm">
          <div>
            <img src={logo} alt="Mediline" className="mb-3 h-7 w-auto" />
            <p className="max-w-sm text-muted">{t("footerNote")}</p>
            {siteConfig.displayPhone && (
              <a
                href={`https://wa.me/${siteConfig.whatsAppNumber}`}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-ui font-medium hover:border-[var(--border-strong)]"
              >
                <FlaticonIcon name="whatsapp" size={22} />
                {siteConfig.displayPhone}
              </a>
            )}
          </div>
          <div>
            <h2 className="font-semibold">{t("footerCategories")}</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={localizedPath(locale, `/catalog/${category.slug}`)}
                  className="flex min-w-0 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] p-2 text-ui text-muted transition-colors hover:border-[var(--border-strong)] hover:text-accent"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-white">
                    <FlaticonIcon name={category.id} size={30} />
                  </span>
                  <span className="min-w-0">{category.label[locale]}</span>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-semibold">{t("footerInfo")}</h2>
            <div className="mt-4 flex flex-col gap-2 text-ui text-muted">
              <Link className="hover:text-accent" to={localizedPath(locale, "/about")}>{t("about")}</Link>
              <Link className="hover:text-accent" to={localizedPath(locale, "/contacts")}>
                {t("contacts")}
              </Link>
              <Link className="hover:text-accent" to={localizedPath(locale, "/compare")}>
                {t("compare")} ({shop.compare.length})
              </Link>
              <p className="pt-2 text-caption text-muted">{siteConfig.address || t("contactAddress")}</p>
              <p className="text-caption text-muted">
                {siteConfig.email ? (
                  <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                ) : (
                  t("contactEmail")
                )}
              </p>
            </div>
          </div>
        </div>
      </footer>
      {siteConfig.whatsAppNumber && (
        <a
          href={`https://wa.me/${siteConfig.whatsAppNumber}`}
          target="_blank"
          rel="noreferrer"
          aria-label={t("orderWhatsApp")}
          className={`fixed bottom-[calc(56px+env(safe-area-inset-bottom)+0.75rem)] right-3 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-600 bg-white md:bottom-6 md:right-6 md:h-14 md:w-14 ${hideMobileWhatsApp ? "hidden md:flex" : ""}`}
        >
          <FlaticonIcon name="whatsapp" size={36} />
        </a>
      )}
      <p className="hidden border-t border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-center text-caption md:text-xs text-muted md:block">
        {t("iconAttribution")} ·{" "}
        <a
          href="https://www.figma.com/design/f42E1fBRGGhGYX3GtSNfdd/Ecommerce-Club---312-Ecommerce-Illustrations--Community-?node-id=1485-3"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          {t("figmaAttribution")}
        </a>
        {" · "}
        <a
          href="https://www.flaticon.com/"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Flaticon
        </a>
      </p>
      {!isMobileProductPage && <MobileBottomNav locale={locale} />}
    </div>
  );
}

export function useLocale(): Locale {
  const { locale } = useParams();
  return locales.includes(locale as Locale) ? (locale as Locale) : "ru";
}
