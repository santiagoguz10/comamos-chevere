export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Prohibido" }, { status: 403 });
  const body = await req.json();
  const data: any = {};
  if (typeof body.enabled === "boolean") data.enabled = body.enabled;
  if (typeof body.priceCents === "number") data.priceCents = Math.max(0, Math.round(body.priceCents));
  if (typeof body.name === "string") data.name = body.name;
  const topping = await prisma.topping.update({ where: { id: params.id }, data });
  return NextResponse.json({ topping });
}