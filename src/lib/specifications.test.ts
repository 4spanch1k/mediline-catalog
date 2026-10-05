import { describe, expect, it } from "vitest";
import { products } from "../data/products";
import {
  booleanSpecificationValue,
  formatSpecificationValue,
  getKeyProductSpecifications,
  getProductSpecificationGroups,
} from "./specifications";
import { getSpecificationDefinition } from "../data/specSchema";

describe("product specification schema", () => {
  it("orders and groups populated specifications from the category schema", () => {
    const television = products.find(
      (product) => product.category === "televisions",
    )!;
    const groups = getProductSpecificationGroups(television, "ru");

    expect(groups[0].label.ru).toBe("Экран");
    expect(groups[0].items[0].definition.key).toBe("diagonal");
    expect(groups[0].items[0].value).toBe("43\u00a0″");
    expect(getKeyProductSpecifications(television, "en")).toHaveLength(4);
  });

  it("formats units and multiplication marks", () => {
    const power = getSpecificationDefinition("power")!;

    expect(formatSpecificationValue("12 Вт", power, "ru")).toBe("12\u00a0Вт");
    expect(formatSpecificationValue("2 x 60 измерений", power, "ru")).toBe(
      "2 × 60 измерений",
    );
  });

  it("recognizes translated boolean values", () => {
    expect(booleanSpecificationValue("Иә")).toBe(true);
    expect(booleanSpecificationValue("Жоқ")).toBe(false);
    expect(booleanSpecificationValue("Smart TV")).toBeUndefined();
  });
});
