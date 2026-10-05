import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { CatalogFilters } from "../types";

export function useCatalogState(): [
  CatalogFilters,
  (update: Partial<CatalogFilters>) => void,
] {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => {
    const specifications: Record<string, string[]> = {};

    for (const [key, value] of params.entries()) {
      if (!key.startsWith("spec:")) continue;
      const specification = key.slice(5);
      specifications[specification] = [
        ...(specifications[specification] ?? []),
        value,
      ];
    }

    return {
      query: params.get("q") ?? "",
      brands: params.getAll("brand"),
      minPrice:
        params.has("min") && Number.isFinite(Number(params.get("min")))
          ? Number(params.get("min"))
          : undefined,
      maxPrice:
        params.has("max") && Number.isFinite(Number(params.get("max")))
          ? Number(params.get("max"))
          : undefined,
      availableOnly: params.get("stock") === "1",
      specifications,
      sort: params.get("sort") ?? "popular",
      view: params.get("view") === "list" ? "list" : "grid",
      page: Math.max(1, Math.floor(Number(params.get("page")) || 1)),
    } satisfies CatalogFilters;
  }, [params]);

  const updateFilters = useCallback(
    (update: Partial<CatalogFilters>) => {
      const changesProducts = [
        "query",
        "brands",
        "minPrice",
        "maxPrice",
        "availableOnly",
        "specifications",
        "sort",
      ].some((key) => key in update);
      const next: CatalogFilters = {
        ...filters,
        ...update,
        page: update.page ?? (changesProducts ? 1 : filters.page),
      };
      const nextParams = new URLSearchParams();
      if (next.query) nextParams.set("q", next.query);
      for (const brand of next.brands) nextParams.append("brand", brand);
      if (next.minPrice !== undefined)
        nextParams.set("min", String(next.minPrice));
      if (next.maxPrice !== undefined)
        nextParams.set("max", String(next.maxPrice));
      if (next.availableOnly) nextParams.set("stock", "1");
      for (const [key, values] of Object.entries(next.specifications)) {
        for (const value of values) nextParams.append(`spec:${key}`, value);
      }
      if (next.sort !== "popular") nextParams.set("sort", next.sort);
      if (next.view !== "grid") nextParams.set("view", next.view);
      if (next.page > 1) nextParams.set("page", String(next.page));
      if (nextParams.toString() === params.toString()) return;
      setParams(nextParams);
    },
    [filters, params, setParams],
  );

  return [filters, updateFilters];
}
