import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "../types";
import { trackEvent } from "../lib/analytics";

interface ShopState {
  cart: CartItem[];
  favorites: string[];
  compare: string[];
  recentlyViewed: string[];
  darkMode: boolean;
  addToCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  toggleCompare: (productId: string) => void;
  addRecentlyViewed: (productId: string) => void;
  toggleTheme: () => void;
}

const ShopContext = createContext<ShopState | undefined>(undefined);

function readStringList(key: string): string[] {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const value: unknown = JSON.parse(stored);
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    localStorage.removeItem(key);
    return [];
  }
}

function readCart(): CartItem[] {
  try {
    const stored = localStorage.getItem("mediline-cart");
    if (!stored) return [];
    const value: unknown = JSON.parse(stored);
    if (!Array.isArray(value)) return [];
    return value.filter(
      (item): item is CartItem =>
        typeof item === "object" &&
        item !== null &&
        "productId" in item &&
        typeof item.productId === "string" &&
        "quantity" in item &&
        typeof item.quantity === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    );
  } catch {
    localStorage.removeItem("mediline-cart");
    return [];
  }
}

function readTheme(): boolean {
  const savedTheme = localStorage.getItem("mediline-theme");
  if (savedTheme) return savedTheme === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState(readCart);
  const [favorites, setFavorites] = useState(() =>
    readStringList("mediline-favorites"),
  );
  const [compare, setCompare] = useState(() =>
    readStringList("mediline-compare").slice(0, 4),
  );
  const [recentlyViewed, setRecentlyViewed] = useState(() =>
    readStringList("mediline-recently-viewed"),
  );
  const [darkMode, setDarkMode] = useState(readTheme);

  useEffect(
    () => localStorage.setItem("mediline-cart", JSON.stringify(cart)),
    [cart],
  );
  useEffect(
    () => localStorage.setItem("mediline-favorites", JSON.stringify(favorites)),
    [favorites],
  );
  useEffect(
    () => localStorage.setItem("mediline-compare", JSON.stringify(compare)),
    [compare],
  );
  useEffect(
    () =>
      localStorage.setItem(
        "mediline-recently-viewed",
        JSON.stringify(recentlyViewed),
      ),
    [recentlyViewed],
  );
  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("mediline-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  function addToCart(productId: string) {
    trackEvent("add_to_cart", { product_id: productId });
    setCart((items) => {
      const current = items.find((item) => item.productId === productId);
      if (current) {
        return items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...items, { productId, quantity: 1 }];
    });
  }

  function setQuantity(productId: string, quantity: number) {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((items) =>
      items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    );
  }

  function removeFromCart(productId: string) {
    setCart((items) => items.filter((item) => item.productId !== productId));
  }

  function toggleFavorite(productId: string) {
    setFavorites((items) =>
      items.includes(productId)
        ? items.filter((item) => item !== productId)
        : [...items, productId],
    );
  }

  function toggleCompare(productId: string) {
    setCompare((items) => {
      if (items.includes(productId))
        return items.filter((item) => item !== productId);
      return items.length < 4 ? [...items, productId] : items;
    });
  }

  const addRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed((items) =>
      [productId, ...items.filter((item) => item !== productId)].slice(0, 8),
    );
  }, []);

  return (
    <ShopContext.Provider
      value={{
        cart,
        favorites,
        compare,
        recentlyViewed,
        darkMode,
        addToCart,
        setQuantity,
        removeFromCart,
        clearCart: () => setCart([]),
        toggleFavorite,
        toggleCompare,
        addRecentlyViewed,
        toggleTheme: () => setDarkMode((current) => !current),
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop(): ShopState {
  const shop = useContext(ShopContext);
  if (!shop) throw new Error("useShop must be used inside ShopProvider");
  return shop;
}
