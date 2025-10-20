import { storage } from '../../../server/storage';
import { insertParticipantSchema } from '../../../shared/schema';

export async function onRequestGet({ params }: { params: { id: string } }) {
  try {
    const participant = await storage.getParticipantById(params.id);
    if (!participant) {
      return Response.json({ error: "Participant not found" }, { status: 404 });
    }
    return Response.json(participant);
  } catch (error) {
    console.error("Error fetching participant:", error);
    return Response.json({ error: "Failed to fetch participant" }, { status: 500 });
  }
}

export async function onRequestPatch({ params, request }: { params: { id: string }; request: Request }) {
  try {
    const body = await request.json();
    const data = insertParticipantSchema.partial().parse(body);
    const participant = await storage.updateParticipant(params.id, data);
    return Response.json(participant);
  } catch (error) {
    console.error("Error updating participant:", error);
    return Response.json({ error: "Failed to update participant" }, { status: 400 });
  }
}

export async function onRequestDelete({ params }: { params: { id: string } }) {
  try {
    await storage.deleteParticipant(params.id);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting participant:", error);
    return Response.json({ error: "Failed to delete participant" }, { status: 500 });
  }
}
