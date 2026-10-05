// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ShopProvider, useShop } from "./useShop";

describe("shop cart state", () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: () => ({ matches: false }),
    });
  });

  it("adds, increments, changes and removes a cart item", () => {
    const { result } = renderHook(() => useShop(), {
      wrapper: ShopProvider,
    });

    act(() => result.current.addToCart("demo-product"));
    act(() => result.current.addToCart("demo-product"));
    expect(result.current.cart).toEqual([
      { productId: "demo-product", quantity: 2 },
    ]);

    act(() => result.current.setQuantity("demo-product", 4));
    expect(result.current.cart[0].quantity).toBe(4);

    act(() => result.current.removeFromCart("demo-product"));
    expect(result.current.cart).toEqual([]);
  });

  it("clears saved items from the cart", () => {
    const { result } = renderHook(() => useShop(), {
      wrapper: ShopProvider,
    });

    act(() => result.current.addToCart("demo-product"));
    act(() => result.current.clearCart());

    expect(result.current.cart).toEqual([]);
  });
});
