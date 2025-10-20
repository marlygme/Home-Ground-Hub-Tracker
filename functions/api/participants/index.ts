import { storage } from '../../../server/storage';
import { insertParticipantSchema } from '../../../shared/schema';

export async function onRequestGet() {
  try {
    const participants = await storage.getParticipants();
    return Response.json(participants);
  } catch (error) {
    console.error("Error fetching participants:", error);
    return Response.json({ error: "Failed to fetch participants" }, { status: 500 });
  }
}

export async function onRequestPost({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const data = insertParticipantSchema.parse(body);
    const participant = await storage.createParticipant(data);
    return Response.json(participant, { status: 201 });
  } catch (error) {
    console.error("Error creating participant:", error);
    return Response.json({ error: "Failed to create participant" }, { status: 400 });
  }
}
