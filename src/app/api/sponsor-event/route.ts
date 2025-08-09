import { NextResponse } from "next/server";
import "server-only";
import { logSponsorImpression, logSponsorClick } from "@/app/actions/sponsorAd";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    sponsorAdId?: string;
    eventType?: string;
  };
  const { sponsorAdId, eventType } = body;
  if (!sponsorAdId || !eventType) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }
  if (eventType === "impression") {
    await logSponsorImpression(sponsorAdId);
  } else if (eventType === "click") {
    await logSponsorClick(sponsorAdId);
  }
  return NextResponse.json({ ok: true });
}
