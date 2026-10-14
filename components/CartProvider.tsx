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
  toast: string | null;
  showToast: (msg: string) => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  let toastTimer: any = null;
  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setToast(null), 2500);
  };
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
    <Ctx.Provider value={{ items, addItem, removeItem, updateQty, clear, totalCents, toast, showToast }}>
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-4 py-3 rounded-xl shadow-lg border border-yellow-400">
          {toast}
          <a href="/cart" className="ml-3 text-yellow-400 font-semibold">Ver carrito</a>
        </div>
      )}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}