import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Use HTTP connection instead of WebSocket for better compatibility
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
