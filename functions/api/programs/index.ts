import { storage } from '../../../server/storage';
import { insertProgramSchema } from '../../../shared/schema';

export async function onRequestGet() {
  try {
    const programs = await storage.getPrograms();
    return Response.json(programs);
  } catch (error) {
    console.error("Error fetching programs:", error);
    return Response.json({ error: "Failed to fetch programs" }, { status: 500 });
  }
}

export async function onRequestPost({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const data = insertProgramSchema.parse(body);
    const program = await storage.createProgram(data);
    return Response.json(program, { status: 201 });
  } catch (error) {
    console.error("Error creating program:", error);
    return Response.json({ error: "Failed to create program" }, { status: 400 });
  }
}
