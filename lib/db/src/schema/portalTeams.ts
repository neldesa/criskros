import { pgTable, serial, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";

export const portalTeamsTable = pgTable("portal_teams", {
  id: serial("id").primaryKey(),
  documentId: text("document_id"),
  email: text("email").notNull(),
  password: text("password"),
  teamName: text("team_name"),
  organization: text("organization"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  locale: text("locale"),
  createdById: integer("created_by_id"),
  updatedById: integer("updated_by_id"),
});

export type PortalTeam = typeof portalTeamsTable.$inferSelect;
