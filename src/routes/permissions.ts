import express from "express";
import { checkPermission } from "../checkPermission.js";
import { PermissionModel } from "../models.js";
import { z } from "zod";
import { GroupEntity } from "../types.js";

const Permission = z.object({
  name: z.string(),
  subject: GroupEntity.partial().nullable(),
  object: GroupEntity.partial().nullable(),
});

const router = express.Router();

// Endpoint to check permission
router.post("/check", async (req, res) => {
  try {
    const { name, subject, object } = Permission.parse(req.body);
    const hasPermission = await checkPermission(name, subject, object);
    res.json({ hasPermission });
  } catch (error) {
    console.log("checkPermissionE1", error);
    res.sendStatus(500);
  }
});

// Endpoint to add a permission
router.post("/", async (req, res) => {
  try {
    const { name, subject, object } = Permission.parse(req.body);
    const permission = await PermissionModel.create({ name, subject, object });
    res.status(201).json(permission);
  } catch (error) {
    console.log("AddPermissionError", error);
    res.sendStatus(500);
  }
});

export default router;
