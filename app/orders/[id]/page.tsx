"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Order = any;

const color: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  preparing: "bg-indigo-100 text-indigo-800",
  ready: "bg-green-100 text-green-800",
  delivered: "bg-stone-200 text-stone-700",
  canceled: "bg-red-100 text-red-800",
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [notified, setNotified] = useState(false);

  async function load() {
    const res = await fetch(`/api/orders/${params.id}`);
    const data = await res.json();
    if (res.ok) {
      setOrder(data.order);
      if (data.order.status === "approved" && !notified) {
        setNotified(true);
      }
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [params.id]);

  if (!order) return <p>Cargando...</p>;

  return (
    <div className="space-y-4">
      {notified && order.status === "approved" && (
        <div className="card p-4 bg-blue-50 border-blue-200">
          <p className="font-semibold text-blue-800">¡Tu pedido fue aprobado por la tienda! 🎉</p>
        </div>
      )}
      <div className="card p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Pedido #{order.id.slice(0, 8)}</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color[order.status] || ""}`}>{order.status}</span>
        </div>
        <p className="text-sm text-stone-500 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
        <p className="mt-1">{order.deliveryType === "delivery" ? "Domicilio" : "Recoger en tienda"}</p>
        {order.address && <p className="text-sm text-stone-600">{order.address.street}, {order.address.city}</p>}
        {order.notes && <p className="text-sm italic text-stone-500">Notas: {order.notes}</p>}
      </div>
      <div className="card p-4">
        <h2 className="font-semibold mb-2">Productos</h2>
        {order.items.map((it: any) => (
          <div key={it.id} className="border-b border-stone-100 py-2">
            <div className="flex justify-between">
              <span>{it.product.name} x{it.quantity}</span>
              <span>${((it.unitPrice * it.quantity) / 100).toFixed(2)}</span>
            </div>
            {it.toppings?.length > 0 && (
              <p className="text-sm text-stone-500">
                Toppings: {it.toppings.map((t: any) => `${t.topping.name} (+$${(t.priceCents / 100).toFixed(2)})`).join(", ")}
              </p>
            )}
          </div>
        ))}
        <p className="font-bold mt-3">Total: ${(order.totalCents / 100).toFixed(2)}</p>
      </div>
      <Link href="/orders" className="text-brand-600">← Volver</Link>
    </div>
  );
}