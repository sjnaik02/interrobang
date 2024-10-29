import { sql } from "drizzle-orm";
import { type SurveyElementInstance } from "@/components/SurveyElement";
import {
  index,
  jsonb,
  pgTableCreator,
  timestamp,
  varchar,
  uuid,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

type SurveyResponse = Record<string, string | string[]>;

export const createTable = pgTableCreator((name) => `interrobang_${name}`);

export const surveys = createTable("survey", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  questions: jsonb("questions").$type<SurveyElementInstance[]>(),
  isPublished: boolean("is_published").default(false),
  isArchived: boolean("is_archived").default(false),
  createdBy: varchar("created_by", { length: 256 }),
  responseCount: integer("response_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const responses = createTable(
  "response",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    surveyId: uuid("survey_id").references(() => surveys.id),
    responses: jsonb("responses").$type<SurveyResponse>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      surveyIdIdx: index("response_survey_id_idx").on(table.surveyId),
    };
  },
);

export type Survey = typeof surveys.$inferSelect;
export type Response = typeof responses.$inferSelect;
