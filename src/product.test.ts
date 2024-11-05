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

describe("Product Tests", () => {
  let productId;

  before(async () => {
    const res = await axiosInstance.post("/products", {
      name: "Test Product",
      description: "This is a test product.",
      price: 29.99,
    });
    productId = res.data.id;
  });

  after(async () => {
    await axiosInstance.delete(`/products/${productId}`).catch((e) => {});
  });

  test("POST /products - should add a product", async () => {
    const res = await axiosInstance.post("/products", {
      name: "Sample Product",
      description: "This is a sample product.",
      price: 19.99,
    });
    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty("id");
    expect(res.data.name).toBe("Sample Product");
  });

  test("GET /products - should return all products", async () => {
    const res = await axiosInstance.get("/products");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  test("GET /products/:id - should return a product by ID", async () => {
    const res = await axiosInstance.get(`/products/${productId}`);
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty("id", productId);
  });

  test("PUT /products/:id - should update a product by ID", async () => {
    const res = await axiosInstance.put(`/products/${productId}`, {
      name: "Updated Product",
      price: 49.99,
    });
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty("id", productId);
    expect(res.data.name).toBe("Updated Product");
  });

  test("DELETE /products/:id - should delete a product by ID", async () => {
    const res = await axiosInstance.delete(`/products/${productId}`);
    expect(res.status).toBe(204);
  });
});
