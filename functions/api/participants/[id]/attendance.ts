import { createStorage } from '../../../../server/db/storage-factory';

interface Env {
  DATABASE_URL: string;
}

export async function onRequestPost(context: { 
  request: Request; 
  params: { id: string }; 
  env: Env 
}) {
  try {
    console.log('[Attendance] Processing attendance update request');
    
    const storage = createStorage(context.env.DATABASE_URL);
    const body = await context.request.json() as { programId: string; attendance: boolean[] };
    
    console.log('[Attendance] Request body:', JSON.stringify(body));
    
    if (!body.programId || !Array.isArray(body.attendance)) {
      console.error('[Attendance] Missing programId or attendance data');
      return Response.json(
        { error: "Missing programId or attendance data" }, 
        { status: 400 }
      );
    }
    
    console.log(`[Attendance] Updating attendance for participant ${context.params.id}, program ${body.programId}`);
    
    await storage.updateAttendance(context.params.id, body.programId, body.attendance);
    
    console.log('[Attendance] Attendance updated successfully, fetching updated participant');
    
    // Return updated participant
    const participant = await storage.getParticipantById(context.params.id);
    
    console.log('[Attendance] Returning updated participant');
    
    return Response.json(participant);
  } catch (error) {
    console.error("[Attendance] Error updating attendance:", error);
    return Response.json(
      { error: "Failed to update attendance", details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}
