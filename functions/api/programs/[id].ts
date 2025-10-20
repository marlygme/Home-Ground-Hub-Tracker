import { createStorage } from '../../../server/db/storage-factory';
import { insertProgramSchema } from '../../../shared/schema';

interface Env {
  DATABASE_URL: string;
}

export async function onRequestGet(context: { params: { id: string }; env: Env }) {
  try {
    const storage = createStorage(context.env.DATABASE_URL);
    const program = await storage.getProgramById(context.params.id);
    if (!program) {
      return Response.json({ error: "Program not found" }, { status: 404 });
    }
    return Response.json(program);
  } catch (error) {
    console.error("Error fetching program:", error);
    return Response.json({ error: "Failed to fetch program" }, { status: 500 });
  }
}

export async function onRequestPatch(context: { request: Request; params: { id: string }; env: Env }) {
  try {
    const storage = createStorage(context.env.DATABASE_URL);
    const body = await context.request.json();
    const data = insertProgramSchema.partial().parse(body);
    const program = await storage.updateProgram(context.params.id, data);
    return Response.json(program);
  } catch (error) {
    console.error("Error updating program:", error);
    return Response.json({ error: "Failed to update program" }, { status: 400 });
  }
}

export async function onRequestDelete(context: { params: { id: string }; env: Env }) {
  try {
    const storage = createStorage(context.env.DATABASE_URL);
    await storage.deleteProgram(context.params.id);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting program:", error);
    return Response.json({ error: "Failed to delete program" }, { status: 500 });
  }
}
