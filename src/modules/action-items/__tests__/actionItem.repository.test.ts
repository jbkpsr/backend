import { ActionItemRepository } from "../actionItem.repository";

jest.mock("../../../config/db", () => ({
  pool: {
    query: jest.fn(),
  },
}));

import { pool } from "../../../config/db";

describe("ActionItemRepository", () => {
  let repo: ActionItemRepository;

  beforeEach(() => {
    repo = new ActionItemRepository();
    jest.clearAllMocks();
  });

  it("should return all items", async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rows: [{ id: "1", task: "Test" }],
    });

    const result = await repo.findAll();
    expect(result.length).toBe(1);
  });

  it("should filter by status", async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rows: [{ id: "1", status: "OPEN" }],
    });

    const result = await repo.findAll("OPEN");

    expect(pool.query).toHaveBeenCalled();
    expect(result[0].status).toBe("OPEN");
  });

  it("should update item", async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rows: [{ id: "1", task: "Updated" }],
    });

    const result = await repo.update("1", {
      task: "Updated",
    });

    expect(result?.task).toBe("Updated");
  });

  it("should update status", async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rows: [{ id: "1", status: "DONE" }],
    });

    const result = await repo.updateStatus("1", "DONE");

    expect(result?.status).toBe("DONE");
  });

  it("should delete item", async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({});

    await repo.delete("1");

    expect(pool.query).toHaveBeenCalled();
  });

  it("should throw error when DB fails", async () => {
    (pool.query as jest.Mock).mockRejectedValueOnce(
      new Error("DB error")
    );

    await expect(repo.findAll()).rejects.toThrow("DB error");
  });
});
