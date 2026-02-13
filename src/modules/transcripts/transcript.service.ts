import { TranscriptRepository } from "./transcript.repository";
import { CreateTranscriptInput } from "./transcript.types";
import { extractActionItems } from "../action-items/actionExtraction.service";
import { ActionItemRepository } from "../action-items/actionItem.repository";


export class TranscriptService {
  private repository = new TranscriptRepository();

  private actionRepository = new ActionItemRepository();


  async createTranscript(input: CreateTranscriptInput) {
  if (!input.content || input.content.trim().length === 0) {
    throw new Error("Transcript content cannot be empty");
  }

  const transcript = await this.repository.create(input.content);

  const extractedItems = await extractActionItems(input.content);

  const createdActionItems =
    extractedItems.length > 0
      ? await this.actionRepository.createMany(
          extractedItems.map((item) => ({
            task: item.task,
            owner: item.owner ?? null,
            dueDate: item.dueDate ?? null,
            transcriptId: transcript.id
          }))
        )
      : [];

  return {
    transcript,
    actionItems: createdActionItems
  };
}


  async getRecentTranscripts() {
    return this.repository.getLastFive();
  }
}
