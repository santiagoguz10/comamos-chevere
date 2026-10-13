"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  productId: string;
  name: string;
  priceCents: number;
  toppingPriceCents: number;
  quantity: number;
  toppingIds: string[];
  toppingNames: string[];
};

type CartCtx = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  updateQty: (index: number, qty: number) => void;
  clear: () => void;
  totalCents: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cc_cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("cc_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => setItems((prev) => [...prev, item]);
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));
  const updateQty = (index: number, qty: number) =>
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, quantity: Math.max(1, qty) } : it)));
  const clear = () => setItems([]);
  const totalCents = items.reduce((acc, it) => {
    return acc + (it.priceCents + it.toppingPriceCents) * it.quantity;
  }, 0);

  return (
    <Ctx.Provider value={{ items, addItem, removeItem, updateQty, clear, totalCents }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}