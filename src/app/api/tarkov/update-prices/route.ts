import { NextResponse } from "next/server";
import { redis } from "~/app/redis";
import { updatedCachedPrices } from "~/utils/updateCachedPrices";

export const dynamic = "force-dynamic";

export async function GET() {
  const updatedAt = await redis.get("tarkov:prices:updatedAt");

  // 1 minute
  if (updatedAt && Date.now() - Number(updatedAt) < 1000 * 60) {
    return NextResponse.json({ message: "Already updated" }, { status: 200 });
  }

  await updatedCachedPrices();

  return NextResponse.json({ message: "Updated list" }, { status: 200 });
}
