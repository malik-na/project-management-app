import request from "supertest";
import app from "./app";

describe("GET /", () => {
  it("responds with a json message", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Project Management API" });
  });
});
