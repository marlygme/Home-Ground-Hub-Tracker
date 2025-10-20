import { createStorage } from '../../../server/db/storage-factory';
import { insertParticipantSchema } from '../../../shared/schema';

interface Env {
  DATABASE_URL: string;
}

export async function onRequestGet(context: { params: { id: string }; env: Env }) {
  try {
    const storage = createStorage(context.env.DATABASE_URL);
    const participant = await storage.getParticipantById(context.params.id);
    if (!participant) {
      return Response.json({ error: "Participant not found" }, { status: 404 });
    }
    return Response.json(participant);
  } catch (error) {
    console.error("Error fetching participant:", error);
    return Response.json({ error: "Failed to fetch participant" }, { status: 500 });
  }
}

export async function onRequestPatch(context: { request: Request; params: { id: string }; env: Env }) {
  try {
    const storage = createStorage(context.env.DATABASE_URL);
    const body = await context.request.json();
    const data = insertParticipantSchema.partial().parse(body);
    const participant = await storage.updateParticipant(context.params.id, data);
    return Response.json(participant);
  } catch (error) {
    console.error("Error updating participant:", error);
    return Response.json({ error: "Failed to update participant" }, { status: 400 });
  }
}

export async function onRequestDelete(context: { params: { id: string }; env: Env }) {
  try {
    const storage = createStorage(context.env.DATABASE_URL);
    await storage.deleteParticipant(context.params.id);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting participant:", error);
    return Response.json({ error: "Failed to delete participant" }, { status: 500 });
  }
}
