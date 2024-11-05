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

describe("Permission on Products Tests", () => {
  let productId: string;
  let userId1: string;
  let userId2: string;
  let companyId1: string;
  let companyId2: string;

  before(async () => {
    const res = await axiosInstance.post("/products", {
      name: "Test Product",
      description: "This is a test product.",
      price: 29.99,
    });
    productId = res.data.id;

    const userRes1 = await axiosInstance.post("/users", {
      name: "User One",
      email: "user1@example.com",
    });
    userId1 = userRes1.data.id;

    const userRes2 = await axiosInstance.post("/users", {
      name: "User Two",
      email: "user2@example.com",
    });
    userId2 = userRes2.data.id;

    const companyRes1 = await axiosInstance.post("/companies", {
      name: "Company One",
    });
    companyId1 = companyRes1.data.id;

    const companyRes2 = await axiosInstance.post("/companies", {
      name: "Company Two",
    });
    companyId2 = companyRes2.data.id;
  });

  after(async () => {
    await axiosInstance.delete(`/products/${productId}`).catch((e) => {});
    await axiosInstance.delete(`/users/${userId1}`).catch((e) => {});
    await axiosInstance.delete(`/users/${userId2}`).catch((e) => {});
    await axiosInstance.delete(`/companies/${companyId1}`).catch((e) => {});
    await axiosInstance.delete(`/companies/${companyId2}`).catch((e) => {});
  });

  test("POST /permissions/check - User One should have permission to post products to Company One", async () => {
    const res = await axiosInstance.post(`/permissions/check`, {
      name: "post_product",
      subject: {
        companyId: companyId1,
        userId: userId1,
      },
      object: {
        companyId: companyId1,
        productId: null,
      },
    });
    expect(res.status).toBe(200);
    expect(res.data.hasPermission).toBe(true);

    const postRes = await axiosInstance.post(`/products`, {
      name: "User One's Product",
      description: "This product is posted by User One.",
      price: 19.99,
      companyId: companyId1,
    });
    expect(postRes.status).toBe(201);
  });

  test("POST /permissions/check - User Two should not have permission to post products to Company One", async () => {
    const res = await axiosInstance.post(`/permissions/check`, {
      name: "post_product",
      subject: {
        companyId: companyId1,
        userId: userId2,
      },
      object: {
        companyId: companyId1,
        productId: null,
      },
    });
    expect(res.status).toBe(200);
    expect(res.data.hasPermission).toBe(false);

    // Expecting the operation to fail
    await expect(
      axiosInstance.post(`/products`, {
        name: "User Two's Product",
        description: "This product is posted by User Two.",
        price: 29.99,
        companyId: companyId1,
      })
    ).rejects.toThrow();
  });

  test("POST /permissions/check - User Two should have permission to post products to Company Two", async () => {
    const res = await axiosInstance.post(`/permissions/check`, {
      name: "post_product",
      subject: {
        companyId: companyId2,
        userId: userId2,
      },
      object: {
        companyId: companyId2,
        productId: null,
      },
    });
    expect(res.status).toBe(200);
    expect(res.data.hasPermission).toBe(true);

    const postRes = await axiosInstance.post(`/products`, {
      name: "User Two's Product for Company Two",
      description: "This product is posted by User Two for Company Two.",
      price: 39.99,
      companyId: companyId2,
    });
    expect(postRes.status).toBe(201);
  });

  test("POST /permissions/check - User One should have permission to view products", async () => {
    const res = await axiosInstance.post(`/permissions/check`, {
      name: "view_product",
      subject: {
        companyId: companyId1,
        userId: userId1,
      },
      object: {
        companyId: companyId1,
        productId: productId,
      },
    });
    expect(res.status).toBe(200);
    expect(res.data.hasPermission).toBe(true);

    const viewRes = await axiosInstance.get(`/products/${productId}`);
    expect(viewRes.status).toBe(200);
    expect(viewRes.data.id).toBe(productId);
  });

  test("POST /permissions/check - User Two should not have any permissions related to products", async () => {
    const res = await axiosInstance.post(`/permissions/check`, {
      name: "edit_product",
      subject: {
        companyId: companyId1,
        userId: userId2,
      },
      object: {
        companyId: companyId1,
        productId: productId,
      },
    });
    expect(res.status).toBe(200);
    expect(res.data.hasPermission).toBe(false);

    // Expecting the operation to fail
    await expect(
      axiosInstance.put(`/products/${productId}`, {
        name: "Updated Product Name",
      })
    ).rejects.toThrow();
  });
});
