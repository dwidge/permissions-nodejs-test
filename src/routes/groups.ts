import express from "express";
import { GroupModel } from "../models.js";
import { z } from "zod";

const router = express.Router();

// Endpoint to add a group
router.post("/", async (req, res) => {
  const schema = z.object({
    name: z.string(),
  });

  try {
    const { name } = schema.parse(req.body);
    const group = await GroupModel.create({ name });
    res.status(201).json(group);
  } catch (error) {
    console.log("AddGroupError", error);
    res.sendStatus(500);
  }
});

export default router;
