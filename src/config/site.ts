const environment = import.meta.env ?? {};
const rawWhatsAppNumber = environment.VITE_WHATSAPP_NUMBER ?? "";
const whatsAppNumber = rawWhatsAppNumber.replace(/\D/g, "");

const displayPhone =
  whatsAppNumber.length === 11 && whatsAppNumber.startsWith("7")
    ? `+7 ${whatsAppNumber.slice(1, 4)} ${whatsAppNumber.slice(4, 7)} ${whatsAppNumber.slice(7, 9)} ${whatsAppNumber.slice(9)}`
    : whatsAppNumber
      ? `+${whatsAppNumber}`
      : "";

export const siteConfig = {
  domain: "mediline.asia",
  whatsAppNumber,
  displayPhone,
  address: environment.VITE_CONTACT_ADDRESS ?? "",
  email: environment.VITE_CONTACT_EMAIL ?? "",
  showDemoProducts: environment.VITE_SHOW_DEMO_PRODUCTS !== "false",
  analytics: {
    ga4Id: environment.VITE_GA4_ID ?? "",
    metaPixelId: environment.VITE_META_PIXEL_ID ?? "",
  },
};
