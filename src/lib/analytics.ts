import { siteConfig } from "../config/site";

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function initializeAnalytics() {
  const { ga4Id, metaPixelId } = siteConfig.analytics;

  if (ga4Id && !document.querySelector("script[data-mediline-ga4]")) {
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = (...args) => window.dataLayer?.push(args);
    const script = document.createElement("script");
    script.async = true;
    script.dataset.medilineGa4 = "true";
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`;
    document.head.append(script);
    window.gtag("js", new Date());
    window.gtag("config", ga4Id);
  }

  if (metaPixelId && !document.querySelector("script[data-mediline-meta]")) {
    const script = document.createElement("script");
    script.dataset.medilineMeta = "true";
    script.text = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId.replace(/[^a-zA-Z0-9]/g, "")}');fbq('track','PageView');`;
    document.head.append(script);
  }
}

export function trackEvent(
  name: string,
  data: Record<string, string | number> = {},
) {
  window.gtag?.("event", name, data);
  window.fbq?.("trackCustom", name, data);
}
