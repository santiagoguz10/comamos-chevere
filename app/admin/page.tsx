"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Order = any;

const color: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-red-100 text-red-700",
  preparing: "bg-neutral-200 text-black",
  ready: "bg-yellow-400 text-black",
  delivered: "bg-black text-white",
  canceled: "bg-red-200 text-red-900",
};

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [me, setMe] = useState<any>(null);
  const [filter, setFilter] = useState("all");

  async function load() {
    const res = await fetch("/api/orders");
    const data = await res.json();
    if (res.ok) setOrders(data.orders || []);
  }

  useEffect(() => {
    fetch("/api/me").then((r) => r.json()).then((d) => setMe(d.user));
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  if (me && me.role !== "admin") {
    return <p className="text-red-600">Acceso solo para administradores. <a href="/login" className="text-red-500 font-semibold">Ingresar</a></p>;
  }

  const shown = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Panel de administrador</h1>
        <div className="flex gap-2">
          <Link href="/admin/productos" className="btn-secondary text-sm">Gestionar productos</Link>
          <Link href="/admin/configuracion" className="btn-dark text-sm">Configuración</Link>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "approved", "preparing", "ready", "delivered", "canceled"].map((s) => (
          <button key={s} className={`btn ${filter === s ? "bg-yellow-400 text-black" : "bg-white"}`} onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>
      {shown.length === 0 && <p>Sin pedidos.</p>}
      {shown.map((o) => (
        <div key={o.id} className="card p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">#{o.id.slice(0, 8)} · {o.user?.email}</p>
              <p className="text-sm text-stone-500">{new Date(o.createdAt).toLocaleString()} · {o.deliveryType === "delivery" ? "Domicilio" : "Recogida"}</p>
              {o.address && <p className="text-sm">{o.address.street}, {o.address.city}</p>}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color[o.status] || ""}`}>{o.status}</span>
          </div>
          <div className="text-sm space-y-1">
            {o.items.map((it: any) => (
              <div key={it.id}>
                {it.product.name} x{it.quantity}
                {it.toppings?.length > 0 && (
                  <span className="text-stone-500"> — Toppings: {it.toppings.map((t: any) => t.topping.name).join(", ")}</span>
                )}
              </div>
            ))}
          </div>
          <p className="font-bold">${(o.totalCents).toLocaleString('es-CO')}</p>
          {o.notes && <p className="text-sm italic">Notas: {o.notes}</p>}
          <div className="flex gap-2 flex-wrap">
            {o.status === "pending" && <button className="btn-primary" onClick={() => updateStatus(o.id, "approved")}>Aprobar y notificar</button>}
            {o.status === "approved" && <button className="btn-secondary" onClick={() => updateStatus(o.id, "preparing")}>Preparar</button>}
            {o.status === "preparing" && <button className="btn-secondary" onClick={() => updateStatus(o.id, "ready")}>Listo</button>}
            {o.status === "ready" && <button className="btn-secondary" onClick={() => updateStatus(o.id, "delivered")}>Entregado</button>}
            {o.status !== "canceled" && o.status !== "delivered" && (
              <button className="btn-danger" onClick={() => updateStatus(o.id, "canceled")}>Cancelar</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}