import type { Product } from "../types";
import { productPlaceholder } from "../lib/product-placeholder";

export function ProductImage({
  product,
  locale,
  photoIndex = 0,
}: {
  product: Product;
  locale: "ru" | "kz" | "en";
  photoIndex?: number;
}) {
  const placeholder = productPlaceholder(product);
  const source = product.photos[photoIndex] || placeholder;

  return (
    <img
      src={source}
      alt={product.name[locale]}
      loading="lazy"
      decoding="async"
      width="640"
      height="480"
      onError={(event) => {
        if (event.currentTarget.src !== placeholder)
          event.currentTarget.src = placeholder;
      }}
      className="h-full w-full object-contain bg-white p-3"
    />
  );
}
