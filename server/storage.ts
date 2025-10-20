import { db } from "./db";
import { programs, participants, Program, InsertProgram, Participant, InsertParticipant } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Program methods
  getPrograms(): Promise<Program[]>;
  getProgramById(id: string): Promise<Program | undefined>;
  createProgram(data: InsertProgram): Promise<Program>;
  updateProgram(id: string, data: Partial<InsertProgram>): Promise<Program>;
  deleteProgram(id: string): Promise<void>;

  // Participant methods
  getParticipants(): Promise<Participant[]>;
  getParticipantById(id: string): Promise<Participant | undefined>;
  createParticipant(data: InsertParticipant): Promise<Participant>;
  updateParticipant(id: string, data: Partial<InsertParticipant>): Promise<Participant>;
  deleteParticipant(id: string): Promise<void>;
}

export class DbStorage implements IStorage {
  // Program methods
  async getPrograms(): Promise<Program[]> {
    return await db.select().from(programs);
  }

  async getProgramById(id: string): Promise<Program | undefined> {
    const result = await db.select().from(programs).where(eq(programs.id, id));
    return result[0];
  }

  async createProgram(data: InsertProgram): Promise<Program> {
    const result = await db.insert(programs).values(data).returning();
    return result[0];
  }

  async updateProgram(id: string, data: Partial<InsertProgram>): Promise<Program> {
    const result = await db.update(programs).set(data).where(eq(programs.id, id)).returning();
    return result[0];
  }

  async deleteProgram(id: string): Promise<void> {
    await db.delete(programs).where(eq(programs.id, id));
  }

  // Participant methods
  async getParticipants(): Promise<Participant[]> {
    return await db.select().from(participants);
  }

  async getParticipantById(id: string): Promise<Participant | undefined> {
    const result = await db.select().from(participants).where(eq(participants.id, id));
    return result[0];
  }

  async createParticipant(data: InsertParticipant): Promise<Participant> {
    // Ensure attendance array is set if not provided
    const participantData = {
      ...data,
      attendance: data.attendance || [],
    };
    const result = await db.insert(participants).values(participantData).returning();
    return result[0];
  }

  async updateParticipant(id: string, data: Partial<InsertParticipant>): Promise<Participant> {
    const result = await db.update(participants).set(data).where(eq(participants.id, id)).returning();
    return result[0];
  }

  async deleteParticipant(id: string): Promise<void> {
    await db.delete(participants).where(eq(participants.id, id));
  }
}

export const storage = new DbStorage();
