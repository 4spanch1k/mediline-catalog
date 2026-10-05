import { Grid2X2, Heart, House, ShoppingBag } from "lucide-react";
import { NavLink } from "react-router-dom";
import { translate } from "../i18n/translations";
import { localizedPath } from "../lib/routes";
import { useShop } from "../hooks/useShop";
import type { Locale } from "../types";

export function MobileBottomNav({ locale }: { locale: Locale }) {
  const shop = useShop();
  const cartCount = shop.cart.reduce((total, item) => total + item.quantity, 0);
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const tabs = [
    { path: "/", label: t("home"), Icon: House },
    { path: "/catalog", label: t("catalog"), Icon: Grid2X2 },
    {
      path: "/favorites",
      label: t("tabFavorites"),
      Icon: Heart,
      count: shop.favorites.length,
    },
    { path: "/cart", label: t("cart"), Icon: ShoppingBag, count: cartCount },
  ];

  return (
    <nav
      aria-label={t("mainNavigation")}
      className="fixed inset-x-0 bottom-0 z-30 grid h-[calc(56px+env(safe-area-inset-bottom))] grid-cols-4 border-t border-[var(--border)] bg-[var(--surface)] pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {tabs.map(({ path, label, Icon, count }) => (
        <NavLink
          key={path}
          to={localizedPath(locale, path)}
          end={path === "/"}
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center gap-0.5 text-micro ${isActive ? "text-accent" : "text-muted"}`
          }
        >
          <span className="relative">
            <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
            {!!count && (
              <span className="absolute -right-1.5 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-button-accent px-1 text-count leading-none text-on-accent">
                {count}
              </span>
            )}
          </span>
          <span className="max-w-full truncate px-1">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
