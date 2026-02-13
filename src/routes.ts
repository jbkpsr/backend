import { Router } from "express";
import { pool } from "./config/db";
import { env } from "./config/env";

import { TranscriptController } from "./modules/transcripts/transcript.controller";
import { ActionItemController } from "./modules/action-items/actionItem.controller";


const transcriptController = new TranscriptController();
const actionItemController = new ActionItemController();


export const router = Router();

router.get("/health", async (_, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      status: "ok",
      database: "connected",
      llm: env.GROQ_API_KEY ? "configured" : "missing"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected"
    });
  }
});


router.post("/transcripts", (req, res) =>
  transcriptController.create(req, res)
);

router.get("/transcripts", (req, res) =>
  transcriptController.listRecent(req, res)
);


router.get("/action-items", (req, res) =>
  actionItemController.list(req, res)
);

router.get("/action-items/:id", (req, res) =>
  actionItemController.getById(req, res)
);

router.patch("/action-items/:id", (req, res) =>
  actionItemController.update(req, res)
);

router.patch("/action-items/:id/status", (req, res) =>
  actionItemController.updateStatus(req, res)
);

router.delete("/action-items/:id", (req, res) =>
  actionItemController.delete(req, res)
);