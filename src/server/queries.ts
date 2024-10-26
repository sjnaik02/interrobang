"use server";
import { Survey, surveys } from "@/server/db/schema";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { SurveyElementInstance } from "@/components/SurveyElement";

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

//save changes

export const saveChangesToSurvey = async ({
  id,
  title,
  name,
  questions,
  updatedAt,
}: {
  id: string;
  title: string;
  name: string;
  questions: SurveyElementInstance[];
  updatedAt: Date;
}) => {
  try {
    const updatedSurvey = await db
      .update(surveys)
      .set({
        title: title,
        name: name,
        questions: questions,
        updatedAt: updatedAt,
      })
      .where(eq(surveys.id, id));
    return updatedSurvey;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to save changes");
  }
};
