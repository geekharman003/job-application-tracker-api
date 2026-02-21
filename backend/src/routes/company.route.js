import express from "express";
import {
  createCompany,
  deleteCompany,
  getCompanies,
  updateCompany,
} from "../controllers/company.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/", protectRoute, createCompany);
router.get("/", protectRoute, getCompanies);
router.put("/:id", protectRoute, updateCompany);
router.delete("/:id", protectRoute, deleteCompany);

export default router;
