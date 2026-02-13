import { pool } from "../config/db";

export default async function () {
  if (pool) {
    await pool.end();
  }
}
