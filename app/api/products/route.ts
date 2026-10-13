export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { toppings: { include: { topping: true } }, variants: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Prohibido" }, { status: 403 });
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const category = String(body.category || "").trim();
    const description = body.description ? String(body.description) : null;
    const priceCents = Math.max(0, Math.round(Number(body.priceCents) || 0));
    const imageUrl = body.imageUrl ? String(body.imageUrl) : null;
    const toppingIds = Array.isArray(body.toppingIds) ? body.toppingIds.map((x: any) => String(x)) : [];
    if (!name || !category || !priceCents) return NextResponse.json({ error: "Nombre, categoría y precio requeridos" }, { status: 400 });

    const product = await prisma.product.create({
      data: { name, category, description, priceCents, imageUrl },
    });

    for (const tid of toppingIds) {
      try {
        await prisma.productTopping.create({ data: { productId: product.id, toppingId: tid } });
      } catch {}
    }

    const full = await prisma.product.findUnique({
      where: { id: product.id },
      include: { toppings: { include: { topping: true } }, variants: true },
    });
    return NextResponse.json({ product: full });
  } catch (e: any) {
    if (e?.code === "P2002") return NextResponse.json({ error: "El producto ya existe" }, { status: 409 });
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}