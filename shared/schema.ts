import { z } from "zod";

// Program/Event Schema
export const programSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Program name is required"),
  attendanceWeeks: z.number().min(1).max(52).default(10),
  createdAt: z.string(),
});

export const insertProgramSchema = programSchema.omit({ 
  id: true, 
  createdAt: true,
});

export type Program = z.infer<typeof programSchema>;
export type InsertProgram = z.infer<typeof insertProgramSchema>;

// Participant Schema
export const participantSchema = z.object({
  id: z.string(),
  fullName: z.string().min(1, "Full name is required"),
  parentEmail: z.string().email("Valid email is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  age: z.number().min(3).max(99),
  programId: z.string(),
  attendance: z.array(z.boolean()),
  createdAt: z.string(),
});

export const insertParticipantSchema = participantSchema.omit({ 
  id: true, 
  createdAt: true,
  attendance: true 
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

export type Participant = z.infer<typeof participantSchema>;
export type InsertParticipant = z.infer<typeof insertParticipantSchema>;
