import { Request, Response } from "express";
import { ActionItemRepository } from "./actionItem.repository";
import { ActionStatus } from "./actionItem.types";
import { z } from "zod";

const repository = new ActionItemRepository();

const updateActionItemSchema = z.object({
  task: z.string().min(1).optional(),
  owner: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional()
});

const updateStatusSchema = z.object({
  status: z.enum(["OPEN", "DONE"])
});


function extractId(param: string | string[] | undefined): string | null {
  if (!param || Array.isArray(param)) return null;
  return param;
}


export class ActionItemController {
  async list(req: Request, res: Response) {
    try {
      const statusParam = req.query.status;

      let status: ActionStatus | undefined;

      if (typeof statusParam === "string") {
        if (statusParam === "OPEN" || statusParam === "DONE") {
          status = statusParam;
        } else {
          return res.status(400).json({ error: "Invalid status value" });
        }
      }

      const items = await repository.findAll(status);
      return res.json(items);
    } catch (error) {
      return res.status(500).json({
        error: "Failed to fetch action items"
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = extractId(req.params.id);

      if (!id) {
        return res.status(400).json({ error: "Invalid id" });
      }

      const item = await repository.findById(id);

      if (!item) {
        return res.status(404).json({ error: "Action item not found" });
      }

      return res.json(item);
    } catch (error) {
      return res.status(500).json({
        error: "Failed to fetch action item"
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = extractId(req.params.id);

      if (!id) {
        return res.status(400).json({ error: "Invalid id" });
      }

      const parsed = updateActionItemSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          error: parsed.error.flatten()
        });
      }

      const updated = await repository.update(id, parsed.data);

      if (!updated) {
        return res.status(404).json({ error: "Action item not found" });
      }

      return res.json(updated);
    } catch (error) {
      return res.status(500).json({
        error: "Failed to update item"
      });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const id = extractId(req.params.id);

      if (!id) {
        return res.status(400).json({ error: "Invalid id" });
      }

      const parsed = updateStatusSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          error: parsed.error.flatten()
        });
      }

      const updated = await repository.updateStatus(
        id,
        parsed.data.status
      );

      if (!updated) {
        return res.status(404).json({ error: "Action item not found" });
      }

      return res.json(updated);
    } catch (error) {
      return res.status(500).json({
        error: "Failed to update status"
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = extractId(req.params.id);

      if (!id) {
        return res.status(400).json({ error: "Invalid id" });
      }

      await repository.delete(id);

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({
        error: "Failed to delete item"
      });
    }
  }
}
