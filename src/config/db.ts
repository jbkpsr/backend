import { Pool } from "pg";

export const pool =
  globalThis.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

if (!globalThis.pgPool) {
  globalThis.pgPool = pool;
}
