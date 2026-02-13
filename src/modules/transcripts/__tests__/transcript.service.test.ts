import { TranscriptService } from "../transcript.service";

/* ---------------- MOCK REPOSITORIES ---------------- */

jest.mock("../transcript.repository", () => ({
  TranscriptRepository: jest.fn().mockImplementation(() => ({
    create: jest.fn().mockResolvedValue({
      id: "123",
      content: "Test transcript",
      created_at: new Date(),
    }),
    getRecent: jest.fn().mockResolvedValue([]),
  })),
}));

jest.mock("../../action-items/actionItem.repository", () => ({
  ActionItemRepository: jest.fn().mockImplementation(() => ({
    createMany: jest.fn().mockResolvedValue([]),
  })),
}));

/* ---------------- MOCK GROQ CLIENT ---------------- */

jest.mock("../../../config/groq", () => ({
  groq: {
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: JSON.stringify([
                  {
                    task: "Prepare budget",
                    owner: "Rahul",
                    dueDate: null,
                  },
                ]),
              },
            },
          ],
        }),
      },
    },
  },
}));

describe("TranscriptService", () => {
  let service: TranscriptService;

  beforeEach(() => {
    service = new TranscriptService();
    jest.clearAllMocks();
  });

  it("should throw error for empty content", async () => {
    await expect(
      service.createTranscript({ content: "" })
    ).rejects.toThrow();
  });

  it("should create transcript successfully", async () => {
    const result = await service.createTranscript({
      content: "Rahul will prepare budget",
    });

    expect(result).toHaveProperty("transcript");
    expect(result).toHaveProperty("actionItems");
  });

  it("should handle LLM returning empty array", async () => {
    const { groq } = require("../../../config/groq");

    groq.chat.completions.create.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify([]),
          },
        },
      ],
    });

    const result = await service.createTranscript({
      content: "No tasks here",
    });

    expect(result.actionItems.length).toBe(0);
  });

  it("should handle invalid JSON from LLM", async () => {
  const { groq } = require("../../../config/groq");

  groq.chat.completions.create.mockResolvedValueOnce({
    choices: [
      {
        message: {
          content: "INVALID_JSON",
        },
      },
    ],
  });

  const result = await service.createTranscript({
    content: "Test",
  });

  expect(result.actionItems).toEqual([]);
});


  it("should handle LLM throwing error", async () => {
    const { groq } = require("../../../config/groq");

    groq.chat.completions.create.mockRejectedValueOnce(
      new Error("LLM failed")
    );

    await expect(
      service.createTranscript({
        content: "Rahul prepare budget",
      })
    ).rejects.toThrow("LLM failed");
  });
});
