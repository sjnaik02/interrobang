"use server";
import { surveys } from "@/server/db/schema";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export const getSurveyFromId = async (id: string) => {
  const userId = auth().userId;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const survey = await db.query.surveys.findFirst({
    where: eq(surveys.id, id),
  });
  return survey;
};

export const createSurvey = async () => {
  const userId = auth().userId;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const newSurvey = await db
    .insert(surveys)
    .values({
      name: "Untitled Survey",
      title: "Untitled Survey",
      createdBy: userId,
    })
    .returning();
  return newSurvey[0];
};

export const getAllSurveys = async () => {
  const userId = auth().userId;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const allSurveys = await db.select().from(surveys);
  return allSurveys;
};
