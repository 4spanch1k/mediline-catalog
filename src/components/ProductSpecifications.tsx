import { Check } from "lucide-react";
import { useState } from "react";
import { translate } from "../i18n/translations";
import {
  booleanSpecificationValue,
  formatSpecificationValue,
  getProductSpecificationGroups,
} from "../lib/specifications";
import type { Locale, Product } from "../types";

export function ProductSpecifications({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const [expanded, setExpanded] = useState(false);
  const groups = getProductSpecificationGroups(product, locale);
  let rowIndex = 0;
  const rowCount = groups.reduce(
    (total, group) => total + group.items.length,
    0,
  );
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <section
      id="specifications"
      className="scroll-mt-28 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 md:p-6"
    >
      <h2 className="text-heading">{t("specifications")}</h2>
      {groups.map((group) => (
        <div key={group.id}>
          <h3 className="mt-4 text-ui font-semibold text-ink">
            {group.label[locale]}
          </h3>
          <dl className="mt-1">
            {group.items.map(({ definition, feature }) => {
              const index = rowIndex++;
              const label = definition.label[locale];
              const value = formatSpecificationValue(
                feature.value[locale],
                definition,
                locale,
              );
              const booleanValue = booleanSpecificationValue(value);
              const stacked = label.length > 24 || value.length > 40;

              return (
                <div
                  key={definition.key}
                  className={`grid min-h-10 gap-1 px-3 py-2.5 even:bg-[var(--background)] ${stacked ? "grid-cols-1" : "grid-cols-[minmax(0,42fr)_minmax(0,58fr)] gap-3"} ${!expanded && index >= 8 ? "max-h-0 min-h-0 overflow-hidden py-0 opacity-0" : ""}`}
                >
                  <dt className="min-w-0 break-words text-ui text-muted">
                    {label}
                  </dt>
                  <dd className="min-w-0 break-words text-ui font-medium text-ink">
                    {booleanValue === undefined ? (
                      value
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        {booleanValue && <Check size={16} aria-hidden="true" />}
                        {translate(locale, booleanValue ? "yes" : "no")}
                      </span>
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      ))}
      {rowCount > 8 && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 min-h-11 w-full rounded-lg border border-[var(--border)] text-ui font-semibold text-accent"
        >
          {expanded
            ? t("fewerSpecifications")
            : `${t("allSpecifications")} (${rowCount})`}
        </button>
      )}
    </section>
  );
}
