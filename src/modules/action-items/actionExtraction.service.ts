import { groq } from "../../config/groq";

interface ExtractedItem {
  task: string;
  owner?: string | null;
  dueDate?: string | null;
}


const today = new Date().toISOString().split("T")[0];


export async function extractActionItems(
  transcript: string
): Promise<ExtractedItem[]> {
  const prompt = `
Today is ${today}.

Extract action items from the following meeting transcript.

If relative dates are mentioned (like "tomorrow", "Friday", "next week"),
resolve them based on today's date.

Return JSON array only in this format:
[
  {
    "task": string,
    "owner": string | null,
    "dueDate": ISO date string | null
  }
]

Transcript:
${transcript}
`;


  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0
  });

  const content = response.choices[0]?.message?.content ?? "[]";

  try {
    return JSON.parse(content);
  } catch {
    return [];
  }
}
