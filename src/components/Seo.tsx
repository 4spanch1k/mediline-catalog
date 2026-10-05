import { useEffect } from "react";

export function Seo({
  title,
  description,
  structuredData,
}: {
  title: string;
  description: string;
  structuredData?: Record<string, unknown>;
}) {
  const schemaJson = structuredData ? JSON.stringify(structuredData) : "";

  useEffect(() => {
    document.title = title;
    let descriptionTag = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.name = "description";
      document.head.append(descriptionTag);
    }
    descriptionTag.content = description;
    setMeta("og:title", title);
    setMeta("og:description", description);
    const canonicalUrl = `${window.location.origin}${window.location.pathname}`;
    setMeta("og:url", canonicalUrl);
    setMeta("og:type", "website");
    const existingCanonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    const canonical = existingCanonical ?? document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = canonicalUrl;
    if (!existingCanonical) document.head.append(canonical);

    const alternates = ["ru", "kz", "en"].map((locale) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = locale === "kz" ? "kk" : locale;
      link.href = `${window.location.origin}/${locale}${window.location.pathname.replace(/^\/(ru|kz|en)/, "")}`;
      document.head.append(link);
      return link;
    });
    const defaultLanguage = document.createElement("link");
    defaultLanguage.rel = "alternate";
    defaultLanguage.hreflang = "x-default";
    defaultLanguage.href = `${window.location.origin}/ru${window.location.pathname.replace(/^\/(ru|kz|en)/, "")}`;
    document.head.append(defaultLanguage);

    const previousSchema = document.getElementById("mediline-jsonld");
    previousSchema?.remove();
    if (schemaJson) {
      const schema = document.createElement("script");
      schema.id = "mediline-jsonld";
      schema.type = "application/ld+json";
      schema.textContent = schemaJson;
      document.head.append(schema);
    }
    return () => {
      document.title = "Mediline — товары для дома и здоровья";
      [...alternates, defaultLanguage].forEach((link) => link.remove());
      if (schemaJson) document.getElementById("mediline-jsonld")?.remove();
    };
  }, [title, description, schemaJson]);

  return null;
}

function setMeta(property: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`,
  );
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.append(tag);
  }
  tag.content = content;
}
