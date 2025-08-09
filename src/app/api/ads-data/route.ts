import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { surveys } from "@/server/db/schema";
import { desc } from "drizzle-orm";
import {
  getSponsorAdBySurveyId,
  getSponsorAdImpressions,
  getSponsorAdClicks,
} from "@/server/queries";

export async function GET() {
  try {
    // Fetch recent surveys with sponsorAdId
    const rows = await db
      .select({
        id: surveys.id,
        title: surveys.title,
        sponsorAdId: surveys.sponsorAdId,
        createdAt: surveys.createdAt,
      })
      .from(surveys)
      .orderBy(desc(surveys.createdAt))
      .limit(100);
    
    const sponsoredRows = rows.filter((r) => r.sponsorAdId !== null);

    const adsData = await Promise.all(
      sponsoredRows.map(async (row) => {
        const ad = await getSponsorAdBySurveyId(row.id);
        if (!ad) return null;
        const impressions = await getSponsorAdImpressions(ad.id);
        const clicks = await getSponsorAdClicks(ad.id);
        return {
          surveyId: row.id,
          title: row.title,
          sponsorName: ad.sponsorName,
          impressions,
          clicks,
          ctaUrl: ad.ctaUrl,
        };
      }),
    );

    const validAds = adsData.filter((x): x is NonNullable<typeof x> => !!x);

    return NextResponse.json(validAds);
  } catch (error) {
    console.error("Failed to fetch ads data:", error);
    return NextResponse.json({ error: "Failed to fetch ads data" }, { status: 500 });
  }
}