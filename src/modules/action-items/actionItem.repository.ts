import { pool } from "../../config/db";
import { CreateActionItemInput, ActionItem } from "./actionItem.types";

export class ActionItemRepository {
  async createMany(items: CreateActionItemInput[]): Promise<ActionItem[]> {
    const createdItems: ActionItem[] = [];

    for (const item of items) {
      const result = await pool.query<ActionItem>(
        `
        INSERT INTO action_items (task, owner, due_date, transcript_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [
          item.task,
          item.owner ?? null,
          item.dueDate ?? null,
          item.transcriptId
        ]
      );

      createdItems.push(result.rows[0]);
    }

    return createdItems;
  }

  async findByTranscript(transcriptId: string): Promise<ActionItem[]> {
    const result = await pool.query<ActionItem>(
      `
      SELECT * FROM action_items
      WHERE transcript_id = $1
      ORDER BY created_at DESC
      `,
      [transcriptId]
    );

    return result.rows;
  }

  async findAll(status?: "OPEN" | "DONE") {
  const query = status
    ? `
      SELECT * FROM action_items
      WHERE status = $1
      ORDER BY created_at DESC
    `
    : `
      SELECT * FROM action_items
      ORDER BY created_at DESC
    `;

  const result = status
    ? await pool.query<ActionItem>(query, [status])
    : await pool.query<ActionItem>(query);

  return result.rows;
}

async update(id: string, fields: Partial<CreateActionItemInput>) {
  const result = await pool.query<ActionItem>(
    `
    UPDATE action_items
    SET task = COALESCE($1, task),
        owner = COALESCE($2, owner),
        due_date = COALESCE($3, due_date)
    WHERE id = $4
    RETURNING *
    `,
    [fields.task, fields.owner, fields.dueDate, id]
  );

  return result.rows[0];
}

async updateStatus(id: string, status: "OPEN" | "DONE") {
  const result = await pool.query<ActionItem>(
    `
    UPDATE action_items
    SET status = $1
    WHERE id = $2
    RETURNING *
    `,
    [status, id]
  );

  return result.rows[0];
}

async delete(id: string) {
  await pool.query(
    `
    DELETE FROM action_items
    WHERE id = $1
    `,
    [id]
  );
}

async findById(id: string): Promise<ActionItem | null> {
  const result = await pool.query<ActionItem>(
    `
    SELECT *
    FROM action_items
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] ?? null;
}

}
