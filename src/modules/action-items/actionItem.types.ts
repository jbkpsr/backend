export type ActionStatus = "OPEN" | "DONE";

export interface CreateActionItemInput {
  task: string;
  owner?: string | null;
  dueDate?: string | null;
  transcriptId: string;
}

export interface ActionItem {
  id: string;
  task: string;
  owner: string | null;
  due_date: Date | null;
  status: ActionStatus;
  transcript_id: string;
  created_at: Date;
}
