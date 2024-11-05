import express from "express";
import { UserModel } from "../models.js";
import { z } from "zod";

const router = express.Router();

// Endpoint to add a user
router.post("/", async (req, res) => {
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
  });

  try {
    const { name, email } = schema.parse(req.body);
    const user = await UserModel.create({ name, email });
    res.status(201).json(user);
  } catch (error) {
    console.log("AddUserError", error);
    res.sendStatus(500);
  }
});

export default router;
