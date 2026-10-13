"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Topping = { id: string; name: string; priceCents: number; enabled: boolean };

export default function AdminSettingsPage() {
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [me, setMe] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    const [tRes, sRes, mRes] = await Promise.all([
      fetch("/api/toppings"),
      fetch("/api/settings"),
      fetch("/api/me"),
    ]);
    const tData = await tRes.json();
    const sData = await sRes.json();
    const mData = await mRes.json();
    setToppings(tData.toppings || []);
    setIsOpen(sData.settings?.isOpen ?? true);
    setMessage(sData.settings?.message || "");
    setMe(mData.user);
  }

  useEffect(() => { load(); }, []);

  async function toggleStore() {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isOpen: !isOpen, message }),
    });
    setIsOpen(!isOpen);
    setSaving(false);
  }

  async function saveMessage() {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isOpen, message }),
    });
    setSaving(false);
    setMsg("Guardado");
    setTimeout(() => setMsg(""), 2000);
  }

  async function toggleTopping(id: string, enabled: boolean) {
    await fetch(`/api/toppings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    });
    setToppings((prev) => prev.map((t) => (t.id === id ? { ...t, enabled } : t)));
  }

  if (me && me.role !== "admin") {
    return <p className="text-red-600">Acceso solo para administradores.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Configuración</h1>
        <Link href="/admin" className="text-red-500 font-semibold">← Pedidos</Link>
      </div>

      <div className="card p-4 space-y-3">
        <h2 className="font-bold text-lg">Estado de la tienda</h2>
        <p className="text-sm text-neutral-500">
          Tienda actualmente: <span className={isOpen ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{isOpen ? "Abierta" : "Cerrada"}</span>
        </p>
        <button className={isOpen ? "btn-secondary" : "btn-primary"} onClick={toggleStore} disabled={saving}>
          {isOpen ? "Cerrar tienda" : "Abrir tienda"}
        </button>
        <textarea className="input" placeholder="Mensaje cuando está cerrada" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button className="btn-dark text-sm" onClick={saveMessage} disabled={saving}>Guardar mensaje</button>
        {msg && <p className="text-xs text-neutral-600">{msg}</p>}
      </div>

      <div className="card p-4 space-y-3">
        <h2 className="font-bold text-lg">Toppings habilitados</h2>
        <p className="text-sm text-neutral-500">Desactiva los toppings que no estén disponibles.</p>
        <div className="space-y-2">
          {toppings.map((t) => (
            <div key={t.id} className="flex items-center justify-between border-b border-neutral-100 py-2">
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-neutral-500">${(t.priceCents / 100).toFixed(2)}</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={t.enabled} onChange={(e) => toggleTopping(t.id, e.target.checked)} />
                <span className="text-sm">{t.enabled ? "Habilitado" : "Deshabilitado"}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}