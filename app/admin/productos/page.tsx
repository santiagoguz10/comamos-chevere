"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Topping = { id: string; name: string; priceCents: number };
type Product = { id: string; name: string; category: string; description?: string; priceCents: number; imageUrl?: string; enabled: boolean; toppings: { topping: Topping }[] };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [me, setMe] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    category: "hamburger",
    description: "",
    price: "",
    imageUrl: "",
    toppingIds: [] as string[],
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function toggleProduct(id: string, enabled: boolean) {
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    });
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, enabled } : p)));
  }

  async function load() {
    const [pRes, tRes, mRes] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/toppings"),
      fetch("/api/me"),
    ]);
    const pData = await pRes.json();
    const tData = await tRes.json();
    const mData = await mRes.json();
    setProducts(pData.products || []);
    setToppings(tData.toppings || []);
    setMe(mData.user);
  }

  useEffect(() => { load(); }, []);

  function toggleTopping(id: string) {
    setForm((f) => ({
      ...f,
      toppingIds: f.toppingIds.includes(id) ? f.toppingIds.filter((x) => x !== id) : [...f.toppingIds, id],
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        category: form.category,
        description: form.description,
        priceCents: Math.round(Number(form.price) * 100),
        imageUrl: form.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(form.name)}/480/320`,
        toppingIds: form.toppingIds,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setMsg("Producto creado ✅");
      setForm({ name: "", category: "hamburger", description: "", price: "", imageUrl: "", toppingIds: [] });
      load();
    } else {
      setMsg(data.error || "Error");
    }
  }

  if (me && me.role !== "admin") {
    return <p className="text-red-600">Acceso solo para administradores.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestionar productos</h1>
        <Link href="/admin" className="text-red-500 font-semibold">← Pedidos</Link>
      </div>

      <form onSubmit={submit} className="card p-4 space-y-3">
        <h2 className="font-bold text-lg">Nuevo producto</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <input className="input" placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="hamburger">Hamburguesa</option>
            <option value="pizza">Pizza</option>
            <option value="choripero">Choriperro</option>
          </select>
          <input className="input" placeholder="Precio (ej. 180.00)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input className="input" placeholder="URL imagen (opcional)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        </div>
        <textarea className="input" placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div>
          <p className="text-sm font-semibold mb-1">Toppings disponibles</p>
          <div className="flex flex-wrap gap-2">
            {toppings.map((t) => (
              <label key={t.id} className="flex items-center gap-1 text-sm bg-neutral-100 px-2 py-1 rounded-lg cursor-pointer">
                <input type="checkbox" checked={form.toppingIds.includes(t.id)} onChange={() => toggleTopping(t.id)} />
                {t.name}
              </label>
            ))}
          </div>
        </div>
        {msg && <p className="text-sm text-neutral-600">{msg}</p>}
        <button className="btn-primary" disabled={saving}>{saving ? "Guardando..." : "Crear producto"}</button>
      </form>

      <div className="space-y-3">
        <h2 className="font-bold text-lg">Productos actuales ({products.length})</h2>
        {products.map((p) => (
          <div key={p.id} className={`card p-3 flex gap-3 items-center ${p.enabled ? "" : "opacity-60"}`}>
            {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-20 h-16 object-cover rounded-lg" />}
            <div className="flex-1">
              <p className="font-bold">{p.name} <span className="text-xs text-neutral-500">({p.category})</span> {!p.enabled && <span className="text-red-600 text-xs">(Deshabilitado)</span>}</p>
              <p className="text-sm text-neutral-500">{p.description}</p>
              <p className="text-sm font-semibold">${(p.priceCents / 100).toFixed(2)} · {p.toppings.map((t) => t.topping.name).join(", ") || "Sin toppings"}</p>
            </div>
            <button
              className={p.enabled ? "btn-secondary text-sm" : "btn-primary text-sm"}
              onClick={() => toggleProduct(p.id, !p.enabled)}
            >
              {p.enabled ? "Deshabilitar" : "Habilitar"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}