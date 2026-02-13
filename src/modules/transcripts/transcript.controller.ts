import { Request, Response } from "express";
import { TranscriptService } from "./transcript.service";
import { z } from "zod";


const createTranscriptSchema = z.object({
  content: z.string().min(1, "Transcript content cannot be empty")
});

const service = new TranscriptService();

export class TranscriptController {
  async create(req: Request, res: Response) {
  try {
    const parsed = createTranscriptSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.flatten()
      });
    }

    const transcript = await service.createTranscript(parsed.data);

    return res.status(201).json(transcript);
  } catch (error) {
    return res.status(500).json({
      // error: "Failed to create transcript"
          error: error instanceof Error ? error.message : "Unknown error"

    });
  }
}


  async listRecent(_: Request, res: Response) {
    try {
      const transcripts = await service.getRecentTranscripts();
      res.json(transcripts);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch transcripts"
      });
    }
  }
}
