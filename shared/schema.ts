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
  parentEmail: varchar("parent_email"),
  phoneNumber: varchar("phone_number"),
  age: integer("age").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Junction table for many-to-many relationship between participants and programs
export const participantPrograms = pgTable("participant_programs", {
  participantId: varchar("participant_id").notNull().references(() => participants.id, { onDelete: "cascade" }),
  programId: varchar("program_id").notNull().references(() => programs.id, { onDelete: "cascade" }),
  attendance: boolean("attendance").array().notNull().default(sql`ARRAY[]::boolean[]`),
});

// Inferred types from Drizzle schema
export type Program = typeof programs.$inferSelect;
export type Participant = typeof participants.$inferSelect;
export type ParticipantProgram = typeof participantPrograms.$inferSelect;

// Extended types with relations
export type ParticipantWithPrograms = Participant & {
  programs: (Program & { attendance: boolean[] })[];
};

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
}).extend({
  programIds: z.array(z.string()).min(1, "Please select at least one program"),
  parentEmail: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  phoneNumber: z.string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
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
