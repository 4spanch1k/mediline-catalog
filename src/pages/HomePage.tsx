import { Link, useNavigate } from "react-router-dom";
import { categories, products } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { Seo } from "../components/Seo";
import { useLocale } from "../components/SiteLayout";
import { localizedPath } from "../lib/routes";
import { translate } from "../i18n/translations";
import { useShop } from "../hooks/useShop";
import { siteConfig } from "../config/site";
import { FlaticonIcon } from "../components/FlaticonIcon";

export function HomePage() {
  const locale = useLocale();
  const navigate = useNavigate();
  const shop = useShop();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const featured = products.slice(0, 4);
  const newArrivals = [...products]
    .sort((first, second) => second.addedAt.localeCompare(first.addedAt))
    .slice(0, 4);
  const offers = products.filter((product) => product.oldPrice).slice(0, 4);
  const recentlyViewed = shop.recentlyViewed
    .map((productId) => products.find((product) => product.id === productId))
    .filter((product) => product !== undefined);

  return (
    <>
      <Seo title={`${t("heroTitle")} — Mediline`} description={t("heroText")} />
      <section className="relative isolate overflow-hidden rounded-2xl bg-[var(--hero)] px-5 py-10 text-hero-text sm:px-8 sm:py-14 xl:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[34%] overflow-hidden md:block"
        >
          <img
            src="/assets/figma/home-illustration.png"
            alt=""
            className="home-illustration h-full w-full object-contain object-bottom"
          />
        </div>
        <div className="relative z-10 max-w-full md:max-w-[58%]">
          <p className="text-body md:text-sm font-semibold tracking-wide text-hero-muted">
            Mediline
          </p>
          <h1 className="mt-3 max-w-2xl text-display font-bold leading-[1.05] tracking-tight md:text-5xl xl:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 max-w-xl text-body leading-7 text-hero-muted sm:text-base md:text-lg md:leading-8">
            {t("heroText")}
          </p>
          <form
            className="mt-7 flex max-w-xl gap-2 rounded-xl bg-white p-2"
            onSubmit={(event) => {
              event.preventDefault();
              const query =
                new FormData(event.currentTarget).get("q")?.toString() ?? "";
              navigate(
                `${localizedPath(locale, "/catalog")}?q=${encodeURIComponent(query)}`,
              );
            }}
          >
            <input
              name="q"
              aria-label={t("search")}
              placeholder={t("searchPlaceholder")}
              className="min-w-0 flex-1 px-2 text-body text-ink outline-none placeholder:text-muted md:text-sm"
            />
            <button
              type="submit"
              className="rounded-lg bg-button-accent px-4 py-2 text-body md:text-sm font-semibold text-on-accent"
            >
              {t("search")}
            </button>
          </form>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-heading md:text-xl font-bold">
            {t("shopByCategory")}
          </h2>
          <Link
            to={localizedPath(locale, "/catalog")}
            className="text-body md:text-sm font-medium text-accent"
          >
            {t("browseCatalog")}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {categories.map((category) => {
            return (
              <Link
                key={category.id}
                to={localizedPath(locale, `/catalog/${category.slug}`)}
                className="group flex min-h-28 items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--border-strong)]"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-white p-1.5">
                  <FlaticonIcon name={category.id} size={50} />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold transition-colors group-hover:text-accent">
                    {category.label[locale]}
                  </span>
                  <span className="mt-1 block text-caption md:text-xs text-muted">
                    {
                      products.filter(
                        (product) => product.category === category.id,
                      ).length
                    }
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-9">
        <h2 className="mb-4 text-heading md:text-xl font-bold">
          {t("featured")}
        </h2>
        <div className="grid grid-cols-2 items-stretch gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4 2xl:grid-cols-5">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </section>

      <section className="mt-9">
        <h2 className="mb-4 text-heading md:text-xl font-bold">
          {t("newArrivals")}
        </h2>
        <div className="grid grid-cols-2 items-stretch gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4 2xl:grid-cols-5">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </section>

      <section className="mt-9">
        <h2 className="mb-4 text-heading md:text-xl font-bold">
          {t("offers")}
        </h2>
        <div className="grid grid-cols-2 items-stretch gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4 2xl:grid-cols-5">
          {offers.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </section>

      {recentlyViewed.length > 0 && (
        <section className="mt-9">
          <h2 className="mb-4 text-heading md:text-xl font-bold">
            {t("recentlyViewed")}
          </h2>
          <div className="grid grid-cols-2 items-stretch gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4 2xl:grid-cols-5">
            {recentlyViewed.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10 grid gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:grid-cols-2 sm:p-7">
        <div>
          <h2 className="text-heading md:text-xl font-bold">{t("contacts")}</h2>
          <p className="mt-3 text-body md:text-sm text-muted">
            {siteConfig.address || t("contactAddress")}
          </p>
          <p className="mt-1 text-body md:text-sm text-muted">
            {siteConfig.email || t("contactEmail")}
          </p>
          {siteConfig.displayPhone && (
            <a
              href={`tel:+${siteConfig.whatsAppNumber}`}
              className="mt-1 inline-block text-body md:text-sm font-medium text-accent"
            >
              {siteConfig.displayPhone}
            </a>
          )}
          <Link
            to={localizedPath(locale, "/contacts")}
            className="mt-3 block text-body md:text-sm font-semibold text-accent"
          >
            {t("contacts")}
          </Link>
        </div>
        <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-[var(--border)] px-4 text-center text-body md:text-sm text-muted">
          {siteConfig.address || t("contactAddress")}
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
        <h2 className="text-heading md:text-xl font-bold">{t("howToOrder")}</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3">
          {[t("stepOneText"), t("stepTwoText"), t("stepThreeText")].map(
            (step, index) => (
              <li
                key={step}
                className="flex gap-3 text-body md:text-sm text-muted"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] font-semibold text-accent">
                  {index + 1}
                </span>
                {step}
              </li>
            ),
          )}
        </ol>
      </section>
    </>
  );
}
