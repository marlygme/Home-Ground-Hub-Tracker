import { z } from "zod";

export const ageGroups = ["5-7", "8-10", "11-13", "14-16", "17+"] as const;
export type AgeGroup = typeof ageGroups[number];

export const participantSchema = z.object({
  id: z.string(),
  fullName: z.string().min(1, "Full name is required"),
  parentEmail: z.string().email("Valid email is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  ageGroup: z.enum(ageGroups),
  attendance: z.array(z.boolean()).length(10),
  createdAt: z.string(),
});

export const insertParticipantSchema = participantSchema.omit({ 
  id: true, 
  createdAt: true,
  attendance: true 
}).extend({
  attendance: z.array(z.boolean()).length(10).optional(),
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

export const ageGroupLabels: Record<AgeGroup, string> = {
  "5-7": "Ages 5-7",
  "8-10": "Ages 8-10",
  "11-13": "Ages 11-13",
  "14-16": "Ages 14-16",
  "17+": "Ages 17+",
};

export const ageGroupColors: Record<AgeGroup, string> = {
  "5-7": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "8-10": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "11-13": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "14-16": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "17+": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
};
