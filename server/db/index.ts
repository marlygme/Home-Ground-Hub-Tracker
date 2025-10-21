import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

// Configure Neon for development environment
if (process.env.NODE_ENV === "development") {
  neonConfig.fetchConnectionCache = true;
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Use HTTP connection instead of WebSocket for better compatibility
const sql = neon(process.env.DATABASE_URL, {
  fetchOptions: {
    // Disable SSL verification in development only (for Replit)
    ...(process.env.NODE_ENV === "development" && {
      agent: undefined,
    }),
  },
});
export const db = drizzle(sql, { schema });
