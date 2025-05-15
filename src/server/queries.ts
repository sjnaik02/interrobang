import "server-only";

import { responses, surveys } from "@/server/db/schema";
import { db } from "@/server/db";
import { eq, desc, gte, sql } from "drizzle-orm";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { cache } from "react";

export const getSurveyFromId = cache(async (id: string) => {
  const survey = await db.query.surveys.findFirst({
    where: eq(surveys.id, id),
  });
  return survey;
});

export const getSurveys = cache(async (skip: number, take: number) => {
  const userId = (await auth()).userId;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const receivedSurveys = await db
    .select({
      id: surveys.id,
      title: surveys.title,
      createdAt: surveys.createdAt,
      updatedAt: surveys.updatedAt,
      responseCount: surveys.responseCount,
      isPublished: surveys.isPublished,
      isArchived: surveys.isArchived,
    })
    .from(surveys)
    .orderBy(desc(surveys.createdAt))
    .offset(skip)
    .limit(take);
  return receivedSurveys;
});

export const getResponsesFromSurveyId = cache(
  async (id: string, skip: number, take: number) => {
    const userId = (await auth()).userId;
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const res = await db.query.responses.findMany({
      where: eq(responses.surveyId, id),
      offset: skip,
      limit: take,
    });
    return res;
  },
);

export const getAllResponsesFromSurveyId = cache(async (id: string) => {
  const userId = (await auth()).userId;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const allResponses = await db.query.responses.findMany({
    where: eq(responses.surveyId, id),
  });
  return allResponses;
});

export const getResponses = cache(async (lastDays: number) => {
  const userId = (await auth()).userId;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  // get all responses for all surveys for the last 30 days
  const allResponses = await db.query.responses.findMany({
    where: gte(
      responses.createdAt,
      new Date(Date.now() - lastDays * 24 * 60 * 60 * 1000),
    ),
  });

  return allResponses;
});

export const getDashboardData = cache(async (limit: number, days: number) => {
  const userId = (await auth()).userId;
  if (!userId) throw new Error("Unauthorized");

  const [requestedSurveys, responseCount] = await Promise.all([
    db
      .select({
        id: surveys.id,
        title: surveys.title,
        createdAt: surveys.createdAt,
        updatedAt: surveys.updatedAt,
        isPublished: surveys.isPublished,
        isArchived: surveys.isArchived,
        responseCount: surveys.responseCount,
      })
      .from(surveys)
      .where(eq(surveys.isArchived, false))
      .orderBy(desc(surveys.createdAt))
      .limit(limit),

    db
      .select({
        date: sql<string>`DATE(${responses.createdAt})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(responses)
      .where(
        gte(
          responses.createdAt,
          new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        ),
      )
      .groupBy(sql`DATE(${responses.createdAt})`),
  ]);

  return { requestedSurveys, responseCount };
});

export const getTotalSurveyCount = cache(async () => {
  const userId = (await auth()).userId;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const [result] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(surveys);

  return result?.count ?? 0;
});

export const getSurveyIds = cache(async (limit: number) => {
  const surveyIds = await db
    .select({ id: surveys.id })
    .from(surveys)
    .orderBy(desc(surveys.createdAt))
    .limit(limit);
  return surveyIds;
});

export const getPendingInvitations = cache(async () => {
  const userId = (await auth()).userId;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const client = clerkClient();
  const invitations = await (await client).invitations.getInvitationList();
  return invitations;
});
