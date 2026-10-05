import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FlaticonIcon } from "../components/FlaticonIcon";
import { categories, products } from "../data/products";
import { specificationSchema } from "../data/specSchema";
import { CatalogFilters } from "../components/CatalogFilters";
import { ProductCard } from "../components/ProductCard";
import { QuickView } from "../components/QuickView";
import { Seo } from "../components/Seo";
import { useLocale } from "../components/SiteLayout";
import { useCatalogState } from "../hooks/useCatalogState";
import {
  filterAndSortProducts,
  formatPrice,
  getCategoryFromSlug,
} from "../lib/catalog";
import { translate } from "../i18n/translations";
import type { Product } from "../types";
import { localizedPath } from "../lib/routes";
import { useDialogFocus } from "../hooks/useDialogFocus";
import {
  ArrowDownUp,
  Check,
  Grid2X2,
  List,
  SlidersHorizontal,
  X,
} from "lucide-react";

const DESKTOP_PAGE_SIZE = 20;

export function CatalogPage() {
  const locale = useLocale();
  const { category: categorySlug } = useParams();
  const [filters, update] = useCatalogState();
  const [queryDraft, setQueryDraft] = useState(filters.query);
  const queryTimer = useRef<number | undefined>(undefined);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortingOpen, setSortingOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState(filters);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const filterDialogRef = useRef<HTMLElement>(null);
  const sortingDialogRef = useRef<HTMLElement>(null);
  const sheetTouchStart = useRef<number | null>(null);
  const category = getCategoryFromSlug(categorySlug);
  const categoryInfo = categories.find((item) => item.id === category);
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  useEffect(() => {
    setQueryDraft(filters.query);
  }, [filters.query]);

  useEffect(() => {
    return () => window.clearTimeout(queryTimer.current);
  }, []);

  useDialogFocus(
    filtersOpen,
    filterDialogRef,
    () => setFiltersOpen(false),
    true,
  );
  useDialogFocus(
    sortingOpen,
    sortingDialogRef,
    () => setSortingOpen(false),
    true,
  );

  useEffect(() => {
    if (!filtersOpen) setDraftFilters(filters);
  }, [filters, filtersOpen]);

  function changeSearchQuery(value: string) {
    setQueryDraft(value);
    window.clearTimeout(queryTimer.current);
    queryTimer.current = window.setTimeout(() => update({ query: value }), 250);
  }

  const visibleProducts = filterAndSortProducts(products, {
    category,
    query: filters.query,
    brands: filters.brands,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    availableOnly: filters.availableOnly,
    specifications: filters.specifications,
    sort: filters.sort,
  });
  const pageCount = Math.max(
    1,
    Math.ceil(visibleProducts.length / DESKTOP_PAGE_SIZE),
  );
  const currentPage = Math.min(filters.page, pageCount);
  const desktopProducts = visibleProducts.slice(
    (currentPage - 1) * DESKTOP_PAGE_SIZE,
    currentPage * DESKTOP_PAGE_SIZE,
  );
  const pageStart = Math.max(1, Math.min(currentPage - 2, pageCount - 4));
  const pageNumbers = Array.from(
    { length: Math.min(5, pageCount) },
    (_, index) => pageStart + index,
  );
  const firstVisibleProduct =
    visibleProducts.length === 0
      ? 0
      : (currentPage - 1) * DESKTOP_PAGE_SIZE + 1;
  const lastVisibleProduct = Math.min(
    currentPage * DESKTOP_PAGE_SIZE,
    visibleProducts.length,
  );

  useEffect(() => {
    if (filters.page > pageCount) update({ page: pageCount });
  }, [filters.page, pageCount, update]);

  const draftVisibleCount = filterAndSortProducts(products, {
    category,
    query: filters.query,
    brands: draftFilters.brands,
    minPrice: draftFilters.minPrice,
    maxPrice: draftFilters.maxPrice,
    availableOnly: draftFilters.availableOnly,
    specifications: draftFilters.specifications,
    sort: filters.sort,
  }).length;
  const activeFilterChips: {
    id: string;
    label: string;
    remove: () => void;
  }[] = [];
  const activeFilterCount =
    Number(filters.query.trim().length > 0) +
    filters.brands.length +
    Number(filters.minPrice !== undefined) +
    Number(filters.maxPrice !== undefined) +
    Number(filters.availableOnly) +
    Object.values(filters.specifications).reduce(
      (total, values) => total + values.length,
      0,
    );

  if (filters.query) {
    activeFilterChips.push({
      id: "query",
      label: filters.query,
      remove: () => update({ query: "" }),
    });
  }
  filters.brands.forEach((brand) =>
    activeFilterChips.push({
      id: `brand:${brand}`,
      label: `${t("brand")}: ${brand}`,
      remove: () =>
        update({ brands: filters.brands.filter((item) => item !== brand) }),
    }),
  );
  if (filters.minPrice !== undefined) {
    activeFilterChips.push({
      id: "min-price",
      label: `${t("price")} ≥ ${formatPrice(filters.minPrice, locale)}`,
      remove: () => update({ minPrice: undefined }),
    });
  }
  if (filters.maxPrice !== undefined) {
    activeFilterChips.push({
      id: "max-price",
      label: `${t("price")} ≤ ${formatPrice(filters.maxPrice, locale)}`,
      remove: () => update({ maxPrice: undefined }),
    });
  }
  if (filters.availableOnly) {
    activeFilterChips.push({
      id: "stock",
      label: t("inStockOnly"),
      remove: () => update({ availableOnly: false }),
    });
  }
  for (const [key, values] of Object.entries(filters.specifications)) {
    const localizedKey = category
      ? specificationSchema[category]
          .flatMap((group) => group.specifications)
          .find((item) => item.key === key)?.label[locale]
      : key;
    values.forEach((value) =>
      activeFilterChips.push({
        id: `spec:${key}:${value}`,
        label: `${localizedKey}: ${value}`,
        remove: () => {
          const specifications = { ...filters.specifications };
          const remaining = specifications[key].filter(
            (item) => item !== value,
          );
          if (remaining.length) specifications[key] = remaining;
          else delete specifications[key];
          update({ specifications });
        },
      }),
    );
  }

  if (categorySlug && !category) {
    return (
      <p className="py-20 text-center text-title md:text-lg">
        {t("pageNotFound")}
      </p>
    );
  }

  const filterPanel = (
    <CatalogFilters
      locale={locale}
      category={category}
      filters={filters}
      update={update}
    />
  );
  const mobileFilterPanel = (
    <CatalogFilters
      locale={locale}
      category={category}
      filters={draftFilters}
      update={(change) =>
        setDraftFilters((current) => ({ ...current, ...change }))
      }
      mobile
    />
  );
  const sortOptions = [
    ["popular", t("popular"), t("sortPopularShort")],
    ["price-asc", t("priceAscending"), t("sortCheaperShort")],
    ["price-desc", t("priceDescending"), t("sortMoreExpensiveShort")],
    ["rating", t("topRated"), t("sortRatingShort")],
    ["newest", t("newest"), t("sortNewestShort")],
    ["discounts", t("discounts"), t("sortDiscountsShort")],
  ];
  const currentSortLabel =
    sortOptions.find(([value]) => value === filters.sort)?.[2] ??
    t("sortPopularShort");
  const productCountPlural =
    locale === "kz"
      ? "other"
      : new Intl.PluralRules(locale).select(draftVisibleCount);
  const productCountKey =
    productCountPlural === "one"
      ? "showProductsCountOne"
      : locale === "ru" && productCountPlural === "few"
        ? "showProductsCountFew"
        : "showProductsCount";

  function openFilters() {
    setDraftFilters(filters);
    setFiltersOpen(true);
  }

  function resetDraftFilters() {
    setDraftFilters({
      ...draftFilters,
      brands: [],
      minPrice: undefined,
      maxPrice: undefined,
      availableOnly: false,
      specifications: {},
    });
  }

  function applyDraftFilters() {
    update({
      brands: draftFilters.brands,
      minPrice: draftFilters.minPrice,
      maxPrice: draftFilters.maxPrice,
      availableOnly: draftFilters.availableOnly,
      specifications: draftFilters.specifications,
    });
    setFiltersOpen(false);
  }

  function clearAppliedFilters() {
    update({
      query: "",
      brands: [],
      minPrice: undefined,
      maxPrice: undefined,
      availableOnly: false,
      specifications: {},
    });
  }

  return (
    <>
      <Seo
        title={`${categoryInfo?.label[locale] ?? t("catalog")} — Mediline`}
        description={categoryInfo?.description[locale] ?? t("heroText")}
      />
      <nav
        aria-label={t("breadcrumb")}
        className="mb-4 hidden text-body text-muted md:block md:text-sm"
      >
        <Link to={`/${locale}/`} className="hover:text-accent">
          {t("home")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">
          {categoryInfo?.label[locale] ?? t("catalog")}
        </span>
      </nav>
      <div className="mb-2 space-y-1.5 md:hidden">
        <div className="-mx-3 flex snap-x snap-mandatory gap-2 overflow-x-auto px-3 py-1 [scroll-padding-inline:12px]">
          <Link
            to={localizedPath(locale, "/catalog")}
            aria-current={!category ? "page" : undefined}
            className={`flex h-8 shrink-0 snap-start items-center rounded-full border px-3 text-ui ${!category ? "border-transparent bg-button-accent text-on-accent" : "border-[var(--border)] bg-[var(--surface)] text-muted"}`}
          >
            {t("allProducts")}
          </Link>
          {categories.map((item) => (
            <Link
              key={item.id}
              to={localizedPath(locale, `/catalog/${item.slug}`)}
              aria-current={category === item.id ? "page" : undefined}
              className={`flex h-8 shrink-0 snap-start items-center rounded-full border px-3 text-ui ${category === item.id ? "border-transparent bg-button-accent text-on-accent" : "border-[var(--border)] bg-[var(--surface)] text-muted"}`}
            >
              {item.label[locale]}
            </Link>
          ))}
        </div>
        {categoryInfo && (
          <div className="-mx-3 flex snap-x snap-mandatory gap-2 overflow-x-auto px-3 py-1 [scroll-padding-inline:12px]">
            {categoryInfo.subcategories.map((subcategory) => {
              const isSelected =
                filters.query.toLocaleLowerCase() ===
                subcategory[locale].toLocaleLowerCase();
              return (
                <Link
                  key={subcategory.ru}
                  to={`${localizedPath(locale, `/catalog/${categoryInfo.slug}`)}?q=${encodeURIComponent(subcategory[locale])}`}
                  aria-current={isSelected ? "page" : undefined}
                  className={`flex h-7 shrink-0 snap-start items-center rounded-full border px-3 text-caption font-medium ${isSelected ? "border-transparent bg-button-accent text-on-accent" : "border-[var(--border)] bg-[var(--surface)] text-muted"}`}
                >
                  {subcategory[locale]}
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex items-start gap-5">
        <aside className="hidden w-60 shrink-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 lg:block">
          {filterPanel}
        </aside>
        <section className="min-w-0 flex-1">
          {category === "medical" && (
            <p className="mb-4 rounded-lg bg-[var(--accent-soft)] p-3 text-caption md:text-xs text-ink">
              {t("medicalNotice")}
            </p>
          )}
          <div className="catalog-mobile-tools sticky top-14 z-20 -mx-3 grid h-12 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-b border-[var(--border)] bg-[var(--surface)] px-3 md:hidden">
            <button type="button" onClick={openFilters} className="min-h-11">
              <span className="flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-ui">
                <SlidersHorizontal size={18} aria-hidden="true" />
                {t("filters")}
                {activeFilterCount > 0 && (
                  <span className="grid h-4 min-w-4 place-items-center rounded-full bg-button-accent px-1 text-micro text-on-accent">
                    {activeFilterCount}
                  </span>
                )}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSortingOpen(true)}
              className="min-h-11 min-w-0"
            >
              <span className="flex h-9 min-w-0 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-ui">
                <ArrowDownUp
                  size={18}
                  className="shrink-0"
                  aria-hidden="true"
                />
                <span className="truncate">{currentSortLabel}</span>
              </span>
            </button>
            <button
              type="button"
              aria-label={
                filters.view === "grid" ? t("listView") : t("gridView")
              }
              onClick={() =>
                update({ view: filters.view === "grid" ? "list" : "grid" })
              }
              className="grid h-11 w-11 place-items-center active:bg-[var(--accent-soft)]"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                {filters.view === "grid" ? (
                  <List size={18} aria-hidden="true" />
                ) : (
                  <Grid2X2 size={18} aria-hidden="true" />
                )}
              </span>
            </button>
          </div>
          {activeFilterChips.length > 0 && (
            <div
              className="-mx-3 mt-2 flex h-7 snap-x gap-1.5 overflow-x-auto px-3 [scroll-padding-inline:12px] md:hidden"
              aria-label={t("filters")}
            >
              {activeFilterChips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={chip.remove}
                  aria-label={`${t("remove")}: ${chip.label}`}
                  className="flex h-7 shrink-0 snap-start items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2 text-caption text-accent"
                >
                  <span className="max-w-40 truncate">{chip.label}</span>
                  <X size={14} aria-hidden="true" />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAppliedFilters}
                className="h-7 shrink-0 px-1 text-caption text-accent underline"
              >
                {t("clearFilters")}
              </button>
            </div>
          )}
          <p className="mb-2 mt-2 text-caption text-muted md:hidden">
            {t("foundCount")}: {visibleProducts.length}
          </p>
          <div>
            <div className="mb-4 hidden flex-wrap items-center gap-2 md:flex">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="flex h-10 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-body md:text-sm font-medium lg:hidden"
              >
                <FlaticonIcon
                  name="filter"
                  size={16}
                  className="flaticon-dark"
                />
                {t("filters")}
              </button>
              <p className="text-body md:text-sm text-muted">
                <strong className="text-ink">{visibleProducts.length}</strong>{" "}
                {t("productsFound")}
              </p>
              <div className="flex-1" />
              <label className="sr-only" htmlFor="sort-products">
                {t("sort")}
              </label>
              <select
                id="sort-products"
                value={filters.sort}
                onChange={(event) => update({ sort: event.target.value })}
                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-body md:text-sm"
              >
                <option value="popular">{t("popular")}</option>
                <option value="price-asc">{t("priceAscending")}</option>
                <option value="price-desc">{t("priceDescending")}</option>
                <option value="rating">{t("topRated")}</option>
                <option value="newest">{t("newest")}</option>
                <option value="discounts">{t("discounts")}</option>
              </select>
              <div className="flex h-10 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                <button
                  type="button"
                  aria-label={t("gridView")}
                  aria-pressed={filters.view === "grid"}
                  onClick={() => update({ view: "grid" })}
                  className={`px-2.5 ${filters.view === "grid" ? "bg-button-accent text-on-accent" : "text-muted"}`}
                >
                  <FlaticonIcon
                    name="grid"
                    size={17}
                    className={
                      filters.view === "grid"
                        ? "brightness-0 invert"
                        : "flaticon-dark"
                    }
                  />
                </button>
                <button
                  type="button"
                  aria-label={t("listView")}
                  aria-pressed={filters.view === "list"}
                  onClick={() => update({ view: "list" })}
                  className={`px-2.5 ${filters.view === "list" ? "bg-button-accent text-on-accent" : "text-muted"}`}
                >
                  <FlaticonIcon
                    name="list"
                    size={18}
                    className={
                      filters.view === "list"
                        ? "brightness-0 invert"
                        : "flaticon-dark"
                    }
                  />
                </button>
              </div>
            </div>
            <label className="mb-4 hidden md:block">
              <span className="sr-only">{t("search")}</span>
              <input
                list="catalog-suggestions"
                value={queryDraft}
                onChange={(event) => changeSearchQuery(event.target.value)}
                placeholder={t("searchPlaceholder")}
                className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-body md:text-sm outline-none focus:border-[var(--accent)]"
              />
              <datalist id="catalog-suggestions">
                {products.slice(0, 20).map((product) => (
                  <option key={product.id} value={product.name[locale]} />
                ))}
                {categories.map((item) => (
                  <option key={item.id} value={item.label[locale]} />
                ))}
              </datalist>
            </label>
            {activeFilterChips.length > 0 && (
              <div
                className="mb-4 hidden flex-wrap gap-2 md:flex"
                aria-label={t("filters")}
              >
                {activeFilterChips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={chip.remove}
                    aria-label={`${t("remove")}: ${chip.label}`}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-caption md:text-xs font-medium text-accent"
                  >
                    {chip.label}
                    <FlaticonIcon name="close" size={12} />
                  </button>
                ))}
              </div>
            )}
            <div
              className={
                filters.view === "grid"
                  ? "grid grid-cols-2 items-stretch gap-2 md:grid-cols-3 md:gap-4 xl:grid-cols-4 2xl:grid-cols-5"
                  : "grid grid-cols-1 items-stretch gap-2 md:gap-3"
              }
            >
              {desktopProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                  view={filters.view}
                  onQuickView={setQuickView}
                />
              ))}
            </div>
            {visibleProducts.length > 0 && pageCount > 1 && (
              <nav
                aria-label={t("pagination")}
                className="mt-6 flex flex-col items-center gap-3 md:flex-row md:justify-between md:gap-4"
              >
                <p className="text-center text-caption text-muted md:text-left">
                  {t("showingProducts")} {firstVisibleProduct}–
                  {lastVisibleProduct} {t("ofProducts")}{" "}
                  {visibleProducts.length}
                </p>
                <div className="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    aria-label={t("previousPage")}
                    disabled={currentPage === 1}
                    onClick={() => update({ page: currentPage - 1 })}
                    className="h-10 min-w-9 rounded-lg border border-[var(--border)] px-2 text-ui disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ‹
                  </button>
                  {pageNumbers.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      aria-label={`${t("page")} ${pageNumber}`}
                      aria-current={
                        pageNumber === currentPage ? "page" : undefined
                      }
                      onClick={() => update({ page: pageNumber })}
                      className={`h-10 min-w-9 rounded-lg border px-2 text-ui ${pageNumber === currentPage ? "border-transparent bg-button-accent text-on-accent" : "border-[var(--border)] bg-[var(--surface)] text-ink"}`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  <button
                    type="button"
                    aria-label={t("nextPage")}
                    disabled={currentPage === pageCount}
                    onClick={() => update({ page: currentPage + 1 })}
                    className="h-10 min-w-9 rounded-lg border border-[var(--border)] px-2 text-ui disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ›
                  </button>
                </div>
              </nav>
            )}
            {visibleProducts.length === 0 && (
              <div className="mt-5 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center">
                <p className="font-semibold">{t("noProducts")}</p>
                <p className="mt-1 text-body md:text-sm text-muted">
                  {t("changeFilters")}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    update({
                      query: "",
                      brands: [],
                      minPrice: undefined,
                      maxPrice: undefined,
                      availableOnly: false,
                      specifications: {},
                    })
                  }
                  className="mt-4 text-body md:text-sm font-semibold text-accent"
                >
                  {t("clearFilters")}
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
      {filtersOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={(event) => {
            if (event.target === event.currentTarget) setFiltersOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label={t("filters")}
            ref={filterDialogRef}
            tabIndex={-1}
            onTouchStart={(event) => {
              sheetTouchStart.current = event.touches[0]?.clientY ?? null;
            }}
            onTouchEnd={(event) => {
              const start = sheetTouchStart.current;
              const end = event.changedTouches[0]?.clientY;
              if (start !== null && end !== undefined && end - start > 70)
                setFiltersOpen(false);
              sheetTouchStart.current = null;
            }}
            className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-2xl bg-[var(--surface)]"
          >
            <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface)] px-4 pb-2">
              <div className="mx-auto mb-2 mt-2 h-1 w-9 rounded-full bg-[var(--border-strong)]" />
              <div className="flex min-h-11 items-center justify-between">
                <h2 className="text-heading">{t("filters")}</h2>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={resetDraftFilters}
                    className="min-h-11 px-2 text-ui text-accent"
                  >
                    {t("reset")}
                  </button>
                  <button
                    type="button"
                    aria-label={t("close")}
                    onClick={() => setFiltersOpen(false)}
                    className="grid h-11 w-11 place-items-center text-muted"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
              {mobileFilterPanel}
            </div>
            <div className="sticky bottom-0 flex gap-2 border-t border-[var(--border)] bg-[var(--surface)] p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
              <button
                type="button"
                onClick={resetDraftFilters}
                className="min-h-11 rounded-lg border border-[var(--border)] px-3 text-ui"
              >
                {t("reset")}
              </button>
              <button
                type="button"
                onClick={applyDraftFilters}
                className="min-h-11 flex-1 rounded-lg bg-button-accent px-3 text-ui font-semibold text-on-accent"
              >
                {t(productCountKey).replace(
                  "{count}",
                  String(draftVisibleCount),
                )}
              </button>
            </div>
          </section>
        </div>
      )}
      {sortingOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSortingOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label={t("sort")}
            ref={sortingDialogRef}
            tabIndex={-1}
            onTouchStart={(event) => {
              sheetTouchStart.current = event.touches[0]?.clientY ?? null;
            }}
            onTouchEnd={(event) => {
              const start = sheetTouchStart.current;
              const end = event.changedTouches[0]?.clientY;
              if (start !== null && end !== undefined && end - start > 70)
                setSortingOpen(false);
              sheetTouchStart.current = null;
            }}
            className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-[var(--surface)] px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]"
          >
            <div className="mx-auto mb-3 mt-2 h-1 w-9 rounded-full bg-[var(--border-strong)]" />
            <h2 className="mb-2 text-heading">{t("sort")}</h2>
            <div role="radiogroup" aria-label={t("sort")}>
              {sortOptions.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={filters.sort === value}
                  onClick={() => {
                    update({ sort: value });
                    setSortingOpen(false);
                  }}
                  className="flex h-12 w-full items-center justify-between border-b border-[var(--border)] text-left text-body"
                >
                  {label}
                  {filters.sort === value && (
                    <Check
                      size={18}
                      className="text-accent"
                      aria-hidden="true"
                    />
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
      {quickView && (
        <QuickView
          product={quickView}
          locale={locale}
          onClose={() => setQuickView(null)}
        />
      )}
    </>
  );
}
