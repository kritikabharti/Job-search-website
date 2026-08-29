import express from "express";
import {
  getPublicCompanies,
  getPublicCompanyById,
} from "../controllers/companyController.js";

const router = express.Router();

router.get("/", getPublicCompanies);
router.get("/:id", getPublicCompanyById);

export default router;
