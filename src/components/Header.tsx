import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FlaticonIcon } from "./FlaticonIcon";
import { localizedPath } from "../lib/routes";
import { categories } from "../data/products";
import { translate } from "../i18n/translations";
import { useShop } from "../hooks/useShop";
import type { Locale } from "../types";
import logo from "../assets/logo.svg";
import { siteConfig } from "../config/site";
import { MiniCart } from "./MiniCart";
import { Moon, Sun } from "lucide-react";

export function Header({ locale }: { locale: Locale }) {
  const shop = useShop();
  const location = useLocation();
  const navigate = useNavigate();
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const cartCount = shop.cart.reduce((total, item) => total + item.quantity, 0);
  const pathWithoutLocale =
    location.pathname.replace(/^\/(ru|kz|en)/, "") || "/";
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex min-h-16 max-w-[1600px] flex-wrap items-center gap-3 px-3 md:flex-nowrap md:gap-6 md:px-6">
        <Link
          to={localizedPath(locale, "/")}
          className="order-1 shrink-0"
          aria-label="Mediline"
        >
          <img src={logo} alt="Mediline" className="h-8 w-auto" />
        </Link>
        <form
          role="search"
          className="order-3 flex min-h-10 w-full min-w-0 basis-full items-center rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 md:order-none md:mx-auto md:w-auto md:max-w-2xl md:flex-1 md:basis-auto"
          onSubmit={(event) => {
            event.preventDefault();
            const value =
              new FormData(event.currentTarget).get("q")?.toString() ?? "";
            navigate(
              `${localizedPath(locale, "/catalog")}?q=${encodeURIComponent(value)}`,
            );
          }}
        >
          <FlaticonIcon name="search" size={18} className="flaticon-dark" />
          <input
            name="q"
            aria-label={t("search")}
            placeholder={t("searchPlaceholder")}
            defaultValue={new URLSearchParams(location.search).get("q") ?? ""}
            className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-body md:text-sm outline-none placeholder:text-muted"
          />
        </form>
        <nav
          className="order-2 ml-auto flex shrink-0 items-center gap-0 sm:gap-1 md:order-none md:ml-0"
          aria-label={t("catalog")}
        >
          {siteConfig.displayPhone && (
            <a
              href={`tel:+${siteConfig.whatsAppNumber}`}
              className="hidden whitespace-nowrap text-caption md:text-xs font-medium text-muted hover:text-accent lg:inline-flex"
            >
              {siteConfig.displayPhone}
            </a>
          )}
          <select
            aria-label={t("language")}
            value={locale}
            onChange={(event) => {
              const nextLocale = event.target.value as Locale;
              localStorage.setItem("mediline-locale", nextLocale);
              navigate(
                `${localizedPath(nextLocale, pathWithoutLocale)}${location.search}`,
              );
            }}
            className="h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-caption md:text-xs font-medium"
          >
            <option value="ru">RU</option>
            <option value="kz">KZ</option>
            <option value="en">EN</option>
          </select>
          <button
            type="button"
            aria-label={t("favorites")}
            onClick={() => navigate(localizedPath(locale, "/favorites"))}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[var(--background)]"
          >
            <FlaticonIcon
              name="heartOutline"
              size={19}
              className="flaticon-dark"
            />
            {shop.favorites.length > 0 && (
              <span className="count-badge">{shop.favorites.length}</span>
            )}
          </button>
          <button
            type="button"
            aria-label={t("cart")}
            onClick={() => setMiniCartOpen(true)}
            aria-expanded={miniCartOpen}
            aria-haspopup="dialog"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[var(--background)]"
          >
            <FlaticonIcon name="bag" size={19} className="flaticon-dark" />
            {cartCount > 0 && <span className="count-badge">{cartCount}</span>}
          </button>
          <button
            type="button"
            aria-label={shop.darkMode ? t("lightTheme") : t("darkTheme")}
            title={shop.darkMode ? t("lightTheme") : t("darkTheme")}
            onClick={shop.toggleTheme}
            className="hidden h-9 w-9 items-center justify-center rounded-lg hover:bg-[var(--background)] sm:flex"
          >
            {shop.darkMode ? (
              <Sun size={18} aria-hidden="true" />
            ) : (
              <Moon size={18} aria-hidden="true" />
            )}
          </button>
        </nav>
      </div>
      <div className="mx-auto flex max-w-[1600px] gap-5 overflow-x-auto px-3 pb-2 text-body md:text-sm md:px-6">
        <Link
          to={localizedPath(locale, "/catalog")}
          className="whitespace-nowrap text-muted hover:text-accent"
        >
          {t("catalog")}
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            to={localizedPath(locale, `/catalog/${category.slug}`)}
            className="whitespace-nowrap text-muted hover:text-accent"
          >
            {category.label[locale]}
          </Link>
        ))}
      </div>
      {miniCartOpen && (
        <MiniCart locale={locale} onClose={() => setMiniCartOpen(false)} />
      )}
    </header>
  );
}
