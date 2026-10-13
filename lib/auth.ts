import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SESSION_COOKIE = "cc_session";
const SESSION_DAYS = 7;

export function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derived) => {
      if (err) return reject(err);
      resolve(`${salt}:${derived.toString("hex")}`);
    });
  });
}

export function verifyPassword(password: string, stored: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return resolve(false);
    crypto.scrypt(password, salt, 64, (err, derived) => {
      if (err) return reject(err);
      try {
        resolve(crypto.timingSafeEqual(Buffer.from(hash, "hex"), derived));
      } catch {
        resolve(false);
      }
    });
  });
}

export async function createSession(userId: string) {
  const id = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await prisma.session.create({ data: { id, userId, expiresAt } });
  cookies().set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
  return id;
}

export async function destroySession() {
  const id = cookies().get(SESSION_COOKIE)?.value;
  if (id) {
    try {
      await prisma.session.delete({ where: { id } });
    } catch {}
  }
  cookies().delete(SESSION_COOKIE);
}

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
};

export async function getCurrentUser(): Promise<AuthUser | null> {
  const id = cookies().get(SESSION_COOKIE)?.value;
  if (!id) return null;
  const session = await prisma.session.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    try {
      await prisma.session.delete({ where: { id } });
    } catch {}
    return null;
  }
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
  };
}

export async function requireUser(role?: "customer" | "admin") {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  if (role && user.role !== role && user.role !== "admin") throw new Error("FORBIDDEN");
  // admin can access any
  if (role === "admin" && user.role !== "admin") throw new Error("FORBIDDEN");
  return user;
}