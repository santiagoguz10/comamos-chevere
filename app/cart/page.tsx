"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const { items, removeItem, updateQty, clear, totalCents } = useCart();
  const router = useRouter();
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setLoading(true);
    setError("");
    const payload = {
      deliveryType,
      notes,
      address: deliveryType === "delivery" ? { street, city } : undefined,
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        toppingIds: i.toppingIds,
      })),
    };
    const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || "Error");
    clear();
    router.push(`/orders/${data.order.id}`);
  }

  if (items.length === 0) {
    return <div className="card p-6 text-center">Tu carrito está vacío 🛒 <a href="/menu" className="text-red-500 font-semibold">Ir al menú</a></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Carrito</h1>
      <div className="space-y-3">
        {items.map((it, idx) => (
          <div key={idx} className="card p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{it.name} x{it.quantity}</p>
              <p className="text-sm text-stone-500">{it.toppingNames.join(", ") || "Sin toppings"}</p>
            </div>
            <div className="flex items-center gap-3">
              <span>${(((it.priceCents + it.toppingPriceCents) * it.quantity) / 100).toFixed(2)}</span>
              <input type="number" min={1} className="input w-16" value={it.quantity} onChange={(e) => updateQty(idx, Number(e.target.value))} />
              <button className="btn-danger" onClick={() => removeItem(idx)}>X</button>
            </div>
          </div>
        ))}
      </div>
      <div className="card p-4 space-y-3">
        <p className="font-bold">Total: ${(totalCents / 100).toFixed(2)}</p>
        <div className="flex gap-3">
          <label className="flex items-center gap-2">
            <input type="radio" checked={deliveryType === "delivery"} onChange={() => setDeliveryType("delivery")} /> A domicilio
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={deliveryType === "pickup"} onChange={() => setDeliveryType("pickup")} /> Recoger en tienda
          </label>
        </div>
        {deliveryType === "delivery" && (
          <div className="grid md:grid-cols-2 gap-2">
            <input className="input" placeholder="Calle / dirección" value={street} onChange={(e) => setStreet(e.target.value)} />
            <input className="input" placeholder="Ciudad" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
        )}
        <textarea className="input" placeholder="Notas (opcional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn-primary w-full" onClick={submit} disabled={loading}>
          {loading ? "Enviando..." : "Enviar pedido"}
        </button>
      </div>
    </div>
  );
}