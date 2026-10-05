import { Link } from "react-router-dom";
import { Fragment, useState } from "react";
import { products } from "../data/products";
import { specificationSchema } from "../data/specSchema";
import { ProductCard } from "../components/ProductCard";
import { ProductImage } from "../components/ProductImage";
import { Seo } from "../components/Seo";
import { useLocale } from "../components/SiteLayout";
import { useShop } from "../hooks/useShop";
import { formatPrice } from "../lib/catalog";
import { formatSpecificationValue } from "../lib/specifications";
import { localizedPath } from "../lib/routes";
import { translate } from "../i18n/translations";
import type { CategoryId, SpecificationDefinition } from "../types";

export function FavoritesPage() {
  const locale = useLocale();
  const shop = useShop();
  const items = products.filter((product) =>
    shop.favorites.includes(product.id),
  );
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <>
      <Seo
        title={`${t("favorites")} — Mediline`}
        description={t("favoriteEmpty")}
      />
      <h1 className="mb-5 text-title md:text-2xl font-bold">
        {t("favorites")}
      </h1>
      {items.length ? (
        <div className="grid grid-cols-2 items-stretch gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4 2xl:grid-cols-5">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
          <p>{t("favoriteEmpty")}</p>
          <Link
            to={localizedPath(locale, "/catalog")}
            className="mt-3 inline-block font-semibold text-accent"
          >
            {t("continueShopping")}
          </Link>
        </div>
      )}
    </>
  );
}

export function ComparePage() {
  const locale = useLocale();
  const shop = useShop();
  const items = products.filter((product) => shop.compare.includes(product.id));
  const comparisonGroups = Array.from(
    new Map(
      items.flatMap((product) =>
        specificationSchema[product.category].map((group) => [
          `${product.category}-${group.id}`,
          {
            ...group,
            id: `${product.category}-${group.id}`,
            category: product.category,
          },
        ]),
      ),
    ).values(),
  );
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  function getComparisonRows(
    definitions: SpecificationDefinition[],
    category: CategoryId,
  ) {
    return definitions.flatMap((definition) => {
      const values = items.map((product) => {
        if (product.category !== category) return "—";
        const feature = product.specifications.find(
          (item) => item.key === definition.key,
        );
        return feature
          ? formatSpecificationValue(feature.value[locale], definition, locale)
          : "—";
      });
      if (values.every((value) => value === "—")) return [];
      const isDifferent = new Set(values).size > 1;
      if (onlyDifferences && !isDifferent) return [];
      return [{ definition, values, isDifferent }];
    });
  }

  return (
    <>
      <Seo
        title={`${t("compare")} — Mediline`}
        description={t("compareEmpty")}
      />
      <h1 className="mb-5 text-title md:text-2xl font-bold">{t("compare")}</h1>
      {items.length ? (
        <>
          <label className="mb-3 inline-flex min-h-11 items-center gap-2 text-ui md:text-sm">
            <input
              type="checkbox"
              checked={onlyDifferences}
              onChange={(event) => setOnlyDifferences(event.target.checked)}
            />
            {t("onlyDifferences")}
          </label>
          <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <table className="min-w-[720px] border-collapse text-left text-body md:text-sm">
              <thead>
                <tr>
                  <th className="w-36 p-3" />
                  {items.map((product) => (
                    <th key={product.id} className="w-64 p-3 align-top">
                      <div className="aspect-[4/3] overflow-hidden rounded-lg bg-white">
                        <ProductImage product={product} locale={locale} />
                      </div>
                      <Link
                        to={localizedPath(locale, `/product/${product.slug}`)}
                        className="mt-2 block font-semibold"
                      >
                        {product.name[locale]}
                      </Link>
                      <button
                        type="button"
                        onClick={() => shop.toggleCompare(product.id)}
                        className="mt-2 text-caption md:text-xs text-muted underline"
                      >
                        {t("remove")}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[var(--border)]">
                  <th className="p-3">{t("price")}</th>
                  {items.map((product) => (
                    <td key={product.id} className="p-3 font-semibold">
                      {formatPrice(product.price, locale)}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-[var(--border)]">
                  <th className="p-3">{t("brand")}</th>
                  {items.map((product) => (
                    <td key={product.id} className="p-3">
                      {product.brand}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-[var(--border)]">
                  <th className="p-3">{t("availability")}</th>
                  {items.map((product) => (
                    <td key={product.id} className="p-3">
                      {product.inStock ? t("inStock") : t("toOrder")}
                    </td>
                  ))}
                </tr>
                {comparisonGroups.map((group) => {
                  const rows = getComparisonRows(
                    group.specifications,
                    group.category,
                  );
                  if (rows.length === 0) return null;
                  return (
                    <Fragment key={group.id}>
                      <tr className="border-t border-[var(--border)] bg-[var(--background)]">
                        <th
                          colSpan={items.length + 1}
                          className="p-3 text-left font-semibold"
                        >
                          {group.label[locale]}
                        </th>
                      </tr>
                      {rows.map(({ definition, values, isDifferent }) => (
                        <tr
                          key={definition.key}
                          className={`border-t border-[var(--border)] ${isDifferent ? "bg-[var(--accent-soft)]" : ""}`}
                        >
                          <th className="sticky left-0 bg-[var(--surface)] p-3">
                            {definition.label[locale]}
                          </th>
                          {values.map((value, index) => (
                            <td key={items[index].id} className="p-3">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
          <p>{t("compareEmpty")}</p>
          <Link
            to={localizedPath(locale, "/catalog")}
            className="mt-3 inline-block font-semibold text-accent"
          >
            {t("continueShopping")}
          </Link>
        </div>
      )}
    </>
  );
}
