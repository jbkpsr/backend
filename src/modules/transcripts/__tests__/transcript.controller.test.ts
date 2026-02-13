import request from "supertest";
import { app } from "../../../app";

describe("TranscriptController", () => {
  it("should return 400 for empty transcript body", async () => {
    const response = await request(app)
      .post("/api/transcripts")
      .send({ content: "" });

    expect(response.status).toBe(400);
  });
});
