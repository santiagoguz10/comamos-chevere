export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getVapidPublicKey } from "@/lib/push";

export async function GET() {
  try {
    return NextResponse.json({ publicKey: getVapidPublicKey() });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}