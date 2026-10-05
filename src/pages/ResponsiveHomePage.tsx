import { lazy, Suspense } from "react";
import { useLocale } from "../components/SiteLayout";
import { PageSkeleton } from "../components/PageSkeleton";
import { MobileHome } from "./MobileHome";

const HomePage = lazy(() =>
  import("./HomePage").then((module) => ({ default: module.HomePage })),
);

export function ResponsiveHomePage() {
  const locale = useLocale();

  return (
    <>
      <div className="md:hidden">
        <MobileHome locale={locale} />
      </div>
      <div className="hidden md:block">
        <Suspense fallback={<PageSkeleton />}>
          <HomePage />
        </Suspense>
      </div>
    </>
  );
}
