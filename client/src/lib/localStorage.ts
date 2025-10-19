import { Participant } from "@shared/schema";

const STORAGE_KEY = "home-ground-hub-participants";

export const localStorageService = {
  getParticipants(): Participant[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  },

  saveParticipants(participants: Participant[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
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
};
