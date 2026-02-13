import { pool } from "../../config/db";
import { Transcript } from "./transcript.types";

export class TranscriptRepository {
  async create(content: string): Promise<Transcript> {
    const result = await pool.query<Transcript>(
      `
      INSERT INTO transcripts (content)
      VALUES ($1)
      RETURNING id, content, created_at
      `,
      [content]
    );

    return result.rows[0];
  }

  async getLastFive(): Promise<Transcript[]> {
    const result = await pool.query<Transcript>(
      `
      SELECT id, content, created_at
      FROM transcripts
      ORDER BY created_at DESC
      LIMIT 5
      `
    );

    return result.rows;
  }

  async getRecent(limit = 5): Promise<Transcript[]> {
  const result = await pool.query<Transcript>(
    `
    SELECT id, content, created_at
    FROM transcripts
    ORDER BY created_at DESC
    LIMIT $1
    `,
    [limit]
  );

  return result.rows;
}

}
