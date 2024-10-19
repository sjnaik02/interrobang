"use server";
import { surveys } from "@/server/db/schema";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";

export const getSurveyFromId = async (id: string) => {
  const survey = await db.query.surveys.findFirst({
    where: eq(surveys.id, id),
  });
  return survey;
};

export const createSurvey = async () => {
  const newSurvey = await db
    .insert(surveys)
    .values({
      name: "Untitled Survey",
    })
    .returning();
  return newSurvey[0];
};

export const getAllSurveys = async () => {
  const allSurveys = await db.select().from(surveys);
  return allSurveys;
};
