export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const endpoint = String(body.endpoint || "");
  if (endpoint) {
    try { await prisma.pushSubscription.delete({ where: { endpoint } }); } catch {}
  }
  return NextResponse.json({ ok: true });
}