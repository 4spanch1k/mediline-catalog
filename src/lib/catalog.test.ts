import { describe, expect, it } from "vitest";
import { categories, products } from "../data/products";
import {
  filterAndSortProducts,
  formatPrice,
  matchesProductSearch,
} from "./catalog";
import { productPlaceholder } from "./product-placeholder";

describe("price formatting", () => {
  it("formats tenge without decimal places", () => {
    const formatted = formatPrice(1250000, "ru").replace(
      /[\s\u00a0\u202f]/g,
      "",
    );
    expect(formatted).toBe("1250000₸");
  });

  it("uses consistent non-breaking groups and currency spacing in all locales", () => {
    const expected = "1\u00a0234\u00a0567\u00a0₸";
    expect(formatPrice(1234567, "ru")).toBe(expected);
    expect(formatPrice(1234567, "kz")).toBe(expected);
    expect(formatPrice(1234567, "en")).toBe(expected);
  });
});

describe("catalog data", () => {
  it("contains 60 demo products across the four requested categories", () => {
    expect(products).toHaveLength(60);
    expect(new Set(products.map((product) => product.category)).size).toBe(4);
    expect(products.every((product) => product.isDemo)).toBe(true);
    expect(categories.map((category) => category.id)).toEqual([
      "lighting",
      "televisions",
      "plumbing",
      "medical",
    ]);
  });

  it("generates a distinct local SVG placeholder for each demo product", () => {
    expect(new Set(products.map(productPlaceholder)).size).toBe(60);
  });
});

describe("catalog search and filters", () => {
  it("searches localized names and tolerates one-character typos", () => {
    const bulb = products.find((product) => product.brand === "Philips")!;

    expect(matchesProductSearch(bulb, "светодиодная лампа")).toBe(true);
    expect(matchesProductSearch(bulb, "светодиодныя лампа")).toBe(true);
    expect(matchesProductSearch(bulb, "жарықдиодты шам")).toBe(true);
    expect(matchesProductSearch(bulb, "LED bulb")).toBe(true);
  });

  it("filters by category, availability and price, then sorts by price", () => {
    const result = filterAndSortProducts(products, {
      category: "lighting",
      availableOnly: true,
      maxPrice: 10000,
      sort: "price-asc",
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((product) => product.category === "lighting")).toBe(
      true,
    );
    expect(
      result.every((product) => product.inStock && product.price <= 10000),
    ).toBe(true);
    expect(result.map((product) => product.price)).toEqual(
      [...result].map((product) => product.price).sort((a, b) => a - b),
    );
  });
});
