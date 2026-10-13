export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { toppings: { include: { topping: true } } },
    orderBy: { category: "asc" },
  });
  return NextResponse.json({ products });
}