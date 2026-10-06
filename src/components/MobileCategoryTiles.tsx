import { Link } from "react-router-dom";
import { categories } from "../data/products";
import { localizedPath } from "../lib/routes";
import type { CategoryId, Locale } from "../types";

const categoryPhotos: Record<CategoryId, string> = {
  lighting: "/assets/categories/photos/lighting.webp",
  televisions: "/assets/categories/photos/televisions.webp",
  plumbing: "/assets/categories/photos/plumbing.webp",
  medical: "/assets/categories/photos/medical.webp",
};

const popularSubcategories = [
  ["lighting", "Лампы", "/assets/categories/photos/bulbs.webp"],
  ["lighting", "LED-ленты", "/assets/categories/photos/led-strips.webp"],
  ["plumbing", "Смесители", "/assets/categories/photos/mixers.webp"],
  ["medical", "Тонометры", "/assets/categories/photos/tonometers.webp"],
] as const;

export function MobileCategoryTiles({ locale }: { locale: Locale }) {
  const tiles = [
    ...categories.map((category) => ({
      key: category.id,
      label: category.label[locale],
      image: categoryPhotos[category.id],
      href: localizedPath(locale, `/catalog/${category.slug}`),
    })),
    ...popularSubcategories.flatMap(([categoryId, subcategoryRu, image]) => {
      const category = categories.find((item) => item.id === categoryId);
      const subcategory = category?.subcategories.find(
        (item) => item.ru === subcategoryRu,
      );
      if (!category || !subcategory) return [];
      return [
        {
          key: image,
          label: subcategory[locale],
          image,
          href: `${localizedPath(locale, `/catalog/${category.slug}`)}?q=${encodeURIComponent(subcategory[locale])}`,
        },
      ];
    }),
  ];

  return (
    <div className="grid auto-cols-[min(76px,calc((100vw-48px)/4))] grid-flow-col grid-rows-[112px_112px] gap-x-2 gap-y-2 overflow-x-auto overscroll-x-contain pb-2 snap-x snap-mandatory">
      {tiles.map((tile) => (
        <Link
          key={tile.key}
          to={tile.href}
          className="grid h-28 w-[min(76px,calc((100vw-48px)/4))] snap-start grid-rows-[76px_32px] gap-1 text-center"
        >
          <span className="mx-auto flex h-[76px] w-full items-center justify-center">
            <img
              src={tile.image}
              alt=""
              width="76"
              height="76"
              className="h-full w-full object-contain"
            />
          </span>
          <span className="line-clamp-2 h-8 wrap-anywhere text-caption leading-4 text-ink md:text-xs">
            {tile.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
