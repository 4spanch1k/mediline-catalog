import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ShopProvider } from "./hooks/useShop";
import { SiteLayout } from "./components/SiteLayout";
import { PageSkeleton } from "./components/PageSkeleton";

const CartPage = lazy(() =>
  import("./pages/CartPage").then((module) => ({ default: module.CartPage })),
);
const CatalogPage = lazy(() =>
  import("./pages/CatalogPage").then((module) => ({
    default: module.CatalogPage,
  })),
);
const FavoritesPage = lazy(() =>
  import("./pages/CollectionPages").then((module) => ({
    default: module.FavoritesPage,
  })),
);
const ComparePage = lazy(() =>
  import("./pages/CollectionPages").then((module) => ({
    default: module.ComparePage,
  })),
);
const AboutPage = lazy(() =>
  import("./pages/InfoPages").then((module) => ({ default: module.AboutPage })),
);
const NotFoundPage = lazy(() =>
  import("./pages/InfoPages").then((module) => ({
    default: module.NotFoundPage,
  })),
);
const ContactsPage = lazy(() =>
  import("./pages/InfoPages").then((module) => ({
    default: module.ContactsPage,
  })),
);
const ResponsiveHomePage = lazy(() =>
  import("./pages/ResponsiveHomePage").then((module) => ({
    default: module.ResponsiveHomePage,
  })),
);
const ProductPage = lazy(() =>
  import("./pages/ProductPage").then((module) => ({
    default: module.ProductPage,
  })),
);

function PreferredLanguageRedirect() {
  const savedLocale = localStorage.getItem("mediline-locale");
  const locale =
    savedLocale === "kz" || savedLocale === "en" ? savedLocale : "ru";
  return <Navigate to={`/${locale}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={<PreferredLanguageRedirect />} />
            <Route path="/:locale" element={<SiteLayout />}>
              <Route index element={<ResponsiveHomePage />} />
              <Route path="catalog" element={<CatalogPage />} />
              <Route path="catalog/:category" element={<CatalogPage />} />
              <Route path="product/:slug" element={<ProductPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="compare" element={<ComparePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contacts" element={<ContactsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="*" element={<PreferredLanguageRedirect />} />
          </Routes>
        </Suspense>
      </ShopProvider>
    </BrowserRouter>
  );
}
