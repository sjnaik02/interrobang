import "server-only";

import { responses, surveys } from "@/server/db/schema";
import { db } from "@/server/db";
import { eq, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { cache } from "react";

export const getSurveyFromId = cache(async (id: string) => {
  const survey = await db.query.surveys.findFirst({
    where: eq(surveys.id, id),
  });
  return survey;
});

export const getAllSurveys = cache(async () => {
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
    .orderBy(desc(surveys.createdAt));
  return allSurveys;
});

export const getResponsesFromSurveyId = cache(async (id: string) => {
  const res = await db.query.responses.findMany({
    where: eq(responses.surveyId, id),
  });
  return res;
});
