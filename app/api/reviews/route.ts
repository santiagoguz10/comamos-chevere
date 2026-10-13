export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const where = productId ? { productId } : {};
  const reviews = await prisma.review.findMany({
    where,
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ reviews });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const body = await req.json();
  const productId = String(body.productId || "");
  const rating = Number(body.rating);
  const comment = body.comment ? String(body.comment) : null;
  const orderId = body.orderId ? String(body.orderId) : null;
  if (!productId || !(rating >= 1 && rating <= 5)) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
  try {
    const review = await prisma.review.create({
      data: { userId: user.id, productId, rating, comment, orderId },
      include: { user: { select: { name: true, email: true } } },
    });
    return NextResponse.json({ review });
  } catch (e: any) {
    if (e?.code === "P2002") return NextResponse.json({ error: "Ya calificaste este producto" }, { status: 409 });
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}