"use client";

import { useEffect, useState } from "react";
import { useCart, CartItem } from "@/components/CartProvider";

type Topping = { id: string; name: string; priceCents: number };
type ProductTopping = { topping: Topping };
type Product = { id: string; name: string; category: string; description?: string; priceCents: number; toppings: ProductTopping[] };

export default function MenuPage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [sel, setSel] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then((d) => setProducts(d.products || []));
  }, []);

  function toggle(productId: string, toppingId: string) {
    setSel((prev) => {
      const cur = prev[productId] || [];
      return {
        ...prev,
        [productId]: cur.includes(toppingId) ? cur.filter((x) => x !== toppingId) : [...cur, toppingId],
      };
    });
  }

  function addToCart(p: Product) {
    const toppingIds = sel[p.id] || [];
    const toppingNames = toppingIds
      .map((id) => p.toppings.find((t) => t.topping.id === id)?.topping.name)
      .filter(Boolean) as string[];
    const toppingPriceCents = toppingIds.reduce((acc, id) => {
      const t = p.toppings.find((x) => x.topping.id === id)?.topping;
      return acc + (t?.priceCents || 0);
    }, 0);
    const item: CartItem = {
      productId: p.id,
      name: p.name,
      priceCents: p.priceCents,
      toppingPriceCents,
      quantity: qty[p.id] || 1,
      toppingIds,
      toppingNames,
    };
    addItem(item);
  }

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Menú</h1>
      {categories.map((cat) => (
        <section key={cat}>
          <h2 className="text-xl font-bold text-red-500 mb-3 capitalize flex items-center gap-2">
            <span className="w-2 h-6 bg-yellow-400 rounded-full inline-block"></span>{cat}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {products.filter((p) => p.category === cat).map((p) => (
              <div key={p.id} className="card p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="text-sm text-stone-500">{p.description}</p>
                  </div>
                  <span className="font-bold bg-black text-yellow-400 px-2 py-1 rounded-lg">${(p.priceCents / 100).toFixed(2)}</span>
                </div>
                {p.toppings.length > 0 && (
                  <div>
                    <p className="text-xs text-stone-500 mb-1">Toppings</p>
                    <div className="flex flex-wrap gap-2">
                      {p.toppings.map((pt) => (
                        <label key={pt.topping.id} className="flex items-center gap-1 text-sm bg-stone-100 px-2 py-1 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(sel[p.id] || []).includes(pt.topping.id)}
                            onChange={() => toggle(p.id, pt.topping.id)}
                          />
                          <span>{pt.topping.name}</span>
                          <span className="text-stone-500">+${(pt.topping.priceCents / 100).toFixed(2)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min={1}
                    className="input w-20"
                    value={qty[p.id] || 1}
                    onChange={(e) => setQty({ ...qty, [p.id]: Number(e.target.value) })}
                  />
                  <button className="btn-primary" onClick={() => addToCart(p)}>Añadir al carrito</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}