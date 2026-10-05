import { describe, expect, it } from "vitest";
import { products } from "../data/products";
import {
  buildWhatsAppUrl,
  formatKazakhstanPhone,
  isValidKazakhstanPhone,
  isValidRequestContact,
} from "./whatsapp";

describe("WhatsApp order links", () => {
  it("formats a localized product request", () => {
    const product = products[0];
    const url = buildWhatsAppUrl(
      [{ productId: product.id, quantity: 2 }],
      products,
      "ru",
    );

    expect(url).toContain("https://wa.me/77776555665?text=");
    expect(decodeURIComponent(url!.split("text=")[1])).toContain(
      `${product.name.ru} — 2 ×`,
    );
  });

  it("rejects a message that exceeds the WhatsApp limit", () => {
    const product = products[0];
    const url = buildWhatsAppUrl(
      [{ productId: product.id, quantity: 1 }],
      products,
      "ru",
      { comment: "x".repeat(4000) },
    );

    expect(url).toBeUndefined();
  });

  it("includes the city on its own localized line", () => {
    const product = products[0];
    const url = buildWhatsAppUrl(
      [{ productId: product.id, quantity: 1 }],
      products,
      "ru",
      { name: "Алия", phone: "+7 (701) 123-45-67", city: "Алматы" },
    );

    expect(decodeURIComponent(url!.split("text=")[1])).toContain(
      "Город: Алматы",
    );
  });

  it("formats and validates Kazakhstan mobile numbers", () => {
    expect(formatKazakhstanPhone("")).toBe("");
    expect(formatKazakhstanPhone("87011234567")).toBe("+7 (701) 123-45-67");
    expect(formatKazakhstanPhone("7011234567")).toBe("+7 (701) 123-45-67");
    expect(isValidKazakhstanPhone("+7 (701) 123-45-67")).toBe(true);
    expect(isValidKazakhstanPhone("+7 (701) 123-45-6")).toBe(false);
    expect(isValidKazakhstanPhone("+7 (101) 123-45-67")).toBe(false);
  });

  it("requires a name, a valid phone and a city", () => {
    expect(
      isValidRequestContact({
        name: "Алия",
        phone: "+7 (701) 123-45-67",
        city: "Алматы",
      }),
    ).toBe(true);
    expect(
      isValidRequestContact({
        name: "Алия",
        phone: "+7 (701) 123-45-67",
        city: "",
      }),
    ).toBe(false);
  });
});
