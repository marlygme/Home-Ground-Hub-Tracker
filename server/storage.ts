import { db } from "./db";
import { programs, participants } from "./db/schema";
import { eq } from "drizzle-orm";
import { Program, InsertProgram, Participant, InsertParticipant } from "@shared/schema";

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
    const result = await db.select().from(programs);
    return result.map(p => ({
      id: p.id,
      name: p.name,
      attendanceWeeks: p.attendanceWeeks,
      createdAt: p.createdAt.toISOString(),
    }));
  }

  async getProgramById(id: string): Promise<Program | undefined> {
    const result = await db.select().from(programs).where(eq(programs.id, id));
    if (result.length === 0) return undefined;
    const p = result[0];
    return {
      id: p.id,
      name: p.name,
      attendanceWeeks: p.attendanceWeeks,
      createdAt: p.createdAt.toISOString(),
    };
  }

  async createProgram(data: InsertProgram): Promise<Program> {
    const result = await db.insert(programs).values(data).returning();
    const p = result[0];
    return {
      id: p.id,
      name: p.name,
      attendanceWeeks: p.attendanceWeeks,
      createdAt: p.createdAt.toISOString(),
    };
  }

  async updateProgram(id: string, data: Partial<InsertProgram>): Promise<Program> {
    const result = await db.update(programs).set(data).where(eq(programs.id, id)).returning();
    const p = result[0];
    return {
      id: p.id,
      name: p.name,
      attendanceWeeks: p.attendanceWeeks,
      createdAt: p.createdAt.toISOString(),
    };
  }

  async deleteProgram(id: string): Promise<void> {
    await db.delete(programs).where(eq(programs.id, id));
  }

  // Participant methods
  async getParticipants(): Promise<Participant[]> {
    const result = await db.select().from(participants);
    return result.map(p => ({
      id: p.id,
      fullName: p.fullName,
      parentEmail: p.parentEmail,
      phoneNumber: p.phoneNumber,
      age: p.age,
      programId: p.programId,
      attendance: p.attendance,
      createdAt: p.createdAt.toISOString(),
    }));
  }

  async getParticipantById(id: string): Promise<Participant | undefined> {
    const result = await db.select().from(participants).where(eq(participants.id, id));
    if (result.length === 0) return undefined;
    const p = result[0];
    return {
      id: p.id,
      fullName: p.fullName,
      parentEmail: p.parentEmail,
      phoneNumber: p.phoneNumber,
      age: p.age,
      programId: p.programId,
      attendance: p.attendance,
      createdAt: p.createdAt.toISOString(),
    };
  }

  async createParticipant(data: InsertParticipant): Promise<Participant> {
    const result = await db.insert(participants).values(data).returning();
    const p = result[0];
    return {
      id: p.id,
      fullName: p.fullName,
      parentEmail: p.parentEmail,
      phoneNumber: p.phoneNumber,
      age: p.age,
      programId: p.programId,
      attendance: p.attendance,
      createdAt: p.createdAt.toISOString(),
    };
  }

  async updateParticipant(id: string, data: Partial<InsertParticipant>): Promise<Participant> {
    const result = await db.update(participants).set(data).where(eq(participants.id, id)).returning();
    const p = result[0];
    return {
      id: p.id,
      fullName: p.fullName,
      parentEmail: p.parentEmail,
      phoneNumber: p.phoneNumber,
      age: p.age,
      programId: p.programId,
      attendance: p.attendance,
      createdAt: p.createdAt.toISOString(),
    };
  }

  async deleteParticipant(id: string): Promise<void> {
    await db.delete(participants).where(eq(participants.id, id));
  }
}

export const storage = new DbStorage();
