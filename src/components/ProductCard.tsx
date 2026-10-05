import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import type { MouseEvent } from "react";
import { products } from "../data/products";
import { useShop } from "../hooks/useShop";
import { formatPrice } from "../lib/catalog";
import { localizedPath } from "../lib/routes";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import { translate } from "../i18n/translations";
import type { Locale, Product } from "../types";
import { ProductImage } from "./ProductImage";
import { trackEvent } from "../lib/analytics";
import { FlaticonIcon } from "./FlaticonIcon";
import { Columns3 } from "lucide-react";
import { getKeyProductSpecifications } from "../lib/specifications";

export function ProductCard({
  product,
  locale,
  view = "grid",
  onQuickView,
}: {
  product: Product;
  locale: Locale;
  view?: "grid" | "list";
  onQuickView?: (product: Product) => void;
}) {
  const navigate = useNavigate();
  const shop = useShop();
  const quantity =
    shop.cart.find((item) => item.productId === product.id)?.quantity ?? 0;
  const favorite = shop.favorites.includes(product.id);
  const compare = shop.compare.includes(product.id);
  const name = product.name[locale];
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;
  const productPath = localizedPath(locale, `/product/${product.slug}`);
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const keySpecifications = getKeyProductSpecifications(product, locale);

  function openProduct() {
    navigate(productPath);
  }

  function stopCardClick(event: MouseEvent) {
    event.stopPropagation();
  }

  const whatsappUrl = buildWhatsAppUrl(
    [{ productId: product.id, quantity: 1 }],
    products,
    locale,
  );

  return (
    <article
      aria-label={`${name}, ${t("details")}`}
      onClick={openProduct}
      className={`group flex h-full cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 transition-shadow active:bg-[var(--accent-soft)] md:p-3 md:hover:border-[var(--border-strong)] md:hover:shadow-md ${view === "list" ? "flex-row gap-3 md:gap-4" : "flex-col"}`}
    >
      <div
        className={`relative aspect-[4/3] shrink-0 overflow-hidden rounded-lg bg-white ${view === "list" ? "w-24 sm:w-40 md:w-56" : ""}`}
      >
        <ProductImage product={product} locale={locale} />
        {discount > 0 && (
          <span className="absolute left-1.5 top-1.5 rounded-md bg-button-accent px-2 text-micro leading-[18px] font-semibold text-on-accent md:left-2 md:top-2 md:py-1 md:text-xs">
            −{discount}%
          </span>
        )}
        <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-100 md:right-2 md:top-2 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          {onQuickView && (
            <button
              type="button"
              aria-label={t("quickView")}
              onClick={(event) => {
                stopCardClick(event);
                onQuickView(product);
              }}
              className="hidden h-11 w-11 items-center justify-center rounded-full bg-white text-muted shadow-sm hover:text-accent md:flex md:h-8 md:w-8"
            >
              <FlaticonIcon name="search" size={16} />
            </button>
          )}
          <button
            type="button"
            aria-label={favorite ? t("favoriteRemove") : t("favoriteAdd")}
            aria-pressed={favorite}
            onClick={(event) => {
              stopCardClick(event);
              shop.toggleFavorite(product.id);
            }}
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-muted after:absolute after:inset-0 after:content-[''] hover:text-rose-600 md:h-8 md:w-8"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white shadow-sm">
              <FlaticonIcon
                name={favorite ? "heart" : "heartOutline"}
                size={16}
                className={favorite ? "flaticon-favorite" : ""}
              />
            </span>
          </button>
          <button
            type="button"
            aria-label={compare ? t("compareRemove") : t("compareAdd")}
            aria-pressed={compare}
            title={
              shop.compare.length === 4 && !compare
                ? t("compareLimit")
                : undefined
            }
            onClick={(event) => {
              stopCardClick(event);
              shop.toggleCompare(product.id);
            }}
            className="hidden h-11 w-11 items-center justify-center rounded-full bg-white text-muted shadow-sm hover:text-accent md:flex md:h-8 md:w-8"
          >
            <Columns3 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col pt-3">
        <Link
          to={productPath}
          onClick={stopCardClick}
          className="line-clamp-2 min-h-10 text-body md:text-sm font-medium leading-5 text-ink group-hover:text-accent"
        >
          {name}
        </Link>
        {view === "list" && (
          <div className="mt-2 min-h-8 text-caption md:text-xs text-muted">
            {keySpecifications
              .slice(0, 4)
              .map((specification) => specification.value)
              .join(" · ")}
          </div>
        )}
        <div className="mt-2 flex min-h-5 items-center gap-1 text-caption md:text-xs">
          {product.reviews ? (
            <>
              <FlaticonIcon name="star" size={14} />
              <span className="font-medium text-ink">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-muted">
                ({product.reviews} {t("reviews")})
              </span>
            </>
          ) : (
            <span className="text-muted">{t("noReviews")}</span>
          )}
        </div>
        <div className="mt-2 flex min-h-6 items-baseline gap-1.5 md:mt-3 md:min-h-[3.25rem] md:flex-col md:items-start md:gap-0">
          <p className="text-price font-bold text-ink md:text-lg">
            {formatPrice(product.price, locale)}
          </p>
          <p className="text-caption text-muted line-through md:h-4 md:text-xs">
            {product.oldPrice
              ? formatPrice(product.oldPrice, locale)
              : "\u00a0"}
          </p>
        </div>
        <div className="flex min-h-6 items-center justify-between text-caption md:text-xs">
          <span className={product.inStock ? "text-success" : "text-muted"}>
            {product.inStock ? t("inStock") : t("toOrder")}
          </span>
          {product.category === "medical" && (
            <span className="group/notice relative h-4 w-4">
              <button
                type="button"
                title={t("medicalNotice")}
                aria-label={t("medicalNotice")}
                onClick={stopCardClick}
                onKeyDown={(event) => event.stopPropagation()}
                className="absolute -right-3.5 -top-3.5 grid h-11 w-11 place-items-center rounded-full text-muted"
              >
                <span className="grid h-4 w-4 place-items-center rounded-full border border-[var(--muted)] text-micro font-semibold">
                  i
                </span>
              </button>
              <span className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 hidden w-56 rounded-lg bg-slate-900 p-2 text-caption md:text-xs text-white group-hover/notice:block group-focus-within/notice:block">
                {t("medicalNotice")}
              </span>
            </span>
          )}
        </div>
        <div
          className="mt-auto flex min-w-0 items-center gap-1.5 pt-3"
          onClick={stopCardClick}
        >
          {quantity === 0 ? (
            <button
              type="button"
              onClick={() => shop.addToCart(product.id)}
              className="min-h-11 min-w-0 flex-1 rounded-lg bg-button-accent px-2 text-ui font-semibold text-on-accent hover:bg-button-accent-strong md:min-h-10 md:px-3 md:text-sm"
            >
              <span className="relative z-10">{t("addToCart")}</span>
            </button>
          ) : (
            <div className="flex min-h-11 min-w-0 flex-1 items-center justify-between rounded-lg bg-button-accent px-1 text-on-accent">
              <button
                type="button"
                aria-label={t("decreaseQuantity")}
                onClick={() => shop.setQuantity(product.id, quantity - 1)}
                className="h-11 w-11 md:h-auto md:w-auto md:p-2"
              >
                −
              </button>
              <span className="text-body md:text-sm font-semibold">
                {quantity}
              </span>
              <button
                type="button"
                aria-label={t("increaseQuantity")}
                onClick={() => shop.addToCart(product.id)}
                className="h-11 w-11 md:h-auto md:w-auto md:p-2"
              >
                +
              </button>
            </div>
          )}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={t("orderWhatsApp")}
            onClick={(event) => {
              event.stopPropagation();
              trackEvent("whatsapp_click", { product_id: product.id });
            }}
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-accent after:absolute after:inset-1 after:rounded-lg after:border after:border-[var(--border)] after:content-[''] hover:bg-[var(--accent-soft)] md:h-10 md:w-10 md:border md:after:hidden"
          >
            <FlaticonIcon name="whatsapp" size={22} />
          </a>
        </div>
      </div>
    </article>
  );
}
