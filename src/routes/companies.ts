import express from "express";
import { CompanyModel } from "../models.js"; // Importing the CompanyModel
import { z } from "zod";

const router = express.Router();

// Schema for creating a company
const createCompanySchema = z.object({
  name: z.string(),
});

// Schema for updating a company
const updateCompanySchema = z.object({
  name: z.string().optional(),
});

// Endpoint to create a company
router.post("/", async (req, res) => {
  try {
    const { name } = createCompanySchema.parse(req.body);
    const company = await CompanyModel.create({ name });
    res.status(201).json(company);
  } catch (error) {
    console.log("AddCompanyError", error);
    res.sendStatus(500);
  }
});

// Endpoint to get all companies
router.get("/", async (req, res) => {
  try {
    const companies = await CompanyModel.findAll();
    res.json(companies);
  } catch (error) {
    console.log("GetCompaniesError", error);
    res.sendStatus(500);
  }
});

// Endpoint to get a company by ID
router.get("/:id", async (req, res) => {
  try {
    const company = await CompanyModel.findByPk(req.params.id);
    if (company) {
      res.json(company);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log("GetCompanyError", error);
    res.sendStatus(500);
  }
});

// Endpoint to update a company by ID
router.put("/:id", async (req, res) => {
  try {
    const { name } = updateCompanySchema.parse(req.body);
    const [updated] = await CompanyModel.update(
      { name },
      { where: { id: req.params.id } }
    );
    if (updated) {
      const updatedCompany = await CompanyModel.findByPk(req.params.id);
      res.json(updatedCompany);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log("UpdateCompanyError", error);
    res.sendStatus(500);
  }
});

// Endpoint to delete a company by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await CompanyModel.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log("DeleteCompanyError", error);
    res.sendStatus(500);
  }
});

export default router;
