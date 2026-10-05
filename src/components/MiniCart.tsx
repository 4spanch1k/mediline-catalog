import { useRef } from "react";
import { Link } from "react-router-dom";
import { products } from "../data/products";
import { useShop } from "../hooks/useShop";
import { formatPrice } from "../lib/catalog";
import { localizedPath } from "../lib/routes";
import { translate } from "../i18n/translations";
import type { Locale } from "../types";
import { FlaticonIcon } from "./FlaticonIcon";
import { ProductImage } from "./ProductImage";
import { useDialogFocus } from "../hooks/useDialogFocus";

export function MiniCart({
  locale,
  onClose,
}: {
  locale: Locale;
  onClose: () => void;
}) {
  const shop = useShop();
  const dialogRef = useRef<HTMLElement>(null);
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const items = shop.cart.flatMap((item) => {
    const product = products.find(
      (candidate) => candidate.id === item.productId,
    );
    return product ? [{ ...item, product }] : [];
  });
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  useDialogFocus(true, dialogRef, onClose, true);

  return (
    <div
      className="fixed inset-0 z-40 bg-black/40"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="mini-cart-title"
        ref={dialogRef}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[var(--surface)] p-4 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h2
            id="mini-cart-title"
            className="text-title md:text-lg font-semibold"
          >
            {t("cart")}
          </h2>
          <button
            type="button"
            aria-label={t("close")}
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-[var(--background)]"
          >
            <FlaticonIcon name="close" size={18} className="flaticon-dark" />
          </button>
        </div>
        {items.length === 0 ? (
          <p className="py-8 text-center text-body md:text-sm text-muted">
            {t("emptyCart")}
          </p>
        ) : (
          <>
            <ul className="min-h-0 flex-1 divide-y divide-[var(--border)] overflow-y-auto">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-3 py-3">
                  <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-white">
                    <ProductImage product={product} locale={locale} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-body md:text-sm font-medium">
                      {product.name[locale]}
                    </p>
                    <p className="mt-1 text-body md:text-sm font-semibold">
                      {formatPrice(product.price * quantity, locale)}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-body md:text-sm">
                      <button
                        type="button"
                        aria-label={t("decreaseQuantity")}
                        onClick={() =>
                          shop.setQuantity(product.id, quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span>{quantity}</span>
                      <button
                        type="button"
                        aria-label={t("increaseQuantity")}
                        onClick={() => shop.addToCart(product.id)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => shop.removeFromCart(product.id)}
                        className="ml-auto text-caption md:text-xs text-muted underline"
                      >
                        {t("remove")}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-[var(--border)] pt-4">
              <div className="mb-3 flex justify-between font-semibold">
                <span>{t("total")}</span>
                <span>{formatPrice(total, locale)}</span>
              </div>
              <Link
                to={localizedPath(locale, "/cart")}
                onClick={onClose}
                className="flex min-h-11 items-center justify-center rounded-lg bg-button-accent px-4 text-body md:text-sm font-semibold text-on-accent"
              >
                {t("sendRequest")}
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
