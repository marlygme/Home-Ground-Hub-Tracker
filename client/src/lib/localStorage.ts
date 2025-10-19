import { Participant, Program } from "@shared/schema";

const PARTICIPANTS_KEY = "home-ground-hub-participants";
const PROGRAMS_KEY = "home-ground-hub-programs";

export const localStorageService = {
  // Participants
  getParticipants(): Participant[] {
    try {
      const data = localStorage.getItem(PARTICIPANTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading participants from localStorage:", error);
      return [];
    }
  },

  saveParticipants(participants: Participant[]): void {
    try {
      localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(participants));
    } catch (error) {
      console.error("Error writing participants to localStorage:", error);
    }
  },

  addParticipant(participant: Participant): void {
    const participants = this.getParticipants();
    participants.push(participant);
    this.saveParticipants(participants);
  },

  updateParticipant(id: string, updatedParticipant: Participant): void {
    const participants = this.getParticipants();
    const index = participants.findIndex((p) => p.id === id);
    if (index !== -1) {
      participants[index] = updatedParticipant;
      this.saveParticipants(participants);
    }
  },

  deleteParticipant(id: string): void {
    const participants = this.getParticipants();
    const filtered = participants.filter((p) => p.id !== id);
    this.saveParticipants(filtered);
  },

  // Programs
  getPrograms(): Program[] {
    try {
      const data = localStorage.getItem(PROGRAMS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading programs from localStorage:", error);
      return [];
    }
  },

  savePrograms(programs: Program[]): void {
    try {
      localStorage.setItem(PROGRAMS_KEY, JSON.stringify(programs));
    } catch (error) {
      console.error("Error writing programs to localStorage:", error);
    }
  },

  addProgram(program: Program): void {
    const programs = this.getPrograms();
    programs.push(program);
    this.savePrograms(programs);
  },

  updateProgram(id: string, updatedProgram: Program): void {
    const programs = this.getPrograms();
    const index = programs.findIndex((p) => p.id === id);
    if (index !== -1) {
      programs[index] = updatedProgram;
      this.savePrograms(programs);
    }
  },

  deleteProgram(id: string): void {
    const programs = this.getPrograms();
    const filtered = programs.filter((p) => p.id !== id);
    this.savePrograms(filtered);
    
    // Also delete all participants in this program
    const participants = this.getParticipants();
    const filteredParticipants = participants.filter((p) => p.programId !== id);
    this.saveParticipants(filteredParticipants);
  },
};
