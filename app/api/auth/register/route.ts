export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const name = String(body.name || "").trim();
    const phone = body.phone ? String(body.phone).trim() : null;
    if (!email || !password || password.length < 4) {
      return NextResponse.json({ error: "Email y password (min 4) requeridos" }, { status: 400 });
    }
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 });
    const user = await prisma.user.create({
      data: { email, name: name || null, phone, passwordHash: await hashPassword(password), role: "customer" },
    });
    await createSession(user.id);
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}