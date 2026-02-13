export interface CreateTranscriptInput {
  content: string;
}

export interface Transcript {
  id: string;
  content: string;
  created_at: Date;
}
