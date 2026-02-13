import request from "supertest";
import { app } from "../../../app";

/* ---------------- MOCK REPOSITORY ---------------- */

jest.mock("../../../config/db", () => ({
  pool: {
    query: jest.fn(),
    end: jest.fn(),
  },
}));


jest.mock("../actionItem.repository", () => ({
  ActionItemRepository: jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockResolvedValue([]),
    update: jest.fn().mockResolvedValue(null),
    updateStatus: jest.fn().mockResolvedValue(null),
    delete: jest.fn().mockResolvedValue(null),
  })),
}));

describe("ActionItemController", () => {
  it("should return 400 for invalid status filter", async () => {
    const response = await request(app).get(
      "/api/action-items?status=INVALID"
    );

    expect(response.status).toBe(400);
  });

  it("should return 400 for invalid id", async () => {
    const response = await request(app).patch(
      "/api/action-items/invalid"
    );

    expect(response.status).toBe(400);
  });

  it("should return 400 for invalid status in updateStatus", async () => {
    const response = await request(app)
      .patch("/api/action-items/123/status")
      .send({ status: "INVALID" });

    expect(response.status).toBe(400);
  });

  it("should return 404 when updating non-existing item", async () => {
    const response = await request(app)
      .patch("/api/action-items/999")
      .send({ task: "Updated" });

    expect(response.status).toBe(404);
  });

  it("should return 404 when deleting non-existing item", async () => {
    const response = await request(app).delete(
      "/api/action-items/999"
    );

    expect(response.status).toBe(204);
  });
});
