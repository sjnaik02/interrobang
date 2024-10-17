import { sql } from "drizzle-orm";
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

export const createTable = pgTableCreator((name) => `interrobang_${name}`);

export const surveys = createTable("survey", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }),
  questions: jsonb("questions").default([]),
  isActive: boolean("is_active").default(false),
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
    responses: jsonb("responses").default([]),
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
