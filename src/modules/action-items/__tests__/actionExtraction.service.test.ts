import { extractActionItems } from "../actionExtraction.service";

jest.mock("../../../config/groq", () => ({
  groq: {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  },
}));

describe("ActionExtractionService", () => {
  it("should parse valid LLM JSON response", async () => {
    const { groq } = require("../../../config/groq");

    groq.chat.completions.create.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify([
              {
                task: "Test Task",
                owner: "Rahul",
                dueDate: null,
              },
            ]),
          },
        },
      ],
    });

    const result = await extractActionItems("Test");

    expect(result.length).toBe(1);
    expect(result[0].task).toBe("Test Task");
  });

  it("should return empty array for invalid JSON", async () => {
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

    const result = await extractActionItems("Test");

    expect(result).toEqual([]);
  });

  it("should throw error if LLM call fails", async () => {
    const { groq } = require("../../../config/groq");

    groq.chat.completions.create.mockRejectedValueOnce(
      new Error("LLM failure")
    );

    await expect(
      extractActionItems("Test")
    ).rejects.toThrow("LLM failure");
  });
});
