"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Order = { id: string; status: string; totalCents: number; createdAt: string; deliveryType: string; items: any[] };

const color: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  preparing: "bg-indigo-100 text-indigo-800",
  ready: "bg-green-100 text-green-800",
  delivered: "bg-stone-200 text-stone-700",
  canceled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/orders");
    const data = await res.json();
    if (res.ok) setOrders(data.orders || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Mis pedidos</h1>
      {orders.length === 0 && <p>No tienes pedidos.</p>}
      {orders.map((o) => (
        <Link key={o.id} href={`/orders/${o.id}`} className="card p-4 block hover:shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Pedido #{o.id.slice(0, 8)}</p>
              <p className="text-sm text-stone-500">{new Date(o.createdAt).toLocaleString()} · {o.deliveryType === "delivery" ? "Domicilio" : "Recogida"}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color[o.status] || ""}`}>{o.status}</span>
          </div>
          <p className="mt-2 font-bold">${(o.totalCents / 100).toFixed(2)}</p>
        </Link>
      ))}
    </div>
  );
}