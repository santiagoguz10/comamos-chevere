export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { effectiveStore } from "@/lib/store";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const where = user.role === "admin" ? {} : { userId: user.id };
  const orders = await prisma.order.findMany({
    where,
    include: {
      user: { select: { id: true, email: true, name: true } },
      address: true,
      items: { include: { product: true, toppings: { include: { topping: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  try {
    const body = await req.json();
    const deliveryType = body.deliveryType === "pickup" ? "pickup" : "delivery";
    const notes = body.notes ? String(body.notes) : null;
    const settings = await prisma.storeSettings.findUnique({ where: { id: "default" } });
    if (settings && !effectiveStore(settings as any)) {
      return NextResponse.json({ error: settings.message || "La tienda está cerrada en este momento" }, { status: 400 });
    }
    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length) return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });

    // Resolve address
    let addressId: string | null = null;
    if (deliveryType === "delivery") {
      const a = body.address || {};
      if (!a.street) return NextResponse.json({ error: "Dirección requerida" }, { status: 400 });
      const addr = await prisma.address.create({
        data: {
          userId: user.id,
          label: a.label || "Entrega",
          street: String(a.street),
          city: String(a.city || "Ciudad"),
          notes: a.notes || null,
        },
      });
      addressId = addr.id;
    }

    // Load products & toppings
    const productIds = [...new Set(items.map((i: any) => String(i.productId)))] as string[];
    const toppingIds = [...new Set(items.flatMap((i: any) => (i.toppingIds || []).map((x: any) => String(x))))] as string[];
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const toppings = await prisma.topping.findMany({ where: { id: { in: toppingIds } } });

    let total = 0;
    const createItems = items.map((i: any) => {
      const product = products.find((p) => p.id === i.productId);
      if (!product) throw new Error("Producto no encontrado");
      const qty = Math.max(1, Number(i.quantity) || 1);
      let itemTotal = product.priceCents * qty;
      const toppingCreates = (i.toppingIds || []).map((tid: string) => {
        const t = toppings.find((x) => x.id === tid);
        if (!t) throw new Error("Topping no encontrado");
        itemTotal += t.priceCents * qty;
        return { toppingId: t.id, priceCents: t.priceCents };
      });
      total += itemTotal;
      return {
        productId: product.id,
        quantity: qty,
        unitPrice: product.priceCents,
        toppings: { create: toppingCreates },
      };
    });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: "pending",
        deliveryType,
        addressId,
        notes,
        totalCents: total,
        items: { create: createItems },
      },
      include: {
        items: { include: { product: true, toppings: { include: { topping: true } } } },
        address: true,
      },
    });
    return NextResponse.json({ order });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}