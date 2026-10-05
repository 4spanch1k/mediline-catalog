import type { Product } from "../types";

const categoryArtwork: Record<Product["category"], string> = {
  lighting:
    '<path d="M12 3a6 6 0 0 0-3.8 10.6c.7.6 1.3 1.4 1.5 2.4h4.6c.2-1 .8-1.8 1.5-2.4A6 6 0 0 0 12 3Z"/><path d="M10 19h4m-3 3h2"/>',
  televisions:
    '<rect x="3" y="5" width="18" height="13" rx="1.5"/><path d="m8 22 4-4 4 4"/>',
  plumbing:
    '<path d="M4 7h12a4 4 0 0 1 4 4v1h-4v-1a1 1 0 0 0-1-1H4V7Z"/><path d="M7 7V4h7v3m2 5v2a5 5 0 0 1-10 0v-2"/>',
  medical:
    '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8m-4-4h8"/>',
};

function colorForProduct(slug: string): number {
  return (
    ([...slug].reduce(
      (hash, character) => hash * 31 + character.charCodeAt(0),
      0,
    ) >>>
      0) %
    300
  );
}

export function productPlaceholder(product: Product): string {
  const hue = 174 + colorForProduct(product.slug);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" data-product="${product.id}" viewBox="0 0 640 480"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="hsl(${hue} 52% 96%)"/><stop offset="1" stop-color="hsl(${hue} 48% 88%)"/></linearGradient></defs><rect width="640" height="480" fill="url(#g)"/><g transform="translate(128 48) scale(16)" fill="none" stroke="hsl(${hue} 42% 39%)" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">${categoryArtwork[product.category]}</g></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
