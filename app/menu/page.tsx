"use client";

import { useEffect, useState } from "react";
import { useCart, CartItem } from "@/components/CartProvider";

type Topping = { id: string; name: string; priceCents: number; enabled?: boolean };
type ProductTopping = { topping: Topping };
type Variant = { id: string; name: string; priceCents: number };
type Product = { id: string; name: string; category: string; description?: string; priceCents: number; imageUrl?: string; toppings: ProductTopping[]; variants: Variant[] };
type Review = { id: string; productId: string; rating: number; comment?: string | null; createdAt: string; user: { name?: string | null; email: string } };

const categoryLabel: Record<string, string> = {
  pizza: "Pizzas",
  hamburger: "Hamburguesas",
  hotdog: "Perros calientes",
  chorizo: "Chorizos",
  papas: "Papitas",
  burrito: "Burritos",
  mazorcada: "Mazorcadas",
  "para picar": "Para picar",
  "fines de semana": "Fines de semana",
};

const categoryIcon: Record<string, string> = {
  pizza: "🍕",
  hamburger: "🍔",
  hotdog: "🌭",
  chorizo: "🌶️",
  papas: "🍟",
  burrito: "🌯",
  mazorcada: "🌽",
  "para picar": "🥟",
  "fines de semana": "🍗",
};

