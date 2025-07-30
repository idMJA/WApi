import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const authData = sqliteTable("auth_data", {
	id: text("id").primaryKey(),
	data: text("data").notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export type AuthData = typeof authData.$inferSelect;
export type AuthDataInsert = typeof authData.$inferInsert;
