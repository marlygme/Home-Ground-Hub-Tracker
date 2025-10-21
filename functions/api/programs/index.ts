import { createStorage } from '../../../server/db/storage-factory';
import { insertProgramSchema } from '../../../shared/schema';

interface Env {
  DATABASE_URL: string;
}

export async function onRequestGet(context: { env: Env }) {
  try {
    console.log("Fetching programs...");
    
    if (!context.env.DATABASE_URL) {
      console.error("DATABASE_URL is not set");
      return Response.json({ error: "Database configuration missing" }, { status: 500 });
    }
    
    const storage = createStorage(context.env.DATABASE_URL);
    const programs = await storage.getPrograms();
    
    console.log(`Successfully fetched ${programs.length} programs`);
    return Response.json(programs);
  } catch (error) {
    console.error("Error fetching programs:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : "";
    console.error("Error details:", { message: errorMessage, stack: errorStack });
    return Response.json({ 
      error: "Failed to fetch programs",
      details: errorMessage 
    }, { status: 500 });
  }
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const storage = createStorage(context.env.DATABASE_URL);
    const body = await context.request.json();
    const data = insertProgramSchema.parse(body);
    const program = await storage.createProgram(data);
    return Response.json(program, { status: 201 });
  } catch (error) {
    console.error("Error creating program:", error);
    return Response.json({ error: "Failed to create program" }, { status: 400 });
  }
}
