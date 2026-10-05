import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { products } from "../data/products";
import { siteConfig } from "../config/site";
import { ProductImage } from "../components/ProductImage";
import { Seo } from "../components/Seo";
import { useLocale } from "../components/SiteLayout";
import { useShop } from "../hooks/useShop";
import { formatPrice } from "../lib/catalog";
import { localizedPath } from "../lib/routes";
import {
  buildWhatsAppUrl,
  formatKazakhstanPhone,
  isValidRequestContact,
  isValidKazakhstanPhone,
} from "../lib/whatsapp";
import { translate } from "../i18n/translations";
import { trackEvent } from "../lib/analytics";

const savedContactKey = "mediline-request-contact";
const popularCities = [
  "Алматы",
  "Астана",
  "Шымкент",
  "Қарағанды",
  "Ақтөбе",
  "Тараз",
  "Павлодар",
  "Өскемен",
  "Семей",
];

function readSavedContact() {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem(savedContactKey) ?? "{}",
    );
    if (typeof stored !== "object" || stored === null) {
      return { name: "", phone: "", city: "" };
    }
    const values = stored as Record<string, unknown>;
    return {
      name: typeof values.name === "string" ? values.name : "",
      phone:
        typeof values.phone === "string"
          ? formatKazakhstanPhone(values.phone)
          : "",
      city: typeof values.city === "string" ? values.city : "",
    };
  } catch {
    return { name: "", phone: "", city: "" };
  }
}

