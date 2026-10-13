export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { effectiveStore } from "@/lib/store";

async function getSettings() {
  let s = await prisma.storeSettings.findUnique({ where: { id: "default" } });
  if (!s) s = await prisma.storeSettings.create({ data: { id: "default", isOpen: true } });
  return s;
}

export async function GET() {
  const s = await getSettings();
  return NextResponse.json({ settings: { ...s, effectiveOpen: effectiveStore(s as any) } });
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Prohibido" }, { status: 403 });
  const body = await req.json();
  const data: any = {};
  if (typeof body.isOpen === "boolean") data.isOpen = body.isOpen;
  if (typeof body.message === "string") data.message = body.message;
  if (typeof body.autoSchedule === "boolean") data.autoSchedule = body.autoSchedule;
  if (typeof body.openTime === "string") data.openTime = body.openTime;
  if (typeof body.closeTime === "string") data.closeTime = body.closeTime;
  const s = await prisma.storeSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", isOpen: data.isOpen ?? true, message: data.message, autoSchedule: data.autoSchedule ?? false, openTime: data.openTime, closeTime: data.closeTime },
  });
  return NextResponse.json({ settings: { ...s, effectiveOpen: effectiveStore(s as any) } });
}