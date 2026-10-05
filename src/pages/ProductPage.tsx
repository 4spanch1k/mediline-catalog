import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { categories, products } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { ProductImage } from "../components/ProductImage";
import { Seo } from "../components/Seo";
import { useLocale } from "../components/SiteLayout";
import { useShop } from "../hooks/useShop";
import { formatPrice, getProduct } from "../lib/catalog";
import { localizedPath } from "../lib/routes";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import { translate } from "../i18n/translations";
import { FlaticonIcon } from "../components/FlaticonIcon";
import { X } from "lucide-react";
import { Columns3 } from "lucide-react";
import { trackEvent } from "../lib/analytics";
import { useDialogFocus } from "../hooks/useDialogFocus";
import { getKeyProductSpecifications } from "../lib/specifications";
import { ProductSpecifications } from "../components/ProductSpecifications";

export function ProductPage() {
  const locale = useLocale();
  const { slug = "" } = useParams();
  const product = getProduct(slug);
  const shop = useShop();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [activeProductTab, setActiveProductTab] = useState("description");
  const galleryRef = useRef<HTMLDivElement>(null);
  const zoomDialogRef = useRef<HTMLDivElement>(null);
  const productId = product?.id;
  const addRecentlyViewed = shop.addRecentlyViewed;
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  useEffect(() => {
    if (productId) addRecentlyViewed(productId);
  }, [productId, addRecentlyViewed]);

  useEffect(() => {
    setPhotoIndex(0);
    setZoomOpen(false);
  }, [productId]);

  useDialogFocus(zoomOpen, zoomDialogRef, () => setZoomOpen(false), true);

  useEffect(() => {
    const sections = ["description", "specifications", "similar-products"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              first.boundingClientRect.top - second.boundingClientRect.top,
          );
        if (visibleSections[0]) {
          setActiveProductTab(visibleSections[0].target.id);
        }
      },
      { rootMargin: "-116px 0px -65% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [productId]);

  if (!product)
    return <p className="py-20 text-center">{t("productNotFound")}</p>;

  const category = categories.find((item) => item.id === product.category);
  const similar = products
    .filter(
      (item) => item.category === product.category && item.id !== product.id,
    )
    .slice(0, 5);
  const whatsappUrl = buildWhatsAppUrl(
    [{ productId: product.id, quantity: 1 }],
    products,
    locale,
  );
  const photoCount = Math.max(product.photos.length, 1);
  const keySpecifications = getKeyProductSpecifications(product, locale);

  async function shareProduct() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareMessage(t("copied"));
    } catch {
      setShareMessage(t("copyFailed"));
    }
  }

  return (
    <>
      <Seo
        title={`${product.name[locale]} — Mediline`}
        description={product.description[locale]}
        structuredData={
          !product.isDemo
            ? {
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "Product",
                    name: product.name[locale],
                    description: product.description[locale],
                    brand: { "@type": "Brand", name: product.brand },
                    offers: {
                      "@type": "Offer",
                      priceCurrency: "KZT",
                      price: product.price,
                      availability: product.inStock
                        ? "https://schema.org/InStock"
                        : "https://schema.org/PreOrder",
                      url: window.location.href,
                    },
                  },
                  {
                    "@type": "BreadcrumbList",
                    itemListElement: [
                      {
                        "@type": "ListItem",
                        position: 1,
                        name: t("home"),
                        item: `${window.location.origin}/${locale}`,
                      },
                      {
                        "@type": "ListItem",
                        position: 2,
                        name: category?.label[locale],
                        item: `${window.location.origin}/${locale}/catalog/${category?.slug}`,
                      },
                      {
                        "@type": "ListItem",
                        position: 3,
                        name: product.name[locale],
                        item: window.location.href,
                      },
                    ],
                  },
                ],
              }
            : undefined
        }
      />
      <nav
        aria-label={t("breadcrumb")}
        className="mb-3 hidden text-body text-muted md:mb-5 md:block md:text-sm"
      >
        <Link
          to={localizedPath(locale, "/catalog")}
          className="hover:text-accent"
        >
          {t("catalog")}
        </Link>
        <span className="mx-2">/</span>
        <Link
          to={localizedPath(locale, `/catalog/${category?.slug ?? ""}`)}
          className="hover:text-accent"
        >
          {category?.label[locale]}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name[locale]}</span>
      </nav>
      <div className="grid gap-2 md:grid-cols-2 md:gap-6">
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 md:border-0 md:bg-transparent md:p-0">
          <div
            ref={galleryRef}
            onScroll={(event) =>
              setPhotoIndex(
                Math.round(
                  event.currentTarget.scrollLeft /
                    event.currentTarget.clientWidth,
                ),
              )
            }
            aria-label={t("productGallery")}
            className="flex snap-x snap-mandatory overflow-x-auto rounded-lg bg-white"
          >
            {Array.from({ length: photoCount }, (_, index) => (
              <button
                key={product.photos[index] ?? product.id}
                type="button"
                aria-label={`${t("zoomImage")} ${index + 1}`}
                onClick={() => setZoomOpen(true)}
                className="aspect-[4/3] w-full shrink-0 snap-start overflow-hidden bg-white"
              >
                <ProductImage
                  product={product}
                  locale={locale}
                  photoIndex={index}
                />
              </button>
            ))}
          </div>
          {photoCount > 1 && (
            <>
              <div className="mt-1 flex justify-center md:hidden">
                {Array.from({ length: photoCount }, (_, index) => (
                  <button
                    key={product.photos[index]}
                    type="button"
                    aria-label={`${t("productPhoto")} ${index + 1}`}
                    aria-pressed={photoIndex === index}
                    onClick={() => {
                      galleryRef.current?.children.item(index)?.scrollIntoView({
                        behavior: "smooth",
                        inline: "start",
                        block: "nearest",
                      });
                    }}
                    className="grid h-11 w-11 place-items-center"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${photoIndex === index ? "bg-button-accent" : "bg-[var(--border-strong)]"}`}
                    />
                  </button>
                ))}
              </div>
              <div className="mt-2 hidden gap-2 overflow-x-auto md:flex">
                {Array.from({ length: photoCount }, (_, index) => (
                  <button
                    key={product.photos[index]}
                    type="button"
                    aria-label={`${t("productPhoto")} ${index + 1}`}
                    aria-pressed={photoIndex === index}
                    onClick={() => {
                      galleryRef.current?.children.item(index)?.scrollIntoView({
                        behavior: "smooth",
                        inline: "start",
                        block: "nearest",
                      });
                    }}
                    className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border ${photoIndex === index ? "border-[var(--accent)]" : "border-[var(--border)]"}`}
                  >
                    <ProductImage
                      product={product}
                      locale={locale}
                      photoIndex={index}
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 md:border-0 md:bg-transparent md:p-0">
          <p className="text-caption text-muted md:text-sm">
            {product.brand} · {product.subcategory[locale]}
          </p>
          <h1 className="mt-1 text-title md:mt-2 md:text-2xl md:font-bold">
            {product.name[locale]}
          </h1>
          {product.reviews ? (
            <p className="mt-2 flex items-center gap-1.5 text-caption md:mt-3 md:text-sm">
              <FlaticonIcon name="star" size={16} />
              {product.rating.toFixed(1)}
              <span className="text-muted">
                ({product.reviews} {t("reviews")})
              </span>
            </p>
          ) : (
            <p className="mt-2 text-caption text-muted md:mt-3 md:text-sm">
              {t("noReviews")}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-baseline gap-2 md:mt-4">
            <p className="text-display md:text-2xl">
              {formatPrice(product.price, locale)}
            </p>
            {product.oldPrice && (
              <p className="text-caption text-muted line-through md:text-sm">
                {formatPrice(product.oldPrice, locale)}
              </p>
            )}
          </div>
          <p className="mt-1 text-caption text-muted md:mt-2 md:text-sm">
            {product.inStock ? t("inStock") : t("toOrder")}
          </p>
          {keySpecifications.length > 0 && (
            <div className="mt-4">
              <h2 className="mb-1 text-heading">{t("mainFeatures")}</h2>
              <dl className="space-y-1">
                {keySpecifications.slice(0, 5).map(({ definition, value }) => (
                  <div
                    key={definition.key}
                    className="grid grid-cols-[42%_1fr] gap-2 text-caption"
                  >
                    <dt className="text-muted">{definition.label[locale]}</dt>
                    <dd className="min-w-0 break-words font-medium text-ink">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <button
            type="button"
            aria-label={
              shop.compare.includes(product.id)
                ? t("compareRemove")
                : t("compareAdd")
            }
            aria-pressed={shop.compare.includes(product.id)}
            onClick={() => shop.toggleCompare(product.id)}
            className="mt-3 flex min-h-11 items-center gap-2 self-start rounded-lg border border-[var(--border)] px-3 text-ui md:hidden"
          >
            <Columns3 size={18} aria-hidden="true" />
            {shop.compare.includes(product.id)
              ? t("compareRemove")
              : t("compareAdd")}
          </button>
          <div className="mt-5 hidden flex-wrap gap-2 md:flex">
            <button
              type="button"
              onClick={() => shop.addToCart(product.id)}
              className="flex min-h-11 items-center gap-2 rounded-lg bg-button-accent px-4 text-ui font-semibold text-on-accent hover:bg-button-accent-strong"
            >
              <FlaticonIcon
                name="cart"
                size={17}
                className="brightness-0 invert"
              />
              {t("addToCart")}
            </button>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  trackEvent("whatsapp_click", { product_id: product.id })
                }
                className="flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border)] px-4 text-ui font-semibold text-accent"
              >
                <FlaticonIcon name="whatsapp" size={20} />
                {t("orderWhatsApp")}
              </a>
            )}
            <button
              type="button"
              aria-label={
                shop.favorites.includes(product.id)
                  ? t("favoriteRemove")
                  : t("favoriteAdd")
              }
              aria-pressed={shop.favorites.includes(product.id)}
              onClick={() => shop.toggleFavorite(product.id)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border)]"
            >
              <FlaticonIcon
                name={
                  shop.favorites.includes(product.id) ? "heart" : "heartOutline"
                }
                size={18}
                className={
                  shop.favorites.includes(product.id)
                    ? "flaticon-favorite"
                    : "flaticon-dark"
                }
              />
            </button>
            <button
              type="button"
              aria-label={
                shop.compare.includes(product.id)
                  ? t("compareRemove")
                  : t("compareAdd")
              }
              aria-pressed={shop.compare.includes(product.id)}
              onClick={() => shop.toggleCompare(product.id)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border)]"
            >
              <Columns3 size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={shareProduct}
              className="min-h-11 rounded-lg border border-[var(--border)] px-4 text-ui"
            >
              {t("share")}
            </button>
            {shareMessage && (
              <span
                role="status"
                className="self-center text-caption text-muted"
              >
                {shareMessage}
              </span>
            )}
          </div>
        </section>
      </div>

      <nav
        aria-label={t("productTabs")}
        className="sticky top-14 z-20 -mx-3 mt-2 flex h-11 snap-x overflow-x-auto border-b border-[var(--border)] bg-[var(--surface)] md:hidden"
      >
        {[
          ["description", t("description")],
          ["specifications", t("specifications")],
          ["similar-products", t("similarProducts")],
        ].map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={activeProductTab === id ? "location" : undefined}
            className={`grid shrink-0 snap-start place-items-center px-4 text-ui ${activeProductTab === id ? "border-b-2 border-[var(--accent)] font-semibold text-accent" : "text-muted"}`}
          >
            {label}
          </a>
        ))}
      </nav>

      <section
        id="description"
        className="mt-2 scroll-mt-28 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 md:mt-7 md:p-6"
      >
        <h2 className="text-heading">{t("description")}</h2>
        <p
          className={`mt-2 text-body text-muted md:text-sm ${descriptionExpanded ? "" : "line-clamp-4"}`}
        >
          {product.description[locale]}
        </p>
        {product.description[locale].length > 160 && (
          <button
            type="button"
            onClick={() => setDescriptionExpanded(!descriptionExpanded)}
            className="mt-2 min-h-11 text-ui font-semibold text-accent"
          >
            {descriptionExpanded ? t("readLess") : t("readMore")}
          </button>
        )}
      </section>

      <div className="mt-2 md:mt-7">
        <ProductSpecifications product={product} locale={locale} />
      </div>
      {product.category === "medical" && (
        <aside className="mt-2 flex items-start gap-2 rounded-xl bg-[var(--accent-soft)] p-4 text-ui text-ink md:mt-4">
          <span
            aria-hidden="true"
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[var(--accent)] font-semibold text-accent"
          >
            i
          </span>
          <p>{t("medicalNotice")}</p>
        </aside>
      )}
      <aside className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-caption text-muted md:mt-4">
        {t("priceNotice")}
      </aside>

      <section id="similar-products" className="mt-2 scroll-mt-28 md:mt-8">
        <h2 className="mb-3 text-title">{t("similarProducts")}</h2>
        <div className="grid auto-cols-[220px] grid-flow-col items-stretch gap-3 overflow-x-auto pb-3 md:grid-flow-row md:grid-cols-3 md:gap-4 xl:grid-cols-4 2xl:grid-cols-5">
          {similar.map((item) => (
            <div
              key={item.id}
              className="h-[360px] w-[220px] md:h-auto md:w-auto"
            >
              <ProductCard product={item} locale={locale} />
            </div>
          ))}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[minmax(0,1fr)_44px] gap-2 border-t border-[var(--border)] bg-[var(--surface)] px-3 py-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] md:hidden">
        <button
          type="button"
          onClick={() => shop.addToCart(product.id)}
          className="min-h-11 rounded-lg bg-button-accent px-2 text-ui font-semibold text-on-accent"
        >
          {t("addToCart")}
        </button>
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={t("orderWhatsApp")}
            onClick={() =>
              trackEvent("whatsapp_click", { product_id: product.id })
            }
            className="grid h-11 w-11 place-items-center rounded-lg border border-emerald-600 bg-white"
          >
            <FlaticonIcon name="whatsapp" size={28} />
          </a>
        ) : (
          <span className="grid h-11 w-11 place-items-center rounded-lg border border-[var(--border)] text-muted">
            <FlaticonIcon name="whatsapp" size={24} />
          </span>
        )}
      </div>
      {zoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("productGallery")}
          ref={zoomDialogRef}
          tabIndex={-1}
          onClick={() => setZoomOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          <button
            type="button"
            aria-label={t("close")}
            onClick={() => setZoomOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white p-2 text-slate-900"
          >
            <X size={20} aria-hidden="true" />
          </button>
          <div
            className="h-[80vh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <ProductImage
              product={product}
              locale={locale}
              photoIndex={photoIndex}
            />
          </div>
        </div>
      )}
    </>
  );
}
