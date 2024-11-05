import { test, describe } from "node:test";
import { expect } from "expect";
import axios from "axios";

const baseURL = "http://localhost:4008";
const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 1000,
});

describe("Group Tests", () => {
  test("POST /groups - should add a group", async () => {
    const res = await axiosInstance.post("/groups", { name: "Admin Group" });
    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty("id");
    expect(res.data.name).toBe("Admin Group");
  });
});
