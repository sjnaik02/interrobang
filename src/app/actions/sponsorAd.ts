"use server";

import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { sponsorAds, sponsorAdEvents, surveys } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { Value } from "@udecode/plate/react";

/**
 * Creates a Sponsor Ad and links it to the given survey in a single transaction.
 */
export const createSponsorAdForSurvey = async (
  surveyId: string,
  sponsorName: string,
  copy: Value,
  ctaText: string,
  ctaUrl: string,
) => {
  const userId = (await auth()).userId;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const newAd = await db.transaction(async (tx) => {
    const inserted = await tx
      .insert(sponsorAds)
      .values({ sponsorName, copy, ctaText, ctaUrl })
      .returning();
    const ad = inserted[0];
    if (!ad) {
      throw new Error("Failed to create sponsor ad");
    }
    await tx
      .update(surveys)
      .set({ sponsorAdId: ad.id })
      .where(eq(surveys.id, surveyId));
    return ad;
  });

  // Revalidate dashboard to update sponsorship badges
  revalidatePath("/dashboard");

  return newAd;
};

/**
 * Logs an impression event for the given Sponsor Ad.
 */
export const logSponsorImpression = async (sponsorAdId: string) => {
  await db.insert(sponsorAdEvents).values({
    sponsorAdId,
    eventType: "impression",
    createdAt: new Date(),
  });
};

/**
 * Logs a click event for the given Sponsor Ad.
 */
export const logSponsorClick = async (sponsorAdId: string) => {
  await db.insert(sponsorAdEvents).values({
    sponsorAdId,
    eventType: "click",
    createdAt: new Date(),
  });
};

// Types for usage in UI components or server actions
export type CreateSponsorAdForSurveyType = typeof createSponsorAdForSurvey;
export type LogSponsorImpressionType = typeof logSponsorImpression;
export type LogSponsorClickType = typeof logSponsorClick;
