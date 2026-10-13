import webpush from "web-push";
import { prisma } from "./prisma";

type VapidKeys = { publicKey: string; privateKey: string };

let cached: VapidKeys | null = null;

function loadKeys(): VapidKeys {
  if (cached) return cached;
  const envPublic = process.env.VAPID_PUBLIC_KEY;
  const envPrivate = process.env.VAPID_PRIVATE_KEY;
  if (envPublic && envPrivate) {
    cached = { publicKey: envPublic, privateKey: envPrivate };
    return cached;
  }
  const fs = require("fs");
  const file = process.env.VAPID_FILE || "/data/vapid.json";
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    if (parsed.publicKey && parsed.privateKey) {
      cached = { publicKey: parsed.publicKey, privateKey: parsed.privateKey };
      return cached;
    }
  } catch {}
  const generated = webpush.generateVAPIDKeys();
  cached = { publicKey: generated.publicKey, privateKey: generated.privateKey };
  try {
    fs.writeFileSync(file, JSON.stringify(cached));
  } catch {}
  return cached;
}

export function getVapidPublicKey() {
  return loadKeys().publicKey;
}

function configure() {
  const { publicKey, privateKey } = loadKeys();
  const subject = process.env.VAPID_SUBJECT || "mailto:admin@comamoschevere.local";
  webpush.setVapidDetails(subject, publicKey, privateKey);
}

export async function sendPushToUser(userId: string, payload: object) {
  try {
    configure();
    const subs = await prisma.pushSubscription.findMany({ where: { userId } });
    for (const sub of subs) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(payload),
        );
      } catch (err: any) {
        const status = err?.statusCode;
        if (status === 410 || status === 404) {
          try {
            await prisma.pushSubscription.delete({ where: { endpoint: sub.endpoint } });
          } catch {}
        }
      }
    }
  } catch (e) {
    console.error("push send error", e);
  }
}