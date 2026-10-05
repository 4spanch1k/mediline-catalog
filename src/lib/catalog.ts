import { categories, products } from "../data/products";
import type { CategoryId, Locale, Product } from "../types";

export function formatPrice(price: number, locale: Locale): string {
  const numberLocale = locale === "en" ? "en-US" : "ru-RU";
  const amount = new Intl.NumberFormat(numberLocale, {
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace(/[\u00a0\u202f,]/gu, "\u00a0");
  return `${amount}\u00a0₸`;
}

export function getCategory(categoryId: CategoryId) {
  return categories.find((category) => category.id === categoryId);
}

export function getCategoryFromSlug(slug?: string): CategoryId | undefined {
  return categories.find((category) => category.slug === slug)?.id;
}

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function normalizeSearchText(value: string): string {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ё/g, "е")
    .trim();
}

function editDistanceAtMostOne(first: string, second: string): boolean {
  if (Math.abs(first.length - second.length) > 1) return false;

  let left = 0;
  let right = 0;
  let edits = 0;

  while (left < first.length && right < second.length) {
    if (first[left] === second[right]) {
      left += 1;
      right += 1;
      continue;
    }

    edits += 1;
    if (edits > 1) return false;

    if (first.length > second.length) left += 1;
    else if (second.length > first.length) right += 1;
    else {
      left += 1;
      right += 1;
    }
  }

  if (left < first.length || right < second.length) edits += 1;
  return edits <= 1;
}

function productSearchText(product: Product): string {
  const category = getCategory(product.category);
  return normalizeSearchText(
    [
      product.brand,
      ...Object.values(product.name),
      ...Object.values(product.description),
      ...Object.values(product.subcategory),
      ...(category ? Object.values(category.label) : []),
      ...product.specifications.flatMap((specification) => [
        specification.key,
        ...Object.values(specification.value),
      ]),
      ...product.tags.flatMap((tag) => Object.values(tag)),
    ].join(" "),
  );
}

export function matchesProductSearch(product: Product, query: string): boolean {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const text = productSearchText(product);
  if (text.includes(normalizedQuery)) return true;

  return normalizedQuery.split(/\s+/).every((word) => {
    if (text.includes(word)) return true;
    if (word.length < 5) return false;
    return text
      .split(/\s+/)
      .some((candidate) => editDistanceAtMostOne(word, candidate));
  });
}

export function filterAndSortProducts(
  productsToFilter: Product[],
  filters: {
    category?: CategoryId;
    query?: string;
    brands?: string[];
    availableOnly?: boolean;
    minPrice?: number;
    maxPrice?: number;
    specifications?: Record<string, string[]>;
    sort?: string;
  },
): Product[] {
  const filtered = productsToFilter.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.query && !matchesProductSearch(product, filters.query))
      return false;
    if (filters.brands?.length && !filters.brands.includes(product.brand))
      return false;
    if (filters.availableOnly && !product.inStock) return false;
    if (filters.minPrice !== undefined && product.price < filters.minPrice)
      return false;
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice)
      return false;

    return Object.entries(filters.specifications ?? {}).every(
      ([key, values]) => {
        if (values.length === 0) return true;
        return product.specifications.some(
          (specification) =>
            specification.key === key &&
            values.includes(specification.value.ru),
        );
      },
    );
  });

  switch (filters.sort) {
    case "price-asc":
      return filtered.sort((a, b) => a.price - b.price);
    case "price-desc":
      return filtered.sort((a, b) => b.price - a.price);
    case "rating":
      return filtered.sort((a, b) => b.rating - a.rating);
    case "newest":
      return filtered.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    case "discounts":
      return filtered.sort(
        (a, b) =>
          (b.oldPrice ? b.oldPrice - b.price : 0) -
          (a.oldPrice ? a.oldPrice - a.price : 0),
      );
    default:
      return filtered.sort((a, b) => b.rating - a.rating);
  }
}
