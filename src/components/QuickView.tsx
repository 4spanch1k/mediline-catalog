import { useRef } from "react";
import { FlaticonIcon } from "./FlaticonIcon";
import { useShop } from "../hooks/useShop";
import { formatPrice } from "../lib/catalog";
import { translate } from "../i18n/translations";
import type { Locale, Product } from "../types";
import { ProductImage } from "./ProductImage";
import { useDialogFocus } from "../hooks/useDialogFocus";
import { getKeyProductSpecifications } from "../lib/specifications";
import { Columns3 } from "lucide-react";

export function QuickView({
  product,
  locale,
  onClose,
}: {
  product: Product;
  locale: Locale;
  onClose: () => void;
}) {
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const shop = useShop();
  const dialogRef = useRef<HTMLElement>(null);
  const keySpecifications = getKeyProductSpecifications(product, locale);

  useDialogFocus(true, dialogRef, onClose, true);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        ref={dialogRef}
        className="relative grid max-h-[90vh] w-full max-w-3xl gap-5 overflow-auto rounded-xl bg-[var(--surface)] p-4 sm:grid-cols-2 sm:p-6"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="absolute right-3 top-3 rounded-full p-2 hover:bg-[var(--background)]"
        >
          <FlaticonIcon name="close" size={20} className="flaticon-dark" />
        </button>
        <div className="aspect-[4/3] overflow-hidden rounded-lg bg-white">
          <ProductImage product={product} locale={locale} />
        </div>
        <div className="flex flex-col">
          <p className="text-caption md:text-xs text-muted">{product.brand}</p>
          <h2
            id="quick-view-title"
            className="mt-1 text-title md:text-lg font-semibold"
          >
            {product.name[locale]}
          </h2>
          <p className="mt-3 text-heading md:text-xl font-bold">
            {formatPrice(product.price, locale)}
          </p>
          <p className="mt-3 text-body md:text-sm text-muted">
            {product.description[locale]}
          </p>
          <ul className="mt-4 space-y-2 text-body md:text-sm">
            {keySpecifications.slice(0, 4).map(({ definition, value }) => (
              <li
                key={definition.key}
                className="flex justify-between gap-3 border-b border-[var(--border)] pb-2"
              >
                <span>{definition.label[locale]}</span>
                <span className="text-right text-muted">{value}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            aria-label={
              shop.compare.includes(product.id)
                ? t("compareRemove")
                : t("compareAdd")
            }
            aria-pressed={shop.compare.includes(product.id)}
            onClick={() => shop.toggleCompare(product.id)}
            className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 text-ui"
          >
            <Columns3 size={18} aria-hidden="true" />
            {shop.compare.includes(product.id)
              ? t("compareRemove")
              : t("compareAdd")}
          </button>
          <button
            type="button"
            onClick={() => shop.addToCart(product.id)}
            className="mt-auto min-h-11 rounded-lg bg-button-accent px-4 text-body md:text-sm font-semibold text-on-accent hover:bg-button-accent-strong"
          >
            {t("addToCart")}
          </button>
        </div>
      </section>
    </div>
  );
}
