const icons = {
  search: "/assets/icons/search.png",
  heart: "/assets/icons/heart.png",
  heartOutline: "/assets/icons/heart-outline.png",
  cart: "/assets/icons/cart.png",
  bag: "/assets/icons/bag.png",
  filter: "/assets/filter-flaticon.png",
  grid: "/assets/icons/grid.png",
  list: "/assets/icons/list.png",
  star: "/assets/icons/star-alt.png",
  close: "/assets/icons/close.png",
  lighting: "/assets/icons/category-lighting.png",
  televisions: "/assets/icons/category-televisions.png",
  plumbing: "/assets/icons/category-plumbing.png",
  medical: "/assets/icons/category-medical.png",
  whatsapp: "/assets/icons/whatsapp.png",
} as const;

export function FlaticonIcon({
  name,
  size = 18,
  className = "",
}: {
  name: keyof typeof icons;
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={icons[name]}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`flaticon-icon inline-block shrink-0 object-contain ${name === "star" ? "flaticon-star" : ""} ${className}`}
    />
  );
}
