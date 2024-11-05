import { test, describe } from "node:test";
import { expect } from "expect";
import axios from "axios";

const baseURL = "http://localhost:4008";
const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 1000,
});

describe("Permission Tests", () => {
  test("POST /permissions - should add a permission", async () => {
    const res = await axiosInstance.post("/permissions", {
      name: "view_dashboard",
      subject: null,
      object: null,
    });
    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty("id");
    expect(res.data.name).toBe("view_dashboard");
  });
});
