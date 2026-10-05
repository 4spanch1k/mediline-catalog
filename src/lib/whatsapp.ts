import { translate } from "../i18n/translations";
import { formatPrice } from "./catalog";
import { siteConfig } from "../config/site";
import type { CartItem, Locale, Product } from "../types";

const maximumEncodedUrlLength = 1800;

export function formatKazakhstanPhone(value: string): string {
  let digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  const alreadyHasCountryCode =
    value.trim().startsWith("+") || digits.length === 11;
  if (
    digits.length === 11 &&
    !digits.startsWith("7") &&
    !digits.startsWith("8")
  ) {
    return digits;
  }
  if (alreadyHasCountryCode && digits.startsWith("8")) {
    digits = `7${digits.slice(1)}`;
  } else if (!alreadyHasCountryCode && digits) {
    digits = `7${digits}`;
  }
  digits = digits.slice(0, 11);

  const localNumber = digits.slice(1);
  const areaCode = localNumber.slice(0, 3);
  const firstPart = localNumber.slice(3, 6);
  const secondPart = localNumber.slice(6, 8);
  const lastPart = localNumber.slice(8, 10);
  let formatted = "+7";

  if (areaCode) {
    formatted += ` (${areaCode}${areaCode.length === 3 ? ")" : ""}`;
  }
  if (firstPart) formatted += ` ${firstPart}`;
  if (secondPart) formatted += `-${secondPart}`;
  if (lastPart) formatted += `-${lastPart}`;
  return formatted;
}

export function isValidKazakhstanPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("77");
}

export function isValidRequestContact(contact: {
  name: string;
  phone: string;
  city: string;
}): boolean {
  return (
    contact.name.trim().length >= 2 &&
    isValidKazakhstanPhone(contact.phone) &&
    contact.city.trim().length >= 2
  );
}

export function buildWhatsAppUrl(
  items: CartItem[],
  products: Product[],
  locale: Locale,
  contact: {
    name?: string;
    phone?: string;
    city?: string;
    comment?: string;
  } = {},
): string | undefined {
  if (!siteConfig.whatsAppNumber || items.length === 0) return undefined;

  const lines = items.flatMap((item, index) => {
    const product = products.find(
      (candidate) => candidate.id === item.productId,
    );
    if (!product) return [];
    const name = product.name[locale];
    const unitPrice = formatPrice(product.price, locale);
    const totalPrice = formatPrice(product.price * item.quantity, locale);
    return [
      `${index + 1}. ${name} — ${item.quantity} × ${unitPrice} = ${totalPrice}`,
    ];
  });

  if (lines.length === 0) return undefined;

  const total = items.reduce((sum, item) => {
    const product = products.find(
      (candidate) => candidate.id === item.productId,
    );
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);
  const message = [
    translate(locale, "requestIntro"),
    "",
    ...lines,
    "",
    `${translate(locale, "total")}: ${formatPrice(total, locale)}`,
    contact.name ? `${translate(locale, "customerName")}: ${contact.name}` : "",
    contact.phone ? `${translate(locale, "phone")}: ${contact.phone}` : "",
    contact.city ? `${translate(locale, "city")}: ${contact.city}` : "",
    contact.comment
      ? `${translate(locale, "comment")}: ${contact.comment}`
      : "",
  ]
    .filter((line, index) => line || index < lines.length + 4)
    .join("\n");

  if (encodeURIComponent(message).length > maximumEncodedUrlLength)
    return undefined;

  return `https://wa.me/${siteConfig.whatsAppNumber}?text=${encodeURIComponent(message)}`;
}
