// Storage factory that works with Cloudflare env bindings
import { createDb } from "./cloudflare";
import { DbStorage } from "../storage";

export function createStorage(databaseUrl: string) {
  const db = createDb(databaseUrl);
  return new DbStorage(db);
}
