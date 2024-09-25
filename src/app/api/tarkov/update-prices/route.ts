import { NextResponse } from "next/server";
import { redis } from "~/app/redis";
import { updatedCachedPrices } from "~/utils/updateCachedPrices";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function GET() {
  const updatedAt = await redis.get("tarkov:prices:updatedAt");

  // 5 minutes
  if (updatedAt && Date.now() - Number(updatedAt) < 1000 * 60 * 5) {
    return NextResponse.json({ message: "Already updated" }, { status: 200 });
  }

  const data = await updatedCachedPrices();

  return NextResponse.json(data, { status: 200 });
}
