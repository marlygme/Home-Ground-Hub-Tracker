import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Configure WebSocket for serverless environment
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // @ts-ignore - ws module is compatible
  webSocketConstructor: ws,
});

export const db = drizzle(pool, { schema });
