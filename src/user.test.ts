import { test, describe } from "node:test";
import { expect } from "expect";
import axios from "axios";

const baseURL = "http://localhost:4008";
const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 1000,
});

describe("User Tests", () => {
  test("POST /users - should add a user", async () => {
    const res = await axiosInstance.post("/users", {
      name: "John Doe",
      email: "john@example.com",
    });
    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty("id");
    expect(res.data.name).toBe("John Doe");
  });
});
