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
  pgEnum,
} from "drizzle-orm/pg-core";

type SurveyResponse = Record<string, string | string[]>;

export const createTable = pgTableCreator((name) => `interrobang_${name}`);

export const surveys = createTable("survey", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 256 }).notNull(),
  questions: jsonb("questions").$type<SurveyElementInstance[]>(),
  isPublished: boolean("is_published").default(false),
  isArchived: boolean("is_archived").default(false),
  createdBy: varchar("created_by", { length: 256 }),
  responseCount: integer("response_count").default(0),
  sponsorAdId: uuid("sponsor_ad_id")
    .references(() => sponsorAds.id)
    .default(sql`NULL`),
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

export const sponsorAdEventType = pgEnum("sponsor_ad_event_type", [
  "impression",
  "click",
]);

export const sponsorAds = createTable("sponsor_ad", {
  id: uuid("id").primaryKey().defaultRandom(),
  sponsorName: varchar("sponsor_name", { length: 256 }).notNull(),
  copy: varchar("copy", { length: 256 }).notNull(),
  ctaText: varchar("cta_text", { length: 256 }).notNull(),
  ctaUrl: varchar("cta_url", { length: 256 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const sponsorAdEvents = createTable("sponsor_ad_event", {
  id: uuid("id").primaryKey().defaultRandom(),
  sponsorAdId: uuid("sponsor_ad_id").references(() => sponsorAds.id),
  eventType: sponsorAdEventType("event_type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Survey = typeof surveys.$inferSelect;
export type Response = typeof responses.$inferSelect;
export type SponsorAd = typeof sponsorAds.$inferSelect;
export type SponsorAdEvent = typeof sponsorAdEvents.$inferSelect;
export { SurveyElementInstance };
