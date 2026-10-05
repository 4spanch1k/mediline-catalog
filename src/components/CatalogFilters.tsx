import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useState } from "react";
import { categories, brands, products } from "../data/products";
import { specificationSchema } from "../data/specSchema";
import { formatPrice } from "../lib/catalog";
import { translate } from "../i18n/translations";
import type {
  CatalogFilters as FilterState,
  CategoryId,
  Locale,
} from "../types";

export function CatalogFilters({
  locale,
  category,
  filters,
  update,
  mobile = false,
}: {
  locale: Locale;
  category?: CategoryId;
  filters: FilterState;
  update: (update: Partial<FilterState>) => void;
  mobile?: boolean;
}) {
  const [brandQuery, setBrandQuery] = useState("");
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const availableBrands = brands.filter((brand) =>
    products.some(
      (product) =>
        (!category || product.category === category) && product.brand === brand,
    ),
  );
  const specKeys = category
    ? specificationSchema[category].flatMap((group) =>
        group.specifications.filter((definition) => definition.filterable),
      )
    : [];
  const priceLimit = Math.max(
    ...products
      .filter((product) => !category || product.category === category)
      .map((product) => product.price),
  );
  const filteredBrands = availableBrands.filter((brand) =>
    brand.toLocaleLowerCase().includes(brandQuery.toLocaleLowerCase()),
  );

  function toggleBrand(brand: string) {
    const values = filters.brands.includes(brand)
      ? filters.brands.filter((value) => value !== brand)
      : [...filters.brands, brand];
    update({ brands: values });
  }

  function toggleSpecification(key: string, value: string) {
    const selected = filters.specifications[key] ?? [];
    const values = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    update({ specifications: { ...filters.specifications, [key]: values } });
  }

  return (
    <div className="space-y-5 text-body md:text-sm">
      <section className={mobile ? "hidden" : ""}>
        <h2 className="mb-2 font-semibold">{t("allCategories")}</h2>
        <div className="flex flex-wrap gap-1.5 lg:flex-col">
          {categories.map((item) => (
            <Link
              key={item.id}
              to={`/${locale}/catalog/${item.slug}`}
              aria-current={category === item.id ? "page" : undefined}
              className={`rounded-lg px-2.5 py-2 ${category === item.id ? "bg-[var(--accent-soft)] font-semibold text-accent" : "text-muted hover:bg-[var(--background)]"}`}
            >
              {item.label[locale]}
            </Link>
          ))}
        </div>
      </section>
      <details
        className={mobile ? "border-b border-[var(--border)] pb-2" : "pb-0"}
        open
      >
        <summary
          className={
            mobile
              ? "min-h-11 cursor-pointer list-none py-2 text-ui font-semibold"
              : "mb-2 cursor-pointer list-none font-semibold"
          }
        >
          {t("brand")}
        </summary>
        {mobile && availableBrands.length > 8 && (
          <label className="mb-2 flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border)] px-3">
            <Search size={16} aria-hidden="true" />
            <span className="sr-only">{t("brandSearch")}</span>
            <input
              value={brandQuery}
              onChange={(event) => setBrandQuery(event.target.value)}
              placeholder={t("brandSearch")}
              className="min-w-0 flex-1 bg-transparent text-ui outline-none"
            />
          </label>
        )}
        <div
          className={
            mobile
              ? "max-h-56 overflow-y-auto"
              : "flex flex-wrap gap-x-3 gap-y-2 lg:flex-col"
          }
        >
          {filteredBrands.map((brand) => (
            <label
              key={brand}
              className={`flex items-center gap-2 text-muted ${mobile ? "min-h-11 border-b border-[var(--border)] text-ui" : ""}`}
            >
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
              />
              {brand}
              <span className="ml-auto text-caption text-muted">
                (
                {
                  products.filter(
                    (product) =>
                      (!category || product.category === category) &&
                      product.brand === brand,
                  ).length
                }
                )
              </span>
            </label>
          ))}
        </div>
      </details>
      <details
        className={mobile ? "border-b border-[var(--border)] pb-2" : "pb-0"}
        open
      >
        <summary
          className={
            mobile
              ? "min-h-11 cursor-pointer list-none py-2 text-ui font-semibold"
              : "mb-2 cursor-pointer list-none font-semibold"
          }
        >
          {t("price")}
        </summary>
        <div className="flex gap-2">
          <label className="min-w-0 flex-1">
            <span className="sr-only">
              {t("price")}: {t("priceAscending")}
            </span>
            <input
              type="number"
              aria-label={`${t("price")}: ${t("from")}`}
              min="0"
              placeholder={t("from")}
              value={filters.minPrice ?? ""}
              onChange={(event) =>
                update({
                  minPrice: event.target.value
                    ? Number(event.target.value)
                    : undefined,
                })
              }
              className={
                mobile
                  ? "min-h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-ui"
                  : "w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5"
              }
            />
          </label>
          <label className="min-w-0 flex-1">
            <span className="sr-only">
              {t("price")}: {t("priceDescending")}
            </span>
            <input
              type="number"
              aria-label={`${t("price")}: ${t("to")}`}
              min="0"
              placeholder={t("to")}
              value={filters.maxPrice ?? ""}
              onChange={(event) =>
                update({
                  maxPrice: event.target.value
                    ? Number(event.target.value)
                    : undefined,
                })
              }
              className={
                mobile
                  ? "min-h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-ui"
                  : "w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5"
              }
            />
          </label>
        </div>
        <input
          type="range"
          min="0"
          max={priceLimit}
          value={filters.maxPrice ?? priceLimit}
          aria-label={t("maximumPriceHint")}
          onChange={(event) => update({ maxPrice: Number(event.target.value) })}
          className={`mt-3 w-full accent-[var(--accent)] ${mobile ? "" : "hidden"}`}
        />
        <p className="mt-1 text-caption text-muted">
          {t("maximumPriceHint")}: {formatPrice(priceLimit, locale)}
        </p>
      </details>
      <details
        className={mobile ? "border-b border-[var(--border)] pb-2" : "pb-0"}
        open={!mobile}
      >
        <summary
          className={
            mobile
              ? "min-h-11 cursor-pointer list-none py-2 text-ui font-semibold"
              : "mb-2 cursor-pointer list-none font-semibold"
          }
        >
          {t("availability")}
        </summary>
        <label
          className={`flex items-center gap-2 font-medium ${mobile ? "min-h-11 text-ui" : ""}`}
        >
          <input
            type="checkbox"
            checked={filters.availableOnly}
            onChange={(event) =>
              update({ availableOnly: event.target.checked })
            }
          />
          {t("inStockOnly")}
        </label>
      </details>
      {specKeys.map((key) => {
        const values = Array.from(
          new Map(
            products
              .filter((product) => product.category === category)
              .flatMap((product) =>
                product.specifications
                  .filter((specification) => specification.key === key.key)
                  .map(
                    (specification) =>
                      [specification.value.ru, specification.value] as const,
                  ),
              ),
          ),
        ).sort(([first], [second]) => first.localeCompare(second));
        return (
          <details
            key={key.key}
            className={mobile ? "border-b border-[var(--border)] pb-2" : "pb-0"}
            open={!mobile}
          >
            <summary
              className={
                mobile
                  ? "min-h-11 cursor-pointer list-none py-2 text-ui font-semibold"
                  : "mb-2 cursor-pointer list-none font-semibold"
              }
            >
              {key.label[locale]}
            </summary>
            <div className="flex flex-wrap gap-x-3 gap-y-2 lg:flex-col">
              {values.map(([valueRu, value]) => (
                <label
                  key={valueRu}
                  className={`flex items-center gap-2 text-muted ${mobile ? "min-h-11 border-b border-[var(--border)] text-ui" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={(filters.specifications[key.key] ?? []).includes(
                      valueRu,
                    )}
                    onChange={() => toggleSpecification(key.key, valueRu)}
                  />
                  {value[locale]}
                  <span className="text-caption md:text-xs text-muted">
                    (
                    {
                      products.filter(
                        (product) =>
                          product.category === category &&
                          product.specifications.some(
                            (specification) =>
                              specification.key === key.key &&
                              specification.value.ru === valueRu,
                          ),
                      ).length
                    }
                    )
                  </span>
                </label>
              ))}
            </div>
          </details>
        );
      })}
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
            sort: "popular",
          })
        }
        className="text-body md:text-sm font-medium text-accent hover:underline"
      >
        {t("clearFilters")}
      </button>
    </div>
  );
}
