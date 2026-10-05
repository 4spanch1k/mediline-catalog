import { Link } from "react-router-dom";
import { categories } from "../data/products";
import { localizedPath } from "../lib/routes";
import type { Locale } from "../types";

const popularSubcategories = [
  ["lighting", "Лампы", "bulbs"],
  ["lighting", "LED-ленты", "led-strips"],
  ["plumbing", "Смесители", "mixers"],
  ["medical", "Тонометры", "tonometers"],
] as const;

export function MobileCategoryTiles({ locale }: { locale: Locale }) {
  const tiles = [
    ...categories.map((category) => ({
      key: category.id,
      label: category.label[locale],
      image: category.slug,
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
    <div className="grid auto-cols-[76px] grid-flow-col grid-rows-[112px_112px] gap-x-2 gap-y-2 overflow-x-auto overscroll-x-contain pb-2 snap-x snap-mandatory">
      {tiles.map((tile) => (
        <Link
          key={tile.key}
          to={tile.href}
          className="grid h-28 w-[76px] snap-start grid-rows-[76px_32px] gap-1 text-center"
        >
          <span className="flex h-[76px] w-[76px] items-center justify-center rounded-2xl bg-[var(--surface)] p-1">
            <img
              src={`/assets/categories/${tile.image}.svg`}
              alt=""
              width="64"
              height="64"
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
