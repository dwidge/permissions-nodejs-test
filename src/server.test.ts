import { test, describe, before, after } from "node:test";
import { expect } from "expect";
import axios from "axios";

const baseURL = "http://localhost:4008";
const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 1000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    throw new Error(error.message, { cause: error?.response?.data });
  }
);

describe("Express Server Tests", () => {
  test("GET / - should return 'Hello, World!'", async () => {
    const res = await axiosInstance.get(`/`);
    expect(res.status).toBe(200);
    expect(res.data).toBe("Hello, World!");
  });
});
