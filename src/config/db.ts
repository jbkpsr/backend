import { Pool } from "pg";
import { env } from "./env";

declare global {
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined;
}

const pool =
  global.pgPool ||
  new Pool({
    connectionString: env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 1, // extremely important
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 5000,
  });


if (!global.pgPool) {
  global.pgPool = pool;
}

console.log("DATABASE_URL:", env.DATABASE_URL);


export { pool };
