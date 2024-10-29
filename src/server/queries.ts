import "server-only";

import { responses, surveys } from "@/server/db/schema";
import { db } from "@/server/db";
import { eq, desc, gte } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { cache } from "react";

export const getSurveyFromId = cache(async (id: string) => {
  const survey = await db.query.surveys.findFirst({
    where: eq(surveys.id, id),
  });
  return survey;
});

export const getLastXSurveys = cache(async (x: number) => {
  const userId = auth().userId;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const allSurveys = await db
    .select({
      id: surveys.id,
      name: surveys.name,
      title: surveys.title,
      createdAt: surveys.createdAt,
      updatedAt: surveys.updatedAt,
      responseCount: surveys.responseCount,
      isPublished: surveys.isPublished,
      isArchived: surveys.isArchived,
    })
    .from(surveys)
    .orderBy(desc(surveys.createdAt))
    .limit(x);
  return allSurveys;
});

export const getResponsesFromSurveyId = cache(async (id: string) => {
  const userId = auth().userId;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const res = await db.query.responses.findMany({
    where: eq(responses.surveyId, id),
  });
  return res;
});

export const getAllResponses = cache(async () => {
  const userId = auth().userId;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  // get all responses for all surveys for the last 30 days
  const allResponses = await db.query.responses.findMany({
    where: gte(
      responses.createdAt,
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    ),
  });

  return allResponses;
});
