import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { registrationsTable } from "./registrations";

export const teamAccountsTable = pgTable("team_accounts", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  teamName: text("team_name").notNull(),
  organization: text("organization").notNull(),
  registrationId: integer("registration_id").references(() => registrationsTable.id),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
});

export const insertTeamAccountSchema = createInsertSchema(teamAccountsTable).omit({
  id: true,
  createdAt: true,
  lastLoginAt: true,
});

export type InsertTeamAccount = z.infer<typeof insertTeamAccountSchema>;
export type TeamAccount = typeof teamAccountsTable.$inferSelect;
