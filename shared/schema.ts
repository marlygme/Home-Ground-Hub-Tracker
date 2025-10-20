import { z } from "zod";
import { pgTable, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";

// Drizzle ORM Tables
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

// Inferred types from Drizzle schema
export type Program = typeof programs.$inferSelect;
export type Participant = typeof participants.$inferSelect;

// Insert schemas from Drizzle
const baseProgramInsertSchema = createInsertSchema(programs);
const baseParticipantInsertSchema = createInsertSchema(participants);

// Custom validation for insert schemas
export const insertProgramSchema = baseProgramInsertSchema.omit({
  id: true,
  createdAt: true,
});

export const insertParticipantSchema = baseParticipantInsertSchema.omit({
  id: true,
  createdAt: true,
  attendance: true,
}).extend({
  attendance: z.array(z.boolean()).optional(),
  phoneNumber: z.string()
    .min(1, "Phone number is required")
    .refine(
      (val) => {
        const cleaned = val.replace(/[\s\(\)\-]/g, '');
        const mobileRegex = /^(?:\+?61|0)4\d{8}$/;
        const landlineRegex = /^(?:\+?61|0)[2378]\d{8}$/;
        return mobileRegex.test(cleaned) || landlineRegex.test(cleaned);
      },
      { message: "Please enter a valid Australian phone number (e.g., +61 412 345 678 or 0412 345 678)" }
    ),
});

export type InsertProgram = z.infer<typeof insertProgramSchema>;
export type InsertParticipant = z.infer<typeof insertParticipantSchema>;
