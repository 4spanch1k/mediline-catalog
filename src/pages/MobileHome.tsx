import { Link } from "react-router-dom";
import { MobileCategoryTiles } from "../components/MobileCategoryTiles";
import { ProductCard } from "../components/ProductCard";
import { products } from "../data/products";
import { siteConfig } from "../config/site";
import { translate } from "../i18n/translations";
import { localizedPath } from "../lib/routes";
import { useShop } from "../hooks/useShop";
import type { Locale } from "../types";

export function MobileHome({ locale }: { locale: Locale }) {
  const shop = useShop();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const recentlyViewed = shop.recentlyViewed
    .map((productId) => products.find((product) => product.id === productId))
    .filter((product) => product !== undefined);
  const productsToShow = recentlyViewed.length
    ? recentlyViewed
    : products.slice(0, 8);

  return (
    <div className="md:hidden">
      <section aria-label={t("popularCategories")}>
        <MobileCategoryTiles locale={locale} />
      </section>
      <section className="mt-5">
        <h1 className="mb-3 text-body md:text-base font-bold">
          {recentlyViewed.length ? t("recentlyViewed") : t("popularSection")}
        </h1>
        <div className="grid grid-cols-2 items-stretch gap-2">
          {productsToShow.map((product) => (
            <div key={product.id} className="min-w-0">
              <ProductCard product={product} locale={locale} />
            </div>
          ))}
        </div>
      </section>
      <footer className="mt-4 border-t border-[var(--border)] py-4 text-caption md:text-xs text-muted">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {siteConfig.displayPhone && (
            <a
              href={`tel:+${siteConfig.whatsAppNumber}`}
              className="font-medium"
            >
              {siteConfig.displayPhone}
            </a>
          )}
          <div className="flex gap-4">
            <Link to={localizedPath(locale, "/about")}>{t("about")}</Link>
            <Link to={localizedPath(locale, "/contacts")}>{t("contacts")}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
