export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const body = await req.json();
  const endpoint = String(body.endpoint || "");
  const p256dh = String(body?.keys?.p256dh || "");
  const auth = String(body?.keys?.auth || "");
  if (!endpoint || !p256dh || !auth) return NextResponse.json({ error: "Suscripción inválida" }, { status: 400 });

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { userId: user.id, p256dh, auth },
    create: { userId: user.id, endpoint, p256dh, auth },
  });
  return NextResponse.json({ ok: true });
}