export function CartPage() {
  const locale = useLocale();
  const shop = useShop();
  const [contact, setContact] = useState(() => ({
    ...readSavedContact(),
    comment: "",
  }));
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    city: false,
  });
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const contactIsValid = isValidRequestContact(contact);

  useEffect(() => {
    localStorage.setItem(
      savedContactKey,
      JSON.stringify({
        name: contact.name,
        phone: contact.phone,
        city: contact.city,
      }),
    );
  }, [contact.name, contact.phone, contact.city]);
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
  const whatsAppUrl = buildWhatsAppUrl(shop.cart, products, locale, contact);
  const requestDisabled =
    !siteConfig.whatsAppNumber || !contactIsValid || !whatsAppUrl;

  function sendRequest() {
    if (contact.name.trim().length < 2) {
      setError(t("nameRequired"));
      return;
    }
    if (!isValidKazakhstanPhone(contact.phone)) {
      setError(t("phoneInvalid"));
      return;
    }
    if (contact.city.trim().length < 2) {
      setError(t("cityRequired"));
      return;
    }
    if (!whatsAppUrl) {
      setError(t("longRequest"));
      return;
    }
    setError("");
    trackEvent("whatsapp_click", { item_count: shop.cart.length });
    window.open(whatsAppUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <Seo title={`${t("cart")} — Mediline`} description={t("cartHint")} />
      <h1 className="mb-4 text-title font-bold md:mb-5 md:text-2xl">
        {t("cart")}
      </h1>
      {items.length === 0 ? (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <p className="font-semibold">{t("emptyCart")}</p>
          <p className="mt-2 text-body md:text-sm text-muted">
            {t("cartHint")}
          </p>
          <Link
            to={localizedPath(locale, "/catalog")}
            className="mt-4 inline-block font-semibold text-accent"
          >
            {t("continueShopping")}
          </Link>
        </section>
      ) : (
        <div className="grid items-start gap-3 pb-28 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-5 lg:pb-0">
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 lg:row-span-2">
            <h2 className="py-4 text-heading">{t("products")}</h2>
            <div className="divide-y divide-[var(--border)]">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex flex-wrap items-center gap-3 py-4 sm:flex-nowrap"
                >
                  <div className="h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-white">
                    <ProductImage product={product} locale={locale} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-ui font-medium md:text-sm">
                      {product.name[locale]}
                    </p>
                    <p className="mt-1 text-caption text-muted md:text-xs">
                      {formatPrice(product.price * quantity, locale)}
                    </p>
                  </div>
                  <div className="flex h-11 items-center rounded-lg border border-[var(--border)]">
                    <button
                      type="button"
                      aria-label={t("decreaseQuantity")}
                      onClick={() => shop.setQuantity(product.id, quantity - 1)}
                      className="h-11 w-11"
                    >
                      −
                    </button>
                    <span className="min-w-6 text-center text-body md:text-sm">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={t("increaseQuantity")}
                      onClick={() => shop.addToCart(product.id)}
                      className="h-11 w-11"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label={t("remove")}
                    onClick={() => shop.removeFromCart(product.id)}
                    className="min-h-11 rounded-lg px-2 text-ui text-muted hover:text-danger"
                  >
                    {t("remove")}
                  </button>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="text-heading">{t("requestDetails")}</h2>
            <div className="mt-4 space-y-3">
              <label className="block text-ui">
                {t("customerName")} <span className="text-danger">*</span>
                <input
                  required
                  autoComplete="name"
                  value={contact.name}
                  onChange={(event) =>
                    setContact({ ...contact, name: event.target.value })
                  }
                  onBlur={() => setTouched({ ...touched, name: true })}
                  aria-invalid={touched.name && contact.name.trim().length < 2}
                  className="mt-1 min-h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
                />
                {touched.name && contact.name.trim().length < 2 && (
                  <span className="mt-1 block text-caption md:text-xs text-danger">
                    {t("nameRequired")}
                  </span>
                )}
              </label>
              <label className="block text-ui">
                {t("phone")} <span className="text-danger">*</span>
                <input
                  required
                  value={contact.phone}
                  onChange={(event) =>
                    setContact({
                      ...contact,
                      phone: formatKazakhstanPhone(event.target.value),
                    })
                  }
                  onBlur={() => setTouched({ ...touched, phone: true })}
                  aria-invalid={
                    touched.phone && !isValidKazakhstanPhone(contact.phone)
                  }
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+7 (7XX) XXX-XX-XX"
                  className="mt-1 min-h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
                />
                {touched.phone && !isValidKazakhstanPhone(contact.phone) && (
                  <span className="mt-1 block text-caption md:text-xs text-danger">
                    {t("phoneInvalid")}
                  </span>
                )}
              </label>
              <label className="block text-ui">
                {t("city")} <span className="text-danger">*</span>
                <input
                  required
                  list="popular-cities"
                  value={contact.city}
                  onChange={(event) =>
                    setContact({ ...contact, city: event.target.value })
                  }
                  onBlur={() => setTouched({ ...touched, city: true })}
                  aria-invalid={touched.city && contact.city.trim().length < 2}
                  className="mt-1 min-h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
                />
                <datalist id="popular-cities">
                  {popularCities.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
                {touched.city && contact.city.trim().length < 2 && (
                  <span className="mt-1 block text-caption md:text-xs text-danger">
                    {t("cityRequired")}
                  </span>
                )}
              </label>
              <label className="block text-ui">
                {t("comment")} · {t("optional")}
                <textarea
                  value={contact.comment}
                  onChange={(event) =>
                    setContact({ ...contact, comment: event.target.value })
                  }
                  rows={3}
                  className="mt-1 min-h-20 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
                />
              </label>
            </div>
          </section>
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="text-heading">{t("estimate")}</h2>
            <p className="mt-2 text-price text-ink md:text-2xl">
              {formatPrice(total, locale)}
            </p>
            <p className="mt-2 text-caption text-muted md:text-xs">
              {t("priceNotice")}
            </p>
            {error && (
              <p role="alert" className="mt-3 text-body md:text-sm text-danger">
                {error}
              </p>
            )}
            {contactIsValid && !whatsAppUrl && (
              <p role="alert" className="mt-3 text-body md:text-sm text-danger">
                {t("longRequest")}
              </p>
            )}
            <button
              type="button"
              onClick={sendRequest}
              disabled={requestDisabled}
              className="mt-4 hidden min-h-11 w-full rounded-lg bg-button-accent px-3 text-ui font-semibold text-on-accent disabled:opacity-50 lg:block"
            >
              {t("sendRequest")}
            </button>
            <button
              type="button"
              onClick={shop.clearCart}
              className="mt-3 hidden min-h-11 w-full text-ui text-muted underline lg:block"
            >
              {t("clearCart")}
            </button>
          </section>
          <div className="fixed inset-x-0 bottom-[calc(56px+env(safe-area-inset-bottom))] z-30 border-t border-[var(--border)] bg-[var(--surface)] p-3 lg:hidden">
            <button
              type="button"
              onClick={sendRequest}
              disabled={requestDisabled}
              className="min-h-11 w-full rounded-lg bg-button-accent px-3 text-ui font-semibold text-on-accent disabled:opacity-50"
            >
              {t("sendRequest")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
