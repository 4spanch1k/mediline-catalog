import { specificationSchema } from "../data/specSchema";
import type { Locale, Product, SpecificationDefinition } from "../types";

export function formatSpecificationValue(
  value: string,
  definition: SpecificationDefinition,
  locale: Locale,
): string {
  const cleanValue = value.trim();
  if (!cleanValue) return "";

  const numericWithUnit = /^\d+(?:[.,]\d+)?$/u.test(cleanValue);
  if (numericWithUnit && definition.unit) {
    return `${cleanValue}\u00a0${definition.unit[locale]}`;
  }

  return cleanValue
    .replace(/(\d)\s*x\s*(\d)/giu, "$1 × $2")
    .replace(
      /(\d+(?:[.,]\d+)?)\s+(Вт|В|К|лм|см|мм|кг|м)(?=\s|$)/giu,
      "$1\u00a0$2",
    )
    .replace(/(\d+)\s+дюйм(?:а|ов)?(?=\s|$)/giu, "$1\u00a0″");
}

export function booleanSpecificationValue(value: string): boolean | undefined {
  const normalized = value.trim().toLocaleLowerCase();
  if (["true", "1", "да", "иә", "yes"].includes(normalized)) return true;
  if (["false", "0", "нет", "жоқ", "no"].includes(normalized)) return false;
  return undefined;
}

export function getProductSpecificationGroups(
  product: Product,
  locale: Locale,
) {
  return specificationSchema[product.category]
    .map((schemaGroup) => ({
      ...schemaGroup,
      items: schemaGroup.specifications.flatMap((definition) => {
        const feature = product.specifications.find(
          (item) => item.key === definition.key,
        );
        if (!feature) return [];
        const value = formatSpecificationValue(
          feature.value[locale],
          definition,
          locale,
        );
        return value ? [{ definition, feature, value }] : [];
      }),
    }))
    .filter((schemaGroup) => schemaGroup.items.length > 0);
}

export function getKeyProductSpecifications(product: Product, locale: Locale) {
  return specificationSchema[product.category].flatMap((schemaGroup) =>
    schemaGroup.specifications.flatMap((definition) => {
      if (!definition.isKey) return [];
      const feature = product.specifications.find(
        (item) => item.key === definition.key,
      );
      const value = feature
        ? formatSpecificationValue(feature.value[locale], definition, locale)
        : "";
      return value ? [{ definition, value }] : [];
    }),
  );
}
