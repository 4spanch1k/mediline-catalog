import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Moon, Search, Sun, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { categories, products } from "../data/products";
import { translate } from "../i18n/translations";
import { matchesProductSearch } from "../lib/catalog";
import { localizedPath } from "../lib/routes";
import type { Locale, Product } from "../types";
import { useShop } from "../hooks/useShop";
import { useDialogFocus } from "../hooks/useDialogFocus";

const locales: Locale[] = ["kz", "ru", "en"];
const recentSearchesKey = "mediline-recent-searches";

function HighlightedText({ text, query }: { text: string; query: string }) {
  const start = text.toLocaleLowerCase().indexOf(query.toLocaleLowerCase());
  if (start < 0 || !query) return text;

  return (
    <>
      {text.slice(0, start)}
      <mark className="rounded bg-[var(--accent-soft)] text-ink">
        {text.slice(start, start + query.length)}
      </mark>
      {text.slice(start + query.length)}
    </>
  );
}

function readRecentSearches(): string[] {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(recentSearchesKey) ?? "[]",
    );
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export function MobileHeader({ locale }: { locale: Locale }) {
  const location = useLocation();
  const navigate = useNavigate();
  const shop = useShop();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(readRecentSearches);
  const [headerHidden, setHeaderHidden] = useState(false);
  const previousScrollY = useRef(0);
  const searchDialogRef = useRef<HTMLElement>(null);
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const pathWithoutLocale =
    location.pathname.replace(/^\/(ru|kz|en)/, "") || "/";
  const isCatalogPage = pathWithoutLocale.startsWith("/catalog");
  const matchingProducts = query
    ? products
        .filter((product) => matchesProductSearch(product, query))
        .slice(0, 5)
    : [];
  const matchingCategories = query
    ? categories.filter((category) =>
        Object.values(category.label).some((label) =>
          label.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
        ),
      )
    : [];

  useDialogFocus(
    searchOpen,
    searchDialogRef,
    () => setSearchOpen(false),
    true,
    "input",
  );

  useEffect(() => {
    if (!isCatalogPage) {
      setHeaderHidden(false);
      document.documentElement.removeAttribute("data-catalog-header-hidden");
      return;
    }

    function updateHeaderOnScroll() {
      const currentScrollY = window.scrollY;
      const movingDown = currentScrollY > previousScrollY.current;
      setHeaderHidden(currentScrollY > 80 && movingDown && !searchOpen);
      previousScrollY.current = currentScrollY;
    }

    window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateHeaderOnScroll);
  }, [isCatalogPage, searchOpen]);

  useEffect(() => {
    document.documentElement.dataset.catalogHeaderHidden = String(
      isCatalogPage && headerHidden,
    );
    return () => {
      document.documentElement.removeAttribute("data-catalog-header-hidden");
    };
  }, [headerHidden, isCatalogPage]);

  function changeLocale(nextLocale: Locale) {
    localStorage.setItem("mediline-locale", nextLocale);
    navigate(
      `${localizedPath(nextLocale, pathWithoutLocale)}${location.search}`,
    );
  }

  function searchProducts(value = query) {
    const cleanQuery = value.trim();
    if (!cleanQuery) return;
    const nextSearches = [
      cleanQuery,
      ...recentSearches.filter(
        (item) => item.toLocaleLowerCase() !== cleanQuery.toLocaleLowerCase(),
      ),
    ].slice(0, 6);
    setRecentSearches(nextSearches);
    localStorage.setItem(recentSearchesKey, JSON.stringify(nextSearches));
    setSearchOpen(false);
    navigate(
      `${localizedPath(locale, "/catalog")}?q=${encodeURIComponent(cleanQuery)}`,
    );
  }

  function openProduct(product: Product) {
    setSearchOpen(false);
    navigate(localizedPath(locale, `/product/${product.slug}`));
  }

  return (
    <>
      <header
        className={`sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)] px-3 py-2 transition-transform motion-reduce:transition-none md:hidden ${isCatalogPage && headerHidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="flex h-11 items-center gap-2">
          <select
            aria-label={t("language")}
            value={locale}
            onChange={(event) => changeLocale(event.target.value as Locale)}
            className="h-11 w-[58px] shrink-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2 text-caption md:text-xs font-semibold"
          >
            {locales.map((item) => (
              <option key={item} value={item}>
                {item.toUpperCase()}
              </option>
            ))}
          </select>
          <button
            type="button"
            aria-label={shop.darkMode ? t("lightTheme") : t("darkTheme")}
            title={shop.darkMode ? t("lightTheme") : t("darkTheme")}
            onClick={shop.toggleTheme}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted"
          >
            {shop.darkMode ? (
              <Sun size={17} aria-hidden="true" />
            ) : (
              <Moon size={17} aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl bg-[var(--background)] px-3 text-left text-body md:text-sm text-muted"
          >
            <Search size={18} aria-hidden="true" />
            <span className="truncate">{t("mobileSearchPlaceholder")}</span>
          </button>
        </div>
      </header>

      {searchOpen && (
        <section
          role="dialog"
          aria-modal="true"
          aria-label={t("search")}
          ref={searchDialogRef}
          tabIndex={-1}
          className="fixed inset-0 z-50 overflow-y-auto bg-[var(--background)] p-3 md:hidden"
        >
          <div className="flex h-11 items-center gap-3">
            <button
              type="button"
              aria-label={t("back")}
              onClick={() => setSearchOpen(false)}
              className="flex h-10 shrink-0 items-center gap-1 text-body md:text-sm font-medium"
            >
              <ArrowLeft size={20} aria-hidden="true" />
              {t("back")}
            </button>
            <form
              role="search"
              className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl bg-[var(--surface)] px-3"
              onSubmit={(event) => {
                event.preventDefault();
                searchProducts();
              }}
            >
              <Search
                size={18}
                className="shrink-0 text-muted"
                aria-hidden="true"
              />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("mobileSearchPlaceholder")}
                className="min-w-0 flex-1 bg-transparent text-body md:text-sm outline-none placeholder:text-muted"
              />
              {query && (
                <button
                  type="button"
                  aria-label={t("clearSearch")}
                  onClick={() => setQuery("")}
                  className="shrink-0 text-muted"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              )}
            </form>
          </div>

          {!query && recentSearches.length > 0 && (
            <section className="mt-6">
              <h2 className="mb-2 text-caption md:text-xs font-semibold tracking-wide text-muted">
                {t("recentSearches")}
              </h2>
              <div className="flex flex-col">
                {recentSearches.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => searchProducts(item)}
                    className="border-b border-[var(--border)] py-3 text-left text-body md:text-sm"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </section>
          )}

          {query &&
            matchingCategories.length + matchingProducts.length === 0 && (
              <p className="py-8 text-center text-body md:text-sm text-muted">
                {t("noSuggestions")}
              </p>
            )}
          {matchingCategories.length > 0 && (
            <section className="mt-5">
              <h2 className="mb-2 text-caption md:text-xs font-semibold tracking-wide text-muted">
                {t("popularCategories")}
              </h2>
              {matchingCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`${localizedPath(locale, `/catalog/${category.slug}`)}?q=${encodeURIComponent(query)}`}
                  onClick={() => setSearchOpen(false)}
                  className="block border-b border-[var(--border)] py-3 text-body md:text-sm"
                >
                  <HighlightedText
                    text={category.label[locale]}
                    query={query}
                  />
                </Link>
              ))}
            </section>
          )}
          {matchingProducts.length > 0 && (
            <section className="mt-5">
              <h2 className="mb-2 text-caption md:text-xs font-semibold tracking-wide text-muted">
                {t("search")}
              </h2>
              {matchingProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => openProduct(product)}
                  className="block w-full border-b border-[var(--border)] py-3 text-left text-body md:text-sm"
                >
                  <HighlightedText text={product.name[locale]} query={query} />
                </button>
              ))}
            </section>
          )}
        </section>
      )}
    </>
  );
}
