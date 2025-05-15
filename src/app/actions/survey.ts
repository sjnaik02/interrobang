"use server";

import type { SurveyElementInstance } from "@/components/SurveyElement";
import { db } from "@/server/db";
import { responses, surveys } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { type OrganizationCustomRoleKey } from "@clerk/types";

export const saveChangesToSurvey = async ({
  id,
  title,
  questions,
  updatedAt,
}: {
  id: string;
  title: string;
  questions: SurveyElementInstance[];
  updatedAt: Date;
}) => {
  try {
    const userId = (await auth()).userId;
    if (!userId) {
      throw new Error("Unauthorized");
    }
    await db
      .update(surveys)
      .set({
        title: title,
        questions: questions,
        updatedAt: updatedAt,
      })
      .where(eq(surveys.id, id));
    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to save changes");
  }
};

export const publishSurvey = async (id: string) => {
  try {
    const userId = (await auth()).userId;
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const updatedSurvey = await db
      .update(surveys)
      .set({
        isPublished: true,
        updatedAt: new Date(),
      })
      .where(eq(surveys.id, id))
      .returning();
    return updatedSurvey[0];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to publish survey");
  }
};

export const submitSurvey = async (
  id: string,
  answers: Record<string, string>,
) => {
  try {
    await db.transaction(async (tx) => {
      await tx.insert(responses).values({
        surveyId: id,
        responses: answers,
        createdAt: new Date(),
      });

      await tx
        .update(surveys)
        .set({
          responseCount: sql`${surveys.responseCount} + 1`,
        })
        .where(eq(surveys.id, id));
    });
    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to submit survey");
  }
};

export const createSurvey = async () => {
  const userId = (await auth()).userId;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const newSurvey = await db
    .insert(surveys)
    .values({
      title: "Untitled Survey",
      createdBy: userId,
    })
    .returning();
  return newSurvey[0];
};

export const archiveSurvey = async (id: string) => {
  try {
    const userId = (await auth()).userId;
    if (!userId) {
      throw new Error("Unauthorized");
    }
    await db
      .update(surveys)
      .set({ isArchived: true })
      .where(eq(surveys.id, id));
    revalidatePath("/dashboard");
    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to archive survey");
  }
};

export const deleteSurvey = async (id: string) => {
  try {
    const userId = (await auth()).userId;
    if (!userId) {
      throw new Error("Unauthorized");
    }
    await db.transaction(async (tx) => {
      await tx.delete(responses).where(eq(responses.surveyId, id));
      await tx.delete(surveys).where(eq(surveys.id, id));
    });
    revalidatePath("/dashboard");
    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete survey");
  }
};

export const renameSurvey = async (id: string, title: string) => {
  try {
    const userId = (await auth()).userId;
    if (!userId) {
      throw new Error("Unauthorized");
    }
    await db
      .update(surveys)
      .set({ title, updatedAt: new Date() })
      .where(eq(surveys.id, id));
    revalidatePath("/dashboard");
    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to rename survey");
  }
};

export const duplicateSurvey = async (id: string) => {
  try {
    const userId = (await auth()).userId;
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const survey = await db.query.surveys.findFirst({
      where: eq(surveys.id, id),
    });
    if (!survey) {
      throw new Error("Could not find survey to duplicate");
    }
    const newSurvey = await db
      .insert(surveys)
      .values({
        title: `${survey.title} (Copy)`,
        createdBy: userId,
        questions: survey.questions,
        isPublished: false,
        isArchived: false,
        responseCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: surveys.id });
    if (!newSurvey[0]) {
      throw new Error("Failed to duplicate survey");
    }
    revalidatePath("/dashboard");
    return newSurvey[0].id;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to duplicate survey");
  }
};

export const createInvitation = async (
  email: string,
  role: OrganizationCustomRoleKey,
) => {
  const userId = (await auth()).userId;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  console.log(email, role);
};

export type SaveChangesToSurveyType = typeof saveChangesToSurvey;
export type PublishSurveyType = typeof publishSurvey;
export type SubmitSurveyType = typeof submitSurvey;
export type CreateSurveyType = typeof createSurvey;
export type ArchiveSurveyType = typeof archiveSurvey;
export type DeleteSurveyType = typeof deleteSurvey;
export type RenameSurveyType = typeof renameSurvey;
export type DuplicateSurveyType = typeof duplicateSurvey;
