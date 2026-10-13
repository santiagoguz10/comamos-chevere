export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sendPushToUser } from "@/lib/push";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { id: true, email: true, name: true } },
      address: true,
      items: { include: { product: true, toppings: { include: { topping: true } } } },
    },
  });
  if (!order) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  if (user.role !== "admin" && order.userId !== user.id) {
    return NextResponse.json({ error: "Prohibido" }, { status: 403 });
  }
  return NextResponse.json({ order });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Prohibido" }, { status: 403 });
  const body = await req.json();
  const status = String(body.status || "");
  const allowed = ["pending", "approved", "preparing", "ready", "delivered", "canceled"];
  if (!allowed.includes(status)) return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status },
    include: {
      user: { select: { id: true, email: true, name: true } },
      address: true,
      items: { include: { product: true, toppings: { include: { topping: true } } } },
    },
  });
  if (status === "approved") {
    await sendPushToUser(order.userId, {
      title: "Comamos Chévere",
      body: `Tu pedido #${order.id.slice(0, 8)} fue aprobado 🎉`,
      url: `/orders/${order.id}`,
    });
  }
  return NextResponse.json({ order });
}