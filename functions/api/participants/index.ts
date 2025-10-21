import { createStorage } from '../../../server/db/storage-factory';
import { insertParticipantSchema } from '../../../shared/schema';

interface Env {
  DATABASE_URL: string;
}

export async function onRequestGet(context: { env: Env }) {
  try {
    console.log("Fetching participants...");
    
    if (!context.env.DATABASE_URL) {
      console.error("DATABASE_URL is not set");
      return Response.json({ error: "Database configuration missing" }, { status: 500 });
    }
    
    const storage = createStorage(context.env.DATABASE_URL);
    const participants = await storage.getParticipants();
    
    console.log(`Successfully fetched ${participants.length} participants`);
    return Response.json(participants);
  } catch (error) {
    console.error("Error fetching participants:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : "";
    console.error("Error details:", { message: errorMessage, stack: errorStack });
    return Response.json({ 
      error: "Failed to fetch participants",
      details: errorMessage 
    }, { status: 500 });
  }
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const storage = createStorage(context.env.DATABASE_URL);
    const body = await context.request.json();
    const data = insertParticipantSchema.parse(body);
    const participant = await storage.createParticipant(data);
    return Response.json(participant, { status: 201 });
  } catch (error) {
    console.error("Error creating participant:", error);
    return Response.json({ error: "Failed to create participant" }, { status: 400 });
  }
}
