import { storage } from '../../../server/storage';
import { insertProgramSchema } from '../../../shared/schema';

export async function onRequestGet({ params }: { params: { id: string } }) {
  try {
    const program = await storage.getProgramById(params.id);
    if (!program) {
      return Response.json({ error: "Program not found" }, { status: 404 });
    }
    return Response.json(program);
  } catch (error) {
    console.error("Error fetching program:", error);
    return Response.json({ error: "Failed to fetch program" }, { status: 500 });
  }
}

export async function onRequestPatch({ params, request }: { params: { id: string }; request: Request }) {
  try {
    const body = await request.json();
    const data = insertProgramSchema.partial().parse(body);
    const program = await storage.updateProgram(params.id, data);
    return Response.json(program);
  } catch (error) {
    console.error("Error updating program:", error);
    return Response.json({ error: "Failed to update program" }, { status: 400 });
  }
}

export async function onRequestDelete({ params }: { params: { id: string } }) {
  try {
    await storage.deleteProgram(params.id);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting program:", error);
    return Response.json({ error: "Failed to delete program" }, { status: 500 });
  }
}
