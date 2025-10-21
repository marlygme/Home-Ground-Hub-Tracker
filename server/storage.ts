import { programs, participants, participantPrograms, Program, InsertProgram, Participant, ParticipantWithPrograms, InsertParticipant } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

export interface IStorage {
  // Program methods
  getPrograms(): Promise<Program[]>;
  getProgramById(id: string): Promise<Program | undefined>;
  createProgram(data: InsertProgram): Promise<Program>;
  updateProgram(id: string, data: Partial<InsertProgram>): Promise<Program>;
  deleteProgram(id: string): Promise<void>;

  // Participant methods
  getParticipants(): Promise<ParticipantWithPrograms[]>;
  getParticipantById(id: string): Promise<ParticipantWithPrograms | undefined>;
  createParticipant(data: InsertParticipant): Promise<ParticipantWithPrograms>;
  updateParticipant(id: string, data: Partial<InsertParticipant>): Promise<ParticipantWithPrograms>;
  updateAttendance(participantId: string, programId: string, attendance: boolean[]): Promise<void>;
  deleteParticipant(id: string): Promise<void>;
}

export class DbStorage implements IStorage {
  constructor(private db: NeonHttpDatabase<typeof import("@shared/schema")>) {}

  // Program methods
  async getPrograms(): Promise<Program[]> {
    return await this.db.select().from(programs);
  }

  async getProgramById(id: string): Promise<Program | undefined> {
    const result = await this.db.select().from(programs).where(eq(programs.id, id));
    return result[0];
  }

  async createProgram(data: InsertProgram): Promise<Program> {
    const result = await this.db.insert(programs).values(data).returning();
    return result[0];
  }

  async updateProgram(id: string, data: Partial<InsertProgram>): Promise<Program> {
    const result = await this.db.update(programs).set(data).where(eq(programs.id, id)).returning();
    return result[0];
  }

  async deleteProgram(id: string): Promise<void> {
    await this.db.delete(programs).where(eq(programs.id, id));
  }

  // Participant methods
  async getParticipants(): Promise<ParticipantWithPrograms[]> {
    const allParticipants = await this.db.select().from(participants);
    
    // For each participant, get their programs with attendance
    const participantsWithPrograms = await Promise.all(
      allParticipants.map(async (participant) => {
        const programLinks = await this.db
          .select()
          .from(participantPrograms)
          .where(eq(participantPrograms.participantId, participant.id));
        
        const programsData = await Promise.all(
          programLinks.map(async (link) => {
            const program = await this.db
              .select()
              .from(programs)
              .where(eq(programs.id, link.programId));
            
            // Guard against deleted programs
            if (!program[0]) {
              console.warn(`Program ${link.programId} not found for participant ${participant.id}`);
              return null;
            }
            
            return {
              ...program[0],
              attendance: link.attendance,
            };
          })
        );

        // Filter out any null entries from deleted programs
        const validPrograms = programsData.filter((p): p is NonNullable<typeof p> => p !== null);

        return {
          ...participant,
          programs: validPrograms,
        };
      })
    );

    return participantsWithPrograms;
  }

  async getParticipantById(id: string): Promise<ParticipantWithPrograms | undefined> {
    const result = await this.db.select().from(participants).where(eq(participants.id, id));
    const participant = result[0];
    
    if (!participant) return undefined;

    const programLinks = await this.db
      .select()
      .from(participantPrograms)
      .where(eq(participantPrograms.participantId, participant.id));
    
    const programsData = await Promise.all(
      programLinks.map(async (link) => {
        const program = await this.db
          .select()
          .from(programs)
          .where(eq(programs.id, link.programId));
        
        // Guard against deleted programs
        if (!program[0]) {
          console.warn(`Program ${link.programId} not found for participant ${id}`);
          return null;
        }
        
        return {
          ...program[0],
          attendance: link.attendance,
        };
      })
    );

    // Filter out any null entries from deleted programs
    const validPrograms = programsData.filter((p): p is NonNullable<typeof p> => p !== null);

    return {
      ...participant,
      programs: validPrograms,
    };
  }

  async createParticipant(data: InsertParticipant): Promise<ParticipantWithPrograms> {
    const { programIds, ...participantData } = data;
    
    // Create participant
    const result = await this.db.insert(participants).values(participantData).returning();
    const participant = result[0];

    // Create program links
    if (programIds && programIds.length > 0) {
      for (const programId of programIds) {
        const program = await this.db.select().from(programs).where(eq(programs.id, programId));
        if (program[0]) {
          const attendanceWeeks = program[0].attendanceWeeks;
          const initialAttendance = Array(attendanceWeeks).fill(false);
          
          await this.db.insert(participantPrograms).values({
            participantId: participant.id,
            programId,
            attendance: initialAttendance,
          });
        }
      }
    }

    return await this.getParticipantById(participant.id) as ParticipantWithPrograms;
  }

  async updateParticipant(id: string, data: Partial<InsertParticipant>): Promise<ParticipantWithPrograms> {
    const { programIds, ...participantData } = data;
    
    // Update participant
    await this.db.update(participants).set(participantData).where(eq(participants.id, id));

    // Update program links if programIds provided
    if (programIds) {
      // Delete existing program links
      await this.db.delete(participantPrograms).where(eq(participantPrograms.participantId, id));
      
      // Create new program links
      if (programIds.length > 0) {
        for (const programId of programIds) {
          const program = await this.db.select().from(programs).where(eq(programs.id, programId));
          if (program[0]) {
            const attendanceWeeks = program[0].attendanceWeeks;
            const initialAttendance = Array(attendanceWeeks).fill(false);
            
            await this.db.insert(participantPrograms).values({
              participantId: id,
              programId,
              attendance: initialAttendance,
            });
          }
        }
      }
    }

    return await this.getParticipantById(id) as ParticipantWithPrograms;
  }

  async updateAttendance(participantId: string, programId: string, attendance: boolean[]): Promise<void> {
    await this.db
      .update(participantPrograms)
      .set({ attendance })
      .where(
        and(
          eq(participantPrograms.participantId, participantId),
          eq(participantPrograms.programId, programId)
        )
      );
  }

  async deleteParticipant(id: string): Promise<void> {
    await this.db.delete(participants).where(eq(participants.id, id));
  }
}
