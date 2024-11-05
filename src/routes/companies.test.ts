import { test, describe, before, after } from "node:test";
import { expect } from "expect";
import axios from "axios";

const baseURL = "http://localhost:4008";
const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 1000,
});

describe("Company CRUD Operations", () => {
  let companyId;

  before(async () => {
    const res = await axiosInstance.post("/companies", {
      name: "Test Company",
    });
    companyId = res.data.id;
  });

  after(async () => {
    await axiosInstance.delete(`/companies/${companyId}`).catch((e) => {});
  });

  test("POST /companies - should create a new company", async () => {
    const response = await axiosInstance.post("/companies", {
      name: "New Company",
    });
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty("id");
    expect(response.data.name).toBe("New Company");
  });

  test("GET /companies - should return all companies", async () => {
    const response = await axiosInstance.get("/companies");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test("GET /companies/:id - should return a company by ID", async () => {
    const response = await axiosInstance.get(`/companies/${companyId}`);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("id", companyId);
  });

  test("PUT /companies/:id - should update a company by ID", async () => {
    const response = await axiosInstance.put(`/companies/${companyId}`, {
      name: "Updated Company",
    });
    expect(response.status).toBe(200);
    expect(response.data.name).toBe("Updated Company");
  });

  test("DELETE /companies/:id - should delete a company by ID", async () => {
    const response = await axiosInstance.delete(`/companies/${companyId}`);
    expect(response.status).toBe(204);
  });
});
