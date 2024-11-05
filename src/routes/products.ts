import express from "express";
import { ProductModel } from "../models.js";
import { z } from "zod";

const router = express.Router();

// Endpoint to create a product
router.post("/", async (req, res) => {
  const schema = z.object({
    name: z.string(),
    description: z.string().nullable(),
    price: z.number().positive(),
  });

  try {
    const { name, description, price } = schema.parse(req.body);
    const product = await ProductModel.create({ name, description, price });
    res.status(201).json(product);
  } catch (error) {
    console.log("AddProductError", error);
    res.sendStatus(500);
  }
});

// Endpoint to get all products
router.get("/", async (req, res) => {
  try {
    const products = await ProductModel.findAll();
    res.json(products);
  } catch (error) {
    console.log("GetProductsError", error);
    res.sendStatus(500);
  }
});

// Endpoint to get a product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await ProductModel.findByPk(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log("GetProductError", error);
    res.sendStatus(500);
  }
});

// Endpoint to update a product by ID
router.put("/:id", async (req, res) => {
  const schema = z.object({
    name: z.string().optional(),
    description: z.string().nullable().optional(),
    price: z.number().positive().optional(),
  });

  try {
    const { name, description, price } = schema.parse(req.body);
    const [updated] = await ProductModel.update(
      { name, description, price },
      { where: { id: req.params.id } }
    );
    if (updated) {
      const updatedProduct = await ProductModel.findByPk(req.params.id);
      res.json(updatedProduct);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log("UpdateProductError", error);
    res.sendStatus(500);
  }
});

// Endpoint to delete a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await ProductModel.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log("DeleteProductError", error);
    res.sendStatus(500);
  }
});

export default router;
