import { pgTable, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const programs = pgTable("programs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  attendanceWeeks: integer("attendance_weeks").notNull().default(10),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const participants = pgTable("participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: varchar("full_name").notNull(),
  parentEmail: varchar("parent_email").notNull(),
  phoneNumber: varchar("phone_number").notNull(),
  age: integer("age").notNull(),
  programId: varchar("program_id").notNull().references(() => programs.id, { onDelete: "cascade" }),
  attendance: boolean("attendance").array().notNull().default(sql`ARRAY[]::boolean[]`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
