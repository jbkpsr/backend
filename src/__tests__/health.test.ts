import request from "supertest";
import { app } from "../app";

describe("Health Endpoint", () => {
  it("should return system status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("database");
    expect(response.body).toHaveProperty("llm");
  });
});