export default function MenuPage() {
  const { addItem, showToast } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [me, setMe] = useState<any>(null);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [sel, setSel] = useState<Record<string, string[]>>({});
  const [variantSel, setVariantSel] = useState<Record<string, string>>({});
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [comboSel, setComboSel] = useState<Record<string, boolean>>({});

  const [ratingSel, setRatingSel] = useState<Record<string, number>>({});
  const [commentSel, setCommentSel] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<Record<string, boolean>>({});
  const [msg, setMsg] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then((d) => setProducts(d.products || []));
    fetch("/api/reviews").then((r) => r.json()).then((d) => setReviews(d.reviews || []));
    fetch("/api/me").then((r) => r.json()).then((d) => setMe(d.user));
  }, []);

  useEffect(() => {
    const defaults: Record<string, string> = {};
    products.forEach((p) => {
      if (p.variants && p.variants.length) defaults[p.id] = p.variants[0].id;
    });
    setVariantSel(defaults);
  }, [products]);

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
    const variant = p.variants && p.variants.length ? (p.variants.find((v) => v.id === variantSel[p.id]) || p.variants[0]) : null;
    const unitPrice = variant ? variant.priceCents : p.priceCents;
    const combo = comboSel[p.id] ? 4000 : 0;
    const displayName = comboSel[p.id] ? `${variant ? `${p.name} (${variant.name})` : p.name} + Combo` : (variant ? `${p.name} (${variant.name})` : p.name);
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
      name: displayName,
      priceCents: unitPrice + combo,
      toppingPriceCents,
      quantity: qty[p.id] || 1,
      toppingIds,
      toppingNames,
    };
    addItem(item);
    showToast(`${qty[p.id] || 1} x ${displayName} agregado al carrito ✅`);
  }

  async function submitReview(productId: string) {
    setSending((s) => ({ ...s, [productId]: true }));
    setMsg((m) => ({ ...m, [productId]: "" }));
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating: ratingSel[productId] || 5, comment: commentSel[productId] }),
    });
    const data = await res.json();
    setSending((s) => ({ ...s, [productId]: false }));
    if (res.ok) {
      setReviews((prev) => [data.review, ...prev]);
      setMsg((m) => ({ ...m, [productId]: "¡Gracias por tu reseña!" }));
      setCommentSel((c) => ({ ...c, [productId]: "" }));
    } else {
      setMsg((m) => ({ ...m, [productId]: data.error || "Error" }));
    }
  }

  function avgFor(productId: string) {
    const rs = reviews.filter((r) => r.productId === productId);
    if (!rs.length) return null;
    return (rs.reduce((a, r) => a + r.rating, 0) / rs.length).toFixed(1);
  }

  const categoryOrder = ["pizza", "hamburger", "hotdog", "chorizo", "papas", "burrito", "mazorcada", "para picar", "fines de semana"];
  const categories = [...new Set(products.map((p) => p.category))];
  const orderedCategories = categoryOrder.filter((c) => categories.includes(c)).concat(categories.filter((c) => !categoryOrder.includes(c)));
  const currentCategory = activeCategory || orderedCategories[0] || "";


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-black flex items-center gap-2">
        <span className="w-2 h-7 bg-yellow-400 rounded-full inline-block"></span>Menú
      </h1>
      <div className="flex gap-2 flex-wrap mb-4">
        {orderedCategories.map((cat) => (
          <button
            key={cat}
            className={`btn ${currentCategory === cat ? "bg-yellow-400 text-black" : "bg-white"}`}
            onClick={() => setActiveCategory(cat)}
          >
            {categoryIcon[cat] || "🍽️"} {categoryLabel[cat] || cat}
          </button>
        ))}
      </div>

      {orderedCategories.filter((c) => c === currentCategory).map((cat) => (
        <section key={cat}>
          <h2 className="text-xl font-bold text-red-500 mb-3 capitalize flex items-center gap-2">
            <span className="w-2 h-6 bg-yellow-400 rounded-full inline-block"></span>{categoryLabel[cat] || cat}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {products.filter((p) => p.category === cat).map((p) => {
              const pr = reviews.filter((r) => r.productId === p.id);
              const avg = avgFor(p.id);
              return (
                <div key={p.id} className="card overflow-hidden flex flex-col">
                  {p.imageUrl && (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-44 object-cover" />
                  )}
                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-bold text-lg">{p.name}</h3>
                        <p className="text-sm text-neutral-500">{p.description}</p>
                      </div>
                      {p.variants && p.variants.length > 0 && (
                        <select
                          className="input w-32 text-sm"
                          value={variantSel[p.id] || p.variants[0].id}
                          onChange={(e) => setVariantSel({ ...variantSel, [p.id]: e.target.value })}
                        >
                          {p.variants.map((v) => (
                            <option key={v.id} value={v.id}>{v.name} - ${(v.priceCents).toLocaleString('es-CO')}</option>
                          ))}
                        </select>
                      )}
                      <span className="font-bold bg-black text-yellow-400 px-2 py-1 rounded-lg">
                        ${(((p.variants && p.variants.length ? (p.variants.find((v) => v.id === variantSel[p.id]) || p.variants[0]).priceCents : p.priceCents)).toLocaleString('es-CO'))}
                      </span>
                    </div>

                    {avg && (
                      <div className="text-sm flex items-center gap-2">
                        <span className="text-yellow-500">{"★".repeat(Math.round(Number(avg)))}</span>
                        <span className="text-neutral-500">{avg} ({pr.length} reseñas)</span>
                      </div>
                    )}

                    {p.toppings.filter((pt) => pt.topping.enabled !== false).length > 0 && (
                      <div>
                        <p className="text-xs text-neutral-500 mb-1 font-semibold">Toppings</p>
                        <div className="flex flex-wrap gap-2">
                          {p.toppings.filter((pt) => pt.topping.enabled !== false).map((pt) => (
                            <label key={pt.topping.id} className="flex items-center gap-1 text-sm bg-neutral-100 px-2 py-1 rounded-lg cursor-pointer hover:bg-yellow-100">
                              <input
                                type="checkbox"
                                checked={(sel[p.id] || []).includes(pt.topping.id)}
                                onChange={() => toggle(p.id, pt.topping.id)}
                              />
                              <span>{pt.topping.name}</span>
                              <span className="text-neutral-500">+${(pt.topping.priceCents).toLocaleString('es-CO')}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    {(p.category === "burger" || p.category === "hotdog" || p.category === "chorizo") && (
                      <label className="flex items-center gap-2 text-sm bg-yellow-50 border border-yellow-200 rounded-lg px-2 py-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={comboSel[p.id] || false}
                          onChange={(e) => setComboSel({ ...comboSel, [p.id]: e.target.checked })}
                        />
                        Combo papas + gaseosa (+$4.000)
                      </label>
                    )}
                    <div className="flex gap-2 items-center mt-auto">
                      <input
                        type="number"
                        min={1}
                        className="input w-20"
                        value={qty[p.id] || 1}
                        onChange={(e) => setQty({ ...qty, [p.id]: Number(e.target.value) })}
                      />
                      <button className="btn-primary" onClick={() => addToCart(p)}>Añadir 🛒</button>
                    </div>

                    {/* Reviews */}
                    <div className="border-t border-neutral-200 pt-3 mt-2">
                      <p className="font-semibold text-sm mb-1">Reseñas</p>
                      {pr.slice(0, 3).map((r) => (
                        <div key={r.id} className="text-sm bg-neutral-50 rounded-lg p-2 mb-1">
                          <div className="flex justify-between">
                            <span className="font-semibold">{r.user?.name || r.user?.email}</span>
                            <span className="text-yellow-500">{"★".repeat(r.rating)}</span>
                          </div>
                          {r.comment && <p className="text-neutral-600">{r.comment}</p>}
                        </div>
                      ))}
                      {pr.length === 0 && <p className="text-xs text-neutral-500">Sin reseñas todavía.</p>}

                      {me && (
                        <div className="mt-2 space-y-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className={`text-xl ${ (ratingSel[p.id] || 5) >= star ? "text-yellow-500" : "text-neutral-300" }`}
                                onClick={() => setRatingSel({ ...ratingSel, [p.id]: star })}
                              >★</button>
                            ))}
                          </div>
                          <textarea
                            className="input text-sm"
                            placeholder="Escribe tu reseña (opcional)"
                            value={commentSel[p.id] || ""}
                            onChange={(e) => setCommentSel({ ...commentSel, [p.id]: e.target.value })}
                          />
                          <button
                            className="btn-secondary text-sm"
                            disabled={sending[p.id]}
                            onClick={() => submitReview(p.id)}
                          >
                            {sending[p.id] ? "Enviando..." : "Enviar reseña"}
                          </button>
                          {msg[p.id] && <p className="text-xs text-neutral-600">{msg[p.id]}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